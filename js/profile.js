import { getProfile, saveProfile, clearAllData, getWatchlist, getFavorites, getHistory } from './storage.js';
import { Toast, Modal } from './components.js';
import { escapeHtml } from './utils.js';

const ACCENTS = ['#7c6aff','#ff6a8a','#00c2a8','#ff9f40','#4caf50','#f04060'];

export function initProfile() {
  renderProfile();
  renderStats();
  renderPreferences();
  renderDangerZone();
}

function renderProfile() {
  const profile = getProfile();
  const avatar = document.getElementById('profile-avatar');
  const name = document.getElementById('profile-name');
  const since = document.getElementById('join-date');

  if (avatar) {
    if (profile.avatarBase64) {
      avatar.innerHTML = `<img src="${profile.avatarBase64}" alt="Avatar">`;
    } else {
      const initial = (profile.displayName || 'U').slice(0, 1).toUpperCase();
      avatar.innerHTML = `<span class="avatar-initial">${initial}</span>`;
    }
    avatar.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;
        const canvas = document.createElement('canvas');
        canvas.width = 200; canvas.height = 200;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 200, 200);
          const base64 = canvas.toDataURL('image/jpeg', 0.85);
          const p = getProfile();
          p.avatarBase64 = base64;
          saveProfile(p);
          renderProfile();
          Toast('Avatar updated', 'success');
        };
        img.src = URL.createObjectURL(file);
      };
      input.click();
    });
  }

  if (name) {
    name.textContent = profile.displayName || 'AnimeUser';
    name.contentEditable = true;
    name.addEventListener('blur', () => {
      const val = name.textContent.trim();
      if (val.length < 1) { renderProfile(); return; }
      const p = getProfile();
      p.displayName = val;
      saveProfile(p);
      Toast('Name updated', 'success');
    });
    name.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); name.blur(); } });
  }

  if (since) {
    since.textContent = new Date(profile.joinDate).toLocaleDateString();
  }
}

function renderStats() {
  const wl = getWatchlist();
  const fav = getFavorites();
  const hist = getHistory();
  const completed = wl.filter(x => x.status === 'completed').length;
  const watching = wl.filter(x => x.status === 'watching').length;
  const plan = wl.filter(x => x.status === 'plan').length;

  const stats = document.getElementById('profile-stats');
  if (stats) {
    stats.innerHTML = `
      <div class="stat-card"><div class="stat-value">${completed}</div><div class="stat-label">Completed</div></div>
      <div class="stat-card"><div class="stat-value">${watching}</div><div class="stat-label">Watching</div></div>
      <div class="stat-card"><div class="stat-value">${plan}</div><div class="stat-label">Plan to Watch</div></div>
      <div class="stat-card"><div class="stat-value">${fav.length}</div><div class="stat-label">Favorites</div></div>
    `;
  }

  const totalEp = hist.reduce((a, b) => a + (b.episode || 1), 0);
  const watchTime = totalEp * 24;
  const days = Math.floor(watchTime / 1440);
  const hours = Math.floor((watchTime % 1440) / 60);

  const viewStats = document.getElementById('viewing-stats');
  if (viewStats) {
    viewStats.innerHTML = `
      <div class="stat-row"><span>Total Episodes</span><span>${totalEp}</span></div>
      <div class="stat-row"><span>Est. Watch Time</span><span>${days}d ${hours}h</span></div>
      <div class="stat-row"><span>Completion Rate</span><span>${wl.length ? Math.round((completed / wl.length) * 100) : 0}%</span></div>
    `;
  }

  const genreChart = document.getElementById('genre-chart');
  if (genreChart) {
    // Simple genre counting from watch history
    genreChart.innerHTML = '<p class="muted">Genre stats based on watch history coming soon.</p>';
  }
}

function renderPreferences() {
  const profile = getProfile();
  const container = document.getElementById('preferences');
  if (!container) return;
  container.innerHTML = `
    <div class="pref-group">
      <label>Default Language</label>
      <div class="pref-options">
        <button class="pref-btn ${profile.preferences.defaultLang === 'sub' ? 'active' : ''}" data-pref="lang" data-val="sub">Sub</button>
        <button class="pref-btn ${profile.preferences.defaultLang === 'dub' ? 'active' : ''}" data-pref="lang" data-val="dub">Dub</button>
      </div>
    </div>
    <div class="pref-group">
      <label>Autoplay Next Episode</label>
      <button class="toggle-btn ${profile.preferences.autoplay ? 'active' : ''}" data-pref="autoplay">${profile.preferences.autoplay ? 'On' : 'Off'}</button>
    </div>
    <div class="pref-group">
      <label>Default Server</label>
      <div class="pref-options">
        <button class="pref-btn ${profile.preferences.defaultServer === 1 ? 'active' : ''}" data-pref="server" data-val="1">Server 1</button>
        <button class="pref-btn ${profile.preferences.defaultServer === 2 ? 'active' : ''}" data-pref="server" data-val="2">Server 2</button>
      </div>
    </div>
    <div class="pref-group">
      <label>Accent Color</label>
      <div class="color-swatches">
        ${ACCENTS.map(c => `
          <button class="color-swatch ${profile.preferences.accentColor === c ? 'active' : ''}" style="background:${c}" data-color="${c}" aria-label="Select accent color"></button>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('[data-pref]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = getProfile();
      const pref = btn.dataset.pref;
      if (pref === 'lang') p.preferences.defaultLang = btn.dataset.val;
      if (pref === 'autoplay') p.preferences.autoplay = !p.preferences.autoplay;
      if (pref === 'server') p.preferences.defaultServer = Number(btn.dataset.val);
      saveProfile(p);
      renderPreferences();
      Toast('Preferences saved', 'success');
    });
  });

  container.querySelectorAll('.color-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = getProfile();
      p.preferences.accentColor = btn.dataset.color;
      saveProfile(p);
      document.documentElement.style.setProperty('--nt-accent', btn.dataset.color);
      renderPreferences();
      Toast('Accent color updated', 'success');
    });
  });
}

function renderDangerZone() {
  const btn = document.getElementById('clear-all-data');
  if (!btn) return;
  btn.addEventListener('click', () => {
    Modal('Clear All Data?', 'Type DELETE to confirm. This will erase all your watchlist, favorites, history, and settings.', [
      { label: 'Cancel', style: 'secondary' },
      { label: 'Delete', style: 'danger', onClick: () => {
        clearAllData();
        window.location.reload();
      }}
    ]);
  });
}
