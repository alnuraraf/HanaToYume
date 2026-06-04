/* ============================================
   NamiTube — Jikan API client
   - Map-based cache with 5-minute TTL
   - Exponential backoff retry (3 attempts)
   - Skeleton/error helpers
   ============================================ */

window.NamiTube = window.NamiTube || {};
const NT = window.NamiTube;

const BASE = 'https://api.jikan.moe/v4';
const TTL  = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;
const BACKOFF_BASE = 600; // ms

const _cache = new Map();

function cacheKey(path, params = {}) {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return sorted ? `${path}?${sorted}` : path;
}

function getFromCache(key) {
  const entry = _cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL) {
    _cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  _cache.set(key, { ts: Date.now(), data });
  // Cap cache size to prevent memory bloat
  if (_cache.size > 200) {
    const firstKey = _cache.keys().next().value;
    _cache.delete(firstKey);
  }
}

function clearCache(pattern) {
  if (!pattern) { _cache.clear(); return; }
  for (const k of _cache.keys()) {
    if (k.includes(pattern)) _cache.delete(k);
  }
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/** Core fetch with retry, exponential backoff, and cache */
async function _fetch(path, params = {}, { useCache = true, retries = MAX_RETRIES } = {}) {
  const key = cacheKey(path, params);

  if (useCache) {
    const cached = getFromCache(key);
    if (cached) return cached;
  }

  let lastError = null;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const url = new URL(BASE + path);
      Object.entries(params).forEach(([k, v]) => {
        if (v != null && v !== '') url.searchParams.set(k, v);
      });

      const res = await fetch(url.toString(), { method: 'GET' });
      if (res.status === 429 || res.status >= 500) {
        throw new Error(`HTTP ${res.status}`);
      }
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}: ${body.slice(0, 100)}`);
      }
      const json = await res.json();
      if (useCache) setCache(key, json);
      return json;
    } catch (err) {
      lastError = err;
      if (attempt < retries - 1) {
        const wait = BACKOFF_BASE * Math.pow(2, attempt) + Math.random() * 200;
        await sleep(wait);
      }
    }
  }
  throw lastError || new Error('Network error');
}

/* ============================================
   Public API methods — wrap Jikan endpoints
   ============================================ */

const Api = {
  BASE,

  /** GET /top/anime — top anime by various filters */
  topAnime({ filter = 'airing', page = 1, limit = 10 } = {}) {
    return _fetch('/top/anime', { filter, page, limit });
  },

  /** GET /seasons/now — currently airing this season */
  seasonsNow({ page = 1, limit = 12 } = {}) {
    return _fetch('/seasons/now', { page, limit });
  },

  /** GET /seasons/upcoming */
  seasonsUpcoming({ page = 1, limit = 10 } = {}) {
    return _fetch('/seasons/upcoming', { page, limit });
  },

  /** GET /anime/{id} */
  animeById(id) {
    return _fetch(`/anime/${id}/full`);
  },

  /** GET /anime/{id}/episodes */
  episodes(id, page = 1) {
    return _fetch(`/anime/${id}/episodes`, { page });
  },

  /** GET /anime/{id}/characters */
  characters(id) {
    return _fetch(`/anime/${id}/characters`);
  },

  /** GET /anime/{id}/staff */
  staff(id) {
    return _fetch(`/anime/${id}/staff`);
  },

  /** GET /anime/{id}/recommendations */
  recommendations(id) {
    return _fetch(`/anime/${id}/recommendations`);
  },

  /** GET /anime/{id}/reviews */
  reviews(id, page = 1) {
    return _fetch(`/anime/${id}/reviews`, { page });
  },

  /** GET /anime/{id}/relations */
  relations(id) {
    return _fetch(`/anime/${id}/relations`);
  },

  /** GET /anime/{id}/streaming */
  streaming(id) {
    return _fetch(`/anime/${id}/streaming`);
  },

  /** GET /schedules?filter=monday etc. */
  schedule(filter) {
    return _fetch('/schedules', { filter });
  },

  /** GET /anime?q=... — generic search */
  search({
    q = '',
    page = 1,
    limit = 12,
    type = '',
    status = '',
    genres = '',
    orderBy = 'score',
    sort = 'desc',
    minScore = '',
    sfw = true
  } = {}) {
    return _fetch('/anime', {
      q, page, limit,
      type: type || undefined,
      status: status || undefined,
      genres: genres || undefined,
      order_by: orderBy,
      sort,
      min_score: minScore || undefined,
      sfw: sfw ? 'true' : undefined
    });
  },

  /** GET /genres/anime */
  genres() {
    return _fetch('/genres/anime');
  },

  /* ---------- Cache management ---------- */
  clearCache,
  cacheSize() { return _cache.size; }
};

NT.api = Api;
