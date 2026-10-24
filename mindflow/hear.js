// Play a few seconds of a voice, so people can choose one before making a session. Needs api.js.
;(function(){
var HEAR = window.HEAR = {tune: new Audio()};

// voice: 'calm_female', 'warm_male', ... btn: the Listen button; its label says what is happening.
HEAR.play = async function(voice, btn, url){
  HEAR.tune.pause(); btn.disabled = true; btn.textContent = 'Loading…';
  try{
    url = URL.createObjectURL(await API.ask('/voices/' + encodeURIComponent(voice) + '/preview', undefined, 'GET', true));
    HEAR.tune.onended = function(){ URL.revokeObjectURL(url); btn.textContent = 'Listen' };
    HEAR.tune.src = url; await HEAR.tune.play(); btn.textContent = 'Playing…';
  }catch(err){ btn.textContent = 'Listen'; throw err }
  finally{ btn.disabled = false }
};
}());
