/* search.js */
const TOP_GENRES = [
  { id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }, { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' }, { id: 10, name: 'Fantasy' }, { id: 14, name: 'Horror' },
  { id: 7, name: 'Mystery' }, { id: 22, name: 'Romance' }, { id: 24, name: 'Sci-Fi' },
  { id: 36, name: 'Slice of Life' }, { id: 30, name: 'Sports' }, { id: 37, name: 'Supernatural' },
  { id: 41, name: 'Suspense' }, { id: 62, name: 'Isekai' }, { id: 27, name: 'Shounen' },
  { id: 42, name: 'Seinen' }, { id: 25, name: 'Shoujo' }, { id: 5, name: 'Avant Garde' },
  { id: 46, name: 'Award Winning' }, { id: 47, name: 'Gourmet' }
];

let page = 1;
let loading = false;
let hasMore = true;
let allResults = [];
let currentFilters = {};

document.addEventListener('DOMContentLoaded', () => {
  Components.mount();

  const q = Utils.getParam('q') || Utils.getParam('genre') || '';
  const input = document.getElementById('searchInput');
  input.value = q;
  input.focus();

  renderRecent();
  renderFilters();

  input.addEventListener('input', Utils.debounce(() => doSearch(), 400));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  input.addEventListener('focus', renderRecent);

  document.getElementById('filterToggle').onclick = () => {
    document.getElementById('searchSidebar').classList.toggle('open');
  };

  window.addEventListener('scroll', Utils.throttle(() => {
    if (loading || !hasMore) return;
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 600) {
      page++; doSearch(true);
    }
  }, 200));

  if (q) doSearch();
  else renderEmptyState();
});

function buildFilters() {
  const f = {};
  const type = document.getElementById('fType').value;
  const status = document.getElementById('fStatus').value;
  const minScore = document.getElementById('fScore').value;
  const order = document.getElementById('fOrder').value;
  const year = document.getElementById('fYear').value;
  const genres = Array.from(document.querySelectorAll('.fGenre:checked')).map(c => c.value).join(',');
  if (type) f.type = type;
  if (status) f.status = status;
  if (minScore && minScore !== '0') f.minScore = minScore;
  if (order) f.orderBy = order;
  if (year) f.year = year;
  if (genres) f.genres = genres;
  return f;
}

async function doSearch(loadMore = false) {
  const q = document.getElementById('searchInput').value.trim();
  if (!loadMore) {
    page = 1; allResults = []; hasMore = true;
    if (q) Storage.addRecentSearch(q);
  }
  loading = true;

  // sync URL
  if (!loadMore) {
    const u = new URL(window.location); u.searchParams.set('q', q);
    history.replaceState(null, '', u);
  }

  currentFilters = buildFilters();
  const grid = document.getElementById('searchGrid');
  if (!loadMore) grid.innerHTML = Utils.skeletonGrid(12);

  try {
    const r = await API.searchAnime(q, { ...currentFilters, page, limit: 24, sort: 'desc' });
    const items = r.data || [];
    allResults = allResults.concat(items);
    hasMore = r.pagination?.has_next_page;

    if (!allResults.length) { renderEmptyState(q); return; }

    document.getElementById('resultCount').textContent =
      `Showing ${allResults.length} result${allResults.length===1?'':'s'}${q ? ` for "${q}"` : ''}`;

    grid.innerHTML = allResults.map(a => Components.AnimeCard(a)).join('') +
      (hasMore ? '<div id="loadMore" style="grid-column:1/-1;text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>' : '');
    Utils.initIcons();
  } catch (e) {
    grid.innerHTML = '<p class="text-muted" style="grid-column:1/-1;">Search failed. Try again.</p>';
  } finally {
    loading = false;
  }
}

function renderEmptyState(q) {
  const grid = document.getElementById('searchGrid');
  document.getElementById('resultCount').textContent = '';
  grid.innerHTML = `
    <div class="empty-state" style="grid-column:1/-1;">
      <i data-lucide="search" style="width:48px;height:48px;"></i>
      <h3>${q ? 'No results found' : 'Start searching'}</h3>
      <p>${q ? 'Try a different keyword or adjust the filters.' : 'Search by anime title, or browse popular picks below.'}</p>
    </div>`;
  Utils.initIcons();
  loadPopular();
}

async function loadPopular() {
  try {
    const r = await API.getTopPopularity();
    const items = (r.data || []).slice(0, 12);
    const grid = document.getElementById('searchGrid');
    grid.insertAdjacentHTML('beforeend',
      '<div style="grid-column:1/-1;margin-top:24px;"><h3 style="font-family:var(--font-head);font-size:18px;margin-bottom:14px;">Popular Picks</h3></div>' +
      items.map(a => Components.AnimeCard(a)).join('')
    );
    Utils.initIcons();
  } catch (e) {}
}

function renderRecent() {
  const wrap = document.getElementById('recentPills');
  const items = Storage.get().recentSearches;
  if (!items.length) { wrap.innerHTML = ''; return; }
  wrap.innerHTML = '<span class="text-muted" style="font-size:12px;">Recent:</span>' +
    items.map(q => `<span class="recent-pill" data-q="${Utils.escapeHtml(q)}"><i data-lucide="clock" style="width:11px;height:11px;"></i>${Utils.escapeHtml(q)}</span>`).join('');
  wrap.querySelectorAll('.recent-pill').forEach(p => {
    p.onclick = () => {
      document.getElementById('searchInput').value = p.dataset.q;
      doSearch();
    };
  });
  Utils.initIcons();
}

function renderFilters() {
  document.getElementById('genreList').innerHTML = TOP_GENRES.map(g =>
    `<label class="check"><input type="checkbox" class="fGenre" value="${g.id}"/>${g.name}</label>`
  ).join('');
  const sc = document.getElementById('fScore');
  const scv = document.getElementById('scoreVal');
  scv.textContent = sc.value + '+';
  sc.oninput = () => { scv.textContent = sc.value + '+'; };

  // Auto-apply on change
  document.querySelectorAll('#searchSidebar select, #searchSidebar input').forEach(el => {
    el.addEventListener('change', () => doSearch());
  });
}
