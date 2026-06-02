import type { UserProfile, WatchHistoryItem } from '../types/anime';

const KEYS = {
  PROFILE: 'namitube_profile',
  HISTORY: 'namitube_history',
  WATCHLIST: 'namitube_watchlist',
  FAVORITES: 'namitube_favorites',
  CONTINUE: 'namitube_continue',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

// User Profile
export function getProfile(): UserProfile {
  return getItem<UserProfile>(KEYS.PROFILE, {
    username: 'Anime Fan',
    avatar: '',
    joinDate: new Date().toISOString(),
  });
}

export function setProfile(profile: UserProfile): void {
  setItem(KEYS.PROFILE, profile);
}

// Watch History
export function getWatchHistory(): WatchHistoryItem[] {
  return getItem<WatchHistoryItem[]>(KEYS.HISTORY, []);
}

export function addToWatchHistory(item: WatchHistoryItem): void {
  const history = getWatchHistory();
  const filtered = history.filter(
    h => !(h.animeId === item.animeId && h.episode === item.episode)
  );
  filtered.unshift(item);
  setItem(KEYS.HISTORY, filtered.slice(0, 100));
}

// Watchlist
export function getWatchlist(): number[] {
  return getItem<number[]>(KEYS.WATCHLIST, []);
}

export function toggleWatchlist(animeId: number): boolean {
  const list = getWatchlist();
  const idx = list.indexOf(animeId);
  if (idx > -1) {
    list.splice(idx, 1);
    setItem(KEYS.WATCHLIST, list);
    return false;
  } else {
    list.unshift(animeId);
    setItem(KEYS.WATCHLIST, list);
    return true;
  }
}

export function isInWatchlist(animeId: number): boolean {
  return getWatchlist().includes(animeId);
}

// Favorites
export function getFavorites(): number[] {
  return getItem<number[]>(KEYS.FAVORITES, []);
}

export function toggleFavorite(animeId: number): boolean {
  const list = getFavorites();
  const idx = list.indexOf(animeId);
  if (idx > -1) {
    list.splice(idx, 1);
    setItem(KEYS.FAVORITES, list);
    return false;
  } else {
    list.unshift(animeId);
    setItem(KEYS.FAVORITES, list);
    return true;
  }
}

export function isFavorite(animeId: number): boolean {
  return getFavorites().includes(animeId);
}

// Continue Watching
export function getContinueWatching(): WatchHistoryItem[] {
  return getItem<WatchHistoryItem[]>(KEYS.CONTINUE, []);
}

export function updateContinueWatching(item: WatchHistoryItem): void {
  const list = getContinueWatching();
  const filtered = list.filter(c => c.animeId !== item.animeId);
  filtered.unshift(item);
  setItem(KEYS.CONTINUE, filtered.slice(0, 20));
}

export function removeContinueWatching(animeId: number): void {
  const list = getContinueWatching().filter(c => c.animeId !== animeId);
  setItem(KEYS.CONTINUE, list);
}
