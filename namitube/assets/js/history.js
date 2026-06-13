/* ===== NamiTube — History Page ===== */
document.addEventListener('DOMContentLoaded', () => {
  renderHistory();

  document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
    showModal('Clear Watch History?', 'This will remove all your watch history. This cannot be undone.', () => {
      localStorage.removeItem('namiTube_history');
      renderHistory();
      showToast('Watch history cleared', 'success');
    });
  });
});

function renderHistory() {
  const grid = document.getElementById('historyGrid');
  if (!grid) return;
  const history = getHistory();

  if (history.length === 0) {
    grid.innerHTML = renderEmptyState('clock', 'No Watch History', "You haven't watched anything yet. Start exploring!", 'Browse Trending', 'catalog.html?view=trending');
    document.getElementById('clearHistoryBtn')?.setAttribute('hidden', '');
    return;
  }

  document.getElementById('clearHistoryBtn')?.removeAttribute('hidden');

  // Deduplicate by animeId, keeping latest
  const seen = new Map();
  for (const h of history) {
    if (!seen.has(h.animeId)) seen.set(h.animeId, h);
  }

  grid.innerHTML = `<div class="card-grid">${Array.from(seen.values()).map(h => `
    <a href="watch.html?id=${h.animeId}&ep=${h.episode}" class="history-card">
      <div class="card-img-wrap">
        <img src="${h.cover || 'assets/img/placeholder-cover.svg'}" alt="${h.title}" loading="lazy" onerror="imgError(this)">
        <div class="card-progress"><div class="card-progress-fill" style="width:${Math.min(100,(h.progress||0)/(h.duration||1)*100)}%"></div></div>
      </div>
      <div class="card-body">
        <div class="card-title">${h.title || 'Unknown'}</div>
        <div class="card-ep">EP ${h.episode}</div>
        <div class="card-time">${relativeTime(h.watchedAt)}</div>
      </div>
    </a>
  `).join('')}</div>`;
}
