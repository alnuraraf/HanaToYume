/* ============================================
   NamiTube — Library page logic
   Watchlist, Favourites, History tabs
   ============================================ */

window.NamiTube = window.NamiTube || {};
const NT = window.NamiTube;
const { $, h, AnimeCard, Formatters, Toast, Modal, Icons, debounce, downloadJSON } = { ...NT.utils, ...NT.components };

const LibraryPage = {
  currentTab: 'watchlist',
  sort: 'date',

  async init() {
    this.bindTabs();
    this.bindToolbar();
    this.render();
  },

  bindTabs() {
    $$('.lib-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.currentTab = tab.dataset.tab;
        $$('.lib-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.render();
      });
    });
  },

  bindToolbar() {
    const select = $('#sortSelect');
    if (select) {
      select.addEventListener('change', () => {
        this.sort = select.value;
        this.render();
      });
    }
    const exportBtn = $('#exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportCurrent());
    }
    const clearBtn = $('#clearBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearCurrent());
    }
  },

  render() {
    const main = $('#libContent');
    if (!main) return;
    main.innerHTML = '';
    this.updateCounts();

    if (this.currentTab === 'watchlist') this.renderWatchlist(main);
    else if (this.currentTab === 'favorites') this.renderFavorites(main);
    else if (this.currentTab === 'history') this.renderHistory(main);
  },

  updateCounts() {
    const profile = NT.storage.getProfile();
    const tabs = $$('.lib-tab');
    tabs.forEach(t => {
      const span = t.querySelector('.count');
      if (!span) return;
      if (t.dataset.tab === 'watchlist') span.textContent = (profile.watchlist || []).length;
      if (t.dataset.tab === 'favorites') span.textContent = (profile.favorites || []).length;
      if (t.dataset.tab === 'history') span.textContent = (profile.watchHistory || []).length;
    });
  },

  renderWatchlist(container) {
    let items = NT.storage.getWatchlist().slice();
    if (this.sort === 'title') items.sort((a, b) => a.title.localeCompare(b.title));
    else if (this.sort === 'score') items.sort((a, b) => (b.score || 0) - (a.score || 0));
    else items.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));

    if (items.length === 0) {
      container.appendChild(this.emptyState('Your watchlist is empty', 'Save anime to watch later and they\'ll show up here.', 'Browse Anime', 'home.html'));
      return;
    }
    const grid = h('div', { class: 'anime-grid' });
    items.forEach((item, i) => {
      const card = this.makeWatchlistCard(item);
      card.style.animation = `fadeUp 500ms ${i * 30}ms ease both`;
      grid.appendChild(card);
    });
    container.appendChild(grid);
  },

  makeWatchlistCard(item) {
    const card = h('div', { class: 'anime-card watchlist-card' });
    const link = h('a', { href: `anime.html?id=${item.malId}` });
    const wrap = h('div', { class: 'poster-wrap' });
    wrap.appendChild(NT.utils.lazyImage(item.posterUrl, item.title));

    // Status select
    const sel = h('select', {
      class: 'status-select',
      'aria-label': 'Status',
      onclick: (e) => e.stopPropagation(),
      onchange: (e) => {
        NT.storage.setWatchlistStatus(item.malId, e.target.value);
        Toast(`Status updated to ${e.target.value}`, 'success', 1500);
      }
    });
    ['plan', 'watching', 'completed', 'dropped'].forEach(s => {
      const opt = h('option', { value: s, selected: item.status === s }, s.charAt(0).toUpperCase() + s.slice(1));
      sel.appendChild(opt);
    });
    wrap.appendChild(sel);

    // Remove
    const rm = h('button', {
      class: 'remove',
      'aria-label': 'Remove from watchlist',
      type: 'button',
      onclick: (e) => {
        e.stopPropagation();
        NT.storage.removeFromWatchlist(item.malId);
        Toast('Removed from watchlist', 'info');
        this.render();
      }
    });
    rm.innerHTML = Icons.trash;
    wrap.appendChild(rm);

    link.appendChild(wrap);
    card.appendChild(link);

    const body = h('div', { class: 'card-body' });
    body.appendChild(h('div', { class: 'card-title' }, item.title));
    body.appendChild(h('div', { class: 'card-meta' }, [
      h('span', {}, item.score ? `★ ${Formatters.score(item.score)}` : '—')
    ]));
    card.appendChild(body);
    return card;
  },

  renderFavorites(container) {
    let items = NT.storage.getFavorites().slice();
    if (this.sort === 'title') items.sort((a, b) => a.title.localeCompare(b.title));
    else if (this.sort === 'score') items.sort((a, b) => (b.score || 0) - (a.score || 0));

    if (items.length === 0) {
      container.appendChild(this.emptyState('No favourites yet', 'Tap the heart icon on any anime to add it to your favourites.', 'Browse Anime', 'home.html'));
      return;
    }
    const grid = h('div', { class: 'anime-grid' });
    items.forEach((item, i) => {
      const card = h('div', { class: 'anime-card' });
      const link = h('a', { href: `anime.html?id=${item.malId}` });
      const wrap = h('div', { class: 'poster-wrap' });
      wrap.appendChild(NT.utils.lazyImage(item.posterUrl, item.title));
      const rm = h('button', {
        class: 'remove',
        'aria-label': 'Remove from favorites',
        type: 'button',
        onclick: (e) => {
          e.stopPropagation();
          NT.storage.removeFromFavorites(item.malId);
          Toast('Removed from favorites', 'info');
          this.render();
        }
      });
      rm.innerHTML = Icons.heartFill;
      wrap.appendChild(rm);
      link.appendChild(wrap);
      card.appendChild(link);
      const body = h('div', { class: 'card-body' });
      body.appendChild(h('div', { class: 'card-title' }, item.title));
      body.appendChild(h('div', { class: 'card-meta' }, [h('span', {}, item.score ? `★ ${Formatters.score(item.score)}` : '—')]));
      card.appendChild(body);
      card.style.animation = `fadeUp 500ms ${i * 30}ms ease both`;
      grid.appendChild(card);
    });
    container.appendChild(grid);
  },

  renderHistory(container) {
    const items = NT.storage.getHistory();
    if (items.length === 0) {
      container.appendChild(this.emptyState('No watch history', 'Episodes you watch will appear here for easy continuation.', 'Start Watching', 'home.html'));
      return;
    }
    const list = h('div', { class: 'history-list' });
    items.forEach((item, i) => {
      const pct = item.totalEpisodes > 0 ? Math.min(100, (item.episode / item.totalEpisodes) * 100) : 0;
      const row = h('div', { class: 'history-row', style: { animationDelay: (i * 30) + 'ms' } }, [
        NT.utils.lazyImage(item.posterUrl, item.title, 'thumb'),
        h('div', { class: 'info' }, [
          h('h3', {}, [h('a', { href: `anime.html?id=${item.malId}` }, item.title)]),
          h('div', { class: 'meta' }, `Last watched ${Formatters.relative(item.timestamp)}`)
        ]),
        h('div', { class: 'progress' }, [
          h('div', { class: 'label' }, [
            h('span', {}, 'Progress'),
            h('span', { class: 'count' }, `EP ${item.episode}${item.totalEpisodes ? ' / ' + item.totalEpisodes : ''}`)
          ]),
          h('div', { class: 'bar' }, [h('div', { class: 'fill', style: { width: pct + '%' } })])
        ]),
        h('div', { class: 'actions' }, [
          h('a', {
            class: 'btn btn-primary btn-sm',
            href: `watch.html?id=${item.malId}&ep=${item.episode}&lang=sub`
          }, [Icons.play, ' Continue'])
        ])
      ]);
      list.appendChild(row);
    });
    container.appendChild(list);
  },

  emptyState(title, message, btnLabel, btnHref) {
    return h('div', { class: 'empty-state' }, [
      h('div', { class: 'icon', html: Icons.library }),
      h('h3', {}, title),
      h('p', {}, message),
      h('a', { class: 'btn btn-primary', href: btnHref }, btnLabel)
    ]);
  },

  exportCurrent() {
    let data = [];
    let filename = 'export.json';
    if (this.currentTab === 'watchlist') { data = NT.storage.getWatchlist(); filename = 'namitube-watchlist.json'; }
    else if (this.currentTab === 'favorites') { data = NT.storage.getFavorites(); filename = 'namitube-favorites.json'; }
    else if (this.currentTab === 'history') { data = NT.storage.getHistory(); filename = 'namitube-history.json'; }
    if (data.length === 0) { Toast('Nothing to export', 'info'); return; }
    downloadJSON(data, filename);
    Toast(`Exported ${data.length} items`, 'success');
  },

  clearCurrent() {
    if (this.currentTab === 'history') {
      Modal('Clear Watch History', 'Are you sure you want to clear your entire watch history? This cannot be undone.', [
        { label: 'Cancel', variant: 'secondary' },
        { label: 'Clear All', variant: 'danger', onClick: () => {
          NT.storage.clearHistory();
          Toast('Watch history cleared', 'success');
          this.render();
        } }
      ]);
    } else {
      Toast('Use the trash icon to remove individual items', 'info');
    }
  }
};

NT.libraryPage = LibraryPage;
