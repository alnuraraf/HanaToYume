function SkeletonCard(size = 'md') {
  return `
    <div class="skeleton-card skeleton-${size}">
      <div class="skeleton-img shimmer"></div>
      <div class="skeleton-lines">
        <div class="skeleton-line shimmer"></div>
        <div class="skeleton-line shimmer short"></div>
      </div>
    </div>
  `;
}

function SkeletonGrid(count = 6, size = 'md') {
  return Array(count).fill(0).map(() => SkeletonCard(size)).join('');
}

function Toast(message, type = 'info', duration = 3000) {
  let container = $('#toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type} reveal`;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('revealed'));
  setTimeout(() => {
    toast.classList.remove('revealed');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function Modal(title, content, actions = []) {
  const existing = $('#modal-overlay');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3>${escapeHtml(title)}</h3>
        <button class="modal-close" aria-label="Close"><i data-lucide="x"></i></button>
      </div>
      <div class="modal-body">${content}</div>
      <div class="modal-footer">
        ${actions.map(a => `<button class="btn ${a.class||''}" data-action="${a.action||''}">${escapeHtml(a.label)}</button>`).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  if (window.lucide) lucide.createIcons({ nodes: overlay.querySelectorAll('[data-lucide]') });
  overlay.querySelector('.modal-close').onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.addEventListener('keydown', (e) => { if (e.key === 'Escape') overlay.remove(); });
  const focusable = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) focusable[0].focus();
}

function AnimeCard(anime, options = {}) {
  const { size = 'md', showProgress = false, showActions = true } = options;
  const malId = anime.mal_id || anime.idMal || anime.id;
  const title = anime.title_english || anime.title || anime.title_romaji || 'Unknown';
  const poster = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || anime.coverImage?.large || anime.coverImage?.medium || '';
  const score = anime.score || anime.averageScore || 0;
  const type = anime.type || anime.format || 'TV';
  const episodes = anime.episodes || 0;
  const synopsis = anime.synopsis || anime.description || '';
  const shortSynopsis = synopsis ? synopsis.substring(0, 120) + '...' : '';

  const scoreBadge = score ? `<span class="score-badge"><i data-lucide="star" class="icon-sm"></i>${typeof score === 'number' ? score.toFixed(1) : score}</span>` : '';
  const typeBadge = `<span class="type-badge">${type}</span>`;
  const epBadge = episodes ? `<span class="ep-badge">${episodes} EPS</span>` : '';
  const progressHtml = showProgress && anime.watchedEpisodes ? `<div class="card-progress"><div class="progress-bar"><div class="progress-fill" style="width:${(anime.watchedEpisodes/anime.totalEpisodes)*100}%"></div></div></div>` : '';
  const actionsHtml = showActions ? `<button class="card-action-btn bookmark-btn" data-mal="${malId}" data-title="${escapeHtml(title)}" data-poster="${anime.images?.jpg?.image_url || ''}" data-score="${score}" title="Add to Watchlist" aria-label="Add to watchlist"><i data-lucide="bookmark-plus"></i></button>` : '';

  return `
    <article class="anime-card anime-card-${size} reveal" data-mal="${malId}">
      <a href="anime.html?id=${malId}" class="card-link">
        <div class="card-image-wrap">
          <img data-src="${poster}" alt="${escapeHtml(title)} poster" class="card-image" loading="lazy">
          <div class="card-overlay">
            <span class="watch-btn"><i data-lucide="play-circle"></i> Watch Now</span>
            <p class="card-synopsis">${escapeHtml(shortSynopsis)}</p>
          </div>
          <div class="card-badges">${scoreBadge}${typeBadge}${epBadge}</div>
          ${actionsHtml}
        </div>
        <div class="card-info">
          <h3 class="card-title">${escapeHtml(title)}</h3>
          ${progressHtml}
        </div>
      </a>
    </article>
  `;
}

function EpisodeStrip(episodes, currentEp = 1, malId = 0, lang = 'sub') {
  if (!episodes || !episodes.length) return '';
  return `
    <div class="episode-strip">
      <button class="strip-arrow strip-prev" aria-label="Previous episodes"><i data-lucide="chevron-left"></i></button>
      <div class="strip-scroll">
        ${episodes.map(ep => {
          const epNum = ep.mal_id || ep.number || ep.episode || 1;
          return `
            <a href="watch.html?id=${malId}&ep=${epNum}&lang=${lang}"
               class="episode-thumb ${epNum == currentEp ? 'current' : ''}"
               data-ep="${epNum}">
              <div class="ep-thumb-img-wrap">
                <img data-src="${ep.images?.jpg?.image_url || ''}" alt="Episode ${epNum}" loading="lazy">
                <span class="ep-num">${epNum}</span>
              </div>
              <span class="ep-title">${escapeHtml(ep.title || `Episode ${epNum}`)}</span>
            </a>
          `;
        }).join('')}
      </div>
      <button class="strip-arrow strip-next" aria-label="Next episodes"><i data-lucide="chevron-right"></i></button>
    </div>
  `;
}

function RatingStars(malId, currentValue = 0) {
  let html = `<div class="rating-stars" data-mal="${malId}" role="radiogroup" aria-label="Rate anime">`;
  for (let i = 1; i <= 10; i++) {
    html += `<button class="star-btn ${i <= currentValue ? 'active' : ''}" data-value="${i}" aria-label="${i} stars" tabindex="0"><i data-lucide="star"></i></button>`;
  }
  html += `</div>`;
  return html;
}

function GenreTag(name, href = '') {
  const url = href || `search.html?genre=${encodeURIComponent(name)}`;
  return `<a href="${url}" class="genre-tag">${escapeHtml(name)}</a>`;
}

function ProgressBar(value, max, label = '') {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return `
    <div class="progress-wrapper">
      ${label ? `<span class="progress-label">${escapeHtml(label)}</span>` : ''}
      <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
      <span class="progress-text">${value}/${max}</span>
    </div>
  `;
}

function CountdownTimer(targetTimestamp, containerId) {
  const el = document.getElementById(containerId);
  if (!el || !targetTimestamp) return;
  function update() {
    const diff = targetTimestamp - Math.floor(Date.now() / 1000);
    if (diff <= 0) { el.textContent = 'Airing now!'; return; }
    const d = Math.floor(diff / 86400);
    const h = Math.floor((diff % 86400) / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    el.textContent = `${d}d ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  }
  update();
  return setInterval(update, 1000);
}

function renderHeader(currentPage = '') {
  const header = document.getElementById('header-root');
  if (!header) return;
  const profile = getProfile();
  const avatarSrc = profile.avatarBase64 || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=6c63ff&color=fff&size=128`;

  header.innerHTML = `
    <a href="#main" class="skip-link">Skip to main content</a>
    <header class="site-header" role="banner">
      <div class="header-inner container">
        <a href="index.html" class="logo">
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwxClcajSZy1q1gj_1kf_9y1J7mutn4jWfqdhlBVbFjLkViz_Z3-nuIZ11W0qOd1jlFgMFYi-g_XrpIiRbQjZd-wPwg4RWWyhbR0QLw0-ZgX5DFncVPNOxrDBouMlbdz2sLvQS65JbQaLJpQReWhjceG8Rn5cxrNusoQAXieXFcX_q_LZthCYS1AsCR30/s320/NamiTube%20Original%20banner.png" alt="NamiTube" height="36">
        </a>
        <nav class="main-nav" role="navigation" aria-label="Main">
          <a href="home.html" class="${currentPage==='home'?'active':''}">Home</a>
          <a href="schedule.html" class="${currentPage==='schedule'?'active':''}">Schedule</a>
          <a href="library.html" class="${currentPage==='library'?'active':''}">Library</a>
          <a href="search.html" class="${currentPage==='search'?'active':''}">Search</a>
          <a href="donate.html" class="${currentPage==='donate'?'active':''}">Donate</a>
        </nav>
        <div class="header-actions">
          <button class="icon-btn search-toggle" aria-label="Search"><i data-lucide="search"></i></button>
          <div class="profile-dropdown-wrap">
            <button class="avatar-btn" aria-label="Profile menu" aria-haspopup="true">
              <img src="${avatarSrc}" alt="Profile" class="avatar-img" id="header-avatar">
            </button>
            <div class="profile-dropdown" role="menu">
              <a href="profile.html" role="menuitem">View Profile</a>
              <a href="library.html" role="menuitem">Library</a>
              <a href="library.html?tab=history" role="menuitem">Watch History</a>
              <a href="library.html?tab=favorites" role="menuitem">Favorites</a>
              <a href="profile.html" role="menuitem">Settings</a>
            </div>
          </div>
          <button class="icon-btn mobile-menu-toggle" aria-label="Menu"><i data-lucide="menu"></i></button>
        </div>
      </div>
      <div class="search-overlay">
        <div class="search-overlay-inner container">
          <i data-lucide="search" class="overlay-search-icon"></i>
          <input type="text" class="overlay-search-input" placeholder="Search anime..." autocomplete="off" aria-label="Search">
          <button class="icon-btn search-close" aria-label="Close search"><i data-lucide="x"></i></button>
          <div class="search-suggestions-list"></div>
        </div>
      </div>
      <div class="mobile-menu">
        <div class="mobile-menu-header">
          <span class="mobile-menu-title">Menu</span>
          <button class="icon-btn mobile-menu-close" aria-label="Close menu"><i data-lucide="x"></i></button>
        </div>
        <nav class="mobile-menu-nav">
          <a href="home.html">Home</a>
          <a href="schedule.html">Schedule</a>
          <a href="library.html">Library</a>
          <a href="search.html">Search</a>
          <a href="donate.html">Donate</a>
          <hr>
          <a href="profile.html">Profile</a>
        </nav>
      </div>
    </header>
  `;

  if (window.lucide) lucide.createIcons({ nodes: header.querySelectorAll('[data-lucide]') });

  const searchToggle = header.querySelector('.search-toggle');
  const searchOverlay = header.querySelector('.search-overlay');
  const searchClose = header.querySelector('.search-close');
  const searchInput = header.querySelector('.overlay-search-input');
  const suggestionsList = header.querySelector('.search-suggestions-list');

  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      setTimeout(() => searchInput.focus(), 100);
    });
  }
  if (searchClose) {
    searchClose.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
      suggestionsList.innerHTML = '';
    });
  }

  let searchDebounce;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      const q = e.target.value.trim();
      if (!q) { suggestionsList.innerHTML = ''; return; }
      searchDebounce = setTimeout(async () => {
        try {
          const res = await Jikan.search(q, 1, '&limit=5');
          if (!res.data || !res.data.length) { suggestionsList.innerHTML = ''; return; }
          suggestionsList.innerHTML = res.data.map(a => `
            <a href="anime.html?id=${a.mal_id}" class="suggestion-item">
              <img src="${a.images?.jpg?.image_url || ''}" alt="" loading="lazy">
              <div class="suggestion-info">
                <span class="suggestion-title">${escapeHtml(a.title_english || a.title)}</span>
                <span class="suggestion-meta">${a.type || 'TV'} &bull; ${a.score || 'N/A'}</span>
              </div>
            </a>
          `).join('');
        } catch (err) { console.error(err); }
      }, 300);
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim();
        if (q) window.location.href = `search.html?q=${encodeURIComponent(q)}`;
      }
    });
  }

  const mobileToggle = header.querySelector('.mobile-menu-toggle');
  const mobileMenu = header.querySelector('.mobile-menu');
  const mobileClose = header.querySelector('.mobile-menu-close');
  if (mobileToggle) mobileToggle.addEventListener('click', () => mobileMenu.classList.add('active'));
  if (mobileClose) mobileClose.addEventListener('click', () => mobileMenu.classList.remove('active'));

  const avatarBtn = header.querySelector('.avatar-btn');
  const dropdown = header.querySelector('.profile-dropdown');
  if (avatarBtn && dropdown) {
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });
    document.addEventListener('click', () => dropdown.classList.remove('active'));
  }
}

function renderFooter() {
  const footer = document.getElementById('footer-root');
  if (!footer) return;
  footer.innerHTML = `
    <footer class="site-footer" role="contentinfo">
      <div class="container footer-inner">
        <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwxClcajSZy1q1gj_1kf_9y1J7mutn4jWfqdhlBVbFjLkViz_Z3-nuIZ11W0qOd1jlFgMFYi-g_XrpIiRbQjZd-wPwg4RWWyhbR0QLw0-ZgX5DFncVPNOxrDBouMlbdz2sLvQS65JbQaLJpQReWhjceG8Rn5cxrNusoQAXieXFcX_q_LZthCYS1AsCR30/s320/NamiTube%20Original%20banner.png" alt="NamiTube" class="footer-logo" width="160">
        <p class="footer-tagline">Your premium destination for anime streaming.</p>
        <div class="social-links">
          <a href="#" aria-label="Discord"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg></a>
          <a href="#" aria-label="Twitter / X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
          <a href="#" aria-label="Reddit"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l3.05.645a1.25 1.25 0 0 1 1.112-1.147zM9.352 14.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm5.296 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/></svg></a>
          <a href="#" aria-label="Telegram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></a>
          <a href="#" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></a>
        </div>
        <div class="footer-divider"></div>
        <p class="footer-disclaimer">This site does not store any files on its server. All contents are provided by non-affiliated third parties.</p>
        <p class="footer-copyright">&copy; 2025 NamiTube. All rights reserved. Not affiliated with MyAnimeList or AniList.</p>
      </div>
    </footer>
  `;
}

function initScrollProgress() {
  let bar = $('#scroll-progress');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.appendChild(bar);
  }
  window.addEventListener('scroll', throttle(() => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = `${Math.min(100, pct)}%`;
  }, 50));
}

function initCommon(page = '') {
  renderHeader(page);
  renderFooter();
  setupReveal();
  setupLazyImages();
  initScrollProgress();

  document.addEventListener('click', (e) => {
    const bookmark = e.target.closest('.bookmark-btn, .watchlist-add');
    if (bookmark) {
      const malId = Number(bookmark.dataset.mal);
      const title = bookmark.dataset.title || 'Anime';
      const poster = bookmark.dataset.poster || '';
      const score = Number(bookmark.dataset.score) || 0;
      const added = addToWatchlist(malId, title, poster, score);
      Toast(added ? 'Added to watchlist' : 'Already in watchlist', added ? 'success' : 'info');
      e.preventDefault();
    }
  });
}

window.initCommon = initCommon;