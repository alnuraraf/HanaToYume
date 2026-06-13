/* ===== NamiTube — Favorites Page ===== */
document.addEventListener('DOMContentLoaded', () => {
  renderFavorites();
});

function renderFavorites() {
  const grid = document.getElementById('favoritesGrid');
  if (!grid) return;
  const list = getFavorites();

  if (list.length === 0) {
    grid.innerHTML = renderEmptyState('heart', 'No Favorites Yet', 'Heart the anime you love to save them here.', 'Browse Popular', 'catalog.html?view=popular');
    return;
  }

  grid.innerHTML = `<div class="card-grid">${list.map(item => `
    <div class="history-card" style="position:relative">
      <a href="anime.html?id=${item.animeId}">
        <div class="card-img-wrap">
          <img src="${item.cover || 'assets/img/placeholder-cover.svg'}" alt="${item.title}" loading="lazy" onerror="imgError(this)">
        </div>
        <div class="card-body">
          <div class="card-title">${item.title || 'Unknown'}</div>
          <div class="card-time">${relativeTime(item.addedAt)}</div>
        </div>
      </a>
      <button class="btn btn-outline remove-btn" data-id="${item.animeId}" style="position:absolute;top:4px;right:4px;padding:4px 8px;font-size:.7rem;background:rgba(0,0,0,0.7);border-radius:var(--radius-sm)">
        ${ICONS.x}
      </button>
    </div>
  `).join('')}</div>`;

  grid.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const f = getFavorites().filter(x => x.animeId !== id);
      setFavorites(f);
      renderFavorites();
      showToast('Removed from Favorites', 'info');
    });
  });
}
