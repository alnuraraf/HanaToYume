/* ============================================
   NamiTube — Reusable UI components
   AnimeCard, SkeletonCard, EpisodeStrip, HeroSpotlight,
   SearchBar, Toast, Modal, RatingStars, ProgressBar,
   GenreTag, CountdownTimer
   ============================================ */

window.NamiTube = window.NamiTube || {};
const NT = window.NamiTube;

const { h, lazyImage } = NT.utils;
const Storage = NT.storage;

/* ============================================
   Icon helpers — inline SVG (Lucide-style)
   ============================================ */
const Icons = {
  search:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  star:    '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  starOutline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  play:    '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  bookmarkFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  heart:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  heartFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  plus:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  check:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  x:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  chevRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  chevLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  menu:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  user:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  library: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  search:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  home:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  heart:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  coffee:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
  film:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>',
  zap:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  trash:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  bell:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  globe:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  trending: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  users:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  discord: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>',
  reddit:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>',
  telegram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
  github:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>'
};

/* ============================================
   Header / Footer
   ============================================ */
const HEADER_HTML = `
  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a class="header-logo" href="index.html" aria-label="NamiTube home">
        <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwxClcajSZy1q1gj_1kf_9y1J7mutn4jWfqdhlBVbFjLkViz_Z3-nuIZ11W0qOd1jlFgMFYi-g_XrpIiRbQjZd-wPwg4RWWyhbR0QLw0-ZgX5DFncVPNOxrDBouMlbdz2sLvQS65JbQaLJpQReWhjceG8Rn5cxrNusoQAXieXFcX_q_LZthCYS1AsCR30/s320/NamiTube%20Original%20banner.png" alt="NamiTube" />
      </a>
      <nav class="header-nav" role="navigation" aria-label="Main">
        <a href="home.html">Home</a>
        <a href="schedule.html">Schedule</a>
        <a href="library.html">Library</a>
        <a href="search.html">Search</a>
        <a href="donate.html">Donate</a>
      </nav>
      <div class="header-actions">
        <div class="header-search hide-mobile" role="search">
          <span class="icon" aria-hidden="true">${Icons.search}</span>
          <input type="search" id="headerSearch" placeholder="Search anime…" aria-label="Search anime" autocomplete="off" />
          <div class="search-suggest" id="searchSuggest" role="listbox" aria-label="Search suggestions"></div>
        </div>
        <button class="btn-icon hide-mobile" id="mobileSearchTrigger" aria-label="Search" style="display:none">${Icons.search}</button>
        <div class="profile-wrap">
          <button class="profile-btn" id="profileBtn" aria-label="Open profile menu">N</button>
          <div class="profile-dropdown" id="profileDropdown" role="menu">
            <div class="profile-dropdown-header">
              <div class="name" id="profileName">AnimeUser</div>
              <div class="sub" id="profileSub">Member since —</div>
            </div>
            <a href="profile.html" role="menuitem">${Icons.user}<span>View Profile</span></a>
            <a href="library.html" role="menuitem">${Icons.library}<span>My Library</span></a>
            <a href="library.html#history" role="menuitem">${Icons.history}<span>Watch History</span></a>
            <a href="library.html#favorites" role="menuitem">${Icons.heart}<span>Favourites</span></a>
            <a href="profile.html#prefs" role="menuitem">${Icons.settings}<span>Settings</span></a>
          </div>
        </div>
        <button class="mobile-toggle" id="mobileToggle" aria-label="Open menu">${Icons.menu}</button>
      </div>
    </div>
  </header>
  <div class="mobile-nav-overlay" id="mobileNavOverlay" aria-hidden="true"></div>
  <aside class="mobile-nav" id="mobileNav" aria-label="Mobile navigation" aria-hidden="true">
    <div class="mobile-nav-head">
      <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwxClcajSZy1q1gj_1kf_9y1J7mutn4jWfqdhlBVbFjLkViz_Z3-nuIZ11W0qOd1jlFgMFYi-g_XrpIiRbQjZd-wPwg4RWWyhbR0QLw0-ZgX5DFncVPNOxrDBouMlbdz2sLvQS65JbQaLJpQReWhjceG8Rn5cxrNusoQAXieXFcX_q_LZthCYS1AsCR30/s320/NamiTube%20Original%20banner.png" alt="NamiTube" />
      <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu">${Icons.x}</button>
    </div>
    <div class="mobile-nav-body">
      <button class="mobile-search-trigger" id="mobileSearchBtn">${Icons.search}<span>Search anime…</span></button>
      <a href="home.html">${Icons.home}<span>Home</span></a>
      <a href="schedule.html">${Icons.calendar}<span>Schedule</span></a>
      <a href="library.html">${Icons.library}<span>Library</span></a>
      <a href="search.html">${Icons.search}<span>Search</span></a>
      <a href="donate.html">${Icons.heart}<span>Donate</span></a>
      <a href="profile.html">${Icons.user}<span>Profile</span></a>
    </div>
  </aside>
  <div class="mobile-search-overlay" id="mobileSearchOverlay" role="dialog" aria-label="Search">
    <div class="mobile-search-bar">
      <button class="btn-icon" id="mobileSearchBack" aria-label="Back">${Icons.chevLeft}</button>
      <input type="search" id="mobileSearchInput" placeholder="Search anime…" autocomplete="off" />
      <button class="btn-icon" id="mobileSearchSubmit" aria-label="Search">${Icons.search}</button>
    </div>
    <div class="mobile-search-results" id="mobileSearchResults"></div>
  </div>
`;

const FOOTER_HTML = `
  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <img class="footer-logo" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwxClcajSZy1q1gj_1kf_9y1J7mutn4jWfqdhlBVbFjLkViz_Z3-nuIZ11W0qOd1jlFgMFYi-g_XrpIiRbQjZd-wPwg4RWWyhbR0QLw0-ZgX5DFncVPNOxrDBouMlbdz2sLvQS65JbQaLJpQReWhjceG8Rn5cxrNusoQAXieXFcX_q_LZthCYS1AsCR30/s320/NamiTube%20Original%20banner.png" alt="NamiTube" />
      <p class="footer-tagline">Your premium destination for anime streaming.</p>
      <div class="footer-socials" aria-label="Social media">
        <a href="#" aria-label="Discord">${Icons.discord}</a>
        <a href="#" aria-label="Twitter / X">${Icons.twitter}</a>
        <a href="#" aria-label="Reddit">${Icons.reddit}</a>
        <a href="#" aria-label="Telegram">${Icons.telegram}</a>
        <a href="#" aria-label="GitHub">${Icons.github}</a>
      </div>
      <div class="footer-divider"></div>
      <p class="footer-disclaimer">This site does not store any files on its server. All contents are provided by non-affiliated third parties.</p>
      <p class="footer-copy">© 2025 NamiTube. All rights reserved. Not affiliated with MyAnimeList or AniList.</p>
    </div>
  </footer>
  <div class="toast-host" id="toastHost" aria-live="polite" aria-atomic="true"></div>
`;

/** Inject header and footer into the page (call once on DOM ready) */
function injectChrome() {
  const headerSlot = document.getElementById('header-slot');
  const footerSlot = document.getElementById('footer-slot');
  if (headerSlot) headerSlot.innerHTML = HEADER_HTML;
  if (footerSlot) footerSlot.innerHTML = FOOTER_HTML;
  bindChrome();
  populateProfileMenu();
  highlightActiveNav();
}

function bindChrome() {
  // Profile dropdown
  const profileBtn = document.getElementById('profileBtn');
  const dropdown = document.getElementById('profileDropdown');
  if (profileBtn && dropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !profileBtn.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

  // Mobile nav
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileNavOverlay');
  const mobileClose = document.getElementById('mobileNavClose');

  function openMobileNav() {
    mobileNav.classList.add('open');
    mobileOverlay.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  if (mobileToggle) mobileToggle.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

  // Mobile search overlay
  const mobileSearchBtn = document.getElementById('mobileSearchBtn');
  const mobileSearchOverlay = document.getElementById('mobileSearchOverlay');
  const mobileSearchBack = document.getElementById('mobileSearchBack');
  const mobileSearchInput = document.getElementById('mobileSearchInput');
  const mobileSearchResults = document.getElementById('mobileSearchResults');

  function openMobileSearch() {
    closeMobileNav();
    mobileSearchOverlay.classList.add('open');
    setTimeout(() => mobileSearchInput.focus(), 50);
  }
  function closeMobileSearch() {
    mobileSearchOverlay.classList.remove('open');
  }
  if (mobileSearchBtn) mobileSearchBtn.addEventListener('click', openMobileSearch);
  if (mobileSearchBack) mobileSearchBack.addEventListener('click', closeMobileSearch);

  // Header search with autocomplete
  const headerInput = document.getElementById('headerSearch');
  const suggest = document.getElementById('searchSuggest');
  if (headerInput && suggest) {
    const run = debounce(async () => {
      const q = headerInput.value.trim();
      if (q.length < 2) { suggest.classList.remove('open'); suggest.innerHTML = ''; return; }
      try {
        const res = await NT.api.search({ q, limit: 5 });
        renderSuggestions(res.data || [], suggest, (anime) => {
          window.location.href = `anime.html?id=${anime.mal_id}`;
        });
      } catch (e) { suggest.classList.remove('open'); }
    }, 300);

    headerInput.addEventListener('input', run);
    headerInput.addEventListener('focus', () => {
      if (suggest.children.length > 0) suggest.classList.add('open');
    });
    headerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = headerInput.value.trim();
        if (q) window.location.href = `search.html?q=${encodeURIComponent(q)}`;
      }
      if (e.key === 'Escape') {
        suggest.classList.remove('open');
        headerInput.blur();
      }
    });
    document.addEventListener('click', (e) => {
      if (!suggest.contains(e.target) && e.target !== headerInput) suggest.classList.remove('open');
    });
  }

  // Mobile search submit
  if (mobileSearchInput) {
    const runMobile = debounce(async () => {
      const q = mobileSearchInput.value.trim();
      if (q.length < 2) { mobileSearchResults.innerHTML = ''; return; }
      try {
        const res = await NT.api.search({ q, limit: 12 });
        renderSuggestions(res.data || [], mobileSearchResults, (anime) => {
          window.location.href = `anime.html?id=${anime.mal_id}`;
        });
      } catch (e) {
        mobileSearchResults.innerHTML = '<p class="suggest-empty">Search failed. Try again.</p>';
      }
    }, 300);
    mobileSearchInput.addEventListener('input', runMobile);
    mobileSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = mobileSearchInput.value.trim();
        if (q) window.location.href = `search.html?q=${encodeURIComponent(q)}`;
      }
    });
    document.getElementById('mobileSearchSubmit')?.addEventListener('click', () => {
      const q = mobileSearchInput.value.trim();
      if (q) window.location.href = `search.html?q=${encodeURIComponent(q)}`;
    });
  }

  // Header scroll effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', throttle(() => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, 100), { passive: true });
  }
}

function renderSuggestions(list, container, onSelect) {
  if (!list || list.length === 0) {
    container.innerHTML = '<div class="suggest-empty">No matches found</div>';
    container.classList.add('open');
    return;
  }
  container.innerHTML = '';
  for (const a of list) {
    const item = h('a', {
      class: 'suggest-item',
      href: `anime.html?id=${a.mal_id}`,
      role: 'option'
    }, [
      lazyImage(a.images?.jpg?.small_image_url || a.images?.jpg?.image_url, a.title, ''),
      h('div', { class: 'info' }, [
        h('div', { class: 't' }, a.title),
        h('div', { class: 's' }, [
          a.type || '—',
          ' • ',
          a.episodes ? `${a.episodes} eps` : '—',
          a.score ? ` • ★ ${a.score}` : ''
        ].join(''))
      ])
    ]);
    item.addEventListener('click', (e) => { e.preventDefault(); onSelect(a); });
    container.appendChild(item);
  }
  container.classList.add('open');
}

function populateProfileMenu() {
  const profile = Storage.getProfile();
  const name = profile.displayName || 'AnimeUser';
  const initial = name.charAt(0).toUpperCase();
  const btn = document.getElementById('profileBtn');
  if (btn) {
    if (profile.avatarBase64) {
      btn.innerHTML = `<img src="${profile.avatarBase64}" alt="${name}">`;
    } else {
      btn.textContent = initial;
    }
  }
  const nameEl = document.getElementById('profileName');
  const subEl  = document.getElementById('profileSub');
  if (nameEl) nameEl.textContent = name;
  if (subEl) {
    const join = new Date(profile.joinDate);
    subEl.textContent = 'Member since ' + join.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}

/* ============================================
   AnimeCard
   ============================================ */
function AnimeCard(anime, options = {}) {
  const { size = 'md', showProgress = false, showActions = true } = options;
  const malId = anime.mal_id;
  const title = anime.title || anime.title_english || 'Untitled';
  const poster = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const score = anime.score;
  const type = anime.type;
  const episodes = anime.episodes;
  const synopsis = anime.synopsis || '';
  const isBookmarked = Storage.isInWatchlist(malId);

  const card = h('a', {
    class: `anime-card size-${size}`,
    href: `anime.html?id=${malId}`,
    'aria-label': title
  });

  const wrap = h('div', { class: 'poster-wrap' });
  wrap.appendChild(lazyImage(poster, title));

  // Badges
  const badges = h('div', { class: 'badges' });
  if (score) {
    const scoreEl = h('div', { class: 'score-badge' });
    scoreEl.innerHTML = Icons.star + `<span>${NT.utils.Formatters.score(score)}</span>`;
    badges.appendChild(scoreEl);
  }
  if (type) {
    badges.appendChild(h('div', { class: 'type-badge' }, type));
  }
  wrap.appendChild(badges);

  // Bookmark button
  if (showActions) {
    const bm = h('button', {
      class: `bookmark ${isBookmarked ? 'active' : ''}`,
      'aria-label': isBookmarked ? 'Remove from watchlist' : 'Add to watchlist',
      type: 'button',
      onclick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (Storage.isInWatchlist(malId)) {
          Storage.removeFromWatchlist(malId);
          bm.classList.remove('active');
          bm.setAttribute('aria-label', 'Add to watchlist');
          NT.components.Toast(`Removed "${title}" from watchlist`, 'info');
        } else {
          Storage.addToWatchlist({ malId, title, posterUrl: poster, score });
          bm.classList.add('active');
          bm.setAttribute('aria-label', 'Remove from watchlist');
          NT.components.Toast(`Added "${title}" to watchlist`, 'success');
        }
      }
    });
    bm.innerHTML = isBookmarked ? Icons.bookmarkFill : Icons.bookmark;
    wrap.appendChild(bm);
  }

  // Hover overlay
  const overlay = h('div', { class: 'card-overlay' });
  if (synopsis) {
    overlay.appendChild(h('p', { class: 'synopsis' }, synopsis));
  }
  const watchBtn = h('span', { class: 'watch-btn' });
  watchBtn.innerHTML = Icons.play + ' Watch Now';
  overlay.appendChild(watchBtn);
  wrap.appendChild(overlay);

  card.appendChild(wrap);

  // Card body
  const body = h('div', { class: 'card-body' });
  body.appendChild(h('div', { class: 'card-title' }, title));
  const meta = h('div', { class: 'card-meta' });
  if (type) meta.appendChild(h('span', { class: 'type-text' }, type));
  if (episodes) meta.appendChild(h('span', { class: 'ep' }, `${episodes} eps`));
  body.appendChild(meta);
  if (showProgress) {
    const watched = Storage.getWatchedEpisodes(malId).length;
    if (watched > 0) {
      const pct = Math.min(100, (watched / episodes) * 100);
      const bar = h('div', { class: 'progress-bar', style: { height: '3px', background: 'var(--color-bg-elevated)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' } });
      bar.appendChild(h('div', { style: { width: pct + '%', height: '100%', background: 'var(--color-accent)' } }));
      body.appendChild(bar);
    }
  }
  card.appendChild(body);
  return card;
}

function SkeletonCard(size = 'md') {
  return NT.utils.Skeletons.card(size);
}

/* ============================================
   EpisodeStrip
   ============================================ */
function EpisodeStrip(episodes, currentEp, onSelect) {
  const strip = h('div', { class: 'ep-strip', role: 'list' });
  for (const ep of episodes) {
    const num = ep.mal_id || ep.episode || ep.number;
    const watched = Storage.getWatchedEpisodes(ep.mal_id_episode || 0); // simplified
    const isCurrent = num === currentEp;
    const isWatched = watched.includes(num);
    const thumb = h('div', {
      class: `ep-thumb ${isCurrent ? 'active' : ''} ${isWatched ? 'watched' : ''}`,
      role: 'listitem',
      tabindex: '0',
      onclick: () => onSelect && onSelect(num),
      onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect && onSelect(num); } }
    }, [
      h('span', { class: 'ep-num' }, `EP ${num}`),
      h('div', { class: 'ep-bar' })
    ]);
    strip.appendChild(thumb);
  }
  return strip;
}

/* ============================================
   HeroSpotlight (auto-cycling featured banner)
   ============================================ */
function HeroSpotlight(animes, options = {}) {
  const { interval = 10000, showControls = true } = options;
  if (!animes || animes.length === 0) return null;

  const root = h('div', { class: 'spotlight reveal in-view' });
  const slides = h('div', { class: 'spotlight-slides' });

  const dots = h('div', { class: 'spotlight-dots' });
  const contentWrap = h('div', { class: 'spotlight-content' });
  const genreWrap = h('div', { class: 'spotlight-genres' });

  // Build slides + dots
  const slideEls = animes.map((a, i) => {
    const bg = a.trailer?.images?.maximum_image_url
      || a.images?.jpg?.large_image_url
      || a.images?.jpg?.image_url;
    const slide = h('div', {
      class: `spotlight-slide ${i === 0 ? 'active' : ''}`,
      style: { backgroundImage: `url(${bg})` }
    });
    slides.appendChild(slide);
    const dot = h('button', {
      class: i === 0 ? 'active' : '',
      'aria-label': `Show ${a.title}`,
      type: 'button'
    });
    dot.addEventListener('click', () => goTo(i));
    dots.appendChild(dot);
    return slide;
  });

  function setContent(a) {
    contentWrap.innerHTML = '';
    contentWrap.appendChild(h('span', { class: 'spotlight-tag' }, '#' + (a.rank ? a.rank : 'Spotlight') + ' Spotlight'));
    contentWrap.appendChild(h('h2', { class: 'spotlight-title' }, a.title));
    const meta = h('div', { class: 'spotlight-meta' });
    if (a.score) {
      const score = h('div', { class: 'score' });
      score.innerHTML = Icons.star + ` <span>${NT.utils.Formatters.score(a.score)}</span>`;
      meta.appendChild(score);
    }
    if (a.type) {
      meta.appendChild(h('div', { class: 'dot' }));
      meta.appendChild(h('span', {}, a.type));
    }
    if (a.episodes) {
      meta.appendChild(h('div', { class: 'dot' }));
      meta.appendChild(h('span', {}, `${a.episodes} Episodes`));
    }
    if (a.status) {
      meta.appendChild(h('div', { class: 'dot' }));
      meta.appendChild(h('span', {}, a.status));
    }
    contentWrap.appendChild(meta);

    // Genres
    genreWrap.innerHTML = '';
    (a.genres || []).slice(0, 4).forEach(g => {
      genreWrap.appendChild(h('a', {
        class: 'tag tag-genre',
        href: `search.html?q=${encodeURIComponent(g.name)}&genre=${g.mal_id}`
      }, g.name));
    });
    if (genreWrap.parentNode !== contentWrap) contentWrap.appendChild(genreWrap);

    if (a.synopsis) {
      contentWrap.appendChild(h('p', { class: 'spotlight-synopsis' }, a.synopsis));
    }

    const actions = h('div', { class: 'spotlight-actions' });
    const watchBtn = h('a', { class: 'btn btn-primary btn-lg', href: `watch.html?id=${a.mal_id}&ep=1&lang=sub` });
    watchBtn.innerHTML = Icons.play + ' Watch Now';
    actions.appendChild(watchBtn);
    const detailBtn = h('a', { class: 'btn btn-ghost btn-lg', href: `anime.html?id=${a.mal_id}` }, 'Details');
    actions.appendChild(detailBtn);
    const listBtn = h('button', {
      class: 'btn btn-secondary btn-lg',
      type: 'button',
      onclick: () => {
        if (Storage.isInWatchlist(a.mal_id)) {
          Storage.removeFromWatchlist(a.mal_id);
          Toast(`Removed from watchlist`, 'info');
        } else {
          Storage.addToWatchlist({
            malId: a.mal_id, title: a.title,
            posterUrl: a.images?.jpg?.large_image_url, score: a.score
          });
          Toast(`Added to watchlist`, 'success');
        }
      }
    });
    listBtn.innerHTML = (Storage.isInWatchlist(a.mal_id) ? Icons.check : Icons.plus) + ' Watchlist';
    actions.appendChild(listBtn);
    contentWrap.appendChild(actions);
  }

  let current = 0;
  let timer = null;
  function goTo(i) {
    slideEls[current].classList.remove('active');
    dots.children[current]?.classList.remove('active');
    current = (i + slideEls.length) % slideEls.length;
    slideEls[current].classList.add('active');
    dots.children[current]?.classList.add('active');
    setContent(animes[current]);
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }
  function start() { stop(); timer = setInterval(next, interval); }
  function stop() { if (timer) clearInterval(timer); timer = null; }

  root.appendChild(slides);
  root.appendChild(contentWrap);

  if (showControls && animes.length > 1) {
    const controls = h('div', { class: 'spotlight-controls' });
    const prevBtn = h('button', { 'aria-label': 'Previous', type: 'button' });
    prevBtn.innerHTML = Icons.chevLeft;
    prevBtn.addEventListener('click', prev);
    const nextBtn = h('button', { 'aria-label': 'Next', type: 'button' });
    nextBtn.innerHTML = Icons.chevRight;
    nextBtn.addEventListener('click', next);
    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);
    root.appendChild(controls);
    root.appendChild(dots);
    start();
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
  }

  setContent(animes[0]);
  return root;
}

/* ============================================
   Toast
   ============================================ */
let _toastHost = null;
function Toast(message, type = 'info', duration = 3000) {
  if (!_toastHost) _toastHost = document.getElementById('toastHost') || document.body.appendChild(h('div', { class: 'toast-host', id: 'toastHost' }));
  const iconMap = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><polyline points="20 6 9 17 4 12"/></svg>',
    error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
  };
  const t = h('div', { class: `toast ${type}`, role: 'status' });
  t.innerHTML = (iconMap[type] || iconMap.info) + `<span>${message}</span>`;
  _toastHost.appendChild(t);
  // Force reflow for transition
  void t.offsetWidth;
  t.classList.add('show');
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 400);
  }, duration);
}

/* ============================================
   Modal
   ============================================ */
function Modal(title, content, actions = []) {
  const overlay = h('div', { class: 'modal-overlay', role: 'dialog', 'aria-modal': 'true' });
  const modal = h('div', { class: 'modal' });
  const head = h('div', { class: 'modal-head' }, [
    h('h3', {}, title),
    (() => {
      const btn = h('button', { class: 'btn-icon', 'aria-label': 'Close', type: 'button' });
      btn.innerHTML = Icons.x;
      btn.addEventListener('click', close);
      return btn;
    })()
  ]);
  const body = h('div', { class: 'modal-body' });
  if (typeof content === 'string') body.innerHTML = content;
  else if (content instanceof Node) body.appendChild(content);

  modal.appendChild(head);
  modal.appendChild(body);

  if (actions.length > 0) {
    const acts = h('div', { class: 'modal-actions' });
    actions.forEach(a => {
      const btn = h('button', {
        class: `btn ${a.variant === 'primary' ? 'btn-primary' : a.variant === 'danger' ? 'btn-primary' : 'btn-secondary'}`,
        type: 'button',
        onclick: () => { a.onClick && a.onClick(); if (a.closeOnClick !== false) close(); }
      }, a.label);
      if (a.variant === 'danger') btn.style.background = 'var(--color-red)';
      acts.appendChild(btn);
    });
    modal.appendChild(acts);
  }

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  void overlay.offsetWidth;
  overlay.classList.add('open');

  function close() {
    overlay.classList.remove('open');
    setTimeout(() => overlay.remove(), 200);
  }

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  // Close on Escape
  function onKey(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } }
  document.addEventListener('keydown', onKey);
  // Focus trap (simple)
  const focusable = modal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
  if (focusable.length > 0) focusable[0].focus();

  return { element: overlay, close };
}

/* ============================================
   RatingStars
   ============================================ */
function RatingStars(value, onChange) {
  const wrap = h('div', { class: 'rating-stars', role: 'radiogroup', 'aria-label': 'Your rating' });
  wrap.appendChild(h('span', { class: 'label' }, 'Rate:'));
  const valSpan = h('span', { class: 'value' }, value || '—');
  for (let i = 1; i <= 10; i++) {
    const btn = h('button', {
      class: 'star ' + (i <= value ? 'active' : ''),
      'aria-label': `${i} star${i > 1 ? 's' : ''}`,
      'aria-checked': String(i === value),
      role: 'radio',
      type: 'button'
    });
    btn.innerHTML = Icons.star;
    btn.addEventListener('click', () => {
      const newVal = (value === i) ? 0 : i;
      onChange && onChange(newVal);
      valSpan.textContent = newVal || '—';
      wrap.querySelectorAll('.star').forEach((s, idx) => {
        s.classList.toggle('active', idx < newVal);
        s.setAttribute('aria-checked', String(idx + 1 === newVal));
      });
    });
    wrap.appendChild(btn);
  }
  wrap.appendChild(valSpan);
  return wrap;
}

/* ============================================
   ProgressBar
   ============================================ */
function ProgressBar(value, max) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const wrap = h('div', { class: 'progress-bar' });
  wrap.style.cssText = 'width:100%;height:6px;background:var(--color-bg-elevated);border-radius:var(--radius-full);overflow:hidden';
  const fill = h('div');
  fill.style.cssText = `width:${pct}%;height:100%;background:linear-gradient(90deg,var(--color-accent),var(--color-accent-light));border-radius:var(--radius-full);transition:width var(--t-slow)`;
  wrap.appendChild(fill);
  return wrap;
}

/* ============================================
   GenreTag
   ============================================ */
function GenreTag(name, onClick) {
  const tag = h('button', { class: 'tag tag-genre', type: 'button' }, name);
  if (onClick) tag.addEventListener('click', onClick);
  return tag;
}

/* ============================================
   CountdownTimer
   ============================================ */
function CountdownTimer(targetTimestamp) {
  const root = h('div', { class: 'countdown' });
  const days = h('div', { class: 'countdown-box' }, [
    h('div', { class: 'num' }, '00'),
    h('div', { class: 'lbl' }, 'Days')
  ]);
  const hours = h('div', { class: 'countdown-box' }, [
    h('div', { class: 'num' }, '00'),
    h('div', { class: 'lbl' }, 'Hours')
  ]);
  const mins = h('div', { class: 'countdown-box' }, [
    h('div', { class: 'num' }, '00'),
    h('div', { class: 'lbl' }, 'Min')
  ]);
  const secs = h('div', { class: 'countdown-box' }, [
    h('div', { class: 'num' }, '00'),
    h('div', { class: 'lbl' }, 'Sec')
  ]);
  root.appendChild(days);
  root.appendChild(hours);
  root.appendChild(mins);
  root.appendChild(secs);

  function update() {
    const now = Date.now();
    let diff = Math.max(0, targetTimestamp - now);
    const d = Math.floor(diff / (1000 * 60 * 60 * 24)); diff -= d * (1000 * 60 * 60 * 24);
    const h = Math.floor(diff / (1000 * 60 * 60));       diff -= h * (1000 * 60 * 60);
    const m = Math.floor(diff / (1000 * 60));            diff -= m * (1000 * 60);
    const s = Math.floor(diff / 1000);
    days.firstChild.textContent  = String(d).padStart(2, '0');
    hours.firstChild.textContent = String(h).padStart(2, '0');
    mins.firstChild.textContent  = String(m).padStart(2, '0');
    secs.firstChild.textContent  = String(s).padStart(2, '0');
  }
  update();
  const iv = setInterval(update, 1000);
  return { element: root, stop: () => clearInterval(iv) };
}

/* ============================================
   Export
   ============================================ */
NT.components = {
  injectChrome, populateProfileMenu,
  AnimeCard, SkeletonCard, EpisodeStrip, HeroSpotlight,
  Toast, Modal, RatingStars, ProgressBar, GenreTag, CountdownTimer,
  Icons, HEADER_HTML, FOOTER_HTML
};
