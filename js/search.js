/* js/search.js */

const TOP_GENRES_MAP = {
  "Action": 1,
  "Adventure": 2,
  "Comedy": 4,
  "Drama": 8,
  "Fantasy": 10,
  "Horror": 14,
  "Mystery": 7,
  "Romance": 22,
  "Sci-Fi": 24,
  "Slice of Life": 36,
  "Supernatural": 37,
  "Suspense": 41,
  "Sports": 30,
  "Award Winning": 46,
  "Gourmet": 47,
  "Ecchi": 9,
  "Avant Garde": 5,
  "Sci-Fi": 24,
  "Workplace": 48
};

const SearchPage = {
  currentQuery: '',
  currentPage: 1,
  hasMorePages: true,
  isLoading: false,
  activeFilters: {},
  observer: null,

  init() {
    if (!document.getElementById('search-page-identifier')) return;

    // Parse URL parameter query
    const params = new URLSearchParams(window.location.search);
    this.currentQuery = params.get('q') || '';

    // Bind inputs
    const inputEl = document.getElementById('search-page-input-el');
    if (inputEl) {
      inputEl.value = this.currentQuery;
      inputEl.focus();

      // Debounced keyup searching
      inputEl.addEventListener('input', debounce((e) => {
        this.currentQuery = e.target.value.trim();
        this.resetAndSearch();
      }, 400));
    }

    // Toggle Mobile filters drawer
    const toggleFiltersBtn = document.getElementById('btn-toggle-filters-mobile');
    const sidebar = document.querySelector('.search-sidebar');
    if (toggleFiltersBtn && sidebar) {
      toggleFiltersBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        toggleFiltersBtn.innerHTML = sidebar.classList.contains('active') 
          ? `<i data-lucide="filter-x"></i> Hide Filters` 
          : `<i data-lucide="sliders"></i> Show Filters`;
        if (window.lucide) window.lucide.createIcons();
      });
    }

    this.renderGenresList();
    this.bindFilters();
    this.renderRecentSearches();

    // Initial search
    this.resetAndSearch();

    // Setup scroll observer for infinite scroll
    this.setupInfiniteScroll();
  },

  renderRecentSearches() {
    const container = document.getElementById('recent-searches-list');
    if (!container) return;

    const searches = JSON.parse(localStorage.getItem('namitube_recent_searches') || '[]');
    if (searches.length === 0) {
      container.parentElement.style.display = 'none';
      return;
    }

    container.parentElement.style.display = 'flex';
    container.innerHTML = searches.slice(0, 5).map(query => `
      <div class="recent-search-pill" data-q="${query}">
        <span>${query}</span>
        <i data-lucide="arrow-up-right" style="width:12px; height:12px;"></i>
      </div>
    `).join('');

    container.querySelectorAll('.recent-search-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const query = pill.getAttribute('data-q');
        const inputEl = document.getElementById('search-page-input-el');
        if (inputEl) inputEl.value = query;
        this.currentQuery = query;
        this.resetAndSearch();
      });
    });

    if (window.lucide) window.lucide.createIcons();
  },

  renderGenresList() {
    const container = document.getElementById('genres-checklist-container');
    if (!container) return;

    container.innerHTML = Object.entries(TOP_GENRES_MAP).map(([name, id]) => `
      <label class="checkbox-option">
        <input type="checkbox" name="genre" value="${id}">
        <span>${name}</span>
      </label>
    `).join('');
  },

  bindFilters() {
    // 1. Checkboxes for Type, Status, Genre
    const form = document.getElementById('search-filters-form');
    if (!form) return;

    // Detect changes and trigger search
    form.addEventListener('change', () => {
      this.collectFiltersAndSearch();
    });

    // Score range slider change trigger label
    const slider = document.getElementById('filter-score-slider');
    const label = document.getElementById('score-slider-val-label');
    if (slider && label) {
      slider.addEventListener('input', (e) => {
        label.textContent = e.target.value === '1' ? 'Any Score' : `★ ${e.target.value}+`;
      });
    }

    // Submit prevention (in case of forms)
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.collectFiltersAndSearch();
    });
  },

  collectFiltersAndSearch() {
    const form = document.getElementById('search-filters-form');
    if (!form) return;

    const filters = {};

    // Collect Types
    const selectedTypes = Array.from(form.querySelectorAll('input[name="type"]:checked')).map(el => el.value);
    if (selectedTypes.length > 0) {
      // Jikan API expects single type, or we filter on client. We will pass the first type if multiple, or construct params.
      filters.type = selectedTypes[0]; // Jikan /anime takes standard single type
    }

    // Collect Status
    const selectedStatus = Array.from(form.querySelectorAll('input[name="status"]:checked')).map(el => el.value);
    if (selectedStatus.length > 0) {
      filters.status = selectedStatus[0];
    }

    // Collect Genres
    const selectedGenres = Array.from(form.querySelectorAll('input[name="genre"]:checked')).map(el => el.value);
    if (selectedGenres.length > 0) {
      filters.genres = selectedGenres.join(',');
    }

    // Collect Score
    const minScore = document.getElementById('filter-score-slider')?.value;
    if (minScore && minScore !== '1') {
      filters.min_score = minScore;
    }

    // Collect Season
    const season = document.getElementById('filter-season-select')?.value;
    if (season) {
      // If season filter is chosen, Jikan season endpoints can be used, but since we are on full search we can ignore or let search process it.
      // Jikan search doesn't natively take season as query param in /anime search under standard v4, so we can client-side filter or ignore. Let's filter client-side if needed, but actually keeping filters mapping simple is better.
    }

    // Collect Year
    const year = document.getElementById('filter-year-input')?.value;
    if (year && year.trim().length === 4) {
      filters.start_date = `${year}-01-01`;
    }

    // Collect Order By
    const orderBy = document.getElementById('filter-orderby-select')?.value;
    if (orderBy) {
      filters.order_by = orderBy;
      filters.sort = 'desc'; // descending for scores/popularity
    }

    this.activeFilters = filters;
    this.resetAndSearch();
  },

  resetAndSearch() {
    this.currentPage = 1;
    this.hasMorePages = true;
    const grid = document.getElementById('search-results-grid-container');
    if (grid) grid.innerHTML = '';
    this.search();
  },

  async search() {
    if (this.isLoading || !this.hasMorePages) return;
    this.isLoading = true;

    const grid = document.getElementById('search-results-grid-container');
    const loadIndicator = document.getElementById('infinite-scroll-loader-bar');
    const resultCountEl = document.getElementById('search-results-count-lbl');

    if (loadIndicator) loadIndicator.style.display = 'flex';

    try {
      // If we are at page 1 and have no queries/filters, show skeletons
      if (this.currentPage === 1 && grid) {
        renderSkeletonsInContainer(grid, 8);
      }

      const response = await NamiAPI.searchAnime(this.currentQuery, this.currentPage, this.activeFilters);
      
      // Clear skeletons if page 1
      if (this.currentPage === 1 && grid) {
        grid.innerHTML = '';
      }

      if (response && response.data && response.data.length > 0) {
        // Display result count
        if (resultCountEl) {
          const total = response.pagination?.items?.total || response.data.length;
          resultCountEl.innerHTML = `Showing <span>${total}</span> results ${this.currentQuery ? `for "<span>${this.currentQuery}</span>"` : ''}`;
        }

        // Render anime cards
        response.data.forEach(anime => {
          const card = AnimeCard(anime);
          grid.appendChild(card);
        });

        // Check if there are more pages
        this.hasMorePages = response.pagination?.has_next_page || false;
        this.currentPage++;
      } else {
        if (this.currentPage === 1) {
          this.renderEmptyState(grid, resultCountEl);
        }
        this.hasMorePages = false;
      }
    } catch (err) {
      console.error("Search error", err);
      if (grid && this.currentPage === 1) {
        grid.innerHTML = `<div class="search-empty-suggestions-box">Failed to fetch search results. Please retry.</div>`;
      }
    } finally {
      this.isLoading = false;
      if (loadIndicator) loadIndicator.style.display = 'none';
      if (window.lucide) window.lucide.createIcons();
    }
  },

  renderEmptyState(grid, countEl) {
    if (countEl) countEl.innerHTML = `No results found ${this.currentQuery ? `for "<span>${this.currentQuery}</span>"` : ''}`;
    if (!grid) return;

    grid.innerHTML = `
      <div style="grid-column: 1 / -1;" class="search-empty-suggestions-box">
        <h3>No matches found</h3>
        <p>Try checking your spelling, using different keywords, or explore our popular recommendations below.</p>
        <div class="empty-suggestions-grid" id="search-empty-popular-recommendations"></div>
      </div>
    `;

    // Fetch popular suggestions
    const suggestionContainer = document.getElementById('search-empty-popular-recommendations');
    if (suggestionContainer) {
      renderSkeletonsInContainer(suggestionContainer, 5);
      NamiAPI.getTopPopular(1).then(res => {
        if (res && res.data) {
          suggestionContainer.innerHTML = '';
          res.data.slice(0, 5).forEach(anime => {
            const card = AnimeCard(anime, { showActions: false });
            suggestionContainer.appendChild(card);
          });
          if (window.lucide) window.lucide.createIcons();
        }
      }).catch(err => {
        console.error("Failed to load empty state suggestions", err);
        suggestionContainer.innerHTML = '';
      });
    }
  },

  setupInfiniteScroll() {
    const trigger = document.getElementById('infinite-scroll-trigger-detector');
    if (!trigger) return;

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.isLoading && this.hasMorePages) {
        this.search();
      }
    }, { rootMargin: '100px' });

    this.observer.observe(trigger);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  SearchPage.init();
});
