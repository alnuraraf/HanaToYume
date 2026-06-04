/* js/api.js */

const API_BASE_URL = 'https://api.jikan.moe/v4';

// In-memory cache Map: key -> { data, expiresAt }
const apiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Perform a fetch with exponential backoff and caching
 */
async function apiFetch(endpoint, params = {}, retries = 3, delay = 1000) {
  // Construct full URL
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}${endpoint}${queryString ? '?' + queryString : ''}`;

  // Check cache
  const cached = apiCache.get(url);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  // Fetch with retry logic
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      
      // Jikan frequently returns 429 (Rate Limit)
      if (response.status === 429) {
        if (attempt === retries) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        // Wait and retry (exponential backoff)
        const backoffDelay = delay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Cache successful response
      apiCache.set(url, {
        data: result,
        expiresAt: Date.now() + CACHE_TTL
      });

      return result;
    } catch (error) {
      if (attempt === retries) {
        console.error(`API Fetch failed for ${url} after ${retries + 1} attempts:`, error);
        throw error;
      }
      const backoffDelay = delay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
}

// Key Endpoints
const NamiAPI = {
  // Get top airing anime
  getTopAiring: (page = 1) => apiFetch('/top/anime', { filter: 'airing', page }),
  
  // Get top popular anime
  getTopPopular: (page = 1) => apiFetch('/top/anime', { filter: 'bypopularity', page }),
  
  // Get upcoming seasons
  getUpcoming: (page = 1) => apiFetch('/seasons/upcoming', { page }),
  
  // Get current season
  getCurrentSeason: (page = 1) => apiFetch('/seasons/now', { page }),
  
  // Get anime details
  getAnimeDetails: (id) => apiFetch(`/anime/${id}`),
  
  // Get episodes
  getAnimeEpisodes: (id, page = 1) => apiFetch(`/anime/${id}/episodes`, { page }),
  
  // Get characters
  getAnimeCharacters: (id) => apiFetch(`/anime/${id}/characters`),
  
  // Get staff
  getAnimeStaff: (id) => apiFetch(`/anime/${id}/staff`),
  
  // Get recommendations
  getAnimeRecommendations: (id) => apiFetch(`/anime/${id}/recommendations`),
  
  // Get reviews
  getAnimeReviews: (id) => apiFetch(`/anime/${id}/reviews`),
  
  // Get schedules for a weekday
  getSchedule: (day) => apiFetch('/schedules', { filter: day }),
  
  // Search anime
  searchAnime: (query, page = 1, filters = {}) => {
    const params = { q: query, page, ...filters };
    return apiFetch('/anime', params);
  },

  // Get related anime
  getAnimeRelations: (id) => apiFetch(`/anime/${id}/relations`),

  // Get external streaming links
  getAnimeStreamingLinks: (id) => apiFetch(`/anime/${id}/streaming`)
};
