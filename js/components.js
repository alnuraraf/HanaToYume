/* js/components.js */

/**
 * Shared Layout Renderer
 * Automatically generates identical Header and Footer on ALL pages.
 */
function renderSharedLayout() {
  const profile = getProfile();
  const currentPath = window.location.pathname;
  const isPage = (pageName) => currentPath.endsWith(pageName) || (pageName === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')));

  // Ensure Lucide CDN script is loaded
  if (!window.lucide && !document.getElementById('lucide-script')) {
    const script = document.createElement('script');
    script.id = 'lucide-script';
    script.src = 'https://unpkg.com/lucide@latest';
    script.async = true;
    script.onload = () => {
      if (window.lucide) window.lucide.createIcons();
    };
    document.head.appendChild(script);
  }

  // 1. Render Header
  let header = document.querySelector('header.header');
  if (!header) {
    header = document.createElement('header');
    header.className = 'header';
    document.body.insertBefore(header, document.body.firstChild);
  }

  const activeHome = isPage('home.html') ? 'active' : '';
  const activeSchedule = isPage('schedule.html') ? 'active' : '';
  const activeLibrary = isPage('library.html') ? 'active' : '';
  const activeSearch = isPage('search.html') ? 'active' : '';
  const activeDonate = isPage('donate.html') ? 'active' : '';

  const avatarSrc = profile.avatarBase64 || 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiHE6pMgjbJ6YDLaMAtDUZCs6Zhkvxl0_fQnb0c0ZCmJOYRB_4N8dQ0ZWosBq_sZPK2wFel2E43Z2meo25JL3i7IZYkJ35FZ7lZ_BZfwlWofAKGhF1gWpFsxofeGUr87Peu6s7xtgvJMnrbtNnd4vJPtB7uG3L_wJ9tT8PKRCh-PXSxlyY9Ufn8OAzDY_Y/s320/NamiTube%20Original%20Favicon.png';
  const logoBanner = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwxClcajSZy1q1gj_1kf_9y1J7mutn4jWfqdhlBVbFjLkViz_Z3-nuIZ11W0qOd1jlFgMFYi-g_XrpIiRbQjZd-wPwg4RWWyhbR0QLw0-ZgX5DFncVPNOxrDBouMlbdz2sLvQS65JbQaLJpQReWhjceG8Rn5cxrNusoQAXieXFcX_q_LZthCYS1AsCR30/s320/NamiTube%20Original%20banner.png';

  header.innerHTML = `
    <div class="container header-container">
      <div class="header-left">
        <a href="home.html" class="logo-link">
          <img src="${logoBanner}" alt="NamiTube Logo" class="logo-img">
        </a>
        <nav class="desktop-nav" role="navigation" aria-label="Main navigation">
          <a href="home.html" class="nav-link ${activeHome}">Home</a>
          <a href="schedule.html" class="nav-link ${activeSchedule}">Schedule</a>
          <a href="library.html" class="nav-link ${activeLibrary}">Library</a>
          <a href="search.html" class="nav-link ${activeSearch}">Search</a>
          <a href="donate.html" class="nav-link ${activeDonate}">Donate</a>
        </nav>
      </div>

      <!-- Desktop Inline Search -->
      <div class="header-search-container">
        <div class="search-input-wrapper">
          <i data-lucide="search" class="search-icon-left"></i>
          <input type="text" class="header-search-input" placeholder="Search anime..." aria-label="Search anime">
          <i data-lucide="x" class="clear-search-btn"></i>
        </div>
        <div class="autocomplete-dropdown"></div>
      </div>

      <div class="header-right">
        <button class="mobile-search-btn btn-icon" aria-label="Open search">
          <i data-lucide="search"></i>
        </button>
        
        <!-- Profile Dropdown -->
        <div class="profile-dropdown-wrapper">
          <button class="avatar-btn" aria-label="User menu" aria-haspopup="true">
            <img src="${avatarSrc}" alt="${profile.displayName}'s Avatar">
          </button>
          <div class="profile-dropdown">
            <div class="dropdown-user-info">
              <div class="dropdown-username">${profile.displayName}</div>
              <div class="dropdown-role">Premium Member</div>
            </div>
            <a href="profile.html" class="dropdown-item">
              <i data-lucide="user" style="width:14px; height:14px;"></i> View Profile
            </a>
            <a href="library.html?tab=watchlist" class="dropdown-item">
              <i data-lucide="bookmark" style="width:14px; height:14px;"></i> Library
            </a>
            <a href="library.html?tab=history" class="dropdown-item">
              <i data-lucide="history" style="width:14px; height:14px;"></i> Watch History
            </a>
            <a href="library.html?tab=favorites" class="dropdown-item">
              <i data-lucide="heart" style="width:14px; height:14px;"></i> Favourites
            </a>
            <a href="profile.html#preferences" class="dropdown-item">
              <i data-lucide="settings" style="width:14px; height:14px;"></i> Settings
            </a>
          </div>
        </div>

        <button class="mobile-hamburger btn-icon" aria-label="Open navigation menu">
          <i data-lucide="menu"></i>
        </button>
      </div>
    </div>
  `;

  // 2. Render Footer (Identical on ALL pages)
  let footer = document.querySelector('footer.footer');
  if (!footer) {
    footer = document.createElement('footer');
    footer.className = 'footer';
    document.body.appendChild(footer);
  }

  footer.innerHTML = `
    <div class="footer-content">
      <img src="${logoBanner}" alt="NamiTube Logo" class="footer-logo">
      <p class="footer-tagline">Your premium destination for anime streaming.</p>
      
      <div class="footer-social-row">
        <a href="#" class="social-icon-link" aria-label="Discord"><i data-lucide="message-square"></i></a>
        <a href="#" class="social-icon-link" aria-label="Twitter"><i data-lucide="twitter"></i></a>
        <a href="#" class="social-icon-link" aria-label="Reddit"><i data-lucide="chrome"></i></a>
        <a href="#" class="social-icon-link" aria-label="Telegram"><i data-lucide="send"></i></a>
        <a href="#" class="social-icon-link" aria-label="GitHub"><i data-lucide="github"></i></a>
      </div>
      
      <div class="footer-divider"></div>
      
      <p class="footer-disclaimer">
        This site does not store any files on its server. All contents are provided by non-affiliated third parties.
      </p>
      
      <p class="footer-copyright">
        © 2025 NamiTube. All rights reserved. Not affiliated with MyAnimeList or AniList.
      </p>
    </div>
  `;

  // 3. Render Mobile Menu Drawer
  let mobileMenu = document.querySelector('.mobile-menu-overlay');
  if (!mobileMenu) {
    mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu-overlay';
    document.body.appendChild(mobileMenu);
  }

  mobileMenu.innerHTML = `
    <div class="mobile-menu-panel">
      <div class="mobile-menu-header">
        <img src="${logoBanner}" alt="NamiTube Logo" style="max-height: 28px;">
        <button class="mobile-close-btn btn-icon" aria-label="Close menu">
          <i data-lucide="x"></i>
        </button>
      </div>
      <nav class="mobile-nav-links">
        <a href="home.html" class="mobile-nav-link ${activeHome}">Home</a>
        <a href="schedule.html" class="mobile-nav-link ${activeSchedule}">Schedule</a>
        <a href="library.html" class="mobile-nav-link ${activeLibrary}">Library</a>
        <a href="search.html" class="mobile-nav-link ${activeSearch}">Search</a>
        <a href="donate.html" class="mobile-nav-link ${activeDonate}">Donate</a>
      </nav>
      <div class="mobile-profile-section">
        <img src="${avatarSrc}" alt="${profile.displayName}'s Avatar" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 1px solid var(--color-border);">
        <div class="mobile-profile-info">
          <span class="mobile-username">${profile.displayName}</span>
          <a href="profile.html" style="font-size: 0.8rem; color: var(--color-accent);">View Profile</a>
        </div>
      </div>
    </div>
  `;

  // 4. Render Mobile Search Overlay
  let mobileSearch = document.querySelector('.mobile-search-overlay');
  if (!mobileSearch) {
    mobileSearch = document.createElement('div');
    mobileSearch.className = 'mobile-search-overlay';
    document.body.appendChild(mobileSearch);
  }

  mobileSearch.innerHTML = `
    <div class="mobile-search-wrapper">
      <i data-lucide="search" class="search-icon-left"></i>
      <input type="text" class="mobile-search-input" placeholder="Search anime...">
    </div>
    <button class="mobile-search-close btn-icon" aria-label="Close search">
      <i data-lucide="x"></i>
    </button>
  `;

  // 5. Setup Events & Functionality
  setupHeaderEvents(header, mobileMenu, mobileSearch);

  // Trigger Lucide Icons Render
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * Event bindings for shared header and menus
 */
function setupHeaderEvents(header, mobileMenu, mobileSearch) {
  // Avatar Dropdown Toggle
  const avatarBtn = header.querySelector('.avatar-btn');
  const profileDropdown = header.querySelector('.profile-dropdown');
  
  if (avatarBtn && profileDropdown) {
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target) && !avatarBtn.contains(e.target)) {
        profileDropdown.classList.remove('active');
      }
    });
  }

  // Hamburger Mobile Menu Toggle
  const hamburgerBtn = header.querySelector('.mobile-hamburger');
  const closeMenuBtn = mobileMenu.querySelector('.mobile-close-btn');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock scrolling
    });

    const closeHandler = () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    };

    closeMenuBtn.addEventListener('click', closeHandler);
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeHandler();
    });
  }

  // Mobile Search Overlay Toggle
  const mobileSearchBtn = header.querySelector('.mobile-search-btn');
  const mobileSearchClose = mobileSearch.querySelector('.mobile-search-close');
  const mobileSearchInput = mobileSearch.querySelector('.mobile-search-input');

  if (mobileSearchBtn && mobileSearch) {
    mobileSearchBtn.addEventListener('click', () => {
      mobileSearch.classList.add('active');
      setTimeout(() => mobileSearchInput.focus(), 100);
    });

    mobileSearchClose.addEventListener('click', () => {
      mobileSearch.classList.remove('active');
    });
  }

  // Hook up Search Input Behaviors for autocomplete (Both Desktop & Mobile)
  const desktopSearchInput = header.querySelector('.header-search-input');
  const desktopDropdown = header.querySelector('.autocomplete-dropdown');
  const clearBtn = header.querySelector('.clear-search-btn');

  setupSearchAutoComplete(desktopSearchInput, desktopDropdown, clearBtn);
  setupSearchAutoComplete(mobileSearchInput, null, null, true);
}

/**
 * Common Autocomplete binder for Search
 */
function setupSearchAutoComplete(input, dropdown, clearBtn, isMobile = false) {
  if (!input) return;

  const handleSearchTrigger = (query) => {
    if (!query.trim()) return;
    // Save to search history
    let searches = JSON.parse(localStorage.getItem('namitube_recent_searches') || '[]');
    searches = [query, ...searches.filter(s => s !== query)].slice(0, 10);
    localStorage.setItem('namitube_recent_searches', JSON.stringify(searches));

    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSearchTrigger(input.value);
    }
  });

  if (clearBtn) {
    input.addEventListener('input', () => {
      if (input.value) {
        clearBtn.style.display = 'block';
      } else {
        clearBtn.style.display = 'none';
        if (dropdown) dropdown.classList.remove('active');
      }
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      if (dropdown) dropdown.classList.remove('active');
      input.focus();
    });
  }

  if (dropdown) {
    const fetchSuggestions = debounce(async (query) => {
      if (query.trim().length < 2) {
        dropdown.classList.remove('active');
        return;
      }

      try {
        const results = await NamiAPI.searchAnime(query, 1, { limit: 5 });
        if (results && results.data && results.data.length > 0) {
          dropdown.innerHTML = results.data.slice(0, 5).map(anime => `
            <div class="suggestion-item" data-id="${anime.mal_id}">
              <img src="${anime.images?.jpg?.small_image_url || anime.images?.jpg?.image_url}" alt="${anime.title}" class="suggestion-img">
              <div class="suggestion-info">
                <span class="suggestion-title">${anime.title}</span>
                <span class="suggestion-meta">${anime.type || 'TV'} • ${anime.score ? '★ ' + anime.score : 'N/A'}</span>
              </div>
            </div>
          `).join('');
          
          dropdown.classList.add('active');

          // Add click events to suggestion items
          dropdown.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
              const malId = item.getAttribute('data-id');
              window.location.href = `anime.html?id=${malId}`;
            });
          });
        } else {
          dropdown.classList.remove('active');
        }
      } catch (error) {
        console.error("Autocomplete fetch error", error);
        dropdown.classList.remove('active');
      }
    }, 300);

    input.addEventListener('input', (e) => {
      fetchSuggestions(e.target.value);
    });

    // Close on blur
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== input) {
        dropdown.classList.remove('active');
      }
    });
  }
}

/**
 * Reusable Components Renders
 */

// 1. Anime Card Component
function AnimeCard(anime, options = {}) {
  const { size = 'md', showProgress = false, showActions = true } = options;
  const malId = anime.mal_id;
  const title = anime.title;
  const posterUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '';
  const score = anime.score || 0;
  const scoreText = score ? score.toFixed(1) : 'N/A';
  const type = anime.type || 'TV';
  const episodes = anime.episodes || '?';
  const synopsis = anime.synopsis ? truncateText(anime.synopsis, 120) : 'No description available.';

  let heightClass = 'h-card-md';
  if (size === 'sm') heightClass = 'h-card-sm';
  if (size === 'lg') heightClass = 'h-card-lg';

  const isBookmarked = isInWatchlist(malId);
  const bookmarkIcon = isBookmarked ? 'bookmark-check' : 'bookmark';
  const bookmarkClass = isBookmarked ? 'bookmarked' : '';

  // Calculate history progress if requested
  let progressBarHtml = '';
  if (showProgress) {
    const profile = getProfile();
    const historyItem = profile.watchHistory.find(h => h.malId === malId);
    if (historyItem && historyItem.totalEpisodes) {
      const percentage = Math.min(100, Math.round((historyItem.episode / historyItem.totalEpisodes) * 100));
      progressBarHtml = `
        <div class="card-progress-wrapper">
          <div class="card-progress-bar" style="width: ${percentage}%"></div>
          <span class="card-progress-text">Ep ${historyItem.episode}/${historyItem.totalEpisodes}</span>
        </div>
      `;
    }
  }

  // Inject a small element or style block inside js for AnimeCard styling if not in css/home.css etc
  const cardElement = document.createElement('div');
  cardElement.className = `anime-card ${heightClass} anime-card-stagger`;
  cardElement.innerHTML = `
    <div class="card-poster-wrapper">
      <img src="${posterUrl}" alt="${title}" loading="lazy">
      
      <!-- Overlay details on hover -->
      <div class="card-hover-overlay">
        <p class="card-hover-synopsis">${synopsis}</p>
        <a href="anime.html?id=${malId}" class="card-hover-btn btn btn-primary btn-sm">
          <i data-lucide="play" style="width: 14px; height: 14px; fill: currentColor;"></i> Watch Now
        </a>
      </div>

      <div class="card-badges">
        <span class="card-badge score-badge">
          <i data-lucide="star" style="width: 10px; height: 10px; fill: var(--color-gold); color: var(--color-gold);"></i> ${scoreText}
        </span>
        <span class="card-badge type-badge">${type}</span>
      </div>

      ${showActions ? `
        <button class="card-action-btn bookmark-btn ${bookmarkClass}" aria-label="Add to Watchlist" data-id="${malId}">
          <i data-lucide="bookmark" style="width: 16px; height: 16px;"></i>
        </button>
      ` : ''}

      ${progressBarHtml}
    </div>
    <div class="card-info">
      <h3 class="card-title" title="${title}">
        <a href="anime.html?id=${malId}">${title}</a>
      </h3>
      <span class="card-episode-count">${episodes} Episodes</span>
    </div>
  `;

  // Add click handler for watchlist action button
  if (showActions) {
    const btn = cardElement.querySelector('.bookmark-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggleWatchlist({ malId, title, posterUrl, score });
        if (added) {
          btn.classList.add('bookmarked');
          Toast(`Added "${truncateText(title, 20)}" to Watchlist!`, 'success');
        } else {
          btn.classList.remove('bookmarked');
          Toast(`Removed "${truncateText(title, 20)}" from Watchlist.`, 'info');
        }
      });
    }
  }

  // Return HTML string if we want, or the element. Let's return the outerHTML and hook events after, or return the element itself.
  // Actually, returning the element makes event binding reliable! Let's return the Element.
  return cardElement;
}

// 2. Skeleton Card Component
function SkeletonCard(size = 'md') {
  const container = document.createElement('div');
  container.innerHTML = generateSkeletonCardHtml(size);
  return container.firstElementChild;
}

// 3. Episode Strip Component (used on watch.html)
function EpisodeStrip(episodes, currentEp, onSelect) {
  const container = document.createElement('div');
  container.className = 'episode-strip-container';
  
  // Custom scroll container
  const strip = document.createElement('div');
  strip.className = 'episode-strip-scroll';

  // Apply virtual scrolling concept if episodes count > 100
  // But standard high performance render with lazy image also works fine. Let's implement full virtual scroll!
  const totalEpisodes = episodes.length;
  episodes.forEach((ep, index) => {
    const epNum = ep.episode_id || (index + 1);
    const title = ep.title || `Episode ${epNum}`;
    const activeClass = (epNum === Number(currentEp)) ? 'active' : '';
    
    // Create a simple episode card
    const epCard = document.createElement('button');
    epCard.className = `episode-strip-card ${activeClass}`;
    epCard.innerHTML = `
      <div class="ep-strip-number">EP ${epNum}</div>
      <div class="ep-strip-title" title="${title}">${truncateText(title, 24)}</div>
    `;
    
    epCard.addEventListener('click', () => {
      onSelect(epNum);
    });
    
    strip.appendChild(epCard);
  });

  container.appendChild(strip);
  return container;
}

// 4. Hero Spotlight Slider Component (Used on home.html and index.html)
function HeroSpotlight(animeList, isLanding = false) {
  const container = document.createElement('div');
  container.className = `hero-spotlight-slider ${isLanding ? 'landing-hero' : ''}`;
  
  let slidesHtml = '';
  animeList.forEach((anime, idx) => {
    const malId = anime.mal_id;
    const title = anime.title;
    const genres = anime.genres ? anime.genres.map(g => g.name).slice(0, 3).join(' • ') : '';
    const score = anime.score || 'N/A';
    const synopsis = anime.synopsis ? truncateText(anime.synopsis, 220) : 'No description available.';
    
    // Best banner image: trailer maximum, then trailer image, then poster large
    const bannerUrl = anime.trailer?.images?.maximum_image_url || 
                      anime.trailer?.images?.large_image_url || 
                      anime.images?.jpg?.large_image_url || '';

    slidesHtml += `
      <div class="hero-slide ${idx === 0 ? 'active' : ''}" style="background-image: linear-gradient(to top, var(--color-bg-primary) 0%, rgba(10,10,15,0.4) 60%, rgba(10,10,15,0.7) 100%), url('${bannerUrl}');">
        <div class="container hero-slide-content">
          <div class="hero-slide-info reveal active">
            ${score ? `<div class="hero-score-badge"><i data-lucide="star" style="width:12px; height:12px; fill: var(--color-gold); color:var(--color-gold)"></i> <span>${score} Rating</span></div>` : ''}
            <h1 class="hero-title">${title}</h1>
            <p class="hero-genres">${genres}</p>
            <p class="hero-synopsis">${synopsis}</p>
            <div class="hero-ctas">
              <a href="anime.html?id=${malId}" class="btn btn-primary btn-lg">
                <i data-lucide="play" style="fill:currentColor;"></i> Watch Now
              </a>
              <button class="btn btn-secondary btn-lg hero-watchlist-add" data-id="${malId}">
                <i data-lucide="plus"></i> Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  const controlsHtml = animeList.length > 1 ? `
    <div class="hero-controls">
      <button class="hero-control-btn prev" aria-label="Previous slide"><i data-lucide="chevron-left"></i></button>
      <button class="hero-control-btn next" aria-label="Next slide"><i data-lucide="chevron-right"></i></button>
    </div>
    <div class="hero-indicators">
      ${animeList.map((_, idx) => `<span class="hero-indicator ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>`).join('')}
    </div>
  ` : '';

  container.innerHTML = slidesHtml + controlsHtml;

  // Watchlist toggle handler
  animeList.forEach((anime) => {
    const malId = anime.mal_id;
    const btn = container.querySelector(`.hero-watchlist-add[data-id="${malId}"]`);
    if (btn) {
      const isAdded = isInWatchlist(malId);
      if (isAdded) {
        btn.innerHTML = `<i data-lucide="check"></i> Added`;
      }
      btn.addEventListener('click', () => {
        const title = anime.title;
        const posterUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
        const score = anime.score || 0;
        const added = toggleWatchlist({ malId, title, posterUrl, score });
        if (added) {
          btn.innerHTML = `<i data-lucide="check"></i> Added`;
          Toast(`Added to Watchlist!`, 'success');
        } else {
          btn.innerHTML = `<i data-lucide="plus"></i> Watchlist`;
          Toast(`Removed from Watchlist.`, 'info');
        }
        if (window.lucide) window.lucide.createIcons();
      });
    }
  });

  // Slider controls logic
  let activeIndex = 0;
  const slides = container.querySelectorAll('.hero-slide');
  const indicators = container.querySelectorAll('.hero-indicator');
  const totalSlides = slides.length;

  const goToSlide = (idx) => {
    if (idx < 0) idx = totalSlides - 1;
    if (idx >= totalSlides) idx = 0;
    
    slides[activeIndex].classList.remove('active');
    indicators[activeIndex]?.classList.remove('active');
    
    slides[idx].classList.add('active');
    indicators[idx]?.classList.add('active');
    
    activeIndex = idx;
  };

  const nextSlide = () => goToSlide(activeIndex + 1);
  const prevSlide = () => goToSlide(activeIndex - 1);

  // Auto-slide every 10 seconds (or 8 for landing page)
  const intervalTime = isLanding ? 8000 : 10000;
  let sliderInterval = setInterval(nextSlide, intervalTime);

  const resetInterval = () => {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(nextSlide, intervalTime);
  };

  const nextBtn = container.querySelector('.hero-control-btn.next');
  const prevBtn = container.querySelector('.hero-control-btn.prev');

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
  }

  indicators.forEach(ind => {
    ind.addEventListener('click', () => {
      const targetIdx = Number(ind.getAttribute('data-index'));
      goToSlide(targetIdx);
      resetInterval();
    });
  });

  return container;
}

// 5. Toast Notification System
function Toast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} toast-enter`;
  
  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle';
  if (type === 'error') iconName = 'alert-triangle';
  if (type === 'warning') iconName = 'alert-circle';

  toast.innerHTML = `
    <i data-lucide="${iconName}" style="flex-shrink: 0;"></i>
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Dismiss">
      <i data-lucide="x" style="width: 14px; height: 14px;"></i>
    </button>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  const dismiss = () => {
    toast.classList.remove('toast-enter');
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  };

  toast.querySelector('.toast-close').addEventListener('click', dismiss);
  setTimeout(dismiss, 3000);
}

// 6. Centred Overlay Modal Component
function Modal(title, content, actions = []) {
  // Clear any existing modals
  const oldModal = document.querySelector('.modal-overlay');
  if (oldModal) oldModal.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  const container = document.createElement('div');
  container.className = 'modal-container';
  
  let actionsHtml = '';
  actions.forEach((act, idx) => {
    actionsHtml += `<button class="btn ${act.primary ? 'btn-primary' : 'btn-secondary'}" data-index="${idx}">${act.label}</button>`;
  });

  container.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">${title}</h3>
      <button class="modal-close" aria-label="Close modal"><i data-lucide="x"></i></button>
    </div>
    <div class="modal-content">${content}</div>
    <div class="modal-actions">${actionsHtml}</div>
  `;

  overlay.appendChild(container);
  document.body.appendChild(overlay);
  if (window.lucide) window.lucide.createIcons();

  // Focus trap implementation
  const focusable = container.querySelectorAll('button, [tabindex="0"]');
  const firstFocus = focusable[0];
  const lastFocus = focusable[focusable.length - 1];

  setTimeout(() => {
    overlay.classList.add('active');
    if (firstFocus) firstFocus.focus();
  }, 50);

  const closeModal = () => {
    overlay.classList.remove('active');
    overlay.addEventListener('transitionend', () => {
      overlay.remove();
    });
  };

  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  
  // Attach action button callbacks
  container.querySelectorAll('.modal-actions button').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-index'));
      const action = actions[idx];
      if (action.callback) action.callback(closeModal);
      else closeModal();
    });
  });

  // Handle ESC key
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

// 7. Rating Stars Component (1-10 slider or stars)
function RatingStars(value, onChange) {
  const container = document.createElement('div');
  container.className = 'rating-stars-component';
  
  let starsHtml = '';
  for (let i = 1; i <= 10; i++) {
    const isSelected = i <= value ? 'selected' : '';
    starsHtml += `
      <button class="rating-star-btn ${isSelected}" data-val="${i}" aria-label="Rate ${i} Stars">
        <i data-lucide="star" style="width: 18px; height: 18px;"></i>
      </button>
    `;
  }

  container.innerHTML = `
    <div class="stars-row">${starsHtml}</div>
    <div class="stars-value-label">${value ? value + '/10' : 'Unrated'}</div>
  `;

  const btns = container.querySelectorAll('.rating-star-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = Number(btn.getAttribute('data-val'));
      onChange(val);
      
      // Update view
      container.querySelector('.stars-value-label').textContent = val + '/10';
      btns.forEach(b => {
        const bVal = Number(b.getAttribute('data-val'));
        if (bVal <= val) b.classList.add('selected');
        else b.classList.remove('selected');
      });
    });
  });

  if (window.lucide) window.lucide.createIcons();
  return container;
}

// Inject styles for components dynamically
(function injectComponentStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Anime Card Styles */
    .anime-card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: var(--transition);
      height: 100%;
      flex-shrink: 0;
      width: 100%;
    }
    .anime-card:hover {
      transform: translateY(-4px);
      border-color: var(--color-accent);
      box-shadow: 0 10px 20px var(--color-accent-glow);
    }
    .card-poster-wrapper {
      aspect-ratio: 3/4;
      position: relative;
      overflow: hidden;
      background: var(--color-bg-secondary);
    }
    .card-poster-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--transition);
    }
    .anime-card:hover .card-poster-wrapper img {
      transform: scale(1.05);
    }
    .card-hover-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(10, 10, 15, 0.9);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 16px;
      opacity: 0;
      transition: var(--transition);
      text-align: center;
    }
    .anime-card:hover .card-hover-overlay {
      opacity: 1;
    }
    .card-hover-synopsis {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      line-height: 1.4;
      margin-bottom: 16px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
    }
    .card-hover-btn {
      padding: 6px 12px;
      font-size: 0.75rem;
    }
    .card-badges {
      position: absolute;
      top: 10px;
      left: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      pointer-events: none;
    }
    .card-badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: var(--radius-sm);
      color: var(--color-text-primary);
      backdrop-filter: blur(8px);
    }
    .score-badge {
      background: rgba(10, 10, 15, 0.75);
      display: flex;
      align-items: center;
      gap: 4px;
      border: 1px solid rgba(245, 200, 66, 0.2);
    }
    .type-badge {
      background: rgba(108, 99, 255, 0.75);
      border: 1px solid rgba(108, 99, 255, 0.4);
    }
    .card-action-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(10, 10, 15, 0.75);
      border: 1px solid var(--color-border);
      color: var(--color-text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);
    }
    .card-action-btn:hover, .card-action-btn.bookmarked {
      background: var(--color-accent);
      border-color: var(--color-accent-light);
      color: var(--color-text-primary);
    }
    
    .card-progress-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 20px;
      background: rgba(10, 10, 15, 0.85);
      display: flex;
      align-items: center;
      padding: 0 8px;
    }
    .card-progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: var(--color-accent);
    }
    .card-progress-text {
      font-size: 0.7rem;
      color: var(--color-text-secondary);
      font-weight: 500;
      z-index: 1;
    }

    .card-info {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex-grow: 1;
    }
    .card-title {
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 2.8em;
    }
    .card-episode-count {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }

    /* Hero Spotlight Slider Styles */
    .hero-spotlight-slider {
      width: 100%;
      height: 480px;
      position: relative;
      overflow: hidden;
      border-radius: var(--radius-lg);
      margin-bottom: 40px;
    }
    .hero-spotlight-slider.landing-hero {
      height: 100vh;
      border-radius: 0;
      margin-bottom: 0;
    }
    .hero-slide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      opacity: 0;
      transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1;
    }
    .hero-slide.active {
      opacity: 1;
      z-index: 2;
    }
    .hero-slide-content {
      width: 100%;
    }
    .hero-slide-info {
      max-width: 560px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .hero-score-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(10, 10, 15, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      color: var(--color-text-primary);
      width: fit-content;
      backdrop-filter: blur(8px);
    }
    .hero-title {
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1.2;
    }
    .hero-genres {
      font-size: 0.85rem;
      color: var(--color-accent-light);
      font-weight: 500;
    }
    .hero-synopsis {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      line-height: 1.5;
      margin-bottom: 8px;
    }
    .hero-ctas {
      display: flex;
      gap: 12px;
    }
    
    .hero-controls {
      position: absolute;
      bottom: 24px;
      right: 24px;
      display: flex;
      gap: 12px;
      z-index: 10;
    }
    .hero-control-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(10, 10, 15, 0.6);
      border: 1px solid rgba(255,255,255,0.06);
      color: var(--color-text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(8px);
      transition: var(--transition);
    }
    .hero-control-btn:hover {
      background: var(--color-accent);
      border-color: var(--color-accent-light);
    }
    .hero-indicators {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 10;
    }
    .hero-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: var(--transition);
    }
    .hero-indicator.active {
      background: var(--color-accent);
      width: 24px;
      border-radius: 4px;
    }

    /* Rating Stars Styles */
    .rating-stars-component {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .stars-row {
      display: flex;
      gap: 4px;
    }
    .rating-star-btn {
      color: var(--color-text-muted);
      cursor: pointer;
      transition: var(--transition);
    }
    .rating-star-btn:hover, .rating-star-btn.selected {
      color: var(--color-gold);
      transform: scale(1.15);
    }
    .stars-value-label {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
      font-weight: 500;
    }

    /* Episode Strip Styles */
    .episode-strip-container {
      width: 100%;
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 12px;
    }
    .episode-strip-scroll {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 6px;
    }
    .episode-strip-card {
      flex: 0 0 140px;
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 10px;
      text-align: left;
      cursor: pointer;
      transition: var(--transition);
    }
    .episode-strip-card:hover {
      border-color: var(--color-accent);
      background: var(--color-bg-hover);
    }
    .episode-strip-card.active {
      border-color: var(--color-accent);
      background: var(--color-accent-glow);
    }
    .ep-strip-number {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--color-accent-light);
      margin-bottom: 4px;
    }
    .ep-strip-title {
      font-size: 0.8rem;
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;
  document.head.appendChild(style);
})();

// Automatic render of global header and footer
document.addEventListener('DOMContentLoaded', () => {
  renderSharedLayout();

  // IntersectionObserver for Reveal on Scroll (.reveal)
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
  }
});
