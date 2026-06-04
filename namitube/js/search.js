/* ============================================
   NamiTube — Search page logic
   Debounced query, filters, infinite scroll
   ============================================ */

window.NamiTube = window.NamiTube || {};
const NT = window.NamiTube;
const { $, $$, h, debounce, AnimeCard, SkeletonCard, Toast, Formatters, Icons, Modal } = { ...NT.utils, ...NT.components };

const GENRE_LIST = [
  { id: 1,   name: 'Action' },
  { id: 2,   name: 'Adventure' },
  { id: 4,   name: 'Comedy' },
  { id: 8,   name: 'Drama' },
  { id: 10,  name: 'Fantasy' },
  { id: 14,  name: 'Horror' },
  { id: 7,   name: 'Mystery' },
  { id: 22,  name: 'Romance' },
  { id: 24,  name: 'Sci-Fi' },
  { id: 36,  name: 'Slice of Life' },
  { id: 30,  name: 'Sports' },
  { id: 37,  name: 'Supernatural' },
  { id: 41,  name: 'Suspense' },
  { id: 9,   name: 'Ecchi' },
  { id: 49,  name: 'Isekai' },
  { id: 25,  name: 'Shoujo' },
  { id: 27,  name: 'Shounen' },
  { id: 42,  name: 'Seinen' },
  { id: 43,  name: 'Josei' },
  { id: 50,  name: 'Adult Cast' }
];

const SearchPage = {
  page: 1,
  loading: false,
  done: false,
  query: '',
  filters: { type: '', status: '', genres: [], minScore: '', orderBy: 'score', sort: 'desc' },
  results: [],

  async init() {
    const params = new URLSearchParams(location.search);
    this.query = params.get('q') || '';
    const initGenre = params.get('genre');

    if (initGenre) {
      this.filters.genres = [parseInt(initGenre, 10)];
    }

    const input = $('#searchInput');
    const clear = $('#searchClear');
    if (input) {
      input.value = this.query;
      input.focus();
      input.addEventListener('input', debounce(() => {
        this.query = input.value.trim();
        if (clear) clear.classList.toggle('visible', this.query.length > 0);
        const url = new URL(location.href);
        if (this.query) url.searchParams.set('q', this.query);
        else url.searchParams.delete('q');
        history.replaceState(null, '', url.toString());
        this.reset();
      }, 300));

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); this.reset(); }
      });
    }
    if (clear) {
      clear.addEventListener('click', () => {
        input.value = '';
        this.query = '';
        clear.classList.remove('visible');
        this.reset();
        input.focus();
      });
    }

    this.renderFilters();
    this.renderRecent();
    this.reset();

    // Infinite scroll
    window.addEventListener('scroll', debounce(() => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 600) {
        this.loadMore();
      }
    }, 100));
  },

  renderFilters() {
    const container = $('#filterList');
    if (!container) return;
    container.innerHTML = '';

    // Type
    container.appendChild(this._group('Type', [
      { v: '', l: 'Any' },
      { v: 'tv', l: 'TV' },
      { v: 'movie', l: 'Movie' },
      { v: 'ova', l: 'OVA' },
      { v: 'ona', l: 'ONA' },
      { v: 'special', l: 'Special' }
    ], 'type', this.filters.type));

    // Status
    container.appendChild(this._group('Status', [
      { v: '', l: 'Any' },
      { v: 'airing', l: 'Airing' },
      { v: 'complete', l: 'Completed' },
      { v: 'upcoming', l: 'Upcoming' }
    ], 'status', this.filters.status));

    // Genres checkboxes
    const gGroup = h('div', { class: 'filter-group' });
    gGroup.appendChild(h('div', { class: 'label' }, ['Genre', h('span', { class: 'chev', html: Icons.chevDown })]));
    gGroup.firstChild.firstChild.addEventListener?.bind(gGroup.firstChild);
    const gOpts = h('div', { class: 'opts filter-options' });
    GENRE_LIST.forEach(g => {
      const label = h('label', { class: 'filter-check' }, [
        h('input', {
          type: 'checkbox',
          value: g.id,
          checked: this.filters.genres.includes(g.id),
          onchange: (e) => {
            if (e.target.checked) this.filters.genres.push(g.id);
            else this.filters.genres = this.filters.genres.filter(x => x !== g.id);
            this.reset();
          }
        }),
        h('span', {}, g.name)
      ]);
      gOpts.appendChild(label);
    });
    gGroup.appendChild(gOpts);
    gGroup.firstChild.addEventListener('click', () => gGroup.classList.toggle('collapsed'));
    container.appendChild(gGroup);

    // Min score slider
    const sGroup = h('div', { class: 'filter-group' });
    sGroup.appendChild(h('div', { class: 'label' }, ['Min Score', h('span', { class: 'chev', html: Icons.chevDown })]));
    const sOpts = h('div', { class: 'opts' });
    sOpts.appendChild(h('input', {
      type: 'range', min: '1', max: '10', step: '0.5', value: this.filters.minScore || '1',
      oninput: (e) => {
        $('#scoreVal').textContent = e.target.value + '+';
        this.filters.minScore = e.target.value === '1' ? '' : e.target.value;
        debouncedReset();
      }
    }));
    sOpts.appendChild(h('div', { class: 'filter-actions' }, [
      h('div', { id: 'scoreVal', class: 'text-soft', style: { fontSize: 'var(--fs-sm)' } },
        (this.filters.minScore || '1') + '+')
    ]));
    sGroup.appendChild(sOpts);
    sGroup.firstChild.addEventListener('click', () => sGroup.classList.toggle('collapsed'));
    container.appendChild(sGroup);

    // Order
    container.appendChild(this._group('Order By', [
      { v: 'score',     l: 'Score' },
      { v: 'popularity',l: 'Popularity' },
      { v: 'title',     l: 'Title' },
      { v: 'episodes',  l: 'Episodes' }
    ], 'orderBy', this.filters.orderBy));

    // Reset
    const actions = h('div', { class: 'filter-actions' }, [
      h('button', {
        class: 'btn btn-secondary btn-block',
        type: 'button',
        onclick: () => {
          this.filters = { type: '', status: '', genres: [], minScore: '', orderBy: 'score', sort: 'desc' };
          this.renderFilters();
          this.reset();
        }
      }, 'Reset Filters')
    ]);
    container.appendChild(actions);

    const debouncedReset = debounce(() => this.reset(), 400);
  },

  _group(labelText, options, filterKey, currentValue) {
    const group = h('div', { class: 'filter-group' });
    group.appendChild(h('div', { class: 'label' }, [labelText, h('span', { class: 'chev', html: Icons.chevDown })]));
    const opts = h('div', { class: 'opts' });
    const row = h('div', { class: 'filter-radio-row' });
    options.forEach(o => {
      const label = h('label', { class: o.v === currentValue ? 'checked' : '' }, [
        h('input', {
          type: 'radio', name: filterKey, value: o.v,
          checked: o.v === currentValue,
          onchange: () => {
            this.filters[filterKey] = o.v;
            row.querySelectorAll('label').forEach(l => l.classList.remove('checked'));
            label.classList.add('checked');
            this.reset();
          }
        }),
        h('span', {}, o.l)
      ]);
      row.appendChild(label);
    });
    opts.appendChild(row);
    group.appendChild(opts);
    group.firstChild.addEventListener('click', () => group.classList.toggle('collapsed'));
    return group;
  },

  renderRecent() {
    const recents = NT.storage.getRecentSearches();
    const wrap = $('#recentSearches');
    if (!wrap) return;
    if (recents.length === 0) { wrap.innerHTML = ''; return; }
    wrap.innerHTML = '';
    wrap.appendChild(h('span', { class: 'label' }, 'Recent:'));
    recents.forEach(q => {
      const pill = h('button', { class: 'recent-pill', type: 'button' }, q);
      pill.addEventListener('click', () => {
        $('#searchInput').value = q;
        this.query = q;
        this.reset();
      });
      wrap.appendChild(pill);
    });
    const clearBtn = h('button', { class: 'recent-pill', type: 'button', style: { color: 'var(--color-red)' } }, '× Clear');
    clearBtn.addEventListener('click', () => {
      NT.storage.clearRecentSearches();
      this.renderRecent();
    });
    wrap.appendChild(clearBtn);
  },

  async reset() {
    this.page = 1;
    this.done = false;
    this.results = [];
    const grid = $('#searchResults');
    if (grid) {
      grid.innerHTML = '';
      // Show skeletons
      for (let i = 0; i < 12; i++) grid.appendChild(SkeletonCard('md'));
    }
    if (this.query) {
      NT.storage.addRecentSearch(this.query);
      this.renderRecent();
    }
    await this.loadMore();
  },

  async loadMore() {
    if (this.loading || this.done) return;
    this.loading = true;
    const grid = $('#searchResults');
    const status = $('#searchStatus');
    const loadMore = $('#loadMore');
    if (loadMore) loadMore.style.display = 'none';

    try {
      const params = {
        q: this.query,
        page: this.page,
        limit: 12,
        type: this.filters.type,
        status: this.filters.status,
        genres: this.filters.genres.join(','),
        orderBy: this.filters.orderBy,
        sort: this.filters.sort,
        minScore: this.filters.minScore
      };
      const res = await NT.api.search(params);
      const list = res.data || [];

      // Clear skeletons on first page
      if (this.page === 1 && grid) {
        grid.innerHTML = '';
      }

      if (this.page === 1 && list.length === 0) {
        if (grid) grid.innerHTML = '';
        this.renderEmpty();
        this.done = true;
        if (status) status.textContent = `No results for "${this.query}"`;
        return;
      }

      list.forEach((a, i) => {
        const card = AnimeCard(a, { size: 'md' });
        card.style.animation = `fadeUp 500ms ${i * 30}ms ease both`;
        grid?.appendChild(card);
      });

      this.results.push(...list);
      this.page = res.pagination?.current_page || this.page;
      const hasNext = res.pagination?.has_next_page;
      this.done = !hasNext;
      if (status) {
        const total = res.pagination?.items?.total || this.results.length;
        status.innerHTML = `Showing <strong>${this.results.length}</strong>${total > this.results.length ? ` of ${Formatters.compact(total)}` : ''} results for <strong>"${this.query || 'all anime'}"</strong>`;
      }
      if (loadMore) loadMore.style.display = hasNext ? 'block' : 'none';
    } catch (e) {
      console.error('Search error', e);
      Toast('Search failed. Please try again.', 'error');
      if (status) status.textContent = 'Search failed';
    } finally {
      this.loading = false;
    }
  },

  renderEmpty() {
    const grid = $('#searchResults');
    if (!grid) return;
    grid.innerHTML = '';
    const empty = h('div', { class: 'no-results' }, [
      h('div', { class: 'empty-state-icon', html: Icons.search, style: { width: '64px', height: '64px', margin: '0 auto var(--space-3)', color: 'var(--color-text-muted)' } }),
      h('h3', {}, 'No results found'),
      h('p', { class: 'text-soft' }, `Try a different search term or adjust your filters.`)
    ]);
    grid.appendChild(empty);

    // Suggestion grid
    NT.api.topAnime({ filter: 'airing', limit: 6 }).then(res => {
      const sug = h('div', { style: { marginTop: 'var(--space-8)' } });
      sug.appendChild(h('h3', { style: { textAlign: 'center', marginBottom: 'var(--space-4)' } }, 'Popular this season'));
      const grid2 = h('div', { class: 'suggestions-grid' });
      (res.data || []).forEach(a => grid2.appendChild(AnimeCard(a, { size: 'md' })));
      sug.appendChild(grid2);
      grid.appendChild(sug);
    }).catch(() => {});
  }
};

NT.searchPage = SearchPage;
