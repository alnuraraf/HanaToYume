/* storage.js — localStorage abstraction */
const Storage = (() => {
  const KEY = 'namitube_profile';

  const defaultProfile = () => ({
    displayName: 'AnimeUser',
    avatarBase64: null,
    joinDate: new Date().toISOString(),
    preferences: {
      defaultLang: 'sub',
      autoplay: true,
      matureWarning: true,
      accentColor: '#6c63ff'
    },
    watchHistory: [],
    watchlist: [],
    favorites: [],
    userRatings: {},
    reminders: [],
    recentSearches: []
  });

  const get = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        const p = defaultProfile();
        save(p);
        return p;
      }
      return { ...defaultProfile(), ...JSON.parse(raw) };
    } catch (e) {
      return defaultProfile();
    }
  };

  const save = (profile) => {
    try { localStorage.setItem(KEY, JSON.stringify(profile)); } catch (e) {}
    return profile;
  };

  const update = (mutator) => {
    const p = get();
    mutator(p);
    save(p);
    return p;
  };

  // Watchlist ----------
  const inWatchlist = (malId) => get().watchlist.some(i => i.malId === Number(malId));
  const addToWatchlist = (item, status = 'plan') => update(p => {
    if (p.watchlist.some(i => i.malId === item.malId)) return;
    p.watchlist.push({ ...item, status, addedAt: Date.now() });
  });
  const removeFromWatchlist = (malId) => update(p => {
    p.watchlist = p.watchlist.filter(i => i.malId !== Number(malId));
  });
  const setWatchlistStatus = (malId, status) => update(p => {
    const it = p.watchlist.find(i => i.malId === Number(malId));
    if (it) it.status = status;
  });

  // Favourites ----------
  const inFavorites = (malId) => get().favorites.some(i => i.malId === Number(malId));
  const addToFavorites = (item) => update(p => {
    if (p.favorites.some(i => i.malId === item.malId)) return;
    p.favorites.push(item);
  });
  const removeFromFavorites = (malId) => update(p => {
    p.favorites = p.favorites.filter(i => i.malId !== Number(malId));
  });

  // History ----------
  const addToHistory = (entry) => update(p => {
    p.watchHistory = p.watchHistory.filter(h => !(h.malId === entry.malId && h.episode === entry.episode));
    p.watchHistory.unshift({ ...entry, timestamp: Date.now() });
    if (p.watchHistory.length > 200) p.watchHistory = p.watchHistory.slice(0, 200);
  });
  const clearHistory = () => update(p => { p.watchHistory = []; });
  const isEpisodeWatched = (malId, ep) =>
    get().watchHistory.some(h => h.malId === Number(malId) && h.episode === Number(ep));

  // Ratings ----------
  const setRating = (malId, value) => update(p => { p.userRatings[malId] = value; });
  const getRating = (malId) => get().userRatings[malId] || 0;

  // Reminders ----------
  const addReminder = (r) => update(p => {
    if (p.reminders.some(i => i.malId === r.malId)) return;
    p.reminders.push(r);
  });
  const removeReminder = (malId) => update(p => {
    p.reminders = p.reminders.filter(i => i.malId !== Number(malId));
  });
  const hasReminder = (malId) => get().reminders.some(r => r.malId === Number(malId));

  // Preferences ----------
  const setPref = (key, val) => update(p => { p.preferences[key] = val; });

  // Recent searches ----------
  const addRecentSearch = (q) => update(p => {
    if (!q) return;
    p.recentSearches = [q, ...p.recentSearches.filter(s => s !== q)].slice(0, 8);
  });

  const clearAll = () => { try { localStorage.removeItem(KEY); } catch (e) {} };

  return {
    get, save, update,
    inWatchlist, addToWatchlist, removeFromWatchlist, setWatchlistStatus,
    inFavorites, addToFavorites, removeFromFavorites,
    addToHistory, clearHistory, isEpisodeWatched,
    setRating, getRating,
    addReminder, removeReminder, hasReminder,
    setPref, addRecentSearch, clearAll
  };
})();

window.Storage = Storage;
