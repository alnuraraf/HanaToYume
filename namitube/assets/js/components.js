/* ===== NamiTube — Shared Component Renderers ===== */

/* ---------- Lucide Icon SVGs ---------- */
const ICONS = {
  play: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>',
  playCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>',
  star: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>',
  heartFilled: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>',
  bookmark: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>',
  bookmarkFilled: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>',
  share: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>',
  chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>',
  chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>',
  chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>',
  chevronUp: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"></path></svg>',
  arrowUp: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>',
  searchX: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13.5 8.5-5 5"></path><path d="m8.5 8.5 5 5"></path><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>',
  menu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>',
  house: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>',
  trendingUp: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>',
  calendarDays: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>',
  film: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 3v18"></path><path d="M3 7.5h4"></path><path d="M3 12h18"></path><path d="M3 16.5h4"></path><path d="M17 3v18"></path><path d="M17 7.5h4"></path><path d="M17 16.5h4"></path></svg>',
  monitorPlay: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 7.75a.75.75 0 0 1 1.142-.638l3.664 2.249a.75.75 0 0 1 0 1.278l-3.664 2.25a.75.75 0 0 1-1.142-.64z"></path><rect width="20" height="14" x="2" y="3" rx="2"></rect><path d="M12 17v4"></path><path d="M8 21h8"></path></svg>',
  sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg>',
  award: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path><circle cx="12" cy="8" r="6"></circle></svg>',
  flame: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
  shuffle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"></path><path d="m18 2 4 4-4 4"></path><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"></path><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"></path><path d="m18 14 4 4-4 4"></path></svg>',
  user: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  clock: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  settings: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
  info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>',
  trash: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>',
  filter: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>',
  skipForward: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" x2="19" y1="5" y2="19"></line></svg>',
  skipBack: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" x2="5" y1="19" y2="5"></line></svg>',
  externalLink: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>',
  tags: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"></path><path d="M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z"></path><circle cx="6.5" cy="9.5" r=".5" fill="currentColor"></circle></svg>',
};

/* ---------- Helpers ---------- */
function getTitle(media) {
  return media.title.english || media.title.romaji || 'Unknown';
}

function formatScore(score) {
  return score ? (score / 10).toFixed(1) : 'N/A';
}

function formatFormat(format) {
  const map = { TV: 'TV', TV_SHORT: 'TV Short', MOVIE: 'Movie', SPECIAL: 'Special', OVA: 'OVA', ONA: 'ONA', MUSIC: 'Music' };
  return map[format] || format || '?';
}

function formatStatus(status) {
  const map = { FINISHED: 'Finished', RELEASING: 'Airing', NOT_YET_RELEASED: 'Upcoming', CANCELLED: 'Cancelled', HIATUS: 'Hiatus' };
  return map[status] || status || '?';
}

function formatEpisodeLabel(media) {
  const parts = [];
  if (media.episodes) parts.push(`EP ${media.episodes}`);
  else if (media.nextAiringEpisode) parts.push(`EP ${media.nextAiringEpisode.episode - 1}+`);
  parts.push(formatFormat(media.format));
  return parts.join(' · ');
}

function stripHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
}

function relativeTime(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function imgError(img) {
  img.onerror = null;
  img.src = 'assets/img/placeholder-cover.svg';
}

/* ---------- localStorage Helpers ---------- */
function getUser() {
  try { return JSON.parse(localStorage.getItem('namiTube_user')) || null; } catch { return null; }
}
function setUser(u) { localStorage.setItem('namiTube_user', JSON.stringify(u)); }
function ensureUser() {
  if (!getUser()) {
    setUser({ displayName: 'Anime Watcher', avatar: '', joinDate: new Date().toISOString().split('T')[0] });
  }
  return getUser();
}

function getPrefs() {
  try { return JSON.parse(localStorage.getItem('namiTube_preferences')) || {}; } catch { return {}; }
}
function setPrefs(p) { localStorage.setItem('namiTube_preferences', JSON.stringify(p)); }
function ensurePrefs() {
  const defaults = { defaultLang: 'sub', defaultServer: 'MegaCloud', autoplay: true, skipIntro: false };
  const p = { ...defaults, ...getPrefs() };
  setPrefs(p);
  return p;
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem('namiTube_history')) || []; } catch { return []; }
}
function setHistory(h) { localStorage.setItem('namiTube_history', JSON.stringify(h.slice(0, 200))); }
function addHistory(entry) {
  const h = getHistory().filter(x => !(x.animeId === entry.animeId && x.episode === entry.episode));
  h.unshift({ ...entry, watchedAt: new Date().toISOString() });
  setHistory(h);
}

function getWatchlist() {
  try { return JSON.parse(localStorage.getItem('namiTube_watchlist')) || []; } catch { return []; }
}
function setWatchlist(w) { localStorage.setItem('namiTube_watchlist', JSON.stringify(w)); }
function toggleWatchlist(anime) {
  const w = getWatchlist();
  const idx = w.findIndex(x => x.animeId === anime.animeId);
  if (idx > -1) { w.splice(idx, 1); setWatchlist(w); return false; }
  w.unshift({ ...anime, addedAt: new Date().toISOString() }); setWatchlist(w); return true;
}
function isInWatchlist(id) { return getWatchlist().some(x => x.animeId === id); }

function getFavorites() {
  try { return JSON.parse(localStorage.getItem('namiTube_favorites')) || []; } catch { return []; }
}
function setFavorites(f) { localStorage.setItem('namiTube_favorites', JSON.stringify(f)); }
function toggleFavorite(anime) {
  const f = getFavorites();
  const idx = f.findIndex(x => x.animeId === anime.animeId);
  if (idx > -1) { f.splice(idx, 1); setFavorites(f); return false; }
  f.unshift({ ...anime, addedAt: new Date().toISOString() }); setFavorites(f); return true;
}
function isInFavorites(id) { return getFavorites().some(x => x.animeId === id); }

/* ---------- Card Renderers ---------- */

function renderPortraitCard(media, extraClass = '') {
  const title = getTitle(media);
  const cover = media.coverImage?.extraLarge || media.coverImage?.large || 'assets/img/placeholder-cover.svg';
  const score = media.averageScore;
  const meta = formatEpisodeLabel(media);
  return `
    <a href="anime.html?id=${media.id}" class="card-portrait ${extraClass}" title="${title}">
      <div class="card-img-wrap">
        <img src="${cover}" alt="${title}" loading="lazy" decoding="async" onerror="imgError(this)">
        <div class="card-overlay">
          ${score ? `<div class="card-score">${ICONS.star}<span>${formatScore(score)}</span></div>` : ''}
          <div class="card-play">${ICONS.playCircle}</div>
          <div>
            <div class="card-title">${title}</div>
            <div class="card-meta">${meta}</div>
          </div>
        </div>
      </div>
    </a>`;
}

function renderWideCard(media, extraClass = '') {
  const title = getTitle(media);
  const img = media.bannerImage || media.coverImage?.extraLarge || media.coverImage?.large || 'assets/img/placeholder-cover.svg';
  const score = media.averageScore;
  return `
    <a href="anime.html?id=${media.id}" class="card-wide ${extraClass}" title="${title}">
      <div class="card-img-wrap">
        <img src="${img}" alt="${title}" loading="lazy" decoding="async" onerror="imgError(this)">
        <div class="card-overlay">
          ${score ? `<div class="card-score">${ICONS.star}<span>${formatScore(score)}</span></div>` : ''}
          <div class="card-play">${ICONS.playCircle}</div>
          <div>
            <div class="card-title">${title}</div>
            <div class="card-meta">${formatEpisodeLabel(media)}</div>
          </div>
        </div>
      </div>
    </a>`;
}

function renderRankedCard(media, rank) {
  const title = getTitle(media);
  const cover = media.coverImage?.extraLarge || media.coverImage?.large || 'assets/img/placeholder-cover.svg';
  const padRank = String(rank).padStart(2, '0');
  return `
    <div class="card-ranked">
      <a href="anime.html?id=${media.id}" class="card-portrait" title="${title}">
        <div class="card-img-wrap">
          <img src="${cover}" alt="${title}" loading="lazy" decoding="async" onerror="imgError(this)">
          <div class="card-overlay">
            <div class="card-play">${ICONS.playCircle}</div>
            <div>
              <div class="card-title">${title}</div>
              <div class="card-meta">${formatEpisodeLabel(media)}</div>
            </div>
          </div>
        </div>
      </a>
      <span class="rank-number" aria-hidden="true">${padRank}</span>
      <span class="rank-badge">#${rank}</span>
    </div>`;
}

function renderContinueWatchingCard(entry) {
  const progress = entry.progress || 0;
  const total = entry.duration || 100;
  const pct = Math.min(100, (progress / total) * 100);
  return `
    <a href="watch.html?id=${entry.animeId}&ep=${entry.episode}" class="card-wide" title="${entry.title}">
      <div class="card-img-wrap">
        <img src="${entry.cover || 'assets/img/placeholder-cover.svg'}" alt="${entry.title}" loading="lazy" decoding="async" onerror="imgError(this)">
        <div class="card-overlay">
          <div class="card-play">${ICONS.playCircle}</div>
          <div>
            <div class="card-title">${entry.title}</div>
            <div class="card-meta">Resume EP ${entry.episode}</div>
          </div>
        </div>
        <div class="card-progress"><div class="card-progress-fill" style="width:${pct}%"></div></div>
      </div>
    </a>`;
}

/* ---------- Carousel Builder ---------- */
function buildCarousel(containerId, items, { title = '', link = '', linkText = 'View All' } = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = '';
  if (title) {
    html += `<div class="section-header">
      <h2 class="section-title">${title}</h2>
      ${link ? `<a href="${link}" class="section-link">${linkText} ${ICONS.chevronRight}</a>` : ''}
    </div>`;
  }
  html += `<div class="carousel-container">
    <button class="carousel-arrow prev" aria-label="Scroll left">${ICONS.chevronLeft}</button>
    <div class="carousel-track">${items}</div>
    <button class="carousel-arrow next" aria-label="Scroll right">${ICONS.chevronRight}</button>
  </div>`;
  container.innerHTML = html;

  // Carousel arrow logic
  const track = container.querySelector('.carousel-track');
  const prevBtn = container.querySelector('.carousel-arrow.prev');
  const nextBtn = container.querySelector('.carousel-arrow.next');
  if (track && prevBtn && nextBtn) {
    const scrollAmt = () => track.clientWidth * 0.8;
    prevBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmt(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => track.scrollBy({ left: scrollAmt(), behavior: 'smooth' }));
  }
}

/* ---------- Skeleton Renderers ---------- */
function renderSkeletonCards(count = 6, type = 'portrait') {
  const cls = type === 'wide' ? 'skeleton skeleton-wide card-wide' : 'skeleton skeleton-card card-portrait';
  return Array.from({ length: count }, () => `<div class="${cls}"></div>`).join('');
}

function renderSkeletonGrid(count = 12) {
  return `<div class="card-grid">${Array.from({ length: count }, () =>
    '<div class="skeleton skeleton-card" style="aspect-ratio:2/3"></div>'
  ).join('')}</div>`;
}

/* ---------- Score Ring ---------- */
function renderScoreRing(score, size = 80) {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const pct = score ? score / 100 : 0;
  const offset = circ * (1 - pct);
  return `
    <div class="score-ring" style="width:${size}px;height:${size}px">
      <svg viewBox="0 0 ${size} ${size}">
        <circle class="ring-bg" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="4"/>
        <circle class="ring-fill" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="4"
          stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
      </svg>
      <div class="ring-text">${score ? formatScore(score) : 'N/A'}</div>
    </div>`;
}

/* ---------- Empty States ---------- */
function renderEmptyState(icon, heading, message, ctaText = '', ctaHref = '') {
  return `
    <div class="empty-state">
      ${ICONS[icon] || ICONS.searchX}
      <h3>${heading}</h3>
      <p>${message}</p>
      ${ctaText ? `<a href="${ctaHref}" class="btn btn-primary">${ctaText}</a>` : ''}
    </div>`;
}

/* ---------- Error State ---------- */
function renderErrorState(containerId, message = "Couldn't load this section. Refresh to try again.") {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="empty-state"><p style="color:var(--text-secondary)">${message}</p></div>`;
}
