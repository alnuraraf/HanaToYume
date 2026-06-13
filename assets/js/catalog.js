/* ===== NamiTube — Catalog Page ===== */
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view') || 'trending';

  const labels = {
    trending: 'New & Trending',
    popular: 'Popular Anime',
    'top-rated': 'Top Rated Anime',
    movies: 'Anime Movies',
    tv: 'TV Shows',
    ova: 'OVAs & Specials',
    upcoming: 'Upcoming Anime',
  };

  const fetchers = {
    trending: fetchTrending,
    popular: fetchPopular,
    'top-rated': fetchTopRated,
    movies: fetchMovies,
    tv: fetchTVShows,
    ova: fetchOVA,
    upcoming: fetchUpcoming,
  };

  const label = labels[view] || 'Anime Catalog';
  const fetchFn = fetchers[view] || fetchTrending;

  document.title = `${label} — NamiTube`;
  const heading = document.getElementById('catalogHeading');
  const grid = document.getElementById('catalogGrid');
  if (heading) heading.textContent = label;

  let currentPage = 1;
  let hasMore = false;
  let loading = false;

  async function loadPage(page, replace) {
    if (loading) return;
    loading = true;
    if (replace && grid) grid.innerHTML = renderSkeletonGrid(18);

    try {
      const data = await fetchFn(page, 20);
      const results = data?.Page?.media || [];
      hasMore = data?.Page?.pageInfo?.hasNextPage || false;
      currentPage = page;

      if (results.length === 0 && replace) {
        grid.innerHTML = renderEmptyState('searchX', 'Nothing here yet', 'Check back later for new content.', 'Go Home', 'index.html');
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
      if (replace && grid) grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:32px">Failed to load. Try refreshing.</p>';
    }
    loading = false;
  }

  loadPage(1, true);

  const sentinel = document.getElementById('catalogSentinel');
  if (sentinel) {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) loadPage(currentPage + 1, false);
    }, { rootMargin: '200px' });
    io.observe(sentinel);
  }
});
