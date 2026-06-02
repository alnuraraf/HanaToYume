/**
 * Jikan API v4 wrapper with caching and rate limiting
 * https://docs.api.jikan.moe/
 */

const BASE_URL = 'https://api.jikan.moe/v4';

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Rate limiting queue
let lastRequest = 0;
const MIN_DELAY = 350; // Jikan rate limit: ~3 req/s

async function fetchWithCache(url: string): Promise<any> {
  // Check cache
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequest;
  if (timeSinceLastRequest < MIN_DELAY) {
    await new Promise((r) => setTimeout(r, MIN_DELAY - timeSinceLastRequest));
  }
  lastRequest = Date.now();

  const response = await fetch(url);
  if (response.status === 429) {
    // Rate limited, wait and retry
    await new Promise((r) => setTimeout(r, 1500));
    return fetchWithCache(url);
  }
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}

/* ─── API Functions ─── */

export async function getTopAnime(page = 1, limit = 25, filter = '') {
  const filterParam = filter ? `&filter=${filter}` : '';
  const data = await fetchWithCache(
    `${BASE_URL}/top/anime?page=${page}&limit=${limit}${filterParam}&sfw=true`
  );
  return data;
}

export async function getTrendingAnime() {
  const data = await fetchWithCache(
    `${BASE_URL}/top/anime?filter=airing&limit=25&sfw=true`
  );
  return data.data || [];
}

export async function getPopularAnime() {
  const data = await fetchWithCache(
    `${BASE_URL}/top/anime?filter=bypopularity&limit=25&sfw=true`
  );
  return data.data || [];
}

export async function getUpcomingAnime() {
  const data = await fetchWithCache(
    `${BASE_URL}/top/anime?filter=upcoming&limit=25&sfw=true`
  );
  return data.data || [];
}

export async function getSeasonalAnime() {
  const data = await fetchWithCache(
    `${BASE_URL}/seasons/now?limit=25&sfw=true`
  );
  return data.data || [];
}

export async function getAnimeById(id: number) {
  const data = await fetchWithCache(`${BASE_URL}/anime/${id}/full`);
  return data.data;
}

export async function getAnimeCharacters(id: number) {
  const data = await fetchWithCache(`${BASE_URL}/anime/${id}/characters`);
  return data.data || [];
}

export async function getAnimeRecommendations(id: number) {
  const data = await fetchWithCache(
    `${BASE_URL}/anime/${id}/recommendations`
  );
  return (data.data || []).slice(0, 12);
}

export async function searchAnime(query: string, page = 1, limit = 20) {
  if (!query.trim()) return { data: [], pagination: {} };
  const data = await fetchWithCache(
    `${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sfw=true&order_by=popularity&sort=asc`
  );
  return data;
}

export async function getAnimeByGenre(genreId: number, page = 1) {
  const data = await fetchWithCache(
    `${BASE_URL}/anime?genres=${genreId}&page=${page}&limit=25&sfw=true&order_by=popularity&sort=asc`
  );
  return data;
}

export async function getGenres() {
  const data = await fetchWithCache(`${BASE_URL}/genres/anime`);
  return data.data || [];
}

export async function getRandomAnime() {
  const data = await fetchWithCache(`${BASE_URL}/random/anime`);
  return data.data;
}

/* ─── Streaming URL Builder ─── */
export function getStreamUrl(malId: number, episode: number, language: 'sub' | 'dub') {
  return `https://megaplay.buzz/stream/mal/${malId}/${episode}/${language}`;
}
