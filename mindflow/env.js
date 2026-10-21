// Where the MindFlow backend lives: local runs use the local one. A tester may override with localStorage.api.
var ENV = {api: /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? 'http://localhost:8000' : 'https://mindflow-3477e972-1.onrender.com'};
try{ ENV.api = localStorage.api || ENV.api }catch(err){}
