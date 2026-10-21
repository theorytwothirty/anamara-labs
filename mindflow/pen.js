// Small words for people: dates, clocks, stars.
;(function(){
var PEN = window.PEN = {};

PEN.date = function(at){
  return at ? new Date(at).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : '';
};
PEN.day = function(at){
  return at ? new Date(at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : '';
};
PEN.ago = function(at, d){
  d = Math.floor((new Date().setHours(0,0,0,0) - new Date(at).setHours(0,0,0,0)) / 864e5);
  return 0 === d ? 'Today' : 1 === d ? 'Yesterday' : PEN.day(at);
};
PEN.clock = function(s){
  s = isFinite(s) && 0 < s ? Math.floor(s) : 0;
  return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2);
};
PEN.star = function(n){ n = +n || 0; return n ? '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(n) : '' };
}());
