export const Store = {
  _get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  },
  _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },

  getProfile() {
    try { return JSON.parse(localStorage.getItem('userProfile')) || { name: '', email: '' }; } catch { return { name: '', email: '' }; }
  },
  setProfile(p) { localStorage.setItem('userProfile', JSON.stringify(p)); },

  getWatchHistory() { return this._get('watchHistory'); },
  addToHistory(item) {
    let h = this.getWatchHistory().filter(i => i.malId != item.malId || i.episodeId != item.episodeId);
    h.unshift(item);
    if (h.length > 100) h = h.slice(0, 100);
    this._set('watchHistory', h);
    this.updateContinueWatching(item);
  },

  getWatchlist() { return this._get('watchlist'); },
  toggleWatchlist(item) {
    let list = this.getWatchlist();
    const idx = list.findIndex(i => i.malId == item.malId);
    if (idx >= 0) { list.splice(idx, 1); this._set('watchlist', list); return false; }
    else { list.unshift(item); this._set('watchlist', list); return true; }
  },

  getFavorites() { return this._get('favorites'); },
  toggleFavorite(item) {
    let list = this.getFavorites();
    const idx = list.findIndex(i => i.malId == item.malId);
    if (idx >= 0) { list.splice(idx, 1); this._set('favorites', list); return false; }
    else { list.unshift(item); this._set('favorites', list); return true; }
  },

  getContinueWatching() { return this._get('continueWatching'); },
  updateContinueWatching(item) {
    let list = this.getContinueWatching().filter(i => i.malId != item.malId);
    list.unshift(item);
    if (list.length > 20) list = list.slice(0, 20);
    this._set('continueWatching', list);
  }
};