import { getWatchlist, getFavorites, getHistory, clearHistory, removeFromWatchlist, removeFromFavorites, updateWatchlistStatus } from './storage.js';
import { Toast, Modal } from './components.js';
import { escapeHtml, formatRelativeTime } from './utils.js';

let activeTab = 'watchlist';

export function initLibrary() {
  const hash = window.location.hash.replace('#', '');
  if (hash) activeTab = hash;
  renderTabs();
  switchTab(activeTab);

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      let data;
      if (activeTab === 'watchlist') data = getWatchlist();
      else if (activeTab === 'favorites') data = getFavorites();
      else if (activeTab === 'history') data = getHistory();
      if (!data) return;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `namitube-${activeTab}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      Toast('Data exported', 'success');
    });
  }
}

function renderTabs() {
  const tabs = document.getElementById('library-tabs');
  if (!tabs) return;
  tabs.innerHTML = ['watchlist','favorites','history'].map(t => `
    <button class="tab-btn ${t === activeTab ? 'active' : ''}" data-tab="${t}">
      ${t.charAt(0).toUpperCase() + t.slice(1)}
    </button>
  `).join('');
}

function switchTab(tab) {
  activeTab = tab;
  renderTabs();
  const container = document.getElementById('library-content');
  if (!container) return;
  if (tab === 'watchlist') renderWatchlist(container);
  else if (tab === 'favorites') renderFavorites(container);
  else if (tab === 'history') renderHistory(container);
}

function renderWatchlist(container) {
  const list = getWatchlist();
  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Your watchlist is empty.</p>
        <a href="home.html" class="nt-btn nt-btn-primary">Browse Anime</a>
      </div>`;
    return;
  }
  container.innerHTML = `
    <div class="library-grid">
      ${list.map(item => `
        <div class="library-card" data-mal-id="${item.malId}">
          <a href="anime.html?id=${item.malId}">
            <img src="${item.posterUrl || ''}" alt="${escapeHtml(item.title)}" loading="lazy">
          </a>
          <div class="library-card-info">
            <a href="anime.html?id=${item.malId}" class="library-title">${escapeHtml(item.title)}</a>
            <select class="status-select" data-mal-id="${item.malId}">
              <option value="watching" ${item.status === 'watching' ? 'selected' : ''}>Watching</option>
              <option value="plan" ${item.status === 'plan' ? 'selected' : ''}>Plan to Watch</option>
              <option value="completed" ${item.status === 'completed' ? 'selected' : ''}>Completed</option>
              <option value="hold" ${item.status === 'hold' ? 'selected' : ''}>On Hold</option>
              <option value="dropped" ${item.status === 'dropped' ? 'selected' : ''}>Dropped</option>
            </select>
            <button class="remove-btn" data-mal-id="${item.malId}" aria-label="Remove">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  container.querySelectorAll('.status-select').forEach(sel => {
    sel.addEventListener('change', () => {
      updateWatchlistStatus(Number(sel.dataset.malId), sel.value);
      Toast('Status updated', 'success');
    });
  });
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const malId = Number(btn.dataset.malId);
      const card = btn.closest('.library-card');
      card.style.opacity = '0.5';
      Modal('Remove from watchlist?', 'This action cannot be undone.', [
        { label: 'Cancel', style: 'secondary' },
        { label: 'Remove', style: 'danger', onClick: () => {
          removeFromWatchlist(malId);
          card.remove();
          Toast('Removed from watchlist', 'info');
          if (!container.querySelector('.library-card')) renderWatchlist(container);
        }}
      ]);
    });
  });
}

function renderFavorites(container) {
  const list = getFavorites();
  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No favorites yet.</p>
        <a href="home.html" class="nt-btn nt-btn-primary">Browse Anime</a>
      </div>`;
    return;
  }
  container.innerHTML = `
    <div class="library-grid">
      ${list.map(item => `
        <div class="library-card" data-mal-id="${item.malId}">
          <a href="anime.html?id=${item.malId}">
            <img src="${item.posterUrl || ''}" alt="${escapeHtml(item.title)}" loading="lazy">
          </a>
          <div class="library-card-info">
            <a href="anime.html?id=${item.malId}" class="library-title">${escapeHtml(item.title)}</a>
            <button class="remove-btn" data-mal-id="${item.malId}" aria-label="Remove">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const malId = Number(btn.dataset.malId);
      removeFromFavorites(malId);
      btn.closest('.library-card').remove();
      Toast('Removed from favorites', 'info');
      if (!container.querySelector('.library-card')) renderFavorites(container);
    });
  });
}

function renderHistory(container) {
  const list = getHistory();
  if (!list.length) {
    container.innerHTML = `<div class="empty-state"><p>No watch history yet.</p></div>`;
    return;
  }
  container.innerHTML = `
    <div class="history-list">
      ${list.map(item => `
        <div class="history-item">
          <img src="${item.posterUrl || ''}" alt="" class="history-thumb" loading="lazy">
          <div class="history-info">
            <a href="anime.html?id=${item.malId}" class="history-title">${escapeHtml(item.title)}</a>
            <div class="history-meta">
              <span>Episode ${item.episode}</span>
              <span>${formatRelativeTime(item.timestamp)}</span>
            </div>
            ${item.totalEpisodes ? `
              <div class="history-progress">
                <div class="history-progress-bar" style="width:${Math.min(100, (item.episode / item.totalEpisodes) * 100)}%"></div>
              </div>
            ` : ''}
          </div>
          <div class="history-actions">
            <a href="watch.html?id=${item.malId}&ep=${item.episode}&lang=${item.lang || 'sub'}" class="nt-btn nt-btn-primary nt-btn-sm">Continue</a>
            <button class="remove-btn" data-ts="${item.timestamp}" aria-label="Remove">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
    <button id="clear-history" class="nt-btn nt-btn-danger" style="margin-top:24px;">Clear All History</button>
  `;
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ts = Number(btn.dataset.ts);
      const newList = getHistory().filter(x => x.timestamp !== ts);
      localStorage.setItem('namitube_history', JSON.stringify(newList));
      btn.closest('.history-item').remove();
      Toast('Entry removed', 'info');
    });
  });
  const clearBtn = document.getElementById('clear-history');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      Modal('Clear all history?', 'This will permanently delete all watch history.', [
        { label: 'Cancel', style: 'secondary' },
        { label: 'Clear', style: 'danger', onClick: () => {
          clearHistory();
          renderHistory(container);
          Toast('History cleared', 'info');
        }}
      ]);
    });
  }
}
