/* profile.js */
const ACCENT_OPTIONS = ['#6c63ff', '#ec4899', '#22c55e', '#f59e0b', '#06b6d4'];

document.addEventListener('DOMContentLoaded', () => {
  Components.mount();
  renderProfile();
});

function renderProfile() {
  const p = Storage.get();

  // Avatar
  const av = document.getElementById('profileAvatar');
  av.innerHTML = p.avatarBase64
    ? `<img src="${p.avatarBase64}" alt="Avatar"/><div class="upload-overlay"><i data-lucide="camera"></i></div>`
    : `${p.displayName.charAt(0).toUpperCase()}<div class="upload-overlay"><i data-lucide="camera"></i></div>`;
  av.onclick = () => document.getElementById('avatarInput').click();
  document.getElementById('avatarInput').onchange = handleAvatarUpload;

  // Display name
  const dn = document.getElementById('profileName');
  dn.textContent = p.displayName;
  dn.onblur = () => {
    const v = dn.textContent.trim() || 'AnimeUser';
    Storage.update(prof => prof.displayName = v);
    dn.textContent = v;
    Components.Toast('Name updated', 'success');
  };
  dn.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); dn.blur(); }
  });

  // Join date
  document.getElementById('profileJoin').textContent = 'Member since ' + new Date(p.joinDate).toLocaleDateString();

  // Stats
  const stats = {
    watched: new Set(p.watchHistory.map(h => h.malId)).size,
    watching: p.watchlist.filter(i => i.status === 'watching').length,
    favorites: p.favorites.length,
    episodes: p.watchHistory.length
  };
  document.getElementById('statsGrid').innerHTML = `
    <div class="stat-card"><div class="stat-num">${stats.watched}</div><div class="stat-label">Anime Watched</div></div>
    <div class="stat-card"><div class="stat-num">${stats.watching}</div><div class="stat-label">Watching</div></div>
    <div class="stat-card"><div class="stat-num">${stats.favorites}</div><div class="stat-label">Favourites</div></div>
    <div class="stat-card"><div class="stat-num">${stats.episodes}</div><div class="stat-label">Episodes Seen</div></div>
  `;

  // Preferences
  renderPreferences(p);
  renderAnimeStats(p);
  Utils.initIcons();
}

function renderPreferences(p) {
  const pr = p.preferences;

  // Lang
  const langWrap = document.getElementById('langRadio');
  langWrap.innerHTML = ['sub','dub'].map(l => `<label class="${pr.defaultLang===l?'active':''}"><input type="radio" name="lang" value="${l}"/>${l.toUpperCase()}</label>`).join('');
  langWrap.querySelectorAll('label').forEach(l => {
    l.onclick = () => {
      langWrap.querySelectorAll('label').forEach(x => x.classList.remove('active'));
      l.classList.add('active');
      Storage.setPref('defaultLang', l.querySelector('input').value);
      Components.Toast('Preference saved', 'success');
    };
  });

  // Toggles
  setupToggle('autoplayToggle', pr.autoplay, v => Storage.setPref('autoplay', v));
  setupToggle('matureToggle', pr.matureWarning, v => Storage.setPref('matureWarning', v));

  // Accent colour
  const cs = document.getElementById('colorSwatches');
  cs.innerHTML = ACCENT_OPTIONS.map(c => `<button class="color-swatch ${c===pr.accentColor?'active':''}" data-c="${c}" style="background:${c};" aria-label="Accent ${c}"></button>`).join('');
  cs.querySelectorAll('.color-swatch').forEach(s => {
    s.onclick = () => {
      cs.querySelectorAll('.color-swatch').forEach(x => x.classList.remove('active'));
      s.classList.add('active');
      const c = s.dataset.c;
      Storage.setPref('accentColor', c);
      document.documentElement.style.setProperty('--color-accent', c);
      document.documentElement.style.setProperty('--color-accent-glow', Components.hexToRgba(c, 0.25));
      Components.Toast('Theme updated', 'success');
    };
  });

  // Danger
  document.getElementById('clearDataBtn').onclick = () => {
    Components.Modal('Clear All Data?', 'This will permanently delete your entire profile, watchlist, favourites, history, and preferences. This cannot be undone.', [
      { label: 'Cancel' },
      { label: 'Delete Everything', primary: true, onClick: () => {
        Storage.clearAll();
        Components.Toast('All data cleared', 'success');
        setTimeout(() => window.location.reload(), 800);
      }}
    ]);
  };
}

function setupToggle(id, val, onChange) {
  const t = document.getElementById(id);
  t.classList.toggle('on', val);
  t.onclick = () => {
    const newV = !t.classList.contains('on');
    t.classList.toggle('on', newV);
    onChange(newV);
    Components.Toast('Preference saved', 'success');
  };
}

function renderAnimeStats(p) {
  const wrap = document.getElementById('animeStats');
  const eps = p.watchHistory.length;
  const totalMin = eps * 24;
  const hours = Math.floor(totalMin / 60);
  const days = (totalMin / 1440).toFixed(1);

  // Top genres (best-effort: we don't have genres stored per item, use watchlist titles as proxy)
  const genreCounts = {};
  // Use watchlist items if score available — no genre stored, so fake distribution from history count
  const completed = p.watchlist.filter(i => i.status === 'completed').length;
  const total = p.watchlist.length || 1;
  const completionRate = Math.round((completed / total) * 100);

  wrap.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:24px;">
      <div class="stat-card"><div class="stat-num">${hours}h</div><div class="stat-label">Watch Time</div></div>
      <div class="stat-card"><div class="stat-num">${days}d</div><div class="stat-label">Days Watched</div></div>
      <div class="stat-card"><div class="stat-num">${completionRate}%</div><div class="stat-label">Completion Rate</div></div>
    </div>

    <h3 style="font-size:14px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:14px;">Activity Overview</h3>
    <div class="bar-chart">
      <div class="bar-row"><span>Watching</span><div class="bar-track"><div class="bar-fill" style="width:${getPct(p,'watching')}%"></div></div><span class="text-muted">${countStat(p,'watching')}</span></div>
      <div class="bar-row"><span>Completed</span><div class="bar-track"><div class="bar-fill" style="width:${getPct(p,'completed')}%"></div></div><span class="text-muted">${countStat(p,'completed')}</span></div>
      <div class="bar-row"><span>Plan to Watch</span><div class="bar-track"><div class="bar-fill" style="width:${getPct(p,'plan')}%"></div></div><span class="text-muted">${countStat(p,'plan')}</span></div>
      <div class="bar-row"><span>Dropped</span><div class="bar-track"><div class="bar-fill" style="width:${getPct(p,'dropped')}%"></div></div><span class="text-muted">${countStat(p,'dropped')}</span></div>
    </div>
  `;
}

function countStat(p, s) { return p.watchlist.filter(i => i.status === s).length; }
function getPct(p, s) {
  const max = Math.max(1, ...['watching','completed','plan','dropped'].map(x => countStat(p, x)));
  return Math.round((countStat(p, s) / max) * 100);
}

function handleAvatarUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 200; canvas.height = 200;
      const ctx = canvas.getContext('2d');
      // Cover crop
      const ratio = Math.max(200 / img.width, 200 / img.height);
      const w = img.width * ratio, h = img.height * ratio;
      ctx.drawImage(img, (200-w)/2, (200-h)/2, w, h);
      const b64 = canvas.toDataURL('image/jpeg', 0.8);
      Storage.update(p => p.avatarBase64 = b64);
      renderProfile();
      Components.Toast('Avatar updated', 'success');
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}
