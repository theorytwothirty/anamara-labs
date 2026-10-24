// A soft background under guided audio: filtered noise whose level rises and falls like slow waves, and optionally a
// deep relaxation tone (a 6 Hz theta binaural beat: 200 Hz left, 206 Hz right; it needs headphones to be heard as a beat).
// Made in the browser with Web Audio, so there are no sound files or licences.
;(function(){
var CALM = window.CALM = {on: false, tone: false, level: 0.05, hum: 0.02};

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
  CALM.beat = ctx.createGain(); CALM.beat.gain.value = 0; CALM.beat.connect(ctx.destination);
  [[200, -1], [206, 1]].forEach(function(t, osc, pan){
    osc = ctx.createOscillator(); osc.frequency.value = t[0];
    pan = ctx.createStereoPanner(); pan.pan.value = t[1];
    osc.connect(pan).connect(CALM.beat); osc.start();
  });
  noise.start(); swell.start();
  return ctx.resume();
};
// node: a gain to glide to `to` over `secs`.
CALM.fade = function(node, to, secs, g){
  if(!node){ return } g = node.gain;
  g.cancelScheduledValues(CALM.ctx.currentTime); g.setValueAtTime(g.value, CALM.ctx.currentTime);
  g.linearRampToValueAtTime(to, CALM.ctx.currentTime + secs);
};
// playing: whether the guided audio is playing now; quiet: whether it is muted.
CALM.follow = function(playing, quiet, live){ live = CALM.on && playing && !quiet;
  CALM.fade(CALM.gain, live ? CALM.level : 0, playing ? 3 : 1.5);
  CALM.fade(CALM.beat, live && CALM.tone ? CALM.hum : 0, playing ? 6 : 1.5);
};
}());
