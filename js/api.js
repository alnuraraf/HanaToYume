const BASE = 'https://api.jikan.moe/v4';
const CACHE_TTL = 5 * 60 * 1000;
const RATE_GAP = 340;
const MAX_RETRIES = 3;

const cache = new Map();
let lastReq = 0;
let queue = [];
let processing = false;
let rateLimitBanner = null;

function getRateBanner() {
  if (!rateLimitBanner) {
    rateLimitBanner = document.getElementById('rate-limit-banner');
  }
  return rateLimitBanner;
}

function showRateBanner(msg) {
  const b = getRateBanner();
  if (b) { b.textContent = msg; b.classList.add('active'); }
}

function hideRateBanner() {
  const b = getRateBanner();
  if (b) b.classList.remove('active');
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function enqueue(fn) {
  return new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject, retries: 0 });
    if (!processing) processQueue();
  });
}

async function processQueue() {
  processing = true;
  while (queue.length > 0) {
    const now = Date.now();
    const wait = Math.max(0, lastReq + RATE_GAP - now);
    if (wait > 0) await sleep(wait);
    const item = queue.shift();
    lastReq = Date.now();
    try {
      const result = await item.fn();
      item.resolve(result);
    } catch (err) {
      if (err.status === 429 && item.retries < MAX_RETRIES) {
        const delay = Math.pow(2, item.retries) * 1000;
        showRateBanner(`Loading... Rate limit reached. Retrying in ${delay/1000}s.`);
        await sleep(delay);
        hideRateBanner();
        item.retries++;
        queue.unshift(item);
      } else if (item.retries < MAX_RETRIES) {
        const delay = Math.pow(2, item.retries) * 1000;
        await sleep(delay);
        item.retries++;
        queue.unshift(item);
      } else {
        item.reject(err);
      }
    }
  }
  processing = false;
}

function cacheKey(url) { return url; }

function getCached(url) {
  const key = cacheKey(url);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(url, data) {
  cache.set(cacheKey(url), { data, ts: Date.now() });
}

export async function jikan(url) {
  const full = url.startsWith('http') ? url : BASE + url;
  const cached = getCached(full);
  if (cached) return cached;
  return enqueue(async () => {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(full, { signal: ctrl.signal });
      clearTimeout(to);
      if (!res.ok) {
        const err = new Error(`HTTP ${res.status}`);
        err.status = res.status;
        throw err;
      }
      const data = await res.json();
      setCached(full, data);
      return data;
    } catch (e) {
      clearTimeout(to);
      throw e;
    }
  });
}

export async function jikanParallel(urls) {
  const results = await Promise.allSettled(urls.map(u => jikan(u)));
  return results.map(r => r.status === 'fulfilled' ? r.value : null);
}

export function clearApiCache() {
  cache.clear();
}
