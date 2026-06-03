const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  arrowDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  discord: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  reddit: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  fullscreen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,
  monitor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
};

const App = {
  init() {
    this.renderHeader();
    this.renderFooter();
    this.initScrollReveal();
    this.initSearch();
    this.initMobileMenu();
    this.initKeyboardShortcuts();
    this.createToastContainer();
  },

  renderHeader() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = [
      { href: 'home.html', label: 'Home', icon: 'home' },
      { href: 'schedule.html', label: 'Schedule', icon: 'clock' },
      { href: 'library.html', label: 'Library', icon: 'heart' },
      { href: 'donate.html', label: 'Donate', icon: 'heart' }
    ];
    const navLinks = navItems.map(item => {
      const isActive = currentPage === item.href;
      return `<a href="${item.href}" class="header-nav-link ${isActive ? 'active' : ''}" aria-label="${item.label}">${item.label}</a>`;
    }).join('');

    const header = document.createElement('header');
    header.className = 'global-header';
    header.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to content</a>
      <div class="header-inner">
        <div class="header-left">
          <button class="mobile-menu-btn header-icon-btn" aria-label="Open menu" onclick="App.toggleMobileMenu()">
            ${ICONS.menu}
          </button>
          <a href="home.html" class="header-brand-link">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwxClcajSZy1q1gj_1kf_9y1J7mutn4jWfqdhlBVbFjLkViz_Z3-nuIZ11W0qOd1jlFgMFYi-g_XrpIiRbQjZd-wPwg4RWWyhbR0QLw0-ZgX5DFncVPNOxrDBouMlbdz2sLvQS65JbQaLJpQReWhjceG8Rn5cxrNusoQAXieXFcX_q_LZthCYS1AsCR30/s320/NamiTube%20Original%20banner.png" alt="NamiTube" class="header-logo" loading="eager">
          </a>
          <span class="header-brand">NamiTube</span>
        </div>
        <nav class="header-center" aria-label="Main navigation">
          ${navLinks}
        </nav>
        <div class="header-right">
          <button class="header-icon-btn" aria-label="Search" onclick="App.toggleSearch()">
            ${ICONS.search}
          </button>
          <div style="position: relative;">
            <button class="header-icon-btn" aria-label="Profile" onclick="App.toggleProfile()">
              ${ICONS.user}
            </button>
            <div class="profile-dropdown" id="profileDropdown">
              <a href="profile.html">View Profile</a>
              <a href="library.html">My Library</a>
              <button onclick="App.openSettings()">Settings</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertBefore(header, document.body.firstChild);

    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav-overlay';
    mobileNav.id = 'mobileNav';
    mobileNav.innerHTML = `
      <button class="header-icon-btn" style="position: absolute; top: 16px; right: 16px;" onclick="App.toggleMobileMenu()">
        ${ICONS.close}
      </button>
      ${navItems.map(item => `<a href="${item.href}" class="${currentPage === item.href ? 'active' : ''}">${item.label}</a>`).join('')}
    `;
    document.body.appendChild(mobileNav);
  },

  renderFooter() {
    const footer = document.createElement('footer');
    footer.className = 'global-footer';
    footer.innerHTML = `
      <div class="footer-inner">
        <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwxClcajSZy1q1gj_1kf_9y1J7mutn4jWfqdhlBVbFjLkViz_Z3-nuIZ11W0qOd1jlFgMFYi-g_XrpIiRbQjZd-wPwg4RWWyhbR0QLw0-ZgX5DFncVPNOxrDBouMlbdz2sLvQS65JbQaLJpQReWhjceG8Rn5cxrNusoQAXieXFcX_q_LZthCYS1AsCR30/s320/NamiTube%20Original%20banner.png" alt="NamiTube" class="footer-logo" loading="lazy">
        <p class="footer-desc">NamiTube is a free anime streaming platform providing high-quality anime content. We do not host any video files on our servers.</p>
        <div class="footer-socials" aria-label="Social media links">
          <a href="#" aria-label="Twitter">${ICONS.twitter}</a>
          <a href="#" aria-label="Discord">${ICONS.discord}</a>
          <a href="#" aria-label="GitHub">${ICONS.github}</a>
          <a href="#" aria-label="Reddit">${ICONS.reddit}</a>
          <a href="#" aria-label="Telegram">${ICONS.telegram}</a>
        </div>
        <p class="footer-disclaimer">This site does not store any files on its server. All contents are provided by non-affiliated third parties.</p>
        <p class="footer-copyright">&copy; 2026 NamiTube. All rights reserved.</p>
      </div>
    `;
    document.body.appendChild(footer);
  },

  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  },

  toggleMobileMenu() {
    document.getElementById('mobileNav').classList.toggle('active');
    document.body.style.overflow = document.getElementById('mobileNav').classList.contains('active') ? 'hidden' : '';
  },

  toggleSearch() {
    let overlay = document.getElementById('searchOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'search-overlay';
      overlay.id = 'searchOverlay';
      overlay.innerHTML = `
        <div class="search-input-wrap">
          <input type="text" class="search-input" placeholder="Search anime..." aria-label="Search anime" id="globalSearchInput" autocomplete="off">
          <button class="search-close" onclick="App.toggleSearch()" aria-label="Close search">
            ${ICONS.close}
          </button>
        </div>
        <div class="search-results" id="searchResults"></div>
        <div class="search-recent" id="searchRecent"></div>
      `;
      document.body.appendChild(overlay);
      const input = document.getElementById('globalSearchInput');
      input.addEventListener('input', debounce((e) => this.handleSearch(e.target.value), 300));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.toggleSearch();
        if (e.key === 'Enter' && input.value.trim()) {
          window.location.href = `search.html?q=${encodeURIComponent(input.value.trim())}`;
        }
      });
    }
    overlay.classList.toggle('active');
    if (overlay.classList.contains('active')) {
      setTimeout(() => document.getElementById('globalSearchInput').focus(), 100);
      this.renderRecentSearches();
    }
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
  },

  async handleSearch(query) {
    if (!query.trim()) {
      document.getElementById('searchResults').innerHTML = '';
      return;
    }
    try {
      const data = await JikanAPI.searchAnime(query);
      const results = document.getElementById('searchResults');
      if (!data.data?.length) {
        results.innerHTML = '<p style="color: var(--text-secondary); text-align: center; grid-column: 1/-1;">No results found</p>';
        return;
      }
      results.innerHTML = data.data.slice(0, 8).map(anime => this.createAnimeCardHTML(anime)).join('');
      results.querySelectorAll('.anime-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.dataset.id;
          this.addRecentSearch(query);
          window.location.href = `anime.html?id=${id}`;
        });
      });
    } catch (e) {
      console.error('Search error:', e);
    }
  },

  addRecentSearch(query) {
    const recent = JSON.parse(localStorage.getItem('nt_recent_searches') || '[]');
    const updated = [query, ...recent.filter(q => q !== query)].slice(0, 5);
    localStorage.setItem('nt_recent_searches', JSON.stringify(updated));
  },

  renderRecentSearches() {
    const recent = JSON.parse(localStorage.getItem('nt_recent_searches') || '[]');
    const container = document.getElementById('searchRecent');
    if (!recent.length || !container) return;
    container.innerHTML = `
      <div class="recent-label">Recent Searches</div>
      <div class="recent-tags">
        ${recent.map(q => `<span class="recent-tag" onclick="document.getElementById('globalSearchInput').value='${q.replace(/'/g, "\'")}'; App.handleSearch('${q.replace(/'/g, "\'")}')">${escapeHtml(q)}</span>`).join('')}
      </div>
    `;
  },

  toggleProfile() {
    document.getElementById('profileDropdown').classList.toggle('active');
  },

  openSettings() {
    this.toggleProfile();
    this.showToast('Settings - implement profile modal', 'info');
  },

  createToastContainer() {
    if (!document.getElementById('toastContainer')) {
      const container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
  },

  showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-message">${escapeHtml(message)}</span>
      <button onclick="this.parentElement.remove()" style="opacity: 0.5; transition: opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.5">
        ${ICONS.close}
      </button>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  createAnimeCardHTML(anime) {
    const image = anime.images?.jpg?.image_url || anime.images?.webp?.image_url || '';
    const title = anime.title_english || anime.title || 'Unknown';
    const score = anime.score ? anime.score.toFixed(1) : 'N/A';
    const episodes = anime.episodes || '?';
    return `
      <div class="anime-card" data-id="${anime.mal_id}" tabindex="0" role="link" aria-label="${escapeHtml(title)}">
        <img src="${image}" alt="${escapeHtml(title)}" class="anime-card-image" loading="lazy">
        <div class="anime-card-pills">
          ${anime.type ? `<span class="anime-card-pill">${anime.type}</span>` : ''}
        </div>
        ${anime.score ? `<span class="anime-card-badge">HD</span>` : ''}
        <div class="anime-card-overlay">
          <div class="anime-card-title">${escapeHtml(title)}</div>
          <div class="anime-card-meta">
            <span class="anime-card-score">${ICONS.star} ${score}</span>
            <span>${episodes} EPS</span>
          </div>
        </div>
      </div>
    `;
  },

  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '/') {
        e.preventDefault();
        this.toggleSearch();
      }
      if (e.key === 'h' || e.key === 'H') {
        window.location.href = 'home.html';
      }
      if (e.key === 'l' || e.key === 'L') {
        window.location.href = 'library.html';
      }
    });
  },

  formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  },

  formatDate(dateStr) {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
};

function debounce(fn, ms) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => App.init());
