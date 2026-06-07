import { jikan } from './api.js';
import { AnimeCard, SkeletonCard, Toast } from './components.js';
import { addRecentSearch, getRecentSearches } from './storage.js';
import { debounce, getParam, escapeHtml } from './utils.js';

let currentQuery = '';
let currentFilters = {};
let currentPage = 1;
let isLoading = false;
let hasMore = true;

export function initSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const filters = document.getElementById('filter-panel');
  const filterToggle = document.getElementById('filter-toggle');
  const recentChips = document.getElementById('recent-searches');
  const applyBtn = document.getElementById('apply-filters');
  const resetBtn = document.getElementById('reset-filters');

  const q = getParam('q');
  if (q && input) input.value = q;

  loadRecentSearches();
  loadGenres();
  performSearch();

  if (input) {
    input.addEventListener('input', debounce(() => {
      currentQuery = input.value.trim();
      currentPage = 1;
      hasMore = true;
      if (results) results.innerHTML = '';
      performSearch();
    }, 400));
    input.focus();
  }

  if (filterToggle && filters) {
    filterToggle.addEventListener('click', () => {
      filters.classList.toggle('active');
    });
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      collectFilters();
      currentPage = 1;
      hasMore = true;
      if (results) results.innerHTML = '';
      performSearch();
      if (filters && window.innerWidth < 1024) filters.classList.remove('active');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('#filter-panel input, #filter-panel select').forEach(el => {
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
        else el.value = '';
      });
      currentFilters = {};
      currentPage = 1;
      hasMore = true;
      if (results) results.innerHTML = '';
      performSearch();
    });
  }

  // Infinite scroll
  window.addEventListener('scroll', debounce(() => {
    if (isLoading || !hasMore) return;
    const threshold = 300;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold) {
      currentPage++;
      performSearch();
    }
  }, 120));
}

function loadRecentSearches() {
  const container = document.getElementById('recent-searches');
  if (!container) return;
  const searches = getRecentSearches();
  if (!searches.length) { container.style.display = 'none'; return; }
  container.style.display = 'flex';
  container.innerHTML = searches.map(q => `
    <button class="recent-chip" data-q="${escapeHtml(q)}">${escapeHtml(q)}</button>
  `).join('');
  container.querySelectorAll('.recent-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById('search-input');
      if (input) input.value = btn.dataset.q;
      currentQuery = btn.dataset.q;
      currentPage = 1;
      hasMore = true;
      document.getElementById('search-results').innerHTML = '';
      performSearch();
    });
  });
}

async function loadGenres() {
  try {
    const data = await jikan('/genres/anime');
    const list = document.getElementById('genre-filters');
    if (!list || !data?.data) return;
    list.innerHTML = data.data.slice(0, 20).map(g => `
      <label class="filter-checkbox">
        <input type="checkbox" value="${g.mal_id}" name="genre">
        <span>${escapeHtml(g.name)}</span>
      </label>
    `).join('');
  } catch (e) {}
}

function collectFilters() {
  const f = {};
  const type = document.querySelector('input[name="type"]:checked');
  if (type) f.type = type.value;
  const status = document.querySelector('input[name="status"]:checked');
  if (status) f.status = status.value;
  const rating = document.querySelector('input[name="rating"]:checked');
  if (rating) f.rating = rating.value;
  const minScore = document.getElementById('min-score');
  if (minScore && minScore.value) f.min_score = minScore.value;
  const orderBy = document.getElementById('order-by');
  if (orderBy && orderBy.value) f.order_by = orderBy.value;
  const sort = document.getElementById('sort');
  if (sort && sort.value) f.sort = sort.value;
  const year = document.getElementById('year');
  if (year && year.value) f.start_date = year.value + '-01-01';
  const season = document.getElementById('season');
  if (season && season.value) f.season = season.value;
  const genres = Array.from(document.querySelectorAll('input[name="genre"]:checked')).map(i => i.value);
  if (genres.length) f.genres = genres.join(',');
  currentFilters = f;
}

async function performSearch() {
  if (isLoading) return;
  isLoading = true;
  const results = document.getElementById('search-results');
  const header = document.getElementById('results-header');
  if (currentPage === 1 && results) {
    results.innerHTML = Array(12).fill(0).map(() => SkeletonCard('lg')).join('');
  }

  const params = new URLSearchParams();
  if (currentQuery) params.set('q', currentQuery);
  Object.entries(currentFilters).forEach(([k, v]) => { if (v) params.set(k, v); });
  params.set('page', String(currentPage));
  params.set('limit', '24');

  try {
    const data = await jikan('/anime?' + params.toString());
    const items = data?.data || [];
    if (currentPage === 1) {
      if (results) results.innerHTML = '';
      if (header) {
        const total = data?.pagination?.items?.total || items.length;
        header.textContent = currentQuery
          ? `Showing ${total} results for "${currentQuery}"`
          : `Browsing all anime`;
      }
      if (currentQuery) addRecentSearch(currentQuery);
    }
    if (!items.length) {
      hasMore = false;
      if (currentPage === 1 && results) {
        results.innerHTML = `<div class="empty-state"><p>No results found for "${escapeHtml(currentQuery)}"</p></div>`;
      }
    } else {
      const html = items.map(item => AnimeCard(item, { size: 'lg' })).join('');
      if (results) results.insertAdjacentHTML('beforeend', html);
      hasMore = data?.pagination?.has_next_page ?? false;
    }
  } catch (e) {
    Toast('Search failed. Please try again.', 'error');
  } finally {
    isLoading = false;
  }
}
