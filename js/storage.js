const PREFIX = 'namitube_';

function get(k, def) {
  try {
    const v = localStorage.getItem(PREFIX + k);
    return v ? JSON.parse(v) : def;
  } catch (e) { return def; }
}

function set(k, v) {
  try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch (e) {}
}

export function getProfile() {
  return get('profile', {
    displayName: 'AnimeUser',
    avatarBase64: null,
    joinDate: new Date().toISOString(),
    preferences: { defaultLang: 'sub', autoplay: true, defaultServer: 1, accentColor: '#7c6aff' }
  });
}

export function saveProfile(data) { set('profile', data); }

export function getWatchlist() { return get('watchlist', []); }
export function addToWatchlist(item) {
  const list = getWatchlist();
  if (!list.find(x => x.malId === item.malId)) {
    list.unshift({ ...item, status: 'plan', addedAt: Date.now() });
    set('watchlist', list);
  }
}
export function removeFromWatchlist(malId) {
  set('watchlist', getWatchlist().filter(x => x.malId !== malId));
}
export function updateWatchlistStatus(malId, status) {
  const list = getWatchlist().map(x => x.malId === malId ? { ...x, status } : x);
  set('watchlist', list);
}

export function getFavorites() { return get('favorites', []); }
export function addToFavorites(item) {
  const list = getFavorites();
  if (!list.find(x => x.malId === item.malId)) {
    list.unshift({ ...item, addedAt: Date.now() });
    set('favorites', list);
  }
}
export function removeFromFavorites(malId) {
  set('favorites', getFavorites().filter(x => x.malId !== malId));
}

export function getHistory() { return get('history', []); }
export function addToHistory(entry) {
  let list = getHistory().filter(x => !(x.malId === entry.malId && x.episode === entry.episode));
  list.unshift({ ...entry, timestamp: Date.now() });
  if (list.length > 200) list = list.slice(0, 200);
  set('history', list);
}
export function clearHistory() { set('history', []); }

export function getRating(malId) { return get('ratings', {})[String(malId)] || 0; }
export function setRating(malId, score) {
  const r = get('ratings', {});
  r[String(malId)] = score;
  set('ratings', r);
}

export function getReminders() { return get('reminders', []); }
export function addReminder(item) {
  const list = getReminders().filter(x => x.malId !== item.malId);
  list.push(item);
  set('reminders', list);
}
export function removeReminder(malId) {
  set('reminders', getReminders().filter(x => x.malId !== malId));
}

export function getRecentSearches() { return get('recentSearches', []); }
export function addRecentSearch(query) {
  let list = getRecentSearches().filter(q => q.toLowerCase() !== query.toLowerCase());
  list.unshift(query);
  if (list.length > 8) list = list.slice(0, 8);
  set('recentSearches', list);
}

export function getPlayerPrefs() {
  return get('playerPrefs', { server: 1, lang: 'sub' });
}
export function savePlayerPrefs(prefs) { set('playerPrefs', prefs); }

export function clearAllData() {
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith(PREFIX)) localStorage.removeItem(k);
  });
}

export function isInWatchlist(malId) { return getWatchlist().some(x => x.malId === malId); }
export function isInFavorites(malId) { return getFavorites().some(x => x.malId === malId); }
export function getWatchlistStatus(malId) {
  const item = getWatchlist().find(x => x.malId === malId);
  return item ? item.status : null;
}
