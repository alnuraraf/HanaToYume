/* js/library.js */

const LibraryPage = {
  activeTab: 'watchlist', // 'watchlist' | 'favorites' | 'history'
  watchlistFilter: 'all',
  watchlistSort: 'added-desc',

  init() {
    if (!document.getElementById('library-page-identifier')) return;

    // Check if query parameter tab is passed
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['watchlist', 'favorites', 'history'].includes(tabParam)) {
      this.activeTab = tabParam;
    }

    // Highlight active tab
    const tabBtn = document.querySelector(`.library-tab-btn[data-tab="${this.activeTab}"]`);
    if (tabBtn) {
      this.highlightTab(tabBtn);
    }

    // Tab bindings
    document.querySelectorAll('.library-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.highlightTab(btn);
        this.activeTab = btn.getAttribute('data-tab');
        this.renderActiveTabContents();
      });
    });

    // Binding Watchlist controls
    const filterSelect = document.getElementById('watchlist-status-filter-select');
    const sortSelect = document.getElementById('watchlist-sort-select');

    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.watchlistFilter = e.target.value;
        this.renderActiveTabContents();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.watchlistSort = e.target.value;
        this.renderActiveTabContents();
      });
    }

    // Export button binding
    const exportBtn = document.getElementById('btn-export-library');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportLibraryAsJson();
      });
    }

    this.renderActiveTabContents();
  },

  highlightTab(btn) {
    document.querySelectorAll('.library-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  },

  renderActiveTabContents() {
    const profile = getProfile();
    const gridContainer = document.getElementById('library-contents-container');
    const filterRow = document.getElementById('library-filters-bar-element');
    
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    if (this.activeTab === 'watchlist') {
      if (filterRow) filterRow.style.display = 'flex';
      this.renderWatchlist(profile, gridContainer);
    } else if (this.activeTab === 'favorites') {
      if (filterRow) filterRow.style.display = 'none';
      this.renderFavorites(profile, gridContainer);
    } else {
      if (filterRow) filterRow.style.display = 'none';
      this.renderHistory(profile, gridContainer);
    }

    if (window.lucide) window.lucide.createIcons();
  },

  renderWatchlist(profile, container) {
    let list = [...profile.watchlist];

    // 1. Filter by Watch status
    if (this.watchlistFilter !== 'all') {
      list = list.filter(w => w.status === this.watchlistFilter);
    }

    // 2. Sort watchlist
    if (this.watchlistSort === 'added-desc') {
      list.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    } else if (this.watchlistSort === 'added-asc') {
      list.sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0));
    } else if (this.watchlistSort === 'title-asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.watchlistSort === 'score-desc') {
      list.sort((a, b) => (b.score || 0) - (a.score || 0));
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1;" class="library-empty-state">
          <i data-lucide="folder-open" class="empty-state-icon"></i>
          <h3>Watchlist is empty</h3>
          <p>No items found matching the selected status filter.</p>
          <a href="home.html" class="btn btn-primary">Browse Anime</a>
        </div>
      `;
      return;
    }

    // Apply grid class
    container.className = 'library-grid';

    list.forEach(item => {
      // Create anime card wrapper element so we can insert custom watchlist manager action controls
      const cardWrapper = document.createElement('div');
      cardWrapper.style.display = 'flex';
      cardWrapper.style.flexDirection = 'column';
      cardWrapper.style.gap = '10px';

      // We pass an anime-like format to the standard Card constructor
      const animeObj = {
        mal_id: item.malId,
        title: item.title,
        images: { jpg: { large_image_url: item.posterUrl } },
        score: item.score
      };

      const card = AnimeCard(animeObj, { size: 'md', showActions: false });
      cardWrapper.appendChild(card);

      // Status dropdown per card
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'library-card-actions';
      actionsDiv.innerHTML = `
        <select class="library-select watchlist-item-status-sel" data-id="${item.malId}">
          <option value="plan" ${item.status === 'plan' ? 'selected' : ''}>Plan to Watch</option>
          <option value="watching" ${item.status === 'watching' ? 'selected' : ''}>Watching</option>
          <option value="completed" ${item.status === 'completed' ? 'selected' : ''}>Completed</option>
          <option value="dropped" ${item.status === 'dropped' ? 'selected' : ''}>Dropped</option>
        </select>
        <button class="btn btn-secondary btn-icon watchlist-item-remove-btn" data-id="${item.malId}" title="Remove from watchlist">
          <i data-lucide="trash-2" style="width:14px; height:14px; color:var(--color-red);"></i>
        </button>
      `;

      // Event: status change
      const statusSel = actionsDiv.querySelector('.watchlist-item-status-sel');
      statusSel.addEventListener('change', (e) => {
        updateWatchlistStatus(item.malId, e.target.value);
        Toast(`Updated status of "${truncateText(item.title, 15)}"`, 'success');
      });

      // Event: remove item
      const removeBtn = actionsDiv.querySelector('.watchlist-item-remove-btn');
      removeBtn.addEventListener('click', () => {
        toggleWatchlist({ malId: item.malId });
        this.renderActiveTabContents();
        Toast(`Removed "${truncateText(item.title, 15)}" from Watchlist`, 'info');
      });

      cardWrapper.appendChild(actionsDiv);
      container.appendChild(cardWrapper);
    });
  },

  renderFavorites(profile, container) {
    const list = profile.favorites;

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1;" class="library-empty-state">
          <i data-lucide="heart" class="empty-state-icon" style="color:var(--color-red);"></i>
          <h3>No Favourites Added Yet</h3>
          <p>Add anime to your favorites list from their detailed review pages.</p>
          <a href="home.html" class="btn btn-primary">Browse Anime</a>
        </div>
      `;
      return;
    }

    container.className = 'library-grid';

    list.forEach(item => {
      const animeObj = {
        mal_id: item.malId,
        title: item.title,
        images: { jpg: { large_image_url: item.posterUrl } },
        score: item.score
      };
      const card = AnimeCard(animeObj, { size: 'md', showActions: true });
      container.appendChild(card);
    });
  },

  renderHistory(profile, container) {
    const list = profile.watchHistory;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="library-empty-state" style="width:100%;">
          <i data-lucide="history" class="empty-state-icon"></i>
          <h3>No Watch History</h3>
          <p>Your streaming records will appear here as soon as you watch episodes.</p>
          <a href="home.html" class="btn btn-primary">Start Streaming</a>
        </div>
      `;
      return;
    }

    // Render list wrapper + Clear all button
    container.className = 'history-list';

    // Header clear button
    const clearHeader = document.createElement('div');
    clearHeader.style.display = 'flex';
    clearHeader.style.justifyContent = 'flex-end';
    clearHeader.style.marginBottom = '8px';
    clearHeader.innerHTML = `
      <button class="btn btn-secondary btn-outline" id="btn-clear-history-confirm">
        <i data-lucide="trash"></i> Clear All History
      </button>
    `;
    container.appendChild(clearHeader);

    clearHeader.querySelector('#btn-clear-history-confirm').addEventListener('click', () => {
      Modal(
        "Clear Watch History?",
        "Are you sure you want to wipe out your entire viewing progress history? This action is irreversible.",
        [
          {
            label: "Yes, Clear History",
            primary: true,
            callback: (close) => {
              clearHistory();
              this.renderActiveTabContents();
              close();
              Toast("Watch history cleared", "info");
            }
          },
          {
            label: "Cancel",
            primary: false,
            callback: (close) => close()
          }
        ]
      );
    });

    list.forEach(item => {
      const histCard = document.createElement('div');
      histCard.className = 'history-item reveal active';

      const progressPercent = Math.min(100, Math.round((item.episode / (item.totalEpisodes || 12)) * 100));

      histCard.innerHTML = `
        <img src="${item.posterUrl}" alt="${item.title}" class="history-poster">
        <div class="history-info">
          <div class="history-title-row">
            <h3 class="history-item-title"><a href="anime.html?id=${item.malId}">${item.title}</a></h3>
            <span class="history-item-time">${formatRelativeTime(item.timestamp)}</span>
          </div>
          
          <div class="history-progress-container">
            <div class="history-progress-label">
              <span>Episode ${item.episode} seen</span>
              <span>${progressPercent}% Complete</span>
            </div>
            <div class="history-progress-bar-bg">
              <div class="history-progress-bar-fill" style="width: ${progressPercent}%;"></div>
            </div>
          </div>
        </div>
        
        <div class="history-actions">
          <a href="watch.html?id=${item.malId}&ep=${item.episode}" class="btn btn-primary" title="Continue Watching">
            <i data-lucide="play" style="width:14px; height:14px; fill:currentColor;"></i> Continue
          </a>
          <button class="btn btn-secondary btn-icon history-single-remove" data-id="${item.malId}" data-ep="${item.episode}" title="Remove entry">
            <i data-lucide="x" style="width:14px; height:14px;"></i>
          </button>
        </div>
      `;

      // Individual history item removal
      histCard.querySelector('.history-single-remove').addEventListener('click', () => {
        removeFromHistory(item.malId, item.episode);
        this.renderActiveTabContents();
        Toast(`Removed episode entry from history`, 'info');
      });

      container.appendChild(histCard);
    });
  },

  exportLibraryAsJson() {
    const profile = getProfile();
    const exportData = {
      displayName: profile.displayName,
      watchlist: profile.watchlist,
      favorites: profile.favorites,
      watchHistory: profile.watchHistory,
      userRatings: profile.userRatings,
      reminders: profile.reminders,
      exportedAt: new Date().toISOString()
    };

    const str = JSON.stringify(exportData, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `namitube_library_export_${profile.displayName}.json`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    Toast("Library data successfully exported as JSON!", "success");
  }
};

document.addEventListener('DOMContentLoaded', () => {
  LibraryPage.init();
});
