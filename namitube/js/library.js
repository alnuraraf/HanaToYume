/* library.js */
let currentTab = 'watchlist';
let sortBy = 'date';

document.addEventListener('DOMContentLoaded', () => {
  Components.mount();

  // Handle initial hash
  const hash = window.location.hash.replace('#', '');
  if (['watchlist','favorites','history'].includes(hash)) currentTab = hash;

  renderTabs();
  renderTab();

  document.getElementById('sortBy').onchange = (e) => { sortBy = e.target.value; renderTab(); };
  document.getElementById('exportBtn').onclick = exportTab;
});

function renderTabs() {
  const p = Storage.get();
  document.getElementById('countWatchlist').textContent = p.watchlist.length;
  document.getElementById('countFavorites').textContent = p.favorites.length;
  document.getElementById('countHistory').textContent = p.watchHistory.length;

  document.querySelectorAll('.lib-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === currentTab);
    t.onclick = () => {
      currentTab = t.dataset.tab;
      window.location.hash = currentTab;
      renderTabs();
      renderTab();
    };
  });

  // Show/hide sort
  document.getElementById('sortWrap').style.display = currentTab === 'history' ? 'none' : 'flex';
}

function renderTab() {
  const p = Storage.get();
  const wrap = document.getElementById('libContent');

  if (currentTab === 'history') return renderHistory(p, wrap);

  let items = currentTab === 'watchlist' ? [...p.watchlist] : [...p.favorites];
  if (sortBy === 'title') items.sort((a,b) => a.title.localeCompare(b.title));
  else if (sortBy === 'score') items.sort((a,b) => (b.score||0) - (a.score||0));
  else items.sort((a,b) => (b.addedAt||0) - (a.addedAt||0));

  if (!items.length) {
    wrap.innerHTML = `<div class="empty-state">
      <i data-lucide="${currentTab==='favorites'?'heart':'bookmark'}" style="width:48px;height:48px;"></i>
      <h3>Your ${currentTab} is empty</h3>
      <p>Start exploring to add anime here.</p>
      <a href="home.html" class="btn btn-primary"><i data-lucide="compass"></i>Browse Anime</a>
    </div>`;
    Utils.initIcons();
    return;
  }

  wrap.innerHTML = `<div class="anime-grid stagger-in">${items.map(item => libCard(item)).join('')}</div>`;
  Utils.initIcons();

  wrap.querySelectorAll('[data-remove]').forEach(b => {
    b.onclick = (e) => {
      e.preventDefault(); e.stopPropagation();
      const id = Number(b.dataset.remove);
      if (currentTab === 'watchlist') Storage.removeFromWatchlist(id);
      else Storage.removeFromFavorites(id);
      Components.Toast('Removed', 'info');
      renderTabs(); renderTab();
    };
  });
  wrap.querySelectorAll('.status-select').forEach(s => {
    s.onchange = (e) => {
      const id = Number(s.dataset.statusFor);
      Storage.setWatchlistStatus(id, e.target.value);
      Components.Toast('Status updated', 'success');
    };
  });
}

function libCard(item) {
  const statusOptions = ['plan','watching','completed','dropped'];
  const labels = { plan: 'Plan to Watch', watching: 'Watching', completed: 'Completed', dropped: 'Dropped' };
  return `
    <div class="lib-card-wrap">
      <div class="lib-actions">
        <button data-remove="${item.malId}" aria-label="Remove"><i data-lucide="x" style="width:14px;height:14px;"></i></button>
      </div>
      ${currentTab === 'watchlist' ? `<select class="status-select" data-status-for="${item.malId}">
        ${statusOptions.map(s => `<option value="${s}" ${item.status===s?'selected':''}>${labels[s]}</option>`).join('')}
      </select>` : ''}
      <article class="anime-card">
        <a href="anime.html?id=${item.malId}" class="poster-wrap">
          <img class="poster" loading="lazy" src="${item.posterUrl||''}" alt="${Utils.escapeHtml(item.title)}"/>
          ${item.score ? `<div class="score-badge"><i data-lucide="star" style="width:11px;height:11px;"></i>${item.score}</div>` : ''}
        </a>
        <div class="card-info">
          <a href="anime.html?id=${item.malId}" class="card-title">${Utils.escapeHtml(item.title)}</a>
        </div>
      </article>
    </div>
  `;
}

function renderHistory(p, wrap) {
  const items = p.watchHistory;
  if (!items.length) {
    wrap.innerHTML = `<div class="empty-state">
      <i data-lucide="history" style="width:48px;height:48px;"></i>
      <h3>No watch history</h3>
      <p>Watch your first episode to start tracking your progress.</p>
      <a href="home.html" class="btn btn-primary"><i data-lucide="compass"></i>Browse Anime</a>
    </div>`;
    Utils.initIcons();
    return;
  }

  wrap.innerHTML = `
    <div style="margin-bottom:12px;text-align:right;">
      <button class="btn btn-secondary btn-sm" id="clearHistBtn"><i data-lucide="trash-2"></i>Clear History</button>
    </div>
    <div class="history-list">
      ${items.map(h => {
        const pct = h.totalEpisodes ? Math.round((h.episode / h.totalEpisodes) * 100) : 0;
        return `
          <div class="history-item">
            <a href="anime.html?id=${h.malId}"><img src="${h.posterUrl||''}" alt=""/></a>
            <div class="history-info">
              <h3><a href="anime.html?id=${h.malId}">${Utils.escapeHtml(h.title)}</a></h3>
              <div class="history-meta">Episode ${h.episode}${h.totalEpisodes ? ' of ' + h.totalEpisodes : ''} · ${Utils.timeAgo(h.timestamp)}</div>
              ${h.totalEpisodes ? `<div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>` : ''}
            </div>
            <a href="watch.html?id=${h.malId}&ep=${h.episode}&lang=sub" class="btn btn-primary btn-sm"><i data-lucide="play"></i>Continue</a>
          </div>`;
      }).join('')}
    </div>
  `;
  Utils.initIcons();
  document.getElementById('clearHistBtn').onclick = () => {
    Components.Modal('Clear History?', 'This will permanently remove all watch history. This cannot be undone.', [
      { label: 'Cancel' },
      { label: 'Clear', primary: true, onClick: () => { Storage.clearHistory(); Components.Toast('History cleared', 'success'); renderTabs(); renderTab(); } }
    ]);
  };
}

function exportTab() {
  const p = Storage.get();
  let data;
  if (currentTab === 'watchlist') data = p.watchlist;
  else if (currentTab === 'favorites') data = p.favorites;
  else data = p.watchHistory;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `namitube-${currentTab}.json`;
  a.click();
  URL.revokeObjectURL(url);
  Components.Toast('Exported', 'success');
}
