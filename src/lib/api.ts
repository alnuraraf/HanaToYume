import type { AnimeData, AnimeEpisode, JikanResponse } from '../types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const requestQueue: Array<() => void> = [];
let isProcessing = false;

function processQueue() {
  if (isProcessing || requestQueue.length === 0) return;
  isProcessing = true;
  const next = requestQueue.shift();
  if (next) {
    next();
    setTimeout(() => {
      isProcessing = false;
      processQueue();
    }, 350);
  }
}

async function fetchWithRateLimit(url: string): Promise<unknown> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  return new Promise((resolve, reject) => {
    requestQueue.push(async () => {
      try {
        const res = await fetch(url);
        if (res.status === 429) {
          // Rate limited, retry after delay
          await new Promise(r => setTimeout(r, 1500));
          const retryRes = await fetch(url);
          if (!retryRes.ok) throw new Error(`HTTP ${retryRes.status}`);
          const data = await retryRes.json();
          cache.set(url, { data, timestamp: Date.now() });
          resolve(data);
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        cache.set(url, { data, timestamp: Date.now() });
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
    processQueue();
  });
}

export async function getTopAnime(page = 1, filter = ''): Promise<JikanResponse<AnimeData[]>> {
  const filterParam = filter ? `&filter=${filter}` : '';
  return fetchWithRateLimit(`${BASE_URL}/top/anime?page=${page}&limit=24${filterParam}`) as Promise<JikanResponse<AnimeData[]>>;
}

export async function getTrendingAnime(): Promise<JikanResponse<AnimeData[]>> {
  return fetchWithRateLimit(`${BASE_URL}/top/anime?filter=airing&limit=10`) as Promise<JikanResponse<AnimeData[]>>;
}

export async function getSeasonalAnime(): Promise<JikanResponse<AnimeData[]>> {
  return fetchWithRateLimit(`${BASE_URL}/seasons/now?limit=24`) as Promise<JikanResponse<AnimeData[]>>;
}

export async function getUpcomingAnime(): Promise<JikanResponse<AnimeData[]>> {
  return fetchWithRateLimit(`${BASE_URL}/seasons/upcoming?limit=24`) as Promise<JikanResponse<AnimeData[]>>;
}

export async function getAnimeById(id: number): Promise<JikanResponse<AnimeData>> {
  return fetchWithRateLimit(`${BASE_URL}/anime/${id}/full`) as Promise<JikanResponse<AnimeData>>;
}

export async function getAnimeEpisodes(id: number, page = 1): Promise<JikanResponse<AnimeEpisode[]>> {
  return fetchWithRateLimit(`${BASE_URL}/anime/${id}/episodes?page=${page}`) as Promise<JikanResponse<AnimeEpisode[]>>;
}

export async function searchAnime(query: string, page = 1): Promise<JikanResponse<AnimeData[]>> {
  return fetchWithRateLimit(`${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=24&sfw=true`) as Promise<JikanResponse<AnimeData[]>>;
}

export async function getAnimeRecommendations(id: number): Promise<JikanResponse<Array<{ entry: AnimeData }>>> {
  return fetchWithRateLimit(`${BASE_URL}/anime/${id}/recommendations`) as Promise<JikanResponse<Array<{ entry: AnimeData }>>>;
}

export async function getAnimeByGenre(genreId: number, page = 1): Promise<JikanResponse<AnimeData[]>> {
  return fetchWithRateLimit(`${BASE_URL}/anime?genres=${genreId}&page=${page}&limit=24&order_by=score&sort=desc`) as Promise<JikanResponse<AnimeData[]>>;
}

export function getStreamUrl(malId: number, episode: number, language: string = 'sub'): string {
  return `https://megaplay.buzz/stream/mal/${malId}/${episode}/${language}`;
}
