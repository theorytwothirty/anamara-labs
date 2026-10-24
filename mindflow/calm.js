// A soft background under guided audio: filtered noise whose level rises and falls like slow waves.
// Made in the browser with Web Audio, so there are no sound files or licences.
;(function(){
var CALM = window.CALM = {on: false, level: 0.05};

// Builds the sound once, on the first tap (browsers only allow audio after a tap).
CALM.wake = function(ctx, noise, data, last, i, low, swell, depth){
  if(CALM.ctx){ return CALM.ctx.resume() }
  ctx = CALM.ctx = new (window.AudioContext || window.webkitAudioContext)();
  noise = ctx.createBufferSource(); noise.loop = true;
  noise.buffer = ctx.createBuffer(1, ctx.sampleRate * 6, ctx.sampleRate); data = noise.buffer.getChannelData(0);
  for(i = 0, last = 0; i < data.length; i++){ last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; data[i] = last * 3.5 } // brown noise
  low = ctx.createBiquadFilter(); low.type = 'lowpass'; low.frequency.value = 650;
  CALM.gain = ctx.createGain(); CALM.gain.gain.value = 0;
  swell = ctx.createOscillator(); swell.frequency.value = 0.08; // one wave about every 12 seconds
  depth = ctx.createGain(); depth.gain.value = 0.35;
  CALM.wave = ctx.createGain(); CALM.wave.gain.value = 0.65;
  swell.connect(depth).connect(CALM.wave.gain);
  noise.connect(low).connect(CALM.wave).connect(CALM.gain).connect(ctx.destination);
  noise.start(); swell.start();
  return ctx.resume();
};
// to: the level to glide to; secs: how long the fade takes.
CALM.fade = function(to, secs, g){
  if(!CALM.gain){ return } g = CALM.gain.gain;
  g.cancelScheduledValues(CALM.ctx.currentTime); g.setValueAtTime(g.value, CALM.ctx.currentTime);
  g.linearRampToValueAtTime(to, CALM.ctx.currentTime + secs);
};
// playing: whether the guided audio is playing now; quiet: whether it is muted.
CALM.follow = function(playing, quiet){ CALM.fade(CALM.on && playing && !quiet ? CALM.level : 0, playing ? 3 : 1.5) };
}());
