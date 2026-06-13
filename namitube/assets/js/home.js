/* ============================================
   NamiTube — Home Page Script
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  /* === Hero Spotlight Carousel (5.1) === */
  initHero();

  /* === Continue Watching (5.4) === */
  initContinueWatching();

  /* === Trending Now === */
  loadCarouselSection('trending-section', fetchTrending, 'catalog.html?view=trending');

  /* === Live Episode Ticker (5.5) === */
  initTicker();

  /* === Top 10 This Week (5.3) === */
  initTop10();

  /* === Currently Airing === */
  loadCarouselSection('airing-section', fetchCurrentlyAiring, 'catalog.html?view=popular');

  /* === Collection Spotlight (5.11) === */
  initCollections();

  /* === By Genre Showcase === */
  initByGenre();

  /* === Stats Counter (5.7) === */
  initStatsCounter();

  /* === Movie Spotlight === */
  initMovieSpotlight();
});

/* --- Hero --- */
async function initHero() {
  const heroEl = document.getElementById('heroCarousel');
  if (!heroEl) return;

  try {
    const data = await fetchSeasonalAnime(1, 6);
    const slides = data.Page.media;
    if (!slides.length) return;

    heroEl.innerHTML = slides.map((m, i) => {
      const title = getTitle(m);
      const banner = getBanner(m);
      const desc = truncate(stripHtml(m.description), 180);
      const genres = (m.genres || []).slice(0, 4).map(g => `<span class="genre-pill">${g}</span>`).join('');
      const score = m.averageScore ? `<span class="score-badge">${ICONS.star} ${formatScore(m.averageScore)}</span>` : '';

      return `
        <div class="hero-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
          <div class="hero-bg" style="background-image:url('${banner}')"></div>
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <h1 class="hero-title">${title}</h1>
            <div class="hero-meta">${genres}${score}</div>
            <p class="hero-desc">${desc}</p>
            <div class="hero-buttons">
              <a href="anime.html?id=${m.id}" class="btn-primary">${ICONS.play} Watch Now</a>
              <button class="btn-outline watchlist-hero-btn" data-id="${m.id}" data-title="${title}" data-cover="${getCover(m)}">${ICONS.bookmark} ${isInWatchlist(m.id) ? 'In Watchlist' : 'Add to Watchlist'}</button>
            </div>
          </div>
        </div>
      `;
    }).join('') + `
      <button class="hero-arrow prev" aria-label="Previous slide">${ICONS.chevronLeft}</button>
      <button class="hero-arrow next" aria-label="Next slide">${ICONS.chevronRight}</button>
      <div class="hero-dots">
        ${slides.map((_, i) => `<button class="hero-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"><div class="dot-progress"></div></button>`).join('')}
      </div>
    `;

    /* Auto advance */
    let current = 0;
    const total = slides.length;
    const INTERVAL = 7000;
    let timer;
    let paused = false;

    function goTo(idx) {
      current = ((idx % total) + total) % total;
      heroEl.querySelectorAll('.hero-slide').forEach((s, i) => s.classList.toggle('active', i === current));
      heroEl.querySelectorAll('.hero-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
        const prog = d.querySelector('.dot-progress');
        prog.style.transition = 'none';
        prog.style.width = '0%';
        if (i === current) {
          requestAnimationFrame(() => {
            prog.style.transition = `width ${INTERVAL}ms linear`;
            prog.style.width = '100%';
          });
        }
      });
    }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(() => { if (!paused) goTo(current + 1); }, INTERVAL);
      goTo(current);
    }

    heroEl.querySelector('.hero-arrow.prev').addEventListener('click', () => { goTo(current - 1); startAuto(); });
    heroEl.querySelector('.hero-arrow.next').addEventListener('click', () => { goTo(current + 1); startAuto(); });
    heroEl.querySelectorAll('.hero-dot').forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.index); startAuto(); }));

    heroEl.addEventListener('mouseenter', () => paused = true);
    heroEl.addEventListener('mouseleave', () => paused = false);

    /* Swipe */
    let touchStartX = 0;
    heroEl.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
    heroEl.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
    }, { passive: true });

    startAuto();

    /* Watchlist buttons */
    heroEl.querySelectorAll('.watchlist-hero-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const anime = { animeId: +btn.dataset.id, title: btn.dataset.title, cover: btn.dataset.cover, addedAt: new Date().toISOString() };
        const added = toggleWatchlist(anime);
        btn.innerHTML = `${ICONS.bookmark} ${added ? 'In Watchlist' : 'Add to Watchlist'}`;
        showToast(added ? 'Added to Watchlist' : 'Removed from Watchlist', 'success');
      });
    });

  } catch (e) {
    heroEl.innerHTML = '<div class="empty-state"><p>Could not load hero. Refresh to try again.</p></div>';
  }
}

/* --- Continue Watching --- */
function initContinueWatching() {
  const section = document.getElementById('continueSection');
  if (!section) return;
  const history = getHistory();
  if (!history.length) { section.style.display = 'none'; return; }

  const unique = [];
  const seen = new Set();
  for (const h of history) {
    if (!seen.has(h.animeId)) { seen.add(h.animeId); unique.push(h); }
    if (unique.length >= 12) break;
  }

  const cards = unique.map(h => renderContinueCard(h));
  buildCarousel('continue-carousel', cards, { scrollAmount: 300 });
  section.style.display = 'block';
}

/* --- Generic Carousel Section Loader --- */
async function loadCarouselSection(sectionId, fetchFn, viewAllLink) {
  try {
    const data = await fetchFn(1, 20);
    const cards = data.Page.media.map(m => renderPortraitCard(m));
    buildCarousel(sectionId + '-carousel', cards);
  } catch {
    renderError(sectionId + '-carousel', "Couldn't load this section.");
  }
}

/* --- Live Episode Ticker (5.5) --- */
async function initTicker() {
  const ticker = document.getElementById('tickerStrip');
  if (!ticker) return;

  try {
    const data = await fetchCurrentlyAiring(1, 20);
    const items = data.Page.media.filter(m => m.nextAiringEpisode).map(m => {
      const ep = m.nextAiringEpisode.episode - 1;
      return `
        <a href="watch.html?id=${m.id}&ep=${ep > 0 ? ep : 1}" class="ticker-item">
          <img src="${getCover(m)}" alt="${getTitle(m)}" loading="lazy" onerror="onImgError(this)">
          <span class="ticker-title">${getTitle(m)}</span>
          <span class="ticker-ep">EP ${ep > 0 ? ep : '?'}</span>
        </a>
      `;
    }).join('');

    if (items) {
      ticker.querySelector('.ticker-track').innerHTML = items + items;
    }
  } catch {
    ticker.style.display = 'none';
  }
}

/* --- Top 10 (5.3) --- */
async function initTop10() {
  try {
    const data = await fetchTopRated(1, 10);
    const cards = data.Page.media.map((m, i) => renderRankedCard(m, i + 1));
    buildCarousel('top10-carousel', cards, { scrollAmount: 400 });
  } catch {
    renderError('top10-carousel', "Couldn't load Top 10.");
  }
}

/* --- Collection Spotlight (5.11) --- */
function initCollections() {
  const el = document.getElementById('collectionsGrid');
  if (!el) return;

  const collections = [
    {
      title: 'Award Winners',
      desc: 'Critically acclaimed masterpieces',
      href: 'catalog.html?view=top-rated',
      bg: 'radial-gradient(circle at 30% 50%, rgba(108,99,255,0.3), transparent 70%)'
    },
    {
      title: 'Hidden Gems',
      desc: 'Under-the-radar treasures worth discovering',
      href: 'catalog.html?view=popular',
      bg: 'radial-gradient(circle at 70% 30%, rgba(255,107,157,0.3), transparent 70%)'
    },
    {
      title: 'Studio Picks',
      desc: 'Best from legendary studios',
      href: 'catalog.html?view=top-rated',
      bg: 'radial-gradient(circle at 50% 70%, rgba(34,197,94,0.2), transparent 70%)'
    }
  ];

  /* "Because You Watched..." */
  const history = getHistory();
  if (history.length) {
    const last = history[0];
    collections.push({
      title: `Because You Watched ${last.title}`,
      desc: 'Discover similar titles you might enjoy',
      href: `anime.html?id=${last.animeId}`,
      bg: 'radial-gradient(circle at 40% 60%, rgba(245,158,11,0.2), transparent 70%)'
    });
  }

  el.innerHTML = collections.map(c => `
    <a href="${c.href}" class="collection-card">
      <div class="cc-bg" style="background:${c.bg}"></div>
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
    </a>
  `).join('');
}

/* --- By Genre Showcase --- */
async function initByGenre() {
  const pills = document.getElementById('genrePills');
  const grid = document.getElementById('genreMasonry');
  if (!pills || !grid) return;

  const genres = ['Action', 'Romance', 'Comedy', 'Fantasy', 'Sci-Fi', 'Drama', 'Horror', 'Thriller'];

  pills.innerHTML = genres.map((g, i) =>
    `<button class="genre-pill-btn ${i === 0 ? 'active' : ''}" data-genre="${g}">${g}</button>`
  ).join('');

  async function loadGenre(genre) {
    grid.innerHTML = renderSkeletonCards(12);
    try {
      const data = await fetchByGenre(genre, 1, 12);
      grid.innerHTML = data.Page.media.map(m => renderPortraitCard(m)).join('');
    } catch {
      grid.innerHTML = '<div class="empty-state"><p>Failed to load. Try again.</p></div>';
    }
  }

  pills.addEventListener('click', (e) => {
    const btn = e.target.closest('.genre-pill-btn');
    if (!btn) return;
    pills.querySelectorAll('.genre-pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadGenre(btn.dataset.genre);
  });

  loadGenre(genres[0]);
}

/* --- Stats Counter (5.7) --- */
function initStatsCounter() {
  const bar = document.getElementById('statsBar');
  if (!bar) return;

  const stats = [
    { target: 12000, suffix: '+', label: 'Episodes Indexed' },
    { target: 5000, suffix: '+', label: 'Titles Available' },
    { target: 100, suffix: '%', label: 'Free Forever' },
    { target: 0, suffix: '', label: 'Ads on NamiTube', display: 'Zero Ads' },
  ];

  bar.querySelector('.stats-grid').innerHTML = stats.map((s, i) =>
    `<div class="stat-item">
      <div class="stat-number" id="statNum${i}">${s.display || '0'}</div>
      <div class="stat-label">${s.label}</div>
    </div>`
  ).join('');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stats.forEach((s, i) => {
          if (s.display) return;
          animateCount(document.getElementById(`statNum${i}`), s.target, s.suffix);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(bar);
}

function animateCount(el, target, suffix) {
  if (!el || target === 0) return;
  const duration = 2000;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* --- Movie Spotlight --- */
async function initMovieSpotlight() {
  try {
    const data = await fetchMovies(1, 6);
    const cards = data.Page.media.map(m => renderWideCard(m));
    buildCarousel('movies-carousel', cards, { scrollAmount: 300 });
  } catch {
    renderError('movies-carousel', "Couldn't load movies.");
  }
}
