/* ===== NamiTube — Common (Header, Drawer, Search, Profile, Toasts, Back-to-Top) ===== */

const FAVICON = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiHE6pMgjbJ6YDLaMAtDUZCs6Zhkvxl0_fQnb0c0ZCmJOYRB_4N8dQ0ZWosBq_sZPK2wFel2E43Z2meo25JL3i7IZYkJ35FZ7lZ_BZfwlWofAKGhF1gWpFsxofeGUr87Peu6s7xtgvJMnrbtNnd4vJPtB7uG3L_wJ9tT8PKRCh-PXSxlyY9Ufn8OAzDY_Y/s320/NamiTube%20Original%20Favicon.png';
const LOGO = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwxClcajSZy1q1gj_1kf_9y1J7mutn4jWfqdhlBVbFjLkViz_Z3-nuIZ11W0qOd1jlFgMFYi-g_XrpIiRbQjZd-wPwg4RWWyhbR0QLw0-ZgX5DFncVPNOxrDBouMlbdz2sLvQS65JbQaLJpQReWhjceG8Rn5cxrNusoQAXieXFcX_q_LZthCYS1AsCR30/s320/NamiTube%20Original%20banner.png';
const DISQUS_SHORTNAME = 'coolsanime';

const ALL_GENRES = [
  'Action','Adventure','Comedy','Drama','Ecchi','Fantasy','Horror',
  'Mahou Shoujo','Mecha','Music','Mystery','Psychological','Romance',
  'Sci-Fi','Slice of Life','Sports','Supernatural','Thriller'
];

document.addEventListener('DOMContentLoaded', () => {
  ensureUser();
  ensurePrefs();
  initHeader();
  initDrawer();
  initSearchOverlay();
  initProfileDropdown();
  initBackToTop();
  initSurpriseMe();
  markActiveNav();
});

/* ---------- HEADER ---------- */
function initHeader() {
  // Already in HTML — just wire events
}

/* ---------- DRAWER ---------- */
function initDrawer() {
  const overlay = document.getElementById('drawerOverlay');
  const drawer = document.getElementById('drawer');
  const openBtn = document.getElementById('menuBtn');
  const closeBtn = document.getElementById('drawerClose');

  if (!overlay || !drawer || !openBtn) return;

  function open() { overlay.classList.add('open'); drawer.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { overlay.classList.remove('open'); drawer.classList.remove('open'); document.body.style.overflow = ''; }

  openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Genre accordion
  const genreBtn = document.getElementById('genreAccordionBtn');
  const genreList = document.getElementById('genreAccordionList');
  if (genreBtn && genreList) {
    // Populate genres
    genreList.innerHTML = ALL_GENRES.map(g =>
      `<a href="genre.html?name=${encodeURIComponent(g)}">${g}</a>`
    ).join('');
    genreBtn.addEventListener('click', () => {
      genreBtn.classList.toggle('expanded');
      genreList.classList.toggle('expanded');
    });
  }

  // Random anime from drawer
  const randomLink = document.getElementById('drawerRandom');
  if (randomLink) {
    randomLink.addEventListener('click', async (e) => {
      e.preventDefault();
      close();
      triggerSurpriseMe();
    });
  }
}

/* ---------- SEARCH OVERLAY ---------- */
function initSearchOverlay() {
  const searchBtn = document.getElementById('searchBtn');
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchOverlayInput');
  const closeBtn = document.getElementById('searchOverlayClose');
  const resultsWrap = document.getElementById('searchOverlayResults');

  if (!searchBtn || !overlay) return;

  let debounceTimer;

  function open() { overlay.classList.add('active'); setTimeout(() => input?.focus(), 100); }
  function close() { overlay.classList.remove('active'); if (input) input.value = ''; if (resultsWrap) { resultsWrap.innerHTML = ''; resultsWrap.classList.remove('has-results'); } }

  searchBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('active')) close(); });

  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && input.value.trim()) {
        window.location.href = `search.html?q=${encodeURIComponent(input.value.trim())}`;
      }
    });
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const q = input.value.trim();
      if (q.length < 2) { if (resultsWrap) { resultsWrap.innerHTML = ''; resultsWrap.classList.remove('has-results'); } return; }
      debounceTimer = setTimeout(async () => {
        try {
          const data = await fetchSearch(q, 1, 6);
          if (!data?.Page?.media?.length) { resultsWrap.innerHTML = ''; resultsWrap.classList.remove('has-results'); return; }
          resultsWrap.innerHTML = data.Page.media.map(m => `
            <a href="anime.html?id=${m.id}" class="search-result-item">
              <img src="${m.coverImage?.large || 'assets/img/placeholder-cover.svg'}" alt="${getTitle(m)}" onerror="imgError(this)">
              <div>
                <div class="sr-title">${getTitle(m)}</div>
                <div class="sr-meta">${formatEpisodeLabel(m)}</div>
              </div>
            </a>
          `).join('') + `<a href="search.html?q=${encodeURIComponent(q)}" class="search-result-all">All results for "${q}"</a>`;
          resultsWrap.classList.add('has-results');
        } catch { /* ignore */ }
      }, 300);
    });
  }
}

/* ---------- PROFILE DROPDOWN ---------- */
function initProfileDropdown() {
  const avatar = document.getElementById('profileAvatar');
  const dropdown = document.getElementById('profileDropdown');
  if (!avatar || !dropdown) return;

  const user = ensureUser();
  // Set avatar
  const avatarInner = avatar;
  if (user.avatar) {
    avatarInner.innerHTML = `<img src="${user.avatar}" alt="${user.displayName}" onerror="this.style.display='none';this.parentElement.textContent='${(user.displayName || 'A')[0].toUpperCase()}'">`;
  } else {
    avatarInner.textContent = (user.displayName || 'A')[0].toUpperCase();
  }

  avatar.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });
  document.addEventListener('click', () => dropdown.classList.remove('open'));
  dropdown.addEventListener('click', e => e.stopPropagation());
}

/* ---------- ACTIVE NAV ---------- */
function markActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;

  // Drawer links
  document.querySelectorAll('.drawer-link[data-nav]').forEach(link => {
    if (link.dataset.nav === page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  // Footer links
  document.querySelectorAll('.footer-link[data-nav]').forEach(link => {
    if (link.dataset.nav === page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

/* ---------- TOASTS ---------- */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const iconMap = { success: ICONS.check, error: ICONS.x, info: ICONS.info };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${iconMap[type] || iconMap.info}<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

/* ---------- MODAL ---------- */
function showModal(title, message, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel') {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="modal-actions">
        <button class="btn btn-outline modal-cancel">${cancelText}</button>
        <button class="btn btn-primary modal-confirm">${confirmText}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));

  const close = () => { overlay.classList.remove('open'); setTimeout(() => overlay.remove(), 300); };
  overlay.querySelector('.modal-cancel').addEventListener('click', close);
  overlay.querySelector('.modal-confirm').addEventListener('click', () => { onConfirm(); close(); });
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });

  // Focus trap
  const modal = overlay.querySelector('.modal');
  const focusable = modal.querySelectorAll('button');
  if (focusable.length) focusable[0].focus();
}

/* ---------- BACK TO TOP ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- SURPRISE ME ---------- */
function initSurpriseMe() {
  const btn = document.getElementById('surpriseBtn');
  if (!btn) return;
  btn.addEventListener('click', () => triggerSurpriseMe(btn));
}

async function triggerSurpriseMe(btn) {
  if (btn) { btn.classList.add('spin'); setTimeout(() => btn.classList.remove('spin'), 600); }
  try {
    const id = await fetchRandomAnime();
    if (id) window.location.href = `anime.html?id=${id}`;
  } catch {
    showToast('Could not fetch a random anime. Try again!', 'error');
  }
}

/* ---------- DISQUS ---------- */
function loadDisqus(identifier, url) {
  window.disqus_config = function () {
    this.page.url = url;
    this.page.identifier = identifier;
  };
  if (window.DISQUS) {
    window.DISQUS.reset({ reload: true, config: window.disqus_config });
  } else {
    const s = document.createElement('script');
    s.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
    s.setAttribute('data-timestamp', String(+new Date()));
    (document.head || document.body).appendChild(s);
  }
}

/* ---------- Seasonal countdown helper ---------- */
function getNextSeasonDate() {
  const now = new Date();
  const year = now.getFullYear();
  const quarters = [
    new Date(year, 0, 1),
    new Date(year, 3, 1),
    new Date(year, 6, 1),
    new Date(year, 9, 1),
    new Date(year + 1, 0, 1),
  ];
  for (const d of quarters) {
    if (d > now) return d;
  }
  return new Date(year + 1, 0, 1);
}

function formatCountdown(target) {
  const diff = target - Date.now();
  if (diff <= 0) return '00:00:00:00';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (window.innerWidth < 480) return `${d}d ${h}h`;
  return `${String(d).padStart(2,'0')}:${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
