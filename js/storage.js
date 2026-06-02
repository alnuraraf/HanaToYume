import { CONFIG } from './config.js';

const KEYS = {
    PROFILE: 'userProfile',
    HISTORY: 'watchHistory',
    WATCHLIST: 'watchlist',
    FAVORITES: 'favorites',
    CONTINUE: 'continueWatching'
};

function get(key, defaultValue = '[]') {
    try { return JSON.parse(localStorage.getItem(key) || defaultValue); }
    catch { return JSON.parse(defaultValue); }
}
function set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

export const Storage = {
    getProfile() { return get(KEYS.PROFILE, '{"name":"Guest","avatar":"","joined":"' + new Date().toISOString() + '"}'); },
    setProfile(profile) { set(KEYS.PROFILE, profile); },
    getWatchHistory() { return get(KEYS.HISTORY); },
    addToHistory(animeId, episode, title, image) {
        const history = this.getWatchHistory();
        const filtered = history.filter(h => h.animeId !== animeId);
        filtered.unshift({ animeId, episode, title, image, timestamp: Date.now() });
        set(KEYS.HISTORY, filtered.slice(0, CONFIG.MAX_HISTORY));
    },
    getWatchlist() { return get(KEYS.WATCHLIST); },
    isInWatchlist(animeId) { return this.getWatchlist().some(a => a.id === animeId); },
    toggleWatchlist(anime) {
        const list = this.getWatchlist();
        const index = list.findIndex(a => a.id === anime.id);
        if (index > -1) { list.splice(index, 1); set(KEYS.WATCHLIST, list); return false; }
        else { list.unshift({ id: anime.id, title: anime.title, image: anime.image, added: Date.now() }); set(KEYS.WATCHLIST, list); return true; }
    },
    getFavorites() { return get(KEYS.FAVORITES); },
    isFavorite(animeId) { return this.getFavorites().some(a => a.id === animeId); },
    toggleFavorite(anime) {
        const list = this.getFavorites();
        const index = list.findIndex(a => a.id === anime.id);
        if (index > -1) { list.splice(index, 1); set(KEYS.FAVORITES, list); return false; }
        else { list.unshift({ id: anime.id, title: anime.title, image: anime.image, added: Date.now() }); set(KEYS.FAVORITES, list); return true; }
    },
    getContinueWatching() { return get(KEYS.CONTINUE); },
    updateContinueWatching(animeId, episode, title, image, totalEpisodes, currentTime = 0) {
        const list = this.getContinueWatching();
        const filtered = list.filter(l => l.animeId !== animeId);
        filtered.unshift({ animeId, episode, title, image, totalEpisodes, currentTime, updated: Date.now() });
        set(KEYS.CONTINUE, filtered.slice(0, CONFIG.MAX_CONTINUE));
    },
    removeContinueWatching(animeId) {
        const list = this.getContinueWatching().filter(l => l.animeId !== animeId);
        set(KEYS.CONTINUE, list);
    },
    getStats() {
        return { history: this.getWatchHistory().length, watchlist: this.getWatchlist().length, favorites: this.getFavorites().length, continue: this.getContinueWatching().length };
    }
};
