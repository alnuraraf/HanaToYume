/* ===== NamiTube — Search Page ===== */
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const initialQ = params.get('q') || '';
  const input = document.getElementById('searchInput');
  const grid = document.getElementById('searchGrid');
  const filterPanel = document.getElementById('filterPanel');
  const filterToggle = document.getElementById('filterToggle');

  let currentPage = 1;
  let hasMore = false;
  let loading = false;
  let currentQuery = initialQ;
  let debounceTimer;

  if (input && initialQ) { input.value = initialQ; }
  if (initialQ) doSearch(initialQ, 1, true);

  // Focus input
  setTimeout(() => input?.focus(), 200);

  // Debounced input
  input?.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      currentQuery = input.value.trim();
      if (currentQuery.length >= 2) doSearch(currentQuery, 1, true);
      else if (grid) grid.innerHTML = '';
    }, 300);
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      clearTimeout(debounceTimer);
      currentQuery = input.value.trim();
      if (currentQuery) doSearch(currentQuery, 1, true);
    }
  });

  // Filter toggle
  filterToggle?.addEventListener('click', () => {
    filterToggle.classList.toggle('expanded');
    if (filterPanel) filterPanel.style.display = filterPanel.style.display === 'none' ? 'grid' : 'none';
  });

  // Filter changes
  filterPanel?.querySelectorAll('select').forEach(sel => {
    sel.addEventListener('change', () => {
      if (currentQuery) doSearch(currentQuery, 1, true);
    });
  });

  async function doSearch(q, page, replace) {
    if (loading) return;
    loading = true;
    if (replace && grid) {
      grid.innerHTML = renderSkeletonGrid(12);
    }

    const filters = {};
    const fmt = document.getElementById('filterFormat')?.value;
    const status = document.getElementById('filterStatus')?.value;
    const sort = document.getElementById('filterSort')?.value;
    const genre = document.getElementById('filterGenre')?.value;
    if (fmt) filters.format = fmt;
    if (status) filters.status = status;
    if (sort) filters.sort = sort;
    if (genre) filters.genre = genre;

    try {
      const data = await fetchSearch(q, page, 20, filters);
      const results = data?.Page?.media || [];
      hasMore = data?.Page?.pageInfo?.hasNextPage || false;
      currentPage = page;

      if (results.length === 0 && replace) {
        grid.innerHTML = renderEmptyState('searchX', 'No results found', `Try different keywords or browse popular anime.`, 'Browse Popular', 'catalog.html?view=popular');
        loading = false;
        return;
      }

      const html = `<div class="card-grid">${results.map(m => renderPortraitCard(m)).join('')}</div>`;
      if (replace) {
        grid.innerHTML = html;
      } else {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        const existingGrid = grid.querySelector('.card-grid');
        if (existingGrid) {
          wrapper.querySelector('.card-grid')?.querySelectorAll('.card-portrait').forEach(c => existingGrid.appendChild(c));
        } else {
          grid.innerHTML += html;
        }
      }
    } catch (e) {
      if (replace && grid) grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:32px">Search failed. Please try again.</p>';
    }
    loading = false;
  }

  // Infinite scroll
  const sentinel = document.getElementById('searchSentinel');
  if (sentinel) {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        doSearch(currentQuery, currentPage + 1, false);
      }
    }, { rootMargin: '200px' });
    io.observe(sentinel);
  }
});
