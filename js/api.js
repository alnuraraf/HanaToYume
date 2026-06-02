import { CONFIG } from './config.js';

const cache = new Map();
const pending = new Map();

async function fetchWithCache(url, options = {}) {
    const key = url;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.time < CONFIG.CACHE_DURATION) return cached.data;
    if (pending.has(key)) return pending.get(key);
    const promise = fetch(url, options).then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        cache.set(key, { data, time: Date.now() });
        pending.delete(key);
        return data;
    }).catch(err => { pending.delete(key); throw err; });
    pending.set(key, promise);
    return promise;
}

export const API = {
    getTopAnime(page = 1, limit = 25) { return fetchWithCache(`${CONFIG.API_BASE}/top/anime?page=${page}&limit=${limit}`); },
    getSeasonNow(page = 1) { return fetchWithCache(`${CONFIG.API_BASE}/seasons/now?page=${page}&limit=25`); },
    getAnimeById(id) { return fetchWithCache(`${CONFIG.API_BASE}/anime/${id}/full`); },
    getAnimeEpisodes(id, page = 1) { return fetchWithCache(`${CONFIG.API_BASE}/anime/${id}/episodes?page=${page}`); },
    getAnimeCharacters(id) { return fetchWithCache(`${CONFIG.API_BASE}/anime/${id}/characters`); },
    searchAnime(query, page = 1, limit = CONFIG.ITEMS_PER_PAGE) {
        return fetchWithCache(`${CONFIG.API_BASE}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sfw=true&order_by=popularity&sort=asc`);
    },
    getAnimeByGenre(genreId, page = 1) { return fetchWithCache(`${CONFIG.API_BASE}/anime?genres=${genreId}&page=${page}&limit=25&sfw=true&order_by=popularity`); },
    getTopRated(page = 1) { return fetchWithCache(`${CONFIG.API_BASE}/top/anime?page=${page}&limit=25&type=tv&filter=airing`); },
    getUpcoming(page = 1) { return fetchWithCache(`${CONFIG.API_BASE}/seasons/upcoming?page=${page}&limit=25`); },
    clearCache() { cache.clear(); }
};
