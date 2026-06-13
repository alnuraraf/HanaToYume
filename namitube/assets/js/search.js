/* ============================================
   NamiTube — Search Page Script
   ============================================ */

let searchPage = 1;
let searchLoading = false;
let searchHasMore = true;
let currentParams = {};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') || '';
  const input = document.getElementById('searchInput');
  if (input && q) { input.value = q; }
  if (input) {
    input.focus();
    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => doSearch(), 300);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSearch();
    });
  }

  /* Filter controls */
  document.getElementById('applyFilters')?.addEventListener('click', () => doSearch());
  document.getElementById('clearFilters')?.addEventListener('click', () => {
    document.getElementById('filterFormat').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterSort').value = 'SEARCH_MATCH';
    doSearch();
  });

  /* Infinite scroll */
  const sentinel = document.getElementById('scrollSentinel');
  if (sentinel) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && searchHasMore && !searchLoading) {
        searchPage++;
        loadMore();
      }
    }, { rootMargin: '200px' });
    observer.observe(sentinel);
  }

  if (q) doSearch();
});

async function doSearch() {
  const input = document.getElementById('searchInput');
  const q = input?.value?.trim() || '';
  const format = document.getElementById('filterFormat')?.value || '';
  const status = document.getElementById('filterStatus')?.value || '';
  const sort = document.getElementById('filterSort')?.value || 'SEARCH_MATCH';

  searchPage = 1;
  searchHasMore = true;
  currentParams = { search: q || undefined, format: format || undefined, status: status || undefined, sort: sort || undefined };

  const grid = document.getElementById('resultsGrid');
  if (!grid) return;
  grid.innerHTML = renderSkeletonCards(12);

  try {
    const data = await searchAnime({ ...currentParams, page: searchPage, perPage: 20 });
    if (!data.Page.media.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          ${ICONS.searchX}
          <h3>No results found</h3>
          <p>Try different keywords or browse <a href="catalog.html?view=popular" style="color:var(--accent)">popular anime</a>.</p>
        </div>
      `;
      searchHasMore = false;
      return;
    }
    grid.innerHTML = data.Page.media.map(m => renderPortraitCard(m)).join('');
    searchHasMore = data.Page.pageInfo.hasNextPage;
  } catch {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><p>Search failed. Please try again.</p></div>';
  }
}

async function loadMore() {
  if (searchLoading || !searchHasMore) return;
  searchLoading = true;
  const grid = document.getElementById('resultsGrid');
  try {
    const data = await searchAnime({ ...currentParams, page: searchPage, perPage: 20 });
    if (data.Page.media.length) {
      grid.insertAdjacentHTML('beforeend', data.Page.media.map(m => renderPortraitCard(m)).join(''));
    }
    searchHasMore = data.Page.pageInfo.hasNextPage;
  } catch { /* silent */ }
  searchLoading = false;
}
