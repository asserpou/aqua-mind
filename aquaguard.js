/* ══════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════ */
var themeBtn = document.getElementById('theme-toggle');
var html     = document.documentElement;

function setTheme(t) {
  html.setAttribute('data-theme', t);
  themeBtn.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('ag-theme', t);
}
setTheme(localStorage.getItem('ag-theme') || 'dark');
themeBtn.addEventListener('click', function() {
  setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ══════════════════════════════════════
   MOBILE DEVICE DETECTION
   — shows a friendly "not available" screen
     on phones/small tablets
══════════════════════════════════════ */
(function() {
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth < 768;

  if (!isMobile) return;

  // Build the overlay
  var overlay = document.createElement('div');
  overlay.id = 'ag-mobile-overlay';
  overlay.innerHTML = [
    '<div class="ag-mo-box">',
    '  <div class="ag-mo-pixels" aria-hidden="true">',
    '    <div class="ag-mo-pixel p1"></div>',
    '    <div class="ag-mo-pixel p2"></div>',
    '    <div class="ag-mo-pixel p3"></div>',
    '    <div class="ag-mo-pixel p4"></div>',
    '    <div class="ag-mo-pixel p5"></div>',
    '  </div>',
    '  <div class="ag-mo-icon">🎮</div>',
    '  <h2 class="ag-mo-title">GAME NOT AVAILABLE</h2>',
    '  <p class="ag-mo-sub">ON MOBILE DEVICES</p>',
    '  <div class="ag-mo-divider"></div>',
    '  <p class="ag-mo-body">AquaGuard requires a keyboard &amp; mouse.<br>Please open on a desktop or laptop.</p>',
    '  <div class="ag-mo-hint">',
    '    <span class="ag-mo-key">💻</span>',
    '    <span>DESKTOP ONLY EXPERIENCE</span>',
    '  </div>',
    '  <div class="ag-mo-blink">▼ SCROLL FOR LEADERBOARD ▼</div>',
    '</div>'
  ].join('');

  // Inject CSS
  var style = document.createElement('style');
  style.textContent = [
    '#ag-mobile-overlay {',
    '  position: relative;',
    '  z-index: 5;',
    '  width: 100%;',
    '  min-height: 100vh;',
    '  background: linear-gradient(180deg, var(--sky-top,#0d1b2a) 0%, var(--sky-bot,#1a3a5c) 55%, var(--ground,#2e6b27) 55%, var(--ground2,#1e4a14) 100%);',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  padding: 80px 20px 60px;',
    '  box-sizing: border-box;',
    '  font-family: "Press Start 2P", monospace;',
    '}',

    '.ag-mo-box {',
    '  position: relative;',
    '  background: var(--panel-bg, rgba(13,27,42,0.97));',
    '  border: 4px solid var(--water, #3ecfcf);',
    '  box-shadow: 0 0 0 4px var(--bg2,#0a1520), 0 0 0 8px rgba(62,207,207,0.18), 0 24px 60px rgba(0,0,0,0.6);',
    '  padding: 44px 32px 36px;',
    '  max-width: 420px;',
    '  width: 100%;',
    '  text-align: center;',
    '  display: flex;',
    '  flex-direction: column;',
    '  align-items: center;',
    '  gap: 16px;',
    '  animation: moBoxIn 0.7s cubic-bezier(0.22,1,0.36,1) both;',
    '}',
    '@keyframes moBoxIn {',
    '  from { opacity:0; transform: translateY(30px) scale(0.96); }',
    '  to   { opacity:1; transform: translateY(0) scale(1); }',
    '}',

    /* gold pixel corners */
    '.ag-mo-box::before { content:""; position:absolute; top:-4px; left:-4px; width:16px; height:16px; background:var(--gold,#f5c842); }',
    '.ag-mo-box::after  { content:""; position:absolute; bottom:-4px; right:-4px; width:16px; height:16px; background:var(--gold,#f5c842); }',

    /* floating pixel decorations */
    '.ag-mo-pixels { position:absolute; inset:0; pointer-events:none; overflow:hidden; }',
    '.ag-mo-pixel { position:absolute; background:rgba(62,207,207,0.12); animation:pixelFloat 4s ease-in-out infinite alternate; }',
    '.ag-mo-pixel.p1 { width:8px; height:8px; top:15%; left:8%; animation-delay:0s; }',
    '.ag-mo-pixel.p2 { width:6px; height:6px; top:70%; left:12%; animation-delay:.6s; }',
    '.ag-mo-pixel.p3 { width:10px; height:10px; top:25%; right:10%; animation-delay:1.2s; }',
    '.ag-mo-pixel.p4 { width:6px; height:6px; top:60%; right:8%; animation-delay:.3s; }',
    '.ag-mo-pixel.p5 { width:8px; height:8px; top:85%; left:50%; animation-delay:.9s; }',
    '@keyframes pixelFloat {',
    '  from { opacity:0.2; transform:translateY(0); }',
    '  to   { opacity:0.7; transform:translateY(-12px); }',
    '}',

    '.ag-mo-icon {',
    '  font-size: 56px;',
    '  filter: drop-shadow(0 0 20px rgba(62,207,207,0.5));',
    '  animation: moIconPulse 2.5s ease-in-out infinite;',
    '  position: relative; z-index:1;',
    '}',
    '@keyframes moIconPulse {',
    '  0%,100% { transform: scale(1) rotate(-4deg); }',
    '  50%     { transform: scale(1.12) rotate(4deg); }',
    '}',

    '.ag-mo-title {',
    '  font-size: clamp(11px,3.5vw,15px);',
    '  color: var(--water,#3ecfcf);',
    '  text-shadow: 3px 3px 0 rgba(0,0,0,0.5), 0 0 20px rgba(62,207,207,0.3);',
    '  letter-spacing: 2px;',
    '  line-height: 1.4;',
    '  position: relative; z-index:1;',
    '}',

    '.ag-mo-sub {',
    '  font-size: clamp(8px,2.5vw,11px);',
    '  color: var(--gold,#f5c842);',
    '  text-shadow: 2px 2px 0 var(--gold-dk,#7a6010);',
    '  letter-spacing: 3px;',
    '  position: relative; z-index:1;',
    '}',

    '.ag-mo-divider {',
    '  width: 100%;',
    '  height: 3px;',
    '  background: repeating-linear-gradient(90deg, var(--water,#3ecfcf) 0, var(--water,#3ecfcf) 8px, transparent 8px, transparent 14px);',
    '  opacity: 0.35;',
    '  position: relative; z-index:1;',
    '}',

    '.ag-mo-body {',
    '  font-family: "VT323", monospace;',
    '  font-size: clamp(16px,4vw,20px);',
    '  color: var(--text,#f0e6c8);',
    '  line-height: 1.7;',
    '  letter-spacing: 1px;',
    '  opacity: 0.85;',
    '  position: relative; z-index:1;',
    '}',

    '.ag-mo-hint {',
    '  display: flex;',
    '  align-items: center;',
    '  gap: 10px;',
    '  background: rgba(62,207,207,0.06);',
    '  border: 2px solid rgba(62,207,207,0.2);',
    '  padding: 10px 16px;',
    '  font-family: "VT323", monospace;',
    '  font-size: clamp(13px,3.5vw,17px);',
    '  color: var(--subtext,rgba(240,230,200,0.55));',
    '  letter-spacing: 1px;',
    '  position: relative; z-index:1;',
    '}',

    '.ag-mo-blink {',
    '  font-family: "VT323", monospace;',
    '  font-size: clamp(12px,3vw,15px);',
    '  color: var(--subtext,rgba(240,230,200,0.4));',
    '  letter-spacing: 2px;',
    '  animation: moBlink 1.6s steps(1) infinite;',
    '  position: relative; z-index:1;',
    '  margin-top: 4px;',
    '}',
  '@keyframes moBlink {',
  '  0%,49% { opacity:1; }',
  '  50%,100% { opacity:0; }',
  '}',
].join('\n');
document.head.appendChild(style);

  // Hide the game section content, replace with overlay
  var gameSection = document.getElementById('gameSection');
  if (gameSection) {
    // Keep the stars & river for visual but hide the actual frame
    var frameWrapper = gameSection.querySelector('.ag-frame-wrapper');
    var titleArea    = gameSection.querySelector('.ag-title-area');
    if (frameWrapper) frameWrapper.style.display = 'none';
    if (titleArea)    titleArea.style.display    = 'none';

    // Insert overlay into game section
    gameSection.appendChild(overlay);
  }
})();



/* ══════════════════════════════════════
   STARS
══════════════════════════════════════ */
(function() {
  var c = document.getElementById('agStars');
  if (!c) return;
  for (var i = 0; i < 70; i++) {
    var s = document.createElement('div');
    s.className = 'ag-star';
    var sz = Math.random() < 0.25 ? 3 : 2;
    s.style.cssText =
      'width:'+sz+'px;height:'+sz+'px;' +
      'left:'+(Math.random()*100)+'%;' +
      'top:'+(Math.random()*55)+'%;' +
      'animation-duration:'+(Math.random()*2+1)+'s;' +
      'animation-delay:'+(Math.random()*3)+'s;';
    c.appendChild(s);
  }
})();

/* ══════════════════════════════════════
   FULLSCREEN
══════════════════════════════════════ */
document.getElementById('fsBtn').addEventListener('click', function() {
  var frame = document.getElementById('gameFrame');
  var isFs  = document.fullscreenElement || document.webkitFullscreenElement;
  if (!isFs) {
    (frame.requestFullscreen || frame.webkitRequestFullscreen).call(frame);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  }
});
function updateFsIcon() {
  var isFs = document.fullscreenElement || document.webkitFullscreenElement;
  document.getElementById('fsIcon').className   = isFs ? 'fas fa-compress' : 'fas fa-expand';
  document.getElementById('fsLabel').textContent = isFs ? 'EXIT' : 'FULLSCREEN';
}
document.addEventListener('fullscreenchange',       updateFsIcon);
document.addEventListener('webkitfullscreenchange', updateFsIcon);

/* ══════════════════════════════════════
   NAVBAR SCROLL
══════════════════════════════════════ */
window.addEventListener('scroll', function() {
  var nb = document.querySelector('.navbar');
  if (nb) nb.classList.toggle('scrolled', window.scrollY > 30);
});

/* ══════════════════════════════════════
   LEADERBOARD
══════════════════════════════════════ */
var currentTab = 'alltime';

// No demo data — leaderboard starts empty and fills from real game scores
var DEMO_DATA = { alltime: [], weekly: [], daily: [] };

function renderLeaderboard(data) {
  var tbody = document.getElementById('lbBody');
  if (!tbody) return;

  if (!data || data.length === 0) {
    tbody.innerHTML = [
      '<tr><td colspan="5">',
      '  <div class="ag-lb-empty-wrap">',
      '    <div class="ag-lb-empty-icon">🏆</div>',
      '    <div class="ag-lb-empty-bars">',
      '      <div class="ag-lb-empty-bar"></div>',
      '      <div class="ag-lb-empty-bar"></div>',
      '      <div class="ag-lb-empty-bar"></div>',
      '      <div class="ag-lb-empty-bar"></div>',
      '      <div class="ag-lb-empty-bar"></div>',
      '    </div>',
      '    <div class="ag-lb-empty-title">NO GUARDIANS YET</div>',
      '    <div class="ag-lb-empty-sub">BE THE FIRST TO CLAIM THE THRONE</div>',
      '    <div class="ag-lb-empty-hint">🎮 &nbsp; PLAY THE GAME · SUBMIT YOUR SCORE</div>',
      '  </div>',
      '</td></tr>'
    ].join('');
    return;
  }

  var rows = '';
  data.forEach(function(e, i) {
    var rank   = e.rank || i + 1;
    var rc     = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';
    var medal  = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '#' + rank;
    var dateS  = e.date ? e.date.slice(5).replace('-','/') : '—';
    rows += '<tr class="'+rc+'">'
      + '<td class="center"><span class="ag-rank-badge">'+medal+'</span></td>'
      + '<td><span class="ag-avatar"></span>'+e.name+'</td>'
      + '<td class="center"><span class="ag-level-tag">LVL '+(e.level||1)+'</span></td>'
      + '<td class="right"><span class="ag-score-value">'+Number(e.score).toLocaleString()+'</span></td>'
      + '<td class="right" style="font-size:16px;opacity:0.6;">'+dateS+'</td>'
      + '</tr>';
  });

  tbody.innerHTML = rows;

  var upd = document.getElementById('lbUpdatedAt');
  if (upd) {
    var now = new Date();
    upd.textContent = 'UPDATED: ' + now.toTimeString().slice(0,5);
  }
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.ag-lb-tab').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
  });
  loadLeaderboard(tab);
}

function loadLeaderboard(tab) {
  tab = tab || currentTab;
  // Try localStorage first (real scores), fall back to demo
  var stored = localStorage.getItem('ag_lb_' + tab);
  var data   = stored ? JSON.parse(stored) : DEMO_DATA[tab] || [];
  renderLeaderboard(data);

  /* ── Real API (uncomment when ready) ──
  fetch('/api/leaderboard?period=' + tab)
    .then(function(r){ return r.json(); })
    .then(function(d){ renderLeaderboard(d); })
    .catch(function(){ renderLeaderboard(DEMO_DATA[tab]||[]); });
  */
}

function refreshLeaderboard() {
  var icon = document.getElementById('refreshIcon');
  if (icon) icon.style.transform = 'rotate(360deg)';
  if (icon) icon.style.transition = 'transform 0.5s ease';
  loadLeaderboard(currentTab);
  setTimeout(function() {
    if (icon) { icon.style.transform = ''; icon.style.transition = ''; }
  }, 600);
}

// Initial load
loadLeaderboard('alltime');

/* ══════════════════════════════════════
   RECEIVE SCORE FROM GAME (postMessage)
   ─────────────────────────────────────
   في لعبتك (Construct / Unity / Godot)
   لما اللعبة تخلص، ابعت كده:

     window.parent.postMessage({
       type:   'AQUAGUARD_SCORE',
       player: 'PlayerName',
       score:  12500,
       level:  3
     }, '*');

   وهيتحفظ أوتوماتيك ويتحدث الجدول
══════════════════════════════════════ */
window.addEventListener('message', function(event) {
  var msg = event.data;
  if (!msg || msg.type !== 'AQUAGUARD_SCORE') return;

  var playerName = msg.player || 'PLAYER';
  var score      = parseInt(msg.score)  || 0;
  var level      = parseInt(msg.level)  || 1;
  var dateStr    = new Date().toISOString().slice(0,10);

  ['alltime','weekly','daily'].forEach(function(tab) {
    var stored = localStorage.getItem('ag_lb_'+tab);
    var data   = stored ? JSON.parse(stored) : [];
    data.push({ name: playerName, score: score, level: level, date: dateStr });
    data.sort(function(a,b){ return b.score - a.score; });
    data = data.slice(0, 10);
    data.forEach(function(e,i){ e.rank = i+1; });
    localStorage.setItem('ag_lb_'+tab, JSON.stringify(data));
  });

  // Show "Your Rank" strip
  var allData = JSON.parse(localStorage.getItem('ag_lb_alltime') || '[]');
  var myIdx   = allData.findIndex(function(e){ return e.name === playerName; });
  if (myIdx !== -1) {
    var strip = document.getElementById('myRankStrip');
    if (strip) {
      strip.style.display = 'flex';
      document.getElementById('myRankValue').textContent = '#' + (myIdx+1);
      document.getElementById('myBestScore').textContent = Number(allData[myIdx].score).toLocaleString();
    }
  }

  loadLeaderboard(currentTab);
});