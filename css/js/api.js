const JIKAN_BASE = 'https://api.jikan.moe/v4';

const API = {
    async fetchWithRetry(url, retries = 3) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('API Error');
            return await res.json();
        } catch (err) {
            if (retries > 0) {
                await new Promise(r => setTimeout(r, 1000));
                return this.fetchWithRetry(url, retries - 1);
            }
            console.error('Fetch failed:', err);
            return null;
        }
    },

    async getTrending() {
        const data = await this.fetchWithRetry(`${JIKAN_BASE}/top/anime?filter=airing&limit=12`);
        return data?.data || [];
    },

    async getHighestRated() {
        const data = await this.fetchWithRetry(`${JIKAN_BASE}/top/anime?limit=12`);
        return data?.data || [];
    },

    async getAnimeDetails(id) {
        const data = await this.fetchWithRetry(`${JIKAN_BASE}/anime/${id}/full`);
        return data?.data || null;
    }
};
