/* ============================================
   NamiTube — Shared UI Components
   ============================================ */

/* --- Lucide SVG Icons (inline) --- */
const ICONS = {
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  playCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  heartFilled: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>',
  bookmarkFilled: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  chevronUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  searchX: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  house: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  trendingUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  calendarDays: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
  film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>',
  monitorPlay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 7.75a.75.75 0 0 1 1.142-.638l3.664 2.249a.75.75 0 0 1 0 1.278l-3.664 2.25a.75.75 0 0 1-1.142-.64z"/><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M12 17v4"/><path d="M8 21h8"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
  award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  alertCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
  externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
  listIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
  discord: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5"/><circle cx="12" cy="12" r="10"/></svg>',
  skipForward: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/></svg>',
  skipBack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" x2="5" y1="19" y2="5"/></svg>',
  tags: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/><path d="M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8 18.01"/><circle cx="6.5" cy="9.5" r=".5" fill="currentColor"/></svg>',
};

/* --- Helpers --- */
function getTitle(media) {
  return media.title.english || media.title.romaji || 'Unknown';
}

function getCover(media) {
  return media.coverImage?.extraLarge || media.coverImage?.large || 'assets/img/placeholder-cover.svg';
}

function getBanner(media) {
  return media.bannerImage || getCover(media);
}

function formatScore(score) {
  return score ? (score / 10).toFixed(1) : 'N/A';
}

function formatStatus(s) {
  const map = { RELEASING: 'Airing', FINISHED: 'Finished', NOT_YET_RELEASED: 'Upcoming', CANCELLED: 'Cancelled', HIATUS: 'Hiatus' };
  return map[s] || s;
}

function formatFormat(f) {
  const map = { TV: 'TV', TV_SHORT: 'TV Short', MOVIE: 'Movie', SPECIAL: 'Special', OVA: 'OVA', ONA: 'ONA', MUSIC: 'Music', MANGA: 'Manga', NOVEL: 'Novel', ONE_SHOT: 'One Shot' };
  return map[f] || f;
}

function stripHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
}

function truncate(str, len = 200) {
  if (!str || str.length <= len) return str || '';
  return str.substring(0, len) + '...';
}

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function onImgError(img) {
  img.onerror = null;
  img.src = 'assets/img/placeholder-cover.svg';
}

/* --- localStorage Helpers --- */
function getUser() {
  try { return JSON.parse(localStorage.getItem('namiTube_user')) || null; } catch { return null; }
}
function setUser(data) { localStorage.setItem('namiTube_user', JSON.stringify(data)); }
function ensureUser() {
  if (!getUser()) {
    setUser({ displayName: 'Anime Watcher', avatar: '', joinDate: new Date().toISOString().split('T')[0] });
  }
  return getUser();
}

function getPrefs() {
  try {
    return JSON.parse(localStorage.getItem('namiTube_preferences')) ||
      { defaultLang: 'sub', defaultServer: 'MegaCloud', autoplay: true, skipIntro: false };
  } catch {
    return { defaultLang: 'sub', defaultServer: 'MegaCloud', autoplay: true, skipIntro: false };
  }
}
function setPrefs(p) { localStorage.setItem('namiTube_preferences', JSON.stringify(p)); }

function getHistory() {
  try { return JSON.parse(localStorage.getItem('namiTube_history')) || []; } catch { return []; }
}
function addToHistory(entry) {
  let h = getHistory();
  h = h.filter(x => !(x.animeId === entry.animeId && x.episode === entry.episode));
  h.unshift(entry);
  if (h.length > 200) h = h.slice(0, 200);
  localStorage.setItem('namiTube_history', JSON.stringify(h));
}

function getWatchlist() {
  try { return JSON.parse(localStorage.getItem('namiTube_watchlist')) || []; } catch { return []; }
}
function toggleWatchlist(anime) {
  let wl = getWatchlist();
  const idx = wl.findIndex(x => x.animeId === anime.animeId);
  if (idx > -1) { wl.splice(idx, 1); return false; }
  else { wl.unshift(anime); localStorage.setItem('namiTube_watchlist', JSON.stringify(wl)); return true; }
}

function getFavorites() {
  try { return JSON.parse(localStorage.getItem('namiTube_favorites')) || []; } catch { return []; }
}
function toggleFavorite(anime) {
  let fav = getFavorites();
  const idx = fav.findIndex(x => x.animeId === anime.animeId);
  if (idx > -1) { fav.splice(idx, 1); localStorage.setItem('namiTube_favorites', JSON.stringify(fav)); return false; }
  else { fav.unshift(anime); localStorage.setItem('namiTube_favorites', JSON.stringify(fav)); return true; }
}

function isInWatchlist(id) { return getWatchlist().some(x => x.animeId === id); }
function isInFavorites(id) { return getFavorites().some(x => x.animeId === id); }

/* === Card Renderers === */

function renderPortraitCard(media, opts = {}) {
  const title = getTitle(media);
  const cover = getCover(media);
  const score = media.averageScore;
  const ep = media.episodes ? `EP ${media.episodes}` : '';
  const fmt = formatFormat(media.format) || '';
  const meta = [ep, fmt].filter(Boolean).join(' · ');
  const link = `anime.html?id=${media.id}`;

  return `
    <a href="${link}" class="card-portrait" title="${title}">
      <div class="card-img-wrap">
        <img src="${cover}" alt="${title}" loading="lazy" decoding="async" onerror="onImgError(this)">
        ${score ? `<div class="card-score">${ICONS.star}<span>${formatScore(score)}</span></div>` : ''}
        <div class="card-overlay">
          <div class="play-icon">${ICONS.play}</div>
        </div>
        <div class="card-info">
          <div class="card-title">${title}</div>
          <div class="card-meta">${meta}</div>
        </div>
      </div>
    </a>
  `;
}

function renderWideCard(media, opts = {}) {
  const title = getTitle(media);
  const banner = getBanner(media);
  const score = media.averageScore;
  const ep = media.episodes ? `EP ${media.episodes}` : '';
  const fmt = formatFormat(media.format) || '';
  const meta = [ep, fmt].filter(Boolean).join(' · ');
  const link = opts.link || `anime.html?id=${media.id}`;

  return `
    <a href="${link}" class="card-wide" title="${title}">
      <div class="card-img-wrap">
        <img src="${banner}" alt="${title}" loading="lazy" decoding="async" onerror="onImgError(this)">
        ${score ? `<div class="card-score">${ICONS.star}<span>${formatScore(score)}</span></div>` : ''}
        <div class="card-overlay">
          <div class="play-icon">${ICONS.play}</div>
        </div>
      </div>
      <div class="card-info">
        <div class="card-title">${title}</div>
        <div class="card-meta">${meta}</div>
      </div>
    </a>
  `;
}

function renderRankedCard(media, rank) {
  const title = getTitle(media);
  const cover = getCover(media);
  const score = media.averageScore;
  const link = `anime.html?id=${media.id}`;
  const rankStr = String(rank).padStart(2, '0');

  return `
    <div class="card-ranked">
      <span class="rank-numeral">${rankStr}</span>
      <span class="rank-badge">${rankStr}</span>
      <a href="${link}" class="card-portrait" title="${title}">
        <div class="card-img-wrap">
          <img src="${cover}" alt="${title}" loading="lazy" decoding="async" onerror="onImgError(this)">
          ${score ? `<div class="card-score">${ICONS.star}<span>${formatScore(score)}</span></div>` : ''}
          <div class="card-overlay">
            <div class="play-icon">${ICONS.play}</div>
          </div>
          <div class="card-info">
            <div class="card-title">${title}</div>
          </div>
        </div>
      </a>
    </div>
  `;
}

function renderContinueCard(entry) {
  const progress = entry.progress && entry.duration ? Math.min((entry.progress / entry.duration) * 100, 100) : 30;
  return `
    <a href="watch.html?id=${entry.animeId}&ep=${entry.episode}" class="card-wide" title="${entry.title}">
      <div class="card-img-wrap">
        <img src="${entry.cover}" alt="${entry.title}" loading="lazy" decoding="async" onerror="onImgError(this)">
        <div class="card-overlay">
          <div class="play-icon">${ICONS.play}</div>
        </div>
        <div class="card-progress-bar"><div class="bar-fill" style="width:${progress}%"></div></div>
      </div>
      <div class="card-info">
        <div class="card-title">${entry.title}</div>
        <div class="card-meta">Resume Episode ${entry.episode} · ${timeAgo(entry.watchedAt)}</div>
      </div>
    </a>
  `;
}

/* === Carousel Builder === */
function buildCarousel(containerId, items, opts = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const trackId = containerId + '-track';
  container.classList.add('carousel-container');
  container.innerHTML = `
    <button class="carousel-arrow prev" aria-label="Scroll left">${ICONS.chevronLeft}</button>
    <div class="carousel-track" id="${trackId}">${items.join('')}</div>
    <button class="carousel-arrow next" aria-label="Scroll right">${ICONS.chevronRight}</button>
  `;

  const track = document.getElementById(trackId);
  const scrollAmt = opts.scrollAmount || 320;
  container.querySelector('.carousel-arrow.prev').addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmt, behavior: 'smooth' });
  });
  container.querySelector('.carousel-arrow.next').addEventListener('click', () => {
    track.scrollBy({ left: scrollAmt, behavior: 'smooth' });
  });
}

/* === Skeleton Renderers === */
function renderSkeletonCards(n = 6, type = 'portrait') {
  const cls = type === 'wide' ? 'skeleton-card-wide' : 'skeleton-card';
  return Array(n).fill(`<div class="skeleton ${cls}"></div>`).join('');
}

/* === Section Builder === */
function buildSection(id, title, linkHref, linkText) {
  return `
    <section class="section" id="${id}">
      <div class="section-header">
        <h2 class="section-title">${title}</h2>
        ${linkHref ? `<a href="${linkHref}" class="section-link">${linkText || 'View All'} ${ICONS.chevronRight}</a>` : ''}
      </div>
      <div id="${id}-carousel" class="carousel-container">
        <div class="carousel-track">${renderSkeletonCards()}</div>
      </div>
    </section>
  `;
}

/* === Error state === */
function renderError(containerId, message) {
  const el = document.getElementById(containerId);
  if (el) {
    el.innerHTML = `
      <div class="empty-state">
        ${ICONS.alertCircle}
        <h3>Something went wrong</h3>
        <p>${message || "Couldn't load this section. Refresh to try again."}</p>
      </div>
    `;
  }
}

function renderEmpty(containerId, message, ctaHref, ctaText) {
  const el = document.getElementById(containerId);
  if (el) {
    el.innerHTML = `
      <div class="empty-state">
        ${ICONS.searchX}
        <h3>${message || 'Nothing here yet'}</h3>
        <p>Start exploring anime to fill this section.</p>
        ${ctaHref ? `<a href="${ctaHref}" class="btn-primary">${ctaText || 'Browse Trending'}</a>` : ''}
      </div>
    `;
  }
}
