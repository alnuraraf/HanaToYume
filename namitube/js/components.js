/* components.js — reusable renderers */
const Components = (() => {

  const FAVICON = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiHE6pMgjbJ6YDLaMAtDUZCs6Zhkvxl0_fQnb0c0ZCmJOYRB_4N8dQ0ZWosBq_sZPK2wFel2E43Z2meo25JL3i7IZYkJ35FZ7lZ_BZfwlWofAKGhF1gWpFsxofeGUr87Peu6s7xtgvJMnrbtNnd4vJPtB7uG3L_wJ9tT8PKRCh-PXSxlyY9Ufn8OAzDY_Y/s320/NamiTube%20Original%20Favicon.png';
  const BANNER = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwxClcajSZy1q1gj_1kf_9y1J7mutn4jWfqdhlBVbFjLkViz_Z3-nuIZ11W0qOd1jlFgMFYi-g_XrpIiRbQjZd-wPwg4RWWyhbR0QLw0-ZgX5DFncVPNOxrDBouMlbdz2sLvQS65JbQaLJpQReWhjceG8Rn5cxrNusoQAXieXFcX_q_LZthCYS1AsCR30/s320/NamiTube%20Original%20banner.png';

  // ---------- HEADER ----------
  const renderHeader = () => {
    const p = Storage.get();
    const avatarHtml = p.avatarBase64
      ? `<img src="${p.avatarBase64}" alt="Profile avatar"/>`
      : p.displayName.charAt(0).toUpperCase();

    return `
    <header class="site-header" role="banner">
      <div class="header-inner">
        <button class="icon-btn hamburger" id="hamburgerBtn" aria-label="Open menu">
          <i data-lucide="menu"></i>
        </button>
        <a href="home.html" class="header-logo" aria-label="NamiTube home">
          <img src="${BANNER}" alt="NamiTube"/>
        </a>
        <nav class="header-nav" role="navigation" aria-label="Main">
          <a href="home.html" class="nav-link">Home</a>
          <a href="schedule.html" class="nav-link">Schedule</a>
          <a href="library.html" class="nav-link">Library</a>
          <a href="search.html" class="nav-link">Search</a>
          <a href="donate.html" class="nav-link">Donate</a>
        </nav>
        <div class="header-search" id="headerSearch">
          <i data-lucide="search" class="search-icon"></i>
          <input type="text" id="headerSearchInput" placeholder="Search anime..." aria-label="Search"/>
          <div class="search-suggestions" id="headerSuggestions"></div>
        </div>
        <div class="header-actions">
          <button class="icon-btn" id="mobileSearchBtn" aria-label="Search" style="display:none;">
            <i data-lucide="search"></i>
          </button>
          <div class="avatar-wrap">
            <button class="avatar-btn" id="avatarBtn" aria-label="Profile menu" aria-haspopup="true">${avatarHtml}</button>
            <div class="profile-dropdown" id="profileDropdown" role="menu">
              <div class="pd-header">
                <div class="pd-name">${Utils.escapeHtml(p.displayName)}</div>
                <div class="pd-sub">Member since ${new Date(p.joinDate).toLocaleDateString()}</div>
              </div>
              <a href="profile.html"><i data-lucide="user"></i>View Profile</a>
              <a href="library.html"><i data-lucide="bookmark"></i>Library</a>
              <a href="library.html#history"><i data-lucide="history"></i>Watch History</a>
              <a href="library.html#favorites"><i data-lucide="heart"></i>Favourites</a>
              <a href="profile.html#settings"><i data-lucide="settings"></i>Settings</a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="mobile-menu" id="mobileMenu" role="navigation" aria-label="Mobile">
      <div class="mobile-menu-header">
        <a href="home.html" class="header-logo"><img src="${BANNER}" alt="NamiTube"/></a>
        <button class="icon-btn" id="mobileMenuClose" aria-label="Close menu"><i data-lucide="x"></i></button>
      </div>
      <a href="home.html"><i data-lucide="home"></i>Home</a>
      <a href="schedule.html"><i data-lucide="calendar"></i>Schedule</a>
      <a href="library.html"><i data-lucide="bookmark"></i>Library</a>
      <a href="search.html"><i data-lucide="search"></i>Search</a>
      <a href="donate.html"><i data-lucide="heart"></i>Donate</a>
      <a href="profile.html"><i data-lucide="user"></i>Profile</a>
    </div>

    <div class="search-overlay" id="searchOverlay">
      <div class="search-overlay-bar">
        <input type="text" id="mobileSearchInput" placeholder="Search anime..." aria-label="Search"/>
        <button class="icon-btn" id="searchOverlayClose" aria-label="Close search"><i data-lucide="x"></i></button>
      </div>
      <div id="mobileSearchResults"></div>
    </div>
    `;
  };

  // ---------- FOOTER ----------
  const renderFooter = () => `
    <footer class="site-footer" role="contentinfo">
      <div class="footer-inner">
        <div class="footer-logo"><img src="${BANNER}" alt="NamiTube"/></div>
        <p class="footer-tagline">Your premium destination for anime streaming.</p>
        <div class="footer-social">
          <a href="#" aria-label="Discord">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.196.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.418 2.157-2.418 1.211 0 2.176 1.094 2.157 2.418 0 1.334-.956 2.419-2.157 2.419zm7.974 0c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.946 2.419-2.157 2.419z"/></svg>
          </a>
          <a href="#" aria-label="X / Twitter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="#" aria-label="Reddit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
          </a>
          <a href="#" aria-label="Telegram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.464.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          </a>
          <a href="#" aria-label="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          </a>
        </div>
        <div class="footer-divider"></div>
        <p class="footer-disclaimer">This site does not store any files on its server. All contents are provided by non‑affiliated third parties.</p>
        <p class="footer-copy">© 2025 NamiTube. All rights reserved. Not affiliated with MyAnimeList or AniList.</p>
      </div>
    </footer>
  `;

  // ---------- ANIME CARD ----------
  const AnimeCard = (anime, opts = {}) => {
    const {
      size = 'md',
      showProgress = false,
      showActions = true
    } = opts;

    const malId = anime.mal_id || anime.id || anime.malId;
    const title = (anime.title && anime.title.romaji) || anime.title_english || anime.title || anime.title_romaji || '';
    const poster = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url ||
                   anime.coverImage?.extraLarge || anime.coverImage?.large ||
                   anime.posterUrl || '';
    const score = anime.score || (anime.averageScore ? anime.averageScore / 10 : 0);
    const type = anime.type || anime.format || 'TV';
    const episodes = anime.episodes || anime.episode || '';
    const syn = Utils.stripHtml(anime.synopsis || anime.description || '');
    const inWl = Storage.inWatchlist(malId);

    return `
      <article class="anime-card" data-mal-id="${malId}" role="article">
        <a href="anime.html?id=${malId}" class="poster-wrap" aria-label="${Utils.escapeHtml(title)}">
          <img class="poster" loading="lazy" src="${poster}" alt="${Utils.escapeHtml(title)} poster"/>
          ${score ? `<div class="score-badge"><i data-lucide="star" style="width:11px;height:11px;"></i>${score.toFixed(1)}</div>` : ''}
          ${type ? `<div class="type-badge">${type}</div>` : ''}
          <div class="overlay">
            ${syn ? `<p class="overlay-syn">${Utils.escapeHtml(Utils.truncate(syn, 120))}</p>` : ''}
            <span class="btn btn-primary btn-sm" style="width:100%;justify-content:center;">
              <i data-lucide="play" style="width:14px;height:14px;"></i>Watch Now
            </span>
          </div>
        </a>
        ${showActions ? `<button class="bookmark-btn ${inWl ? 'active' : ''}" data-bookmark="${malId}" aria-label="Add to watchlist">
          <i data-lucide="bookmark" style="width:14px;height:14px;"></i>
        </button>` : ''}
        <div class="card-info">
          <a href="anime.html?id=${malId}" class="card-title">${Utils.escapeHtml(title)}</a>
          <div class="card-meta">
            ${episodes ? `<span>${episodes} eps</span>` : ''}
            ${anime.year ? `<span>· ${anime.year}</span>` : ''}
          </div>
          ${showProgress && opts.progress != null ? ProgressBar(opts.progress, opts.totalEpisodes || 1) : ''}
        </div>
      </article>
    `;
  };

  // ---------- HERO SPOTLIGHT ----------
  const HeroSpotlight = (anime) => {
    const title = anime.title?.english || anime.title?.romaji || anime.title || '';
    const banner = anime.bannerImage || anime.trailer?.images?.maximum_image_url || anime.images?.jpg?.large_image_url;
    const desc = Utils.stripHtml(anime.description || anime.synopsis || '');
    const score = anime.averageScore ? anime.averageScore / 10 : anime.score;
    const genres = (anime.genres || []).slice(0, 4).map(g => typeof g === 'string' ? g : g.name);
    const malId = anime.idMal || anime.mal_id;
    return `
      <div class="hero-spot" style="background-image:linear-gradient(180deg,rgba(10,10,15,0.3) 0%,rgba(10,10,15,0.9) 80%,var(--color-bg-primary) 100%),url('${banner}')">
        <div class="hero-spot-content">
          <h1 class="hero-spot-title">${Utils.escapeHtml(title)}</h1>
          <div class="hero-spot-meta">
            ${score ? `<span class="meta-pill"><i data-lucide="star" style="width:12px;height:12px;color:var(--color-gold);"></i>${score.toFixed(1)}</span>` : ''}
            ${genres.map(g => `<span class="tag tag-static">${Utils.escapeHtml(g)}</span>`).join('')}
          </div>
          <p class="hero-spot-desc">${Utils.escapeHtml(Utils.truncate(desc, 240))}</p>
          <div class="hero-spot-actions">
            <a href="watch.html?id=${malId}&ep=1&lang=sub" class="btn btn-primary btn-lg">
              <i data-lucide="play"></i>Watch Now
            </a>
            <a href="anime.html?id=${malId}" class="btn btn-secondary btn-lg">
              <i data-lucide="info"></i>More Info
            </a>
          </div>
        </div>
      </div>
    `;
  };

  // ---------- PROGRESS BAR ----------
  const ProgressBar = (value, max) => {
    const pct = Math.min(100, Math.round((value / max) * 100));
    return `<div class="progress-bar" role="progressbar" aria-valuenow="${value}" aria-valuemax="${max}">
      <div class="progress-fill" style="width:${pct}%"></div>
    </div>`;
  };

  // ---------- RATING STARS ----------
  const RatingStars = (value = 0, onChange) => {
    const id = 'stars-' + Math.random().toString(36).slice(2, 8);
    setTimeout(() => {
      const wrap = document.getElementById(id);
      if (!wrap) return;
      wrap.querySelectorAll('.star').forEach((s, i) => {
        s.addEventListener('click', () => {
          const v = i + 1;
          wrap.querySelectorAll('.star').forEach((st, idx) => st.classList.toggle('active', idx < v));
          if (onChange) onChange(v);
        });
      });
    }, 0);
    let html = `<div class="rating-stars" id="${id}" role="radiogroup" aria-label="Your rating">`;
    for (let i = 1; i <= 10; i++) {
      html += `<button class="star ${i <= value ? 'active' : ''}" data-v="${i}" aria-label="Rate ${i}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      </button>`;
    }
    html += '</div>';
    return html;
  };

  // ---------- GENRE TAG ----------
  const GenreTag = (name, href) => {
    return `<a href="${href || ('search.html?genre=' + encodeURIComponent(name))}" class="tag">${Utils.escapeHtml(name)}</a>`;
  };

  // ---------- COUNTDOWN ----------
  const CountdownTimer = (targetTs) => {
    const id = 'cdt-' + Math.random().toString(36).slice(2, 8);
    const update = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const diff = Math.max(0, targetTs - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      el.innerHTML = `
        <div class="cd-cell"><div class="cd-num">${d}</div><div class="cd-lbl">days</div></div>
        <div class="cd-cell"><div class="cd-num">${String(h).padStart(2,'0')}</div><div class="cd-lbl">hrs</div></div>
        <div class="cd-cell"><div class="cd-num">${String(m).padStart(2,'0')}</div><div class="cd-lbl">min</div></div>
        <div class="cd-cell"><div class="cd-num">${String(s).padStart(2,'0')}</div><div class="cd-lbl">sec</div></div>
      `;
    };
    setTimeout(() => { update(); setInterval(update, 1000); }, 0);
    return `<div class="countdown-timer" id="${id}"></div>`;
  };

  // ---------- TOAST ----------
  let toastStack;
  const Toast = (msg, type = 'info') => {
    if (!toastStack) {
      toastStack = document.createElement('div');
      toastStack.className = 'toast-stack';
      document.body.appendChild(toastStack);
    }
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : type === 'warning' ? 'alert-triangle' : 'info';
    t.innerHTML = `<i data-lucide="${icon}" style="width:16px;height:16px;flex-shrink:0;"></i><span>${Utils.escapeHtml(msg)}</span>`;
    toastStack.appendChild(t);
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => {
      t.classList.add('hide');
      setTimeout(() => t.remove(), 300);
    }, 3000);
  };

  // ---------- MODAL ----------
  const Modal = (title, contentHtml, actions = []) => {
    const back = document.createElement('div');
    back.className = 'modal-backdrop';
    back.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <h3 id="modalTitle">${Utils.escapeHtml(title)}</h3>
        <div class="modal-content">${contentHtml}</div>
        <div class="modal-actions"></div>
      </div>`;
    const close = () => back.remove();
    back.addEventListener('click', (e) => { if (e.target === back) close(); });
    document.addEventListener('keydown', function onKey(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } });
    const actBox = back.querySelector('.modal-actions');
    actions.forEach(a => {
      const b = document.createElement('button');
      b.className = `btn ${a.primary ? 'btn-primary' : 'btn-secondary'}`;
      b.textContent = a.label;
      b.onclick = () => { if (a.onClick) a.onClick(); close(); };
      actBox.appendChild(b);
    });
    if (!actions.length) {
      const b = document.createElement('button');
      b.className = 'btn btn-secondary'; b.textContent = 'Close'; b.onclick = close;
      actBox.appendChild(b);
    }
    document.body.appendChild(back);
    if (window.lucide) window.lucide.createIcons();
    return { close };
  };

  // ---------- EPISODE STRIP ----------
  const EpisodeStrip = (episodes, currentEp, onSelect) => {
    const wrap = document.createElement('div');
    wrap.className = 'ep-strip';
    episodes.forEach(ep => {
      const epNum = ep.mal_id || ep.number || ep.episode;
      const t = document.createElement('button');
      t.className = 'ep-strip-item' + (Number(epNum) === Number(currentEp) ? ' current' : '');
      t.innerHTML = `
        <div class="ep-strip-num">EP ${epNum}</div>
        <div class="ep-strip-title">${Utils.escapeHtml(ep.title || `Episode ${epNum}`)}</div>
      `;
      t.onclick = () => onSelect && onSelect(epNum);
      wrap.appendChild(t);
    });
    return wrap;
  };

  // ---------- INIT HEADER LOGIC ----------
  const initHeader = () => {
    const $ = Utils.qs;
    Utils.setActiveNav();

    const avatarBtn = $('#avatarBtn');
    const dropdown = $('#profileDropdown');
    if (avatarBtn && dropdown) {
      avatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== avatarBtn) dropdown.classList.remove('open');
      });
    }

    // Mobile menu
    const ham = $('#hamburgerBtn');
    const menu = $('#mobileMenu');
    const close = $('#mobileMenuClose');
    if (ham && menu) {
      ham.addEventListener('click', () => menu.classList.add('open'));
      close.addEventListener('click', () => menu.classList.remove('open'));
    }

    // Mobile search overlay
    const showMobSearch = () => $('#searchOverlay').classList.add('open');
    if (window.matchMedia('(max-width: 900px)').matches) {
      const msb = $('#mobileSearchBtn');
      if (msb) { msb.style.display = 'inline-flex'; msb.addEventListener('click', showMobSearch); }
    }
    const so = $('#searchOverlay');
    const soClose = $('#searchOverlayClose');
    if (soClose) soClose.addEventListener('click', () => so.classList.remove('open'));

    // Desktop search suggestions
    const input = $('#headerSearchInput');
    const sugBox = $('#headerSuggestions');
    if (input && sugBox) {
      const run = Utils.debounce(async (q) => {
        if (!q || q.length < 2) { sugBox.classList.remove('open'); sugBox.innerHTML = ''; return; }
        try {
          const r = await API.searchSuggest(q);
          const items = r.data || [];
          if (!items.length) { sugBox.innerHTML = '<div style="padding:10px;color:var(--color-text-muted);font-size:12px;">No results</div>'; sugBox.classList.add('open'); return; }
          sugBox.innerHTML = items.map(a => `
            <a class="search-suggestion" href="anime.html?id=${a.mal_id}">
              <img src="${a.images.jpg.small_image_url || a.images.jpg.image_url}" alt=""/>
              <div>
                <div class="ss-title">${Utils.escapeHtml(a.title)}</div>
                <div class="ss-meta">${a.type || ''} ${a.episodes ? '· ' + a.episodes + ' eps' : ''} ${a.score ? '· ⭐ ' + a.score : ''}</div>
              </div>
            </a>`).join('');
          sugBox.classList.add('open');
        } catch (e) {}
      }, 300);
      input.addEventListener('input', e => run(e.target.value.trim()));
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.target.value.trim()) {
          window.location.href = 'search.html?q=' + encodeURIComponent(e.target.value.trim());
        }
      });
      document.addEventListener('click', (e) => {
        if (!sugBox.contains(e.target) && e.target !== input) sugBox.classList.remove('open');
      });
    }

    // Mobile overlay search
    const mInput = $('#mobileSearchInput');
    if (mInput) {
      mInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.target.value.trim()) {
          window.location.href = 'search.html?q=' + encodeURIComponent(e.target.value.trim());
        }
      });
    }

    // Bookmark click delegation (global)
    document.addEventListener('click', (e) => {
      const bm = e.target.closest('[data-bookmark]');
      if (!bm) return;
      e.preventDefault(); e.stopPropagation();
      const malId = Number(bm.dataset.bookmark);
      const card = bm.closest('.anime-card');
      const title = card?.querySelector('.card-title')?.textContent || 'Anime';
      const poster = card?.querySelector('.poster')?.src || '';
      if (Storage.inWatchlist(malId)) {
        Storage.removeFromWatchlist(malId);
        bm.classList.remove('active');
        Toast('Removed from watchlist', 'info');
      } else {
        Storage.addToWatchlist({ malId, title, posterUrl: poster, score: 0 });
        bm.classList.add('active');
        Toast('Added to watchlist', 'success');
      }
    });
  };

  const mount = () => {
    // Inject header + footer if placeholders exist
    const hp = Utils.qs('#header-placeholder');
    if (hp) hp.outerHTML = renderHeader();
    const fp = Utils.qs('#footer-placeholder');
    if (fp) fp.outerHTML = renderFooter();
    Utils.initIcons();
    initHeader();
    Utils.initObservers();
    // apply accent color from prefs
    const p = Storage.get();
    if (p.preferences?.accentColor) {
      document.documentElement.style.setProperty('--color-accent', p.preferences.accentColor);
      // derive light/glow
      document.documentElement.style.setProperty('--color-accent-glow', hexToRgba(p.preferences.accentColor, 0.25));
    }
  };

  const hexToRgba = (hex, a) => {
    const m = hex.replace('#', '');
    const v = m.length === 3 ? m.split('').map(c=>c+c).join('') : m;
    const r = parseInt(v.slice(0,2),16), g=parseInt(v.slice(2,4),16), b=parseInt(v.slice(4,6),16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  return {
    renderHeader, renderFooter, mount,
    AnimeCard, HeroSpotlight, ProgressBar, RatingStars, GenreTag,
    CountdownTimer, Toast, Modal, EpisodeStrip,
    FAVICON, BANNER, hexToRgba
  };
})();

window.Components = Components;
