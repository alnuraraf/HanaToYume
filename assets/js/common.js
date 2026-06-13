/* ============================================
   NamiTube — Common Chrome (Header, Drawer, Footer, Toast, etc.)
   ============================================ */

const FAVICON_URL = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiHE6pMgjbJ6YDLaMAtDUZCs6Zhkvxl0_fQnb0c0ZCmJOYRB_4N8dQ0ZWosBq_sZPK2wFel2E43Z2meo25JL3i7IZYkJ35FZ7lZ_BZfwlWofAKGhF1gWpFsxofeGUr87Peu6s7xtgvJMnrbtNnd4vJPtB7uG3L_wJ9tT8PKRCh-PXSxlyY9Ufn8OAzDY_Y/s320/NamiTube%20Original%20Favicon.png';
const LOGO_URL = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwxClcajSZy1q1gj_1kf_9y1J7mutn4jWfqdhlBVbFjLkViz_Z3-nuIZ11W0qOd1jlFgMFYi-g_XrpIiRbQjZd-wPwg4RWWyhbR0QLw0-ZgX5DFncVPNOxrDBouMlbdz2sLvQS65JbQaLJpQReWhjceG8Rn5cxrNusoQAXieXFcX_q_LZthCYS1AsCR30/s320/NamiTube%20Original%20banner.png';

const ALL_GENRES = [
  'Action','Adventure','Comedy','Drama','Ecchi','Fantasy','Horror',
  'Mahou Shoujo','Mecha','Music','Mystery','Psychological','Romance',
  'Sci-Fi','Slice of Life','Sports','Supernatural','Thriller'
];

const PAGE_ID = document.body.getAttribute('data-page') || '';

/* --- Initialize User --- */
ensureUser();

/* === HEADER === */
(function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const user = getUser();
  const avatarContent = user && user.avatar
    ? `<img src="${user.avatar}" alt="Profile" onerror="onImgError(this)">`
    : (user ? user.displayName.charAt(0).toUpperCase() : 'A');

  header.innerHTML = `
    <div class="header-left">
      <button class="header-btn" id="menuBtn" aria-label="Open menu">${ICONS.menu}</button>
      <a href="index.html" class="logo-link"><img src="${LOGO_URL}" alt="NamiTube"></a>
    </div>
    <div class="header-right">
      <button class="header-btn" id="searchBtn" aria-label="Search">${ICONS.search}</button>
      <button class="profile-btn" id="profileBtn" aria-label="Profile menu">${avatarContent}</button>
    </div>
  `;

  /* Profile Dropdown */
  const dropdown = document.createElement('div');
  dropdown.className = 'profile-dropdown';
  dropdown.id = 'profileDropdown';
  dropdown.innerHTML = `
    <a href="profile.html">${ICONS.user} Profile</a>
    <a href="history.html">${ICONS.clock} Watch History</a>
    <a href="watchlist.html">${ICONS.bookmark} Watchlist</a>
    <a href="favorites.html">${ICONS.heart} Favorites</a>
    <a href="settings.html">${ICONS.settings} Settings</a>
    <div class="divider"></div>
    <a href="support.html">${ICONS.heart} Support NamiTube</a>
  `;
  header.appendChild(dropdown);

  document.getElementById('profileBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });
  document.addEventListener('click', () => dropdown.classList.remove('open'));

  /* Search Overlay */
  const searchOverlay = document.createElement('div');
  searchOverlay.className = 'search-overlay';
  searchOverlay.id = 'searchOverlay';
  searchOverlay.innerHTML = `
    <button class="header-btn close-search" aria-label="Close search">${ICONS.x}</button>
    <input type="search" id="headerSearchInput" placeholder="Search anime..." autocomplete="off" aria-label="Search anime">
  `;
  document.body.appendChild(searchOverlay);

  const liveResults = document.createElement('div');
  liveResults.className = 'search-live-results';
  liveResults.id = 'liveResults';
  document.body.appendChild(liveResults);

  document.getElementById('searchBtn').addEventListener('click', () => {
    searchOverlay.classList.add('open');
    setTimeout(() => document.getElementById('headerSearchInput').focus(), 100);
  });
  searchOverlay.querySelector('.close-search').addEventListener('click', () => {
    searchOverlay.classList.remove('open');
    liveResults.classList.remove('open');
  });

  let searchDebounce;
  document.getElementById('headerSearchInput').addEventListener('input', (e) => {
    clearTimeout(searchDebounce);
    const q = e.target.value.trim();
    if (!q) { liveResults.classList.remove('open'); return; }
    searchDebounce = setTimeout(async () => {
      try {
        const data = await searchAnime({ search: q, page: 1, perPage: 6 });
        if (data && data.Page && data.Page.media.length) {
          liveResults.innerHTML = data.Page.media.map(m => `
            <a href="anime.html?id=${m.id}" class="search-live-item">
              <img src="${getCover(m)}" alt="${getTitle(m)}" loading="lazy" onerror="onImgError(this)">
              <div class="sli-info">
                <div class="sli-title">${getTitle(m)}</div>
                <div class="sli-meta">${formatFormat(m.format) || ''} ${m.averageScore ? '· ' + formatScore(m.averageScore) : ''}</div>
              </div>
            </a>
          `).join('') + `<a href="search.html?q=${encodeURIComponent(q)}" class="search-all-link">All results for "${q}"</a>`;
          liveResults.classList.add('open');
        } else {
          liveResults.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted)">No results found</div>`;
          liveResults.classList.add('open');
        }
      } catch { liveResults.classList.remove('open'); }
    }, 300);
  });

  document.getElementById('headerSearchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      if (q) window.location.href = `search.html?q=${encodeURIComponent(q)}`;
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchOverlay.classList.remove('open');
      liveResults.classList.remove('open');
    }
  });
})();

/* === NAVIGATION DRAWER === */
(function initDrawer() {
  const overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  overlay.id = 'drawerOverlay';

  const drawer = document.createElement('nav');
  drawer.className = 'nav-drawer';
  drawer.id = 'navDrawer';
  drawer.setAttribute('role', 'navigation');
  drawer.setAttribute('aria-label', 'Main navigation');

  const genreLinks = ALL_GENRES.map(g => `<a href="genre.html?name=${encodeURIComponent(g)}">${g}</a>`).join('');

  drawer.innerHTML = `
    <div class="drawer-header">
      <img src="${LOGO_URL}" alt="NamiTube">
      <button class="drawer-close" id="drawerClose" aria-label="Close menu">${ICONS.x}</button>
    </div>
    <div class="drawer-nav">
      <a href="index.html" class="drawer-link" data-nav="home">${ICONS.house} Home</a>
      <a href="search.html" class="drawer-link" data-nav="search">${ICONS.search} Search</a>
      <a href="catalog.html?view=trending" class="drawer-link" data-nav="trending">${ICONS.trendingUp} New & Trending</a>
      <a href="schedule.html" class="drawer-link" data-nav="schedule">${ICONS.calendarDays} Schedule</a>
      <a href="catalog.html?view=movies" class="drawer-link" data-nav="movies">${ICONS.film} Movies</a>
      <a href="catalog.html?view=tv" class="drawer-link" data-nav="tv">${ICONS.monitorPlay} TV Shows</a>
      <a href="catalog.html?view=ova" class="drawer-link" data-nav="ova">${ICONS.sparkles} OVAs & Specials</a>
      <a href="catalog.html?view=top-rated" class="drawer-link" data-nav="top-rated">${ICONS.award} Top Rated</a>
      <a href="catalog.html?view=popular" class="drawer-link" data-nav="popular">${ICONS.flame} Popular</a>
      <button class="drawer-accordion-btn" id="genreAccordion">
        ${ICONS.tags} Genres
        <span class="chevron">${ICONS.chevronDown}</span>
      </button>
      <div class="drawer-genre-list" id="genreList">${genreLinks}</div>
      <button class="drawer-link" id="drawerRandom">${ICONS.shuffle} Random Anime</button>
      <div class="drawer-divider"></div>
      <a href="support.html" class="drawer-link" data-nav="support">${ICONS.heart} Support NamiTube</a>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  /* Active page */
  const navMap = {
    home: 'home', search: 'search', schedule: 'schedule', support: 'support'
  };
  const viewParam = new URLSearchParams(window.location.search).get('view');
  drawer.querySelectorAll('.drawer-link[data-nav]').forEach(link => {
    const nav = link.getAttribute('data-nav');
    let match = false;
    if (navMap[nav] && PAGE_ID === navMap[nav]) match = true;
    if (PAGE_ID === 'catalog' && viewParam === nav) match = true;
    if (match) link.setAttribute('aria-current', 'page');
  });

  /* Drawer open/close */
  function openDrawer() { overlay.classList.add('open'); drawer.classList.add('open'); }
  function closeDrawer() { overlay.classList.remove('open'); drawer.classList.remove('open'); }
  document.getElementById('menuBtn').addEventListener('click', openDrawer);
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

  /* Genre accordion */
  document.getElementById('genreAccordion').addEventListener('click', function() {
    this.classList.toggle('expanded');
    document.getElementById('genreList').classList.toggle('expanded');
  });

  /* Random Anime */
  document.getElementById('drawerRandom').addEventListener('click', async () => {
    closeDrawer();
    triggerSurpriseMe();
  });
})();

/* === FOOTER === */
(function initFooter() {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="${LOGO_URL}" alt="NamiTube" class="footer-logo">
        <p>Watch anime free online. No sign-up, no ads, no hassle.</p>
        <div class="footer-socials">
          <a href="#" aria-label="Twitter">${ICONS.twitter}</a>
          <a href="#" aria-label="GitHub">${ICONS.github}</a>
          <a href="#" aria-label="Discord">${ICONS.discord}</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Explore</h4>
        <a href="index.html">Home</a>
        <a href="catalog.html?view=trending">New & Trending</a>
        <a href="schedule.html">Schedule</a>
        <a href="catalog.html?view=top-rated">Top Rated</a>
      </div>
      <div class="footer-col">
        <h4>Genres</h4>
        <a href="genre.html?name=Action">Action</a>
        <a href="genre.html?name=Romance">Romance</a>
        <a href="genre.html?name=Comedy">Comedy</a>
        <a href="genre.html?name=Fantasy">Fantasy</a>
        <a href="genre.html?name=Sci-Fi">Sci-Fi</a>
        <a href="genre.html?name=Drama">Drama</a>
        <a href="index.html#by-genre">All Genres</a>
      </div>
      <div class="footer-col">
        <h4>Account</h4>
        <a href="profile.html">Profile</a>
        <a href="history.html">Watch History</a>
        <a href="watchlist.html">Watchlist</a>
        <a href="favorites.html">Favorites</a>
        <a href="settings.html">Settings</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 NamiTube. All rights reserved.</span>
      <a href="support.html">Support NamiTube</a>
    </div>
  `;
})();

/* === TOAST SYSTEM === */
(function initToasts() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  container.id = 'toastContainer';
  document.body.appendChild(container);
})();

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icon = type === 'success' ? ICONS.check : type === 'error' ? ICONS.alertCircle : ICONS.info;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${icon}<span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* === BACK TO TOP === */
(function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.id = 'backToTop';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = ICONS.arrowUp;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* === SURPRISE ME BUTTON === */
(function initSurpriseMe() {
  const btn = document.createElement('button');
  btn.className = 'surprise-btn';
  btn.id = 'surpriseBtn';
  btn.setAttribute('aria-label', 'Surprise me with a random anime');
  btn.innerHTML = ICONS.shuffle;
  document.body.appendChild(btn);
  btn.addEventListener('click', triggerSurpriseMe);
})();

async function triggerSurpriseMe() {
  const btn = document.getElementById('surpriseBtn');
  if (btn) btn.classList.add('spinning');
  try {
    const id = await fetchRandomAnime();
    window.location.href = `anime.html?id=${id}`;
  } catch {
    showToast('Failed to fetch random anime. Try again!', 'error');
    if (btn) btn.classList.remove('spinning');
  }
}

/* === MODAL SYSTEM === */
function showModal(title, message, confirmText, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-card">
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="modal-actions">
        <button class="btn-cancel" id="modalCancel">Cancel</button>
        <button class="btn-danger" id="modalConfirm">${confirmText}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));

  function close() {
    overlay.classList.remove('open');
    setTimeout(() => overlay.remove(), 250);
  }

  overlay.querySelector('#modalCancel').addEventListener('click', close);
  overlay.querySelector('#modalConfirm').addEventListener('click', () => {
    onConfirm();
    close();
  });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', handler); }
  });

  /* Focus trap */
  const focusable = overlay.querySelectorAll('button');
  if (focusable.length) focusable[0].focus();
}
