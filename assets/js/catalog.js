/* ============================================
   NamiTube — Catalog Page Script
   ============================================ */

const VIEW_CONFIG = {
  trending:    { title: 'New & Trending', desc: 'The hottest anime right now' },
  popular:     { title: 'Most Popular', desc: 'All-time fan favorites' },
  'top-rated': { title: 'Top Rated', desc: 'Highest-scored anime of all time' },
  movies:      { title: 'Movies', desc: 'Feature-length anime films' },
  tv:          { title: 'TV Shows', desc: 'Full-length anime series' },
  ova:         { title: 'OVAs & Specials', desc: 'Original video animations and specials' },
  upcoming:    { title: 'Upcoming', desc: 'Anime coming soon' },
};

let catalogPage = 1;
let catalogLoading = false;
let catalogHasMore = true;
let currentView = 'trending';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  currentView = params.get('view') || 'trending';

  const config = VIEW_CONFIG[currentView] || VIEW_CONFIG.trending;
  document.title = `${config.title} — NamiTube`;
  document.getElementById('catalogTitle').textContent = config.title;
  document.getElementById('catalogDesc').textContent = config.desc;

  /* Infinite scroll */
  const sentinel = document.getElementById('scrollSentinel');
  if (sentinel) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && catalogHasMore && !catalogLoading) {
        catalogPage++;
        loadCatalog(false);
      }
    }, { rootMargin: '200px' });
    observer.observe(sentinel);
  }

  loadCatalog(true);
});

function getFetcher() {
  switch (currentView) {
    case 'trending': return (p, pp) => fetchTrending(p, pp);
    case 'popular': return (p, pp) => fetchPopular(p, pp);
    case 'top-rated': return (p, pp) => fetchTopRated(p, pp);
    case 'movies': return (p, pp) => fetchByFormat('MOVIE', p, pp);
    case 'tv': return (p, pp) => fetchByFormat('TV', p, pp);
    case 'ova': return (p, pp) => fetchByFormat(['OVA', 'ONA', 'SPECIAL'], p, pp);
    case 'upcoming': return (p, pp) => fetchUpcoming(p, pp);
    default: return (p, pp) => fetchTrending(p, pp);
  }
}

async function loadCatalog(reset) {
  if (catalogLoading) return;
  catalogLoading = true;
  const grid = document.getElementById('catalogGrid');

  if (reset) grid.innerHTML = renderSkeletonCards(18);

  try {
    const fetcher = getFetcher();
    const data = await fetcher(catalogPage, 24);
    const html = data.Page.media.map(m => renderPortraitCard(m)).join('');
    if (reset) grid.innerHTML = html;
    else grid.insertAdjacentHTML('beforeend', html);
    catalogHasMore = data.Page.pageInfo.hasNextPage;

    if (!data.Page.media.length && reset) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          ${ICONS.searchX}
          <h3>No anime found</h3>
          <p>Try browsing another category.</p>
        </div>
      `;
    }
  } catch {
    if (reset) grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><p>Failed to load. Refresh to try again.</p></div>';
  }
  catalogLoading = false;
}
