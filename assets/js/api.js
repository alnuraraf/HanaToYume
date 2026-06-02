const API_BASE = 'https://api.jikan.moe/v4';
const cache = new Map();

export const api = {
  async fetch(endpoint) {
    if (cache.has(endpoint)) return cache.get(endpoint);
    const res = await fetch(API_BASE + endpoint);
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    cache.set(endpoint, data);
    return data;
  },
  getTopAnime() { return this.fetch('/top/anime?limit=25'); },
  getSeasonalAnime() { return this.fetch('/seasons/now?limit=25'); },
  getAnime(id) { return this.fetch(`/anime/${id}/full`); },
  searchAnime(q, limit=25) { return this.fetch(`/anime?q=${encodeURIComponent(q)}&limit=${limit}&sfw=true`); }
};