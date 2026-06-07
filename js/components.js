import { escapeHtml, imgPlaceholder } from './utils.js';
import { isInWatchlist, isInFavorites, getWatchlistStatus, addToWatchlist, removeFromWatchlist, addToFavorites, removeFromFavorites, updateWatchlistStatus } from './storage.js';

const LOGO_URL = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwxClcajSZy1q1gj_1kf_9y1J7mutn4jWfqdhlBVbFjLkViz_Z3-nuIZ11W0qOd1jlFgMFYi-g_XrpIiRbQjZd-wPwg4RWWyhbR0QLw0-ZgX5DFncVPNOxrDBouMlbdz2sLvQS65JbQaLJpQReWhjceG8Rn5cxrNusoQAXieXFcX_q_LZthCYS1AsCR30/s320/NamiTube%20Original%20banner.png';

export function renderHeader(activePage) {
  const pages = [
    { id: 'home', label: 'Home', url: 'home.html' },
    { id: 'discover', label: 'Discover', url: 'discover.html' },
    { id: 'search', label: 'Search', url: 'search.html' },
    { id: 'schedule', label: 'Schedule', url: 'schedule.html' },
    { id: 'spotlight', label: 'Spotlight', url: 'spotlight.html' },
    { id: 'library', label: 'Library', url: 'library.html' },
    { id: 'donate', label: 'Donate', url: 'donate.html' }
  ];
  const navLinks = pages.map(p => {
    const cls = p.id === activePage ? 'active' : '';
    return `<a href="${p.url}" class="${cls}">${escapeHtml(p.label)}</a>`;
  }).join('');

  return `
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <div class="header-left">
      <a href="index.html" class="header-logo" aria-label="NamiTube Home">
        <img src="${LOGO_URL}" alt="NamiTube Logo" loading="eager">
      </a>
    </div>
    <nav class="header-nav" role="navigation" aria-label="Main navigation">
      ${navLinks}
    </nav>
    <div class="header-actions">
      <button class="header-btn" id="search-toggle" aria-label="Open search">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
      <div style="position:relative;">
        <button class="header-avatar" id="profile-toggle" aria-label="Open profile menu">
          <span id="header-avatar-initial">U</span>
          <img id="header-avatar-img" src="" alt="" style="display:none;">
        </button>
        <div class="profile-dropdown" id="profile-dropdown">
          <a href="profile.html">View Profile</a>
          <a href="library.html">My Library</a>
          <a href="library.html#history">Watch History</a>
          <a href="library.html#favorites">Favorites</a>
          <hr>
          <a href="profile.html#settings">Settings</a>
        </div>
      </div>
      <button class="header-btn hamburger" id="menu-toggle" aria-label="Open menu" aria-expanded="false">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>
      </button>
    </div>
  `;
}

export function renderFooter() {
  return `
    <div class="footer-inner">
      <div class="footer-logo">
        <img src="${LOGO_URL}" alt="NamiTube Banner" loading="lazy">
      </div>
      <p class="footer-tagline">Your premium destination for free anime streaming.</p>
      <div class="footer-socials">
        <a href="#" aria-label="Discord"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0"/><path d="M15 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0"/><path d="M8.5 8a3.5 3.5 0 0 1 3.5-3.5h.5a3.5 3.5 0 0 1 3.5 3.5v0a3.5 3.5 0 0 1-3.5 3.5h-.5A3.5 3.5 0 0 1 8.5 8v0z"/><path d="M3 5c.8 4.5 2.8 14 4.5 15.5 1.2 1 3-.5 3-.5"/><path d="M16 20s1.8 1.5 3 .5C20.8 19 22.8 9.5 23 5"/></svg></a>
        <a href="#" aria-label="Twitter"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>
        <a href="#" aria-label="Reddit"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M8 12h8"/><path d="M9 8a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3"/><path d="M15 8a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3"/></svg></a>
        <a href="#" aria-label="Telegram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 3 10l6 2 2 6 10-15z"/><path d="m11 18 2 2"/></svg></a>
        <a href="#" aria-label="GitHub"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg></a>
      </div>
      <hr class="footer-hr">
      <p class="footer-disclaimer">This site does not store any files on its server. All contents are provided by non-affiliated third parties.</p>
      <p class="footer-copy">&copy; 2025 NamiTube. Built with passion for anime fans worldwide.</p>
    </div>
  `;
}

export function AnimeCard(data, options = {}) {
  const { size = 'md', showActions = true, showProgress = false } = options;
  const width = size === 'sm' ? '120px' : size === 'md' ? '160px' : '100%';
  const malId = data.mal_id || data.malId;
  const title = data.title || data.title_english || 'Untitled';
  const img = data.images?.jpg?.large_image_url || data.images?.jpg?.image_url || data.posterUrl || imgPlaceholder(230,345);
  const score = data.score || data.scored_by || 0;
  const type = data.type || 'TV';
  const episodes = data.episodes || data.totalEpisodes || '?';
  const inWl = isInWatchlist(malId);
  const inFav = isInFavorites(malId);
  const wlClass = inWl ? 'active' : '';
  const favClass = inFav ? 'active' : '';

  return `
    <div class="anime-card" style="width:${width}" data-mal-id="${malId}">
      <a href="anime.html?id=${malId}" class="card-poster-wrap" aria-label="${escapeHtml(title)}">
        <div class="card-poster">
          <img data-src="${img}" src="${imgPlaceholder(230,345)}" alt="${escapeHtml(title)} poster" loading="lazy">
          <div class="card-badges">
            <span class="badge-type">${escapeHtml(type)}</span>
            ${score ? `<span class="badge-score"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ${score.toFixed(1)}</span>` : ''}
          </div>
          <div class="card-overlay">
            <div class="card-overlay-content">
              <button class="overlay-btn watch-btn" onclick="event.preventDefault(); window.location.href='watch.html?id=${malId}&ep=1&lang=sub'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Watch Now
              </button>
              <p class="overlay-synopsis">${escapeHtml((data.synopsis || '').slice(0, 120))}...</p>
            </div>
          </div>
          ${showActions ? `<button class="card-bookmark ${wlClass}" data-mal-id="${malId}" aria-label="Toggle watchlist" onclick="event.preventDefault(); toggleWatchlistFromCard(this)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${inWl ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </button>` : ''}
        </div>
      </a>
      <div class="card-info">
        <a href="anime.html?id=${malId}" class="card-title">${escapeHtml(title)}</a>
        <div class="card-meta">
          <span>${episodes} Ep</span>
          ${showProgress && data.progress ? `<span class="progress-dot" style="background:var(--nt-green)"></span>` : ''}
        </div>
      </div>
    </div>
  `;
}

export function SkeletonCard(size = 'md') {
  const width = size === 'sm' ? '120px' : size === 'md' ? '160px' : '100%';
  return `
    <div class="skeleton-card" style="width:${width}">
      <div class="skeleton-poster"></div>
      <div class="skeleton-text medium"></div>
      <div class="skeleton-text short"></div>
    </div>
  `;
}

export function SkeletonRow(count = 6, size = 'md') {
  return `<div class="skeleton-row">${Array(count).fill(0).map(() => SkeletonCard(size)).join('')}</div>`;
}

export function Toast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container') || (() => {
    const c = document.createElement('div');
    c.id = 'toast-container';
    c.className = 'toast-container';
    document.body.appendChild(c);
    return c;
  })();
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `
    <span>${escapeHtml(message)}</span>
    <button onclick="this.parentElement.remove()" aria-label="Dismiss" style="margin-left:auto;background:none;border:none;color:var(--nt-text-muted);cursor:pointer;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  `;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 350);
  }, duration);
}

export function Modal(title, bodyHTML, actions = []) {
  const existing = document.querySelector('.modal-overlay');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'modal-title');
  overlay.innerHTML = `
    <div class="modal-box anim-scale-in">
      <h3 class="modal-title" id="modal-title">${escapeHtml(title)}</h3>
      <div class="modal-body">${bodyHTML}</div>
      <div class="modal-actions">
        ${actions.map(a => `<button class="nt-btn nt-btn-${a.style || 'secondary'}" data-action>${escapeHtml(a.label)}</button>`).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));

  const close = () => {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 250);
  };
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelectorAll('[data-action]').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (actions[i]?.onClick) actions[i].onClick();
      close();
    });
  });
  const onKey = e => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } };
  document.addEventListener('keydown', onKey);
  return { close };
}

export function EpisodeGrid(episodes, currentEp, malId, lang) {
  if (!episodes || !episodes.length) return '<p class="empty-msg">No episodes available.</p>';
  return `
    <div class="episode-grid">
      ${episodes.map(ep => {
        const isCurrent = ep.mal_id === currentEp || ep.episode === currentEp;
        const epNum = ep.mal_id || ep.episode || ep.number;
        const title = ep.title || `Episode ${epNum}`;
        const thumb = ep.images?.jpg?.image_url || '';
        return `
          <a href="watch.html?id=${malId}&ep=${epNum}&lang=${lang}" class="episode-tile ${isCurrent ? 'current' : ''}" aria-current="${isCurrent ? 'true' : 'false'}">
            ${thumb ? `<img src="${thumb}" alt="" loading="lazy">` : `<div class="ep-thumb-placeholder">${epNum}</div>`}
            <div class="ep-info">
              <span class="ep-num">EP ${epNum}</span>
              <span class="ep-title">${escapeHtml(title)}</span>
            </div>
          </a>
        `;
      }).join('')}
    </div>
  `;
}

export function RatingStars(malId, currentRating = 0, onRate) {
  let html = '<div class="rating-stars" role="group" aria-label="Rate anime">';
  for (let i = 1; i <= 10; i++) {
    const filled = i <= currentRating;
    html += `<button class="star-btn ${filled ? 'filled' : ''}" data-val="${i}" aria-label="Rate ${i} out of 10">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    </button>`;
  }
  html += '</div>';
  return html;
}

export function CountdownTimer(targetTimestamp, containerEl) {
  function update() {
    if (!containerEl || !document.contains(containerEl)) return;
    const diff = targetTimestamp - Date.now();
    if (diff <= 0) { containerEl.textContent = 'Airing now'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    containerEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
  }
  update();
  const id = setInterval(update, 1000);
  return () => clearInterval(id);
}

export function initHeaderInteractions() {
  const searchToggle = document.getElementById('search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', () => {
      searchOverlay.classList.toggle('active');
      if (searchOverlay.classList.contains('active')) {
        const input = searchOverlay.querySelector('input');
        if (input) setTimeout(() => input.focus(), 100);
      }
    });
  }

  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  if (menuToggle && mobileDrawer) {
    const toggleMenu = () => {
      const active = mobileDrawer.classList.toggle('active');
      if (drawerOverlay) drawerOverlay.classList.toggle('active', active);
      menuToggle.setAttribute('aria-expanded', String(active));
    };
    menuToggle.addEventListener('click', toggleMenu);
    if (drawerOverlay) drawerOverlay.addEventListener('click', toggleMenu);
  }

  const profileToggle = document.getElementById('profile-toggle');
  const profileDropdown = document.getElementById('profile-dropdown');
  if (profileToggle && profileDropdown) {
    profileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
    });
    document.addEventListener('click', () => profileDropdown.classList.remove('active'));
  }

  // Update avatar
  try {
    const profile = JSON.parse(localStorage.getItem('namitube_profile') || '{}');
    const initial = document.getElementById('header-avatar-initial');
    const img = document.getElementById('header-avatar-img');
    if (profile.avatarBase64 && img) {
      img.src = profile.avatarBase64;
      img.style.display = 'block';
      if (initial) initial.style.display = 'none';
    } else if (initial && profile.displayName) {
      initial.textContent = profile.displayName.slice(0, 1).toUpperCase();
    }
  } catch (e) {}
}

window.toggleWatchlistFromCard = function(btn) {
  const malId = Number(btn.dataset.malId);
  const inWl = btn.classList.contains('active');
  if (inWl) {
    removeFromWatchlist(malId);
    btn.classList.remove('active');
    btn.querySelector('svg').setAttribute('fill', 'none');
    Toast('Removed from watchlist', 'info');
  } else {
    const card = document.querySelector(`.anime-card[data-mal-id="${malId}"]`);
    const title = card?.querySelector('.card-title')?.textContent || 'Anime';
    const img = card?.querySelector('img')?.dataset.src || '';
    addToWatchlist({ malId, title, posterUrl: img, score: 0, totalEpisodes: null });
    btn.classList.add('active');
    btn.querySelector('svg').setAttribute('fill', 'currentColor');
    Toast('Added to watchlist', 'success');
  }
};
