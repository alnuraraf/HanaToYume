const API_CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000;

async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    if (retries <= 1) throw err;
    await new Promise(r => setTimeout(r, delay));
    return fetchWithRetry(url, options, retries - 1, delay * 2);
  }
}

async function jikan(endpoint) {
  const key = `jikan:${endpoint}`;
  const cached = API_CACHE.get(key);
  if (cached && Date.now() - cached.time < CACHE_TTL) return cached.data;
  await new Promise(r => setTimeout(r, 400));
  const data = await fetchWithRetry(`https://api.jikan.moe/v4${endpoint}`);
  API_CACHE.set(key, { data, time: Date.now() });
  return data;
}

async function anilist(query, variables = {}) {
  const key = `anilist:${query}:${JSON.stringify(variables)}`;
  const cached = API_CACHE.get(key);
  if (cached && Date.now() - cached.time < CACHE_TTL) return cached.data;
  const res = await fetchWithRetry('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query, variables })
  });
  API_CACHE.set(key, { data: res.data, time: Date.now() });
  return res.data;
}

const Jikan = {
  topAiring: (page = 1) => jikan(`/top/anime?filter=airing&page=${page}`),
  topPopular: (page = 1) => jikan(`/top/anime?filter=bypopularity&page=${page}`),
  topRated: (page = 1) => jikan(`/top/anime?page=${page}`),
  seasonNow: (page = 1) => jikan(`/seasons/now?page=${page}`),
  seasonUpcoming: (page = 1) => jikan(`/seasons/upcoming?page=${page}`),
  schedules: (day) => jikan(`/schedules?filter=${day}`),
  search: (q, page = 1, params = '') => jikan(`/anime?q=${encodeURIComponent(q)}&page=${page}${params}`),
  details: (id) => jikan(`/anime/${id}`),
  episodes: (id, page = 1) => jikan(`/anime/${id}/episodes?page=${page}`),
  characters: (id) => jikan(`/anime/${id}/characters`),
  staff: (id) => jikan(`/anime/${id}/staff`),
  recommendations: (id) => jikan(`/anime/${id}/recommendations`),
  reviews: (id, page = 1) => jikan(`/anime/${id}/reviews?page=${page}`),
  animeByGenre: (genreId, page = 1) => jikan(`/anime?genres=${genreId}&page=${page}`)
};

const AniList = {
  async getTrendingBanners(limit = 5) {
    const data = await anilist(`
      query {
        Page(page: 1, perPage: ${limit}) {
          media(type: ANIME, status: RELEASING, sort: TRENDING_DESC) {
            idMal
            title { english romaji }
            bannerImage
            coverImage { extraLarge large }
            description
            averageScore
            genres
          }
        }
      }
    `);
    return data.Page.media;
  },

  async getByMalId(malId) {
    const data = await anilist(`
      query($idMal: Int) {
        Media(idMal: $idMal, type: ANIME) {
          id
          bannerImage
          coverImage { extraLarge large }
          trailer { id site }
          nextAiringEpisode { airingAt episode }
          title { english romaji }
        }
      }
    `, { idMal: malId });
    return data.Media;
  },

  async searchByTitle(title) {
    const data = await anilist(`
      query($search: String) {
        Page(page: 1, perPage: 5) {
          media(type: ANIME, search: $search) {
            idMal
            title { english romaji }
            coverImage { medium }
            format
            episodes
            averageScore
          }
        }
      }
    `, { search: title });
    return data.Page.media;
  }
};