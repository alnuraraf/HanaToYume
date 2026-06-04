/* ============================================
   NamiTube — localStorage abstraction
   Safe getters/setters with JSON serialization
   ============================================ */

window.NamiTube = window.NamiTube || {};
const NT = window.NamiTube;

const PROFILE_KEY = 'namitube_profile';
const RECENT_KEY  = 'namitube_recent_searches';

const DEFAULT_PROFILE = {
  displayName: 'AnimeUser',
  avatarBase64: null,
  joinDate: new Date().toISOString(),
  preferences: {
    defaultLang: 'sub',
    autoplay: true,
    accentColor: '#6c63ff'
  },
  watchHistory: [],
  watchlist: [],
  favorites: [],
  userRatings: {},
  reminders: []
};

function safeGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('storage.get failed', key, e);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('storage.set failed', key, e);
    return false;
  }
}

function safeRemove(key) {
  try { localStorage.removeItem(key); return true; }
  catch (e) { return false; }
}

/* ============================================
   Profile-specific helpers
   ============================================ */

function getProfile() {
  let profile = safeGet(PROFILE_KEY, null);
  if (!profile) {
    profile = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    safeSet(PROFILE_KEY, profile);
  }
  // Backfill any missing default fields
  profile = Object.assign(JSON.parse(JSON.stringify(DEFAULT_PROFILE)), profile);
  profile.preferences = Object.assign({}, DEFAULT_PROFILE.preferences, profile.preferences || {});
  return profile;
}

function saveProfile(profile) {
  return safeSet(PROFILE_KEY, profile);
}

function updateProfile(updater) {
  const profile = getProfile();
  const updated = updater(profile);
  saveProfile(updated);
  return updated;
}

/* ---------- Watchlist ---------- */
function getWatchlist() { return getProfile().watchlist || []; }

function addToWatchlist(anime) {
  return updateProfile(p => {
    if (p.watchlist.some(w => w.malId === anime.malId)) return p;
    p.watchlist.unshift({
      malId: anime.malId,
      title: anime.title,
      posterUrl: anime.posterUrl,
      score: anime.score,
      status: 'plan',
      addedAt: Date.now()
    });
    return p;
  });
}

function removeFromWatchlist(malId) {
  return updateProfile(p => {
    p.watchlist = p.watchlist.filter(w => w.malId !== malId);
    return p;
  });
}

function isInWatchlist(malId) {
  return getWatchlist().some(w => w.malId === malId);
}

function setWatchlistStatus(malId, status) {
  return updateProfile(p => {
    const item = p.watchlist.find(w => w.malId === malId);
    if (item) item.status = status;
    return p;
  });
}

/* ---------- Favourites ---------- */
function getFavorites() { return getProfile().favorites || []; }

function addToFavorites(anime) {
  return updateProfile(p => {
    if (p.favorites.some(f => f.malId === anime.malId)) return p;
    p.favorites.unshift({
      malId: anime.malId,
      title: anime.title,
      posterUrl: anime.posterUrl,
      score: anime.score
    });
    return p;
  });
}

function removeFromFavorites(malId) {
  return updateProfile(p => {
    p.favorites = p.favorites.filter(f => f.malId !== malId);
    return p;
  });
}

function isInFavorites(malId) {
  return getFavorites().some(f => f.malId === malId);
}

/* ---------- Watch history ---------- */
function getHistory() { return getProfile().watchHistory || []; }

function addToHistory(entry) {
  return updateProfile(p => {
    // Remove any prior entry for same anime
    p.watchHistory = p.watchHistory.filter(h => h.malId !== entry.malId);
    p.watchHistory.unshift(entry);
    // Cap at 50 items
    if (p.watchHistory.length > 50) p.watchHistory = p.watchHistory.slice(0, 50);
    return p;
  });
}

function clearHistory() {
  return updateProfile(p => { p.watchHistory = []; return p; });
}

function markEpisodeWatched(malId, episode) {
  const profile = getProfile();
  const key = String(malId);
  profile.watchedEpisodes = profile.watchedEpisodes || {};
  if (!profile.watchedEpisodes[key]) profile.watchedEpisodes[key] = [];
  if (!profile.watchedEpisodes[key].includes(episode)) {
    profile.watchedEpisodes[key].push(episode);
  }
  saveProfile(profile);
}

function getWatchedEpisodes(malId) {
  const profile = getProfile();
  return (profile.watchedEpisodes && profile.watchedEpisodes[String(malId)]) || [];
}

/* ---------- User ratings ---------- */
function setUserRating(malId, rating) {
  return updateProfile(p => {
    p.userRatings = p.userRatings || {};
    p.userRatings[malId] = rating;
    return p;
  });
}

function getUserRating(malId) {
  const profile = getProfile();
  return (profile.userRatings && profile.userRatings[malId]) || 0;
}

/* ---------- Reminders ---------- */
function getReminders() { return getProfile().reminders || []; }
function addReminder(r) {
  return updateProfile(p => {
    p.reminders = p.reminders || [];
    if (!p.reminders.some(x => x.malId === r.malId)) {
      p.reminders.push(r);
    }
    return p;
  });
}
function removeReminder(malId) {
  return updateProfile(p => {
    p.reminders = (p.reminders || []).filter(r => r.malId !== malId);
    return p;
  });
}
function hasReminder(malId) {
  return getReminders().some(r => r.malId === malId);
}

/* ---------- Recent searches ---------- */
function getRecentSearches() {
  return safeGet(RECENT_KEY, []);
}
function addRecentSearch(q) {
  if (!q || !q.trim()) return;
  let recents = getRecentSearches().filter(x => x !== q);
  recents.unshift(q.trim());
  recents = recents.slice(0, 8);
  safeSet(RECENT_KEY, recents);
}
function clearRecentSearches() {
  safeRemove(RECENT_KEY);
}

/* ---------- Last server preference ---------- */
const SERVER_KEY = 'namitube_server_pref';
function getServerPref() { return safeGet(SERVER_KEY, 'primary'); }
function setServerPref(s) { safeSet(SERVER_KEY, s); }

/* ---------- Wipe all data ---------- */
function wipeAll() {
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith('namitube_')) localStorage.removeItem(k);
  });
}

const Storage = {
  getProfile, saveProfile, updateProfile,
  getWatchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, setWatchlistStatus,
  getFavorites, addToFavorites, removeFromFavorites, isInFavorites,
  getHistory, addToHistory, clearHistory, markEpisodeWatched, getWatchedEpisodes,
  setUserRating, getUserRating,
  getReminders, addReminder, removeReminder, hasReminder,
  getRecentSearches, addRecentSearch, clearRecentSearches,
  getServerPref, setServerPref,
  wipeAll
};

NT.storage = Storage;
