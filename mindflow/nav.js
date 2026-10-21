// Inside the app, local page links ask the shell to show that page.
;(function(){
var NAV = window.NAV = {};
NAV.root = new URL('.', document.currentScript.src).href;

// Opened alone, a page reloads inside the shell so it gets the app's bar, sign-in gate and data.
if(window.parent === window){
  location.replace(NAV.root + 'index.html#' + location.href.replace(NAV.root, '').split('#')[0]);
  return;
}

NAV.go = function(path){ kit.say(new URL(path, location.href).href, 'go') };

document.addEventListener('click', function(eve, a){
  a = eve.target.closest && eve.target.closest('a[href]');
  if(!a || a.target || a.hasAttribute('download') || eve.defaultPrevented){ return }
  if(!/\.html(\?|$)/.test(a.getAttribute('href'))){ return }
  eve.preventDefault();
  NAV.go(a.getAttribute('href'));
});
}());
