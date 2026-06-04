/* api.js — fetch logic with caching, retry, exponential backoff */
const API = (() => {
  const JIKAN_BASE = 'https://api.jikan.moe/v4';
  const ANILIST = 'https://graphql.anilist.co';

  const TTL = 5 * 60 * 1000; // 5 mins
  const cache = new Map();

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const fetchWithRetry = async (url, opts = {}, attempt = 1) => {
    try {
      const res = await fetch(url, opts);
      if (res.status === 429) throw new Error('rate-limit');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (err) {
      if (attempt < 3) {
        await sleep(400 * Math.pow(2, attempt));
        return fetchWithRetry(url, opts, attempt + 1);
      }
      throw err;
    }
  };

  const cachedFetch = async (key, fetcher) => {
    const hit = cache.get(key);
    if (hit && (Date.now() - hit.t) < TTL) return hit.data;
    const data = await fetcher();
    cache.set(key, { t: Date.now(), data });
    return data;
  };

  // --- Jikan ---
  const jikan = (path) => cachedFetch('jikan:' + path, () => fetchWithRetry(JIKAN_BASE + path));

  const getTopAiring = (page = 1) => jikan(`/top/anime?filter=airing&page=${page}`);
  const getTopUpcoming = () => jikan(`/top/anime?filter=upcoming`);
  const getTopPopularity = () => jikan(`/top/anime?filter=bypopularity`);
  const getSeasonNow = () => jikan(`/seasons/now`);
  const getSeasonUpcoming = () => jikan(`/seasons/upcoming`);
  const getAnime = (id) => jikan(`/anime/${id}/full`);
  const getEpisodes = (id, page = 1) => jikan(`/anime/${id}/episodes?page=${page}`);
  const getCharacters = (id) => jikan(`/anime/${id}/characters`);
  const getStaff = (id) => jikan(`/anime/${id}/staff`);
  const getRecommendations = (id) => jikan(`/anime/${id}/recommendations`);
  const getReviews = (id) => jikan(`/anime/${id}/reviews`);
  const getSchedule = (day) => jikan(`/schedules?filter=${day}`);
  const searchAnime = (q, opts = {}) => {
    const p = new URLSearchParams({ q, page: opts.page || 1, limit: opts.limit || 24 });
    if (opts.type) p.set('type', opts.type);
    if (opts.status) p.set('status', opts.status);
    if (opts.minScore) p.set('min_score', opts.minScore);
    if (opts.genres) p.set('genres', opts.genres);
    if (opts.orderBy) p.set('order_by', opts.orderBy);
    if (opts.sort) p.set('sort', opts.sort);
    if (opts.year) { p.set('start_date', opts.year + '-01-01'); p.set('end_date', opts.year + '-12-31'); }
    return jikan(`/anime?${p.toString()}`);
  };
  const searchSuggest = (q) => jikan(`/anime?q=${encodeURIComponent(q)}&limit=5&sfw`);

  // --- AniList ---
  const aniListQuery = async (query, variables = {}) => {
    const key = 'al:' + JSON.stringify({ query, variables });
    return cachedFetch(key, async () => {
      let attempt = 1;
      while (attempt <= 3) {
        try {
          const res = await fetch(ANILIST, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ query, variables })
          });
          if (res.status === 429) throw new Error('rate');
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const j = await res.json();
          return j.data;
        } catch (e) {
          if (attempt < 3) await sleep(400 * Math.pow(2, attempt));
          else throw e;
          attempt++;
        }
      }
    });
  };

  const aniListTrending = () => aniListQuery(`
    query {
      Page(perPage: 6) {
        media(type: ANIME, status: RELEASING, sort: TRENDING_DESC) {
          id idMal title { romaji english } bannerImage
          coverImage { extraLarge color }
          description(asHtml: false)
          averageScore episodes
        }
      }
    }`);

  const aniListByMal = (malId) => aniListQuery(`
    query ($mal: Int) {
      Media(idMal: $mal, type: ANIME) {
        id idMal bannerImage
        coverImage { extraLarge color }
        trailer { id site thumbnail }
        nextAiringEpisode { airingAt timeUntilAiring episode }
        streamingEpisodes { title thumbnail url site }
        description(asHtml: false)
        title { romaji english native }
        averageScore
      }
    }`, { mal: Number(malId) });

  const clearCache = () => cache.clear();

  return {
    getTopAiring, getTopUpcoming, getTopPopularity, getSeasonNow, getSeasonUpcoming,
    getAnime, getEpisodes, getCharacters, getStaff, getRecommendations, getReviews,
    getSchedule, searchAnime, searchSuggest,
    aniListTrending, aniListByMal, clearCache
  };
})();

window.API = API;
