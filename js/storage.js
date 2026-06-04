/* js/storage.js */

const STORAGE_KEY = 'namitube_profile';

const defaultProfile = {
  displayName: "AnimeUser",
  avatarBase64: null,
  joinDate: new Date().toISOString(),
  preferences: {
    defaultLang: "sub",
    autoplay: true,
    accentColor: "#6c63ff"
  },
  watchHistory: [],
  watchlist: [],
  favorites: [],
  userRatings: {},
  reminders: []
};

function getProfile() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    saveProfile(defaultProfile);
    return JSON.parse(JSON.stringify(defaultProfile));
  }
  try {
    // Fill in any missing default fields if profile schema evolved
    const parsed = JSON.parse(data);
    return {
      ...defaultProfile,
      ...parsed,
      preferences: { ...defaultProfile.preferences, ...(parsed.preferences || {}) },
      watchHistory: parsed.watchHistory || [],
      watchlist: parsed.watchlist || [],
      favorites: parsed.favorites || [],
      userRatings: parsed.userRatings || {},
      reminders: parsed.reminders || []
    };
  } catch (e) {
    console.error("Error reading profile", e);
    return JSON.parse(JSON.stringify(defaultProfile));
  }
}

function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    // Apply accent color immediately
    if (profile.preferences && profile.preferences.accentColor) {
      document.documentElement.style.setProperty('--color-accent', profile.preferences.accentColor);
      // Generate some lighter and translucent versions
      const hex = profile.preferences.accentColor;
      document.documentElement.style.setProperty('--color-accent-light', adjustColorBrightness(hex, 15));
      document.documentElement.style.setProperty('--color-accent-glow', hexToRgba(hex, 0.25));
    }
  } catch (e) {
    console.error("Failed to save profile", e);
  }
}

function updatePreferences(key, value) {
  const profile = getProfile();
  profile.preferences[key] = value;
  saveProfile(profile);
}

function updateDisplayName(name) {
  const profile = getProfile();
  profile.displayName = name.trim() || "AnimeUser";
  saveProfile(profile);
}

function updateAvatar(base64) {
  const profile = getProfile();
  profile.avatarBase64 = base64;
  saveProfile(profile);
}

function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('namitube_last_server'); // also clear server pref
  window.location.reload();
}

// Watch history management
function addToHistory(item) {
  // item: { malId, title, posterUrl, episode, totalEpisodes }
  const profile = getProfile();
  // Remove existing same item if exists
  profile.watchHistory = profile.watchHistory.filter(h => !(h.malId === item.malId && h.episode === item.episode));
  
  // also filter by same malId to update progress or clean up old history entries for same episode
  // But let's keep all episodes, just remove the exact episode duplicate to move it to the front
  profile.watchHistory.unshift({
    ...item,
    timestamp: Date.now()
  });
  
  // Limit history to 50 items
  if (profile.watchHistory.length > 50) {
    profile.watchHistory.pop();
  }
  
  saveProfile(profile);
}

function removeFromHistory(malId, episode) {
  const profile = getProfile();
  profile.watchHistory = profile.watchHistory.filter(h => !(h.malId === malId && h.episode === episode));
  saveProfile(profile);
}

function clearHistory() {
  const profile = getProfile();
  profile.watchHistory = [];
  saveProfile(profile);
}

// Watchlist management
function toggleWatchlist(item) {
  // item: { malId, title, posterUrl, score }
  const profile = getProfile();
  const index = profile.watchlist.findIndex(w => w.malId === item.malId);
  let status = false; // true if added, false if removed
  
  if (index > -1) {
    profile.watchlist.splice(index, 1);
  } else {
    profile.watchlist.push({
      malId: item.malId,
      title: item.title,
      posterUrl: item.posterUrl,
      score: item.score || 0,
      status: "plan", // default
      addedAt: Date.now()
    });
    status = true;
  }
  saveProfile(profile);
  return status;
}

function updateWatchlistStatus(malId, status) {
  const profile = getProfile();
  const index = profile.watchlist.findIndex(w => w.malId === malId);
  if (index > -1) {
    profile.watchlist[index].status = status;
    saveProfile(profile);
  }
}

function isInWatchlist(malId) {
  const profile = getProfile();
  return profile.watchlist.some(w => w.malId === malId);
}

// Favorites management
function toggleFavorite(item) {
  // item: { malId, title, posterUrl, score }
  const profile = getProfile();
  const index = profile.favorites.findIndex(f => f.malId === item.malId);
  let status = false;
  
  if (index > -1) {
    profile.favorites.splice(index, 1);
  } else {
    profile.favorites.push({
      malId: item.malId,
      title: item.title,
      posterUrl: item.posterUrl,
      score: item.score || 0
    });
    status = true;
  }
  saveProfile(profile);
  return status;
}

function isFavorite(malId) {
  const profile = getProfile();
  return profile.favorites.some(f => f.malId === malId);
}

// User Rating management
function saveUserRating(malId, rating) {
  const profile = getProfile();
  profile.userRatings[malId] = rating;
  saveProfile(profile);
}

function getUserRating(malId) {
  const profile = getProfile();
  return profile.userRatings[malId] || 0;
}

// Reminders management
function toggleReminder(item) {
  // item: { malId, title, dayOfWeek, broadcastTime }
  const profile = getProfile();
  const index = profile.reminders.findIndex(r => r.malId === item.malId);
  let status = false;
  
  if (index > -1) {
    profile.reminders.splice(index, 1);
  } else {
    profile.reminders.push(item);
    status = true;
  }
  saveProfile(profile);
  return status;
}

function hasReminder(malId) {
  const profile = getProfile();
  return profile.reminders.some(r => r.malId === malId);
}

// Utility for color brightness adjusting (hex to accent-light)
function adjustColorBrightness(hex, percent) {
  let R = parseInt(hex.substring(1, 3), 16);
  let G = parseInt(hex.substring(3, 5), 16);
  let B = parseInt(hex.substring(5, 7), 16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  const rHex = R.toString(16).padStart(2, '0');
  const gHex = G.toString(16).padStart(2, '0');
  const bHex = B.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

// Utility to convert hex to rgba
function hexToRgba(hex, alpha) {
  const R = parseInt(hex.substring(1, 3), 16);
  const G = parseInt(hex.substring(3, 5), 16);
  const B = parseInt(hex.substring(5, 7), 16);
  return `rgba(${R}, ${G}, ${B}, ${alpha})`;
}

// Initialize styles on script execution (runs on every page import)
(function initAccentTheme() {
  const profile = getProfile();
  if (profile.preferences && profile.preferences.accentColor) {
    const hex = profile.preferences.accentColor;
    document.documentElement.style.setProperty('--color-accent', hex);
    document.documentElement.style.setProperty('--color-accent-light', adjustColorBrightness(hex, 15));
    document.documentElement.style.setProperty('--color-accent-glow', hexToRgba(hex, 0.25));
  }
})();
