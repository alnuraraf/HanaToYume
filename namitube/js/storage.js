const Storage = {
  prefix: 'nt_',

  get(key) {
    try {
      const data = localStorage.getItem(this.prefix + key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
  },

  getProfile() {
    return this.get('profile') || {
      displayName: 'User',
      avatar: null,
      theme: 'dark',
      language: 'en',
      defaultQuality: 'auto',
      autoPlay: true,
      memberSince: new Date().toISOString()
    };
  },

  saveProfile(profile) {
    this.set('profile', { ...this.getProfile(), ...profile });
  },

  getWatchlist() {
    return this.get('watchlist') || [];
  },

  addToWatchlist(anime, status = 'plan_to_watch') {
    const list = this.getWatchlist();
    const existing = list.find(a => a.malId === anime.mal_id);
    if (existing) {
      existing.status = status;
      existing.updatedAt = new Date().toISOString();
    } else {
      list.push({
        malId: anime.mal_id,
        anilistId: anime.anilist_id,
        title: anime.title_english || anime.title,
        image: anime.images?.jpg?.image_url || '',
        status,
        episodesWatched: 0,
        totalEpisodes: anime.episodes || 0,
        score: 0,
        addedAt: new Date().toISOString()
      });
    }
    this.set('watchlist', list);
    App.showToast('Added to watchlist', 'success');
  },

  removeFromWatchlist(malId) {
    const list = this.getWatchlist().filter(a => a.malId !== malId);
    this.set('watchlist', list);
  },

  getFavorites() {
    return this.get('favorites') || [];
  },

  toggleFavorite(anime) {
    const favs = this.getFavorites();
    const idx = favs.findIndex(f => f.malId === anime.mal_id);
    if (idx >= 0) {
      favs.splice(idx, 1);
      this.set('favorites', favs);
      App.showToast('Removed from favorites', 'success');
      return false;
    } else {
      favs.push({
        malId: anime.mal_id,
        title: anime.title_english || anime.title,
        image: anime.images?.jpg?.image_url || '',
        addedAt: new Date().toISOString()
      });
      this.set('favorites', favs);
      App.showToast('Added to favorites', 'success');
      return true;
    }
  },

  isFavorite(malId) {
    return this.getFavorites().some(f => f.malId === malId);
  },

  getHistory() {
    return this.get('history') || [];
  },

  addToHistory(anime, episode, language = 'sub', progress = 0) {
    const history = this.getHistory().filter(h => !(h.malId === anime.mal_id && h.episode === episode));
    history.unshift({
      malId: anime.mal_id,
      anilistId: anime.anilist_id,
      title: anime.title_english || anime.title,
      episode,
      language,
      progress,
      image: anime.images?.jpg?.image_url || '',
      timestamp: new Date().toISOString()
    });
    this.set('history', history.slice(0, 500));
  },

  getContinueWatching() {
    const history = this.getHistory();
    const grouped = {};
    history.forEach(h => {
      if (!grouped[h.malId] || new Date(h.timestamp) > new Date(grouped[h.malId].timestamp)) {
        grouped[h.malId] = h;
      }
    });
    return Object.values(grouped).filter(h => h.progress < 95).slice(0, 20);
  },

  getSettings() {
    return this.get('settings') || {
      defaultServer: 'megaplay',
      skipIntro: false,
      compactView: false
    };
  },

  saveSettings(settings) {
    this.set('settings', { ...this.getSettings(), ...settings });
  },

  exportData() {
    const data = {
      profile: this.getProfile(),
      watchlist: this.getWatchlist(),
      favorites: this.getFavorites(),
      history: this.getHistory(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `namitube-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    App.showToast('Data exported successfully', 'success');
  },

  async importData(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.profile) this.set('profile', data.profile);
      if (data.watchlist) this.set('watchlist', data.watchlist);
      if (data.favorites) this.set('favorites', data.favorites);
      if (data.history) this.set('history', data.history);
      if (data.settings) this.set('settings', data.settings);
      App.showToast('Data imported successfully', 'success');
      return true;
    } catch (e) {
      App.showToast('Invalid backup file', 'error');
      return false;
    }
  },

  resetAll() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) localStorage.removeItem(key);
    });
    App.showToast('All data has been reset', 'success');
  }
};
