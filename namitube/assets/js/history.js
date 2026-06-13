/* ============================================
   NamiTube — History Page Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderHistory();

  document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
    showModal('Clear Watch History', 'Are you sure you want to clear your entire watch history? This cannot be undone.', 'Clear History', () => {
      localStorage.removeItem('namiTube_history');
      renderHistory();
      showToast('Watch history cleared.', 'success');
    });
  });
});

function renderHistory() {
  const grid = document.getElementById('historyGrid');
  const emptyState = document.getElementById('historyEmpty');
  const clearBtn = document.getElementById('clearHistoryBtn');
  const history = getHistory();

  if (!history.length) {
    if (grid) grid.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    if (clearBtn) clearBtn.style.display = 'none';
    return;
  }

  if (grid) grid.style.display = 'grid';
  if (emptyState) emptyState.style.display = 'none';
  if (clearBtn) clearBtn.style.display = 'inline-flex';

  /* Deduplicate by animeId, keeping latest */
  const seen = new Map();
  for (const h of history) {
    if (!seen.has(h.animeId)) seen.set(h.animeId, h);
  }

  grid.innerHTML = Array.from(seen.values()).map(h => `
    <div class="user-card">
      <a href="watch.html?id=${h.animeId}&ep=${h.episode}">
        <img src="${h.cover}" alt="${h.title}" loading="lazy" onerror="onImgError(this)">
      </a>
      <div class="uc-info">
        <a href="anime.html?id=${h.animeId}" class="uc-title">${h.title}</a>
        <div class="uc-meta">EP ${h.episode} · ${timeAgo(h.watchedAt)}</div>
      </div>
    </div>
  `).join('');
}
