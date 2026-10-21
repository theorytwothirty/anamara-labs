// The one boundary between backend field names and MindFlow's small internal shapes, both ways.
;(function(){
var FIT = window.FIT = {};

FIT.user = function(u, p){ p = u.preferences || {};
  return {id: u.id, name: u.name, mail: u.email, ok: u.email_verified ? 'Yes' : 'No', plan: u.subscription_tier,
    pref: {voice: p.voice_type, len: p.session_length, bg: !!p.background_sounds}};
};
FIT.me = function(m){
  return {name: m.name, preferences: {voice_type: m.voice, session_length: +m.len, background_sounds: !!m.bg}};
};

FIT.goal = function(g){
  return {id: g.id, kind: g.goal_type, text: g.description, state: g.status, due: g.target_date, done: g.completed_at, made: g.created_at};
};
FIT.aim = function(g){
  return {goal_type: g.kind, description: g.text, target_date: g.due ? new Date(g.due).toISOString() : null};
};

FIT.sess = function(s){
  return {id: s.id, title: s.title || 'Untitled session', text: s.script || '', audio: !!s.has_audio, len: s.duration_minutes || 0,
    state: s.status, err: s.generation_error, stars: s.rating, note: s.user_notes, done: s.completed_at, made: s.created_at};
};

// An assessment is the question form behind every hypnosis session.
FIT.ask = function(a){
  return {specific_issue: a.issue, current_mood: +a.mood || 5, environment: a.place || null, emotional_state: a.feel || null};
};

FIT.frame = function(f, d){ d = f.practice;
  return {id: f.id, issue: f.problem, view: f.reframe, aim: f.positive_intention, turn: f.new_perspective,
    msgs: (f.messages || []).map(function(m){ return {who: 'user' === m.role ? 'me' : 'guide', text: m.content} }),
    drill: d ? {title: d.title, steps: d.steps || [], self: d.self_statement} : null, sound: !!f.has_practice_audio};
};

FIT.sum = function(s){
  return {count: s.session_count || 0, logs: s.habit_total_logs || 0, rate: s.habit_success_rate, tips: s.insights || [],
    trend: (s.mood_trend || []).map(function(p){ return {at: p.timestamp, kind: 'preMood' === p.data_type ? 'pre' : 'postMood' === p.data_type ? 'post' : 'habit', val: +p.value} })};
};

FIT.list = function(fn){ return function(all){ return (all || []).map(fn) } };
}());
