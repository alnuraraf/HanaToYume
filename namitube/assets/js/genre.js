/* ===== NamiTube — Genre Page ===== */
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const genreName = params.get('name') || 'Action';
  const heading = document.getElementById('genreHeading');
  const grid = document.getElementById('genreGrid');
  const sortBtns = document.querySelectorAll('.genre-sort-btn');

  if (heading) heading.textContent = genreName;
  document.title = `${genreName} Anime — NamiTube`;

  let currentSort = 'POPULARITY_DESC';
  let currentPage = 1;
  let hasMore = false;
  let loading = false;

  sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sortBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSort = btn.dataset.sort;
      loadGenre(1, true);
    });
  });

  async function loadGenre(page, replace) {
    if (loading) return;
    loading = true;
    if (replace && grid) grid.innerHTML = renderSkeletonGrid(12);

    try {
      const data = await fetchByGenre(genreName, page, 20, currentSort);
      const results = data?.Page?.media || [];
      hasMore = data?.Page?.pageInfo?.hasNextPage || false;
      currentPage = page;

      if (results.length === 0 && replace) {
        grid.innerHTML = renderEmptyState('searchX', 'No anime found', `No anime found for the genre "${genreName}".`, 'Browse Popular', 'catalog.html?view=popular');
        loading = false;
        return;
      }

      const html = results.map(m => renderPortraitCard(m)).join('');
      if (replace) {
        grid.innerHTML = `<div class="card-grid">${html}</div>`;
      } else {
        const existing = grid.querySelector('.card-grid');
        if (existing) existing.insertAdjacentHTML('beforeend', html);
      }
    } catch {
      if (replace && grid) grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:32px">Failed to load. Try again.</p>';
    }
    loading = false;
  }

  loadGenre(1, true);

  // Infinite scroll
  const sentinel = document.getElementById('genreSentinel');
  if (sentinel) {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) loadGenre(currentPage + 1, false);
    }, { rootMargin: '200px' });
    io.observe(sentinel);
  }
});
