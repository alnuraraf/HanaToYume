/* ============================================
   NamiTube — Favorites Page Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderFavoritesPage();
});

function renderFavoritesPage() {
  const grid = document.getElementById('favoritesGrid');
  const emptyState = document.getElementById('favoritesEmpty');
  const favorites = getFavorites();

  if (!favorites.length) {
    if (grid) grid.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (grid) grid.style.display = 'grid';
  if (emptyState) emptyState.style.display = 'none';

  grid.innerHTML = favorites.map(f => `
    <div class="user-card" data-id="${f.animeId}">
      <a href="anime.html?id=${f.animeId}">
        <img src="${f.cover}" alt="${f.title}" loading="lazy" onerror="onImgError(this)">
      </a>
      <div class="uc-info">
        <a href="anime.html?id=${f.animeId}" class="uc-title">${f.title}</a>
        <div class="uc-meta">Added ${timeAgo(f.addedAt)}</div>
      </div>
      <div class="uc-actions">
        <button class="remove-btn" data-id="${f.animeId}">Remove</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = +btn.dataset.id;
      let fav = getFavorites();
      fav = fav.filter(x => x.animeId !== id);
      localStorage.setItem('namiTube_favorites', JSON.stringify(fav));
      renderFavoritesPage();
      showToast('Removed from Favorites', 'success');
    });
  });
}
