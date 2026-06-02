import { api } from '../api.js';
import { AnimeCard } from '../components.js';

let debounceTimer;

export async function SearchPage() {
  const main = document.getElementById('main-content');
  const q = new URLSearchParams(location.search).get('q') || '';

  main.innerHTML = `
    <div class="search-page">
      <div class="search-hero">
        <input type="text" class="search-input-large" id="search-input" value="${q}" placeholder="Search anime..." autocomplete="off">
      </div>
      <div id="search-results" class="results-grid">
        ${q ? '<div class="skeleton" style="height:300px;grid-column:1/-1"></div>' : ''}
      </div>
    </div>
  `;

  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');

  const doSearch = async (query) => {
    if (!query) {
      results.innerHTML = '';
      return;
    }
    results.innerHTML = '<div class="skeleton" style="height:300px;grid-column:1/-1"></div>';
    try {
      const data = await api.searchAnime(query);
      const anime = data.data || [];
      if (anime.length === 0) {
        results.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted)">No results found.</p>';
      } else {
        results.innerHTML = anime.map(AnimeCard).join('');
      }
    } catch (err) {
      results.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted)">Error searching.</p>';
    }
  };

  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const val = e.target.value.trim();
      if (val) {
        const newUrl = `/search?q=${encodeURIComponent(val)}`;
        history.replaceState(null, '', newUrl);
        doSearch(val);
      } else {
        history.replaceState(null, '', '/search');
        results.innerHTML = '';
      }
    }, 400);
  });

  if (q) doSearch(q);
}