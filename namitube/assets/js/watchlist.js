/* ============================================
   NamiTube — Watchlist Page Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderWatchlistPage();
});

function renderWatchlistPage() {
  const grid = document.getElementById('watchlistGrid');
  const emptyState = document.getElementById('watchlistEmpty');
  const watchlist = getWatchlist();

  if (!watchlist.length) {
    if (grid) grid.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (grid) grid.style.display = 'grid';
  if (emptyState) emptyState.style.display = 'none';

  grid.innerHTML = watchlist.map(w => `
    <div class="user-card" data-id="${w.animeId}">
      <a href="anime.html?id=${w.animeId}">
        <img src="${w.cover}" alt="${w.title}" loading="lazy" onerror="onImgError(this)">
      </a>
      <div class="uc-info">
        <a href="anime.html?id=${w.animeId}" class="uc-title">${w.title}</a>
        <div class="uc-meta">Added ${timeAgo(w.addedAt)}</div>
      </div>
      <div class="uc-actions">
        <button class="remove-btn" data-id="${w.animeId}">Remove</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = +btn.dataset.id;
      let wl = getWatchlist();
      wl = wl.filter(x => x.animeId !== id);
      localStorage.setItem('namiTube_watchlist', JSON.stringify(wl));
      renderWatchlistPage();
      showToast('Removed from Watchlist', 'success');
    });
  });
}
