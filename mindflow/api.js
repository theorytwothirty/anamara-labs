// Real HTTP to the MindFlow backend: one request primitive, tokens, and one shared refresh across frames.
;(function(){
var API = window.API = {};
API.root = document.currentScript.src;
API.key = {tok: 'mindflow_access_token', ref: 'mindflow_refresh_token'};

API.tok = function(){ try{ return localStorage[API.key.tok] || '' }catch(err){ return '' } };
API.keep = function(t){ localStorage[API.key.tok] = t.access_token; localStorage[API.key.ref] = t.refresh_token };
API.drop = function(){ localStorage.removeItem(API.key.tok); localStorage.removeItem(API.key.ref) };

// path: '/goals'. body: sent as JSON (omit for GET). how: HTTP method. raw: return a Blob.
API.ask = async function(path, body, how, raw, again){
  var old = API.tok(), opt = {method: how || (undefined === body ? 'GET' : 'POST'), headers: {}}, res;
  if(old){ opt.headers.Authorization = 'Bearer ' + old }
  if(undefined !== body){ opt.headers['Content-Type'] = 'application/json'; opt.body = JSON.stringify(body) }
  try{ res = await fetch(ENV.api + path, opt) }catch(err){ throw API.fail(0, 'Cannot reach MindFlow. Check your connection and try again.') }
  if(401 === res.status && old && !again){
    if(await API.renew(old)){ return API.ask(path, body, how, raw, 1) }
    API.drop(); kit.say(new URL('sign.html', API.root).href, 'go');
    throw API.fail(401, 'Session expired. Please sign in again.');
  }
  if(!res.ok){ throw API.fail(res.status, await API.why(res)) }
  if(204 === res.status){ return }
  return raw ? res.blob() : res.json();
};

API.why = async function(res, d){
  try{ d = (await res.json()).detail }catch(err){ return '' }
  return Array.isArray(d) ? d.map(function(e){ return e.msg }).join('. ') : d;
};
API.fail = function(code, why){
  var err = new Error(why || 'Something went wrong. Please try again.'); err.status = code; return err;
};

// Every frame shares one token store, so refresh under a lock and skip it if another frame already did.
API.renew = function(old){
  return navigator.locks ? navigator.locks.request('mindflow', function(){ return API.swap(old) }) : API.swap(old);
};
API.swap = async function(old, ref, res){
  if(API.tok() !== old){ return 1 }
  ref = localStorage[API.key.ref]; if(!ref){ return 0 }
  try{ res = await fetch(ENV.api + '/auth/refresh', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({refresh_token: ref})}) }catch(err){ return 0 }
  if(!res.ok){ return 0 }
  API.keep(await res.json()); return 1;
};

// Turn a Blob into a URL this frame can play, or hand it to the frame's own hidden <a download>.
API.link = async function(path){ return URL.createObjectURL(await API.ask(path, undefined, 'GET', 1)) };
API.save = async function(what, a){
  a.href = URL.createObjectURL('string' === typeof what ? await API.ask(what, undefined, 'GET', 1) : what);
  a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href) }, 999);
};
}());
