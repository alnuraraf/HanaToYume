/* ============================================
   NamiTube — Genre Page Script
   ============================================ */

let genrePage = 1;
let genreLoading = false;
let genreHasMore = true;
let currentSort = 'POPULARITY_DESC';
let genreName = '';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  genreName = params.get('name') || 'Action';

  document.title = `${genreName} Anime — NamiTube`;
  document.getElementById('genreTitle').textContent = genreName;

  /* Sort controls */
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSort = btn.dataset.sort;
      genrePage = 1;
      genreHasMore = true;
      loadGenre(true);
    });
  });

  /* Infinite scroll */
  const sentinel = document.getElementById('scrollSentinel');
  if (sentinel) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && genreHasMore && !genreLoading) {
        genrePage++;
        loadGenre(false);
      }
    }, { rootMargin: '200px' });
    observer.observe(sentinel);
  }

  loadGenre(true);
});

async function loadGenre(reset) {
  if (genreLoading) return;
  genreLoading = true;
  const grid = document.getElementById('genreGrid');

  if (reset) {
    grid.innerHTML = renderSkeletonCards(18);
  }

  try {
    const data = await fetchByGenre(genreName, genrePage, 24, currentSort);
    const html = data.Page.media.map(m => renderPortraitCard(m)).join('');
    if (reset) grid.innerHTML = html;
    else grid.insertAdjacentHTML('beforeend', html);
    genreHasMore = data.Page.pageInfo.hasNextPage;

    if (!data.Page.media.length && reset) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          ${ICONS.searchX}
          <h3>No anime found</h3>
          <p>Try browsing <a href="catalog.html?view=popular" style="color:var(--accent)">popular anime</a>.</p>
        </div>
      `;
    }
  } catch {
    if (reset) grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><p>Failed to load. Refresh to try again.</p></div>';
  }
  genreLoading = false;
}
