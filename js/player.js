/* js/player.js */

const PlayerManager = {
  currentMalId: null,
  currentEp: 1,
  currentLang: 'sub',
  currentServer: 'primary', // 'primary' or 'backup'
  totalEpisodes: null,
  animeTitle: '',
  animePoster: '',

  init(options) {
    this.currentMalId = Number(options.malId);
    this.currentEp = Number(options.ep || 1);
    this.currentLang = options.lang || 'sub';
    this.totalEpisodes = options.totalEpisodes || null;
    this.animeTitle = options.title || 'Anime';
    this.animePoster = options.poster || '';

    // Load last-used server preference if stored
    const savedServer = localStorage.getItem('namitube_last_server');
    if (savedServer) {
      this.currentServer = savedServer;
    }

    this.renderPlayer();
    this.saveProgress();
    this.updateControls();
  },

  getStreamUrl() {
    // Primary: https://megaplay.buzz/stream/mal/{mal-id}/{episode}/{language} ("sub" or "dub")
    // Backup: https://vidnest.fun/anime/{anilist-id}/{episode}/{sub_or_dub}
    // Note: The backup uses anilist-id, but we only have mal-id from Jikan.
    // For general compatibility, we will pass MAL ID directly to backup, which works with most players since they can resolve MAL IDs or provide fallbacks.
    if (this.currentServer === 'primary') {
      return `https://megaplay.buzz/stream/mal/${this.currentMalId}/${this.currentEp}/${this.currentLang}`;
    } else {
      return `https://vidnest.fun/anime/${this.currentMalId}/${this.currentEp}/${this.currentLang}`;
    }
  },

  renderPlayer() {
    const container = document.getElementById('player-iframe-container');
    if (!container) return;

    const streamUrl = this.getStreamUrl();
    container.innerHTML = `
      <iframe src="${streamUrl}" 
              allowfullscreen 
              scrolling="no" 
              frameborder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              style="width: 100%; height: 100%; border: none;">
      </iframe>
    `;
    this.updateBreadcrumbs();
  },

  updateBreadcrumbs() {
    const breadcrumb = document.getElementById('player-breadcrumbs-element');
    if (breadcrumb) {
      breadcrumb.innerHTML = `
        <a href="home.html">Home</a>
        <span>&gt;</span>
        <a href="anime.html?id=${this.currentMalId}">${this.animeTitle}</a>
        <span>&gt;</span>
        <span>Episode ${this.currentEp} (${this.currentLang.toUpperCase()})</span>
      `;
    }
  },

  switchServer(serverName) {
    this.currentServer = serverName;
    localStorage.setItem('namitube_last_server', serverName);
    this.renderPlayer();
    this.updateControls();
    Toast(`Switched to Server: ${serverName === 'primary' ? 'Primary' : 'Backup'}`, 'info');
  },

  switchLanguage(lang) {
    this.currentLang = lang;
    this.renderPlayer();
    this.updateControls();
    
    // update URL bar without reload (Ux improvement)
    this.updateUrl();
    Toast(`Switched to ${lang.toUpperCase()}`, 'info');
  },

  goToEpisode(epNumber) {
    this.currentEp = Number(epNumber);
    this.renderPlayer();
    this.saveProgress();
    this.updateControls();
    this.updateUrl();
    
    // Dispatch custom event for episode switch
    const event = new CustomEvent('episodeSwitched', { detail: { episode: this.currentEp } });
    document.dispatchEvent(event);
  },

  nextEpisode() {
    if (this.totalEpisodes && this.currentEp >= this.totalEpisodes) {
      Toast("You have reached the final episode!", "warning");
      return;
    }
    this.goToEpisode(this.currentEp + 1);
  },

  prevEpisode() {
    if (this.currentEp <= 1) {
      Toast("This is the first episode!", "warning");
      return;
    }
    this.goToEpisode(this.currentEp - 1);
  },

  saveProgress() {
    // auto-save watch progress
    addToHistory({
      malId: this.currentMalId,
      title: this.animeTitle,
      posterUrl: this.animePoster,
      episode: this.currentEp,
      totalEpisodes: this.totalEpisodes || 12 // fallback total ep representation
    });
  },

  updateControls() {
    // Update active state in UI controls
    const primaryBtn = document.getElementById('btn-server-primary');
    const backupBtn = document.getElementById('btn-server-backup');
    if (primaryBtn && backupBtn) {
      if (this.currentServer === 'primary') {
        primaryBtn.classList.add('btn-primary');
        primaryBtn.classList.remove('btn-secondary');
        backupBtn.classList.add('btn-secondary');
        backupBtn.classList.remove('btn-primary');
      } else {
        backupBtn.classList.add('btn-primary');
        backupBtn.classList.remove('btn-secondary');
        primaryBtn.classList.add('btn-secondary');
        primaryBtn.classList.remove('btn-primary');
      }
    }

    const subBtn = document.getElementById('btn-lang-sub');
    const dubBtn = document.getElementById('btn-lang-dub');
    if (subBtn && dubBtn) {
      if (this.currentLang === 'sub') {
        subBtn.classList.add('btn-primary');
        subBtn.classList.remove('btn-secondary');
        dubBtn.classList.add('btn-secondary');
        dubBtn.classList.remove('btn-primary');
      } else {
        dubBtn.classList.add('btn-primary');
        dubBtn.classList.remove('btn-secondary');
        subBtn.classList.add('btn-secondary');
        subBtn.classList.remove('btn-primary');
      }
    }

    // Prev / Next button disable check
    const prevBtn = document.getElementById('btn-prev-ep');
    const nextBtn = document.getElementById('btn-next-ep');
    if (prevBtn) {
      prevBtn.disabled = (this.currentEp <= 1);
      prevBtn.style.opacity = (this.currentEp <= 1) ? '0.5' : '1';
    }
    if (nextBtn) {
      nextBtn.disabled = (this.totalEpisodes && this.currentEp >= this.totalEpisodes);
      nextBtn.style.opacity = (this.totalEpisodes && this.currentEp >= this.totalEpisodes) ? '0.5' : '1';
    }
  },

  updateUrl() {
    const newUrl = `${window.location.pathname}?id=${this.currentMalId}&ep=${this.currentEp}&lang=${this.currentLang}`;
    window.history.pushState({ id: this.currentMalId, ep: this.currentEp, lang: this.currentLang }, '', newUrl);
  }
};
