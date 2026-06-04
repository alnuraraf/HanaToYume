const STORAGE_KEY = 'namitube_profile';

function getProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.error(e); }
  return createDefaultProfile();
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function createDefaultProfile() {
  return {
    displayName: 'AnimeUser',
    avatarBase64: null,
    joinDate: new Date().toISOString(),
    preferences: {
      defaultLang: 'sub',
      autoplay: true,
      showMature: false,
      accentColor: '#6c63ff'
    },
    watchHistory: [],
    watchlist: [],
    favorites: [],
    userRatings: {},
    reminders: []
  };
}

function ensureProfile() {
  let p = getProfile();
  if (!p) {
    p = createDefaultProfile();
    saveProfile(p);
  }
  return p;
}

function addToHistory(malId, title, posterUrl, episode, totalEpisodes) {
  const p = ensureProfile();
  p.watchHistory = p.watchHistory.filter(h => h.malId !== malId);
  p.watchHistory.unshift({ malId, title, posterUrl, episode, totalEpisodes, timestamp: Date.now() });
  if (p.watchHistory.length > 100) p.watchHistory = p.watchHistory.slice(0, 100);
  saveProfile(p);
}

function getHistory() { return ensureProfile().watchHistory; }
function clearHistory() {
  const p = ensureProfile();
  p.watchHistory = [];
  saveProfile(p);
}

function addToWatchlist(malId, title, posterUrl, score) {
  const p = ensureProfile();
  if (!p.watchlist.find(w => w.malId === malId)) {
    p.watchlist.push({ malId, title, posterUrl, score, status: 'plan', addedAt: Date.now() });
    saveProfile(p);
    return true;
  }
  return false;
}

function removeFromWatchlist(malId) {
  const p = ensureProfile();
  p.watchlist = p.watchlist.filter(w => w.malId !== malId);
  saveProfile(p);
}

function updateWatchlistStatus(malId, status) {
  const p = ensureProfile();
  const item = p.watchlist.find(w => w.malId === malId);
  if (item) { item.status = status; saveProfile(p); }
}

function getWatchlist() { return ensureProfile().watchlist; }

function toggleFavorite(malId, title, posterUrl, score) {
  const p = ensureProfile();
  const idx = p.favorites.findIndex(f => f.malId === malId);
  if (idx >= 0) {
    p.favorites.splice(idx, 1);
    saveProfile(p);
    return false;
  } else {
    p.favorites.push({ malId, title, posterUrl, score });
    saveProfile(p);
    return true;
  }
}

function getFavorites() { return ensureProfile().favorites; }
function isFavorite(malId) { return ensureProfile().favorites.some(f => f.malId === malId); }

function setRating(malId, rating) {
  const p = ensureProfile();
  p.userRatings[malId] = rating;
  saveProfile(p);
}

function getRating(malId) { return ensureProfile().userRatings[malId] || 0; }

function addReminder(malId, title, dayOfWeek, broadcastTime) {
  const p = ensureProfile();
  if (!p.reminders.find(r => r.malId === malId)) {
    p.reminders.push({ malId, title, dayOfWeek, broadcastTime });
    saveProfile(p);
  }
}

function removeReminder(malId) {
  const p = ensureProfile();
  p.reminders = p.reminders.filter(r => r.malId !== malId);
  saveProfile(p);
}

function getReminders() { return ensureProfile().reminders; }

function setPreference(key, value) {
  const p = ensureProfile();
  p.preferences[key] = value;
  saveProfile(p);
  applyPreferences();
}

function applyPreferences() {
  const p = ensureProfile();
  document.documentElement.style.setProperty('--color-accent', p.preferences.accentColor);
  document.documentElement.style.setProperty('--color-accent-light', adjustColor(p.preferences.accentColor, 20));
  document.documentElement.style.setProperty('--color-accent-glow', hexToRgba(p.preferences.accentColor, 0.25));
  document.documentElement.style.setProperty('--color-tag-bg', hexToRgba(p.preferences.accentColor, 0.15));
}

function adjustColor(hex, amt) {
  let num = parseInt(hex.replace('#',''),16);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0x00FF) + amt;
  let b = (num & 0x00FF) + amt;
  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);
  return `#${(g | (b << 8) | (r << 16)).toString(16).padStart(6,'0')}`;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

applyPreferences();