// Make a hypnosis session from an assessment: show the wait page, then play it. Needs api.js, fit.js, nav.js.
;(function(){
var MAKE = window.MAKE = {};
MAKE.root = new URL('.', document.currentScript.src).href;

// ask: {issue, mood, place, feel}. Resolves when the player opens; rejects (back on the asking page) on failure.
MAKE.sess = async function(ask, back, a, s){
  NAV.go(MAKE.root + 'wait.html');
  try{
    a = await API.ask('/assessments', FIT.ask(ask));
    s = await API.ask('/sessions/generate', {assessment_id: a.id});
  }catch(err){ NAV.go(back); throw err }
  NAV.go(MAKE.root + 'play.html?id=' + encodeURIComponent(s.id));
};
}());
