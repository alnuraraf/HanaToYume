/* ===== NamiTube — Home Page ===== */

document.addEventListener('DOMContentLoaded', async () => {
  loadHeroCarousel();
  loadContinueWatching();
  loadTrending();
  loadTicker();
  loadTop10();
  loadCurrentlyAiring();
  loadCollectionSpotlight();
  loadGenreShowcase();
  loadStatsCounter();
  loadMovieSpotlight();
  loadSeasonalCountdown();
});

/* ---------- Hero Spotlight Carousel ---------- */
async function loadHeroCarousel() {
  const container = document.getElementById('heroCarousel');
  if (!container) return;
  try {
    const data = await fetchSeasonal(1, 6);
    const media = data.Page.media;
    if (!media.length) return;

    const slidesHtml = media.map((m, i) => {
      const title = getTitle(m);
      const bg = m.bannerImage || m.coverImage?.extraLarge || '';
      const genres = (m.genres || []).slice(0, 3).map(g => `<span class="genre-pill">${g}</span>`).join('');
      const desc = stripHtml(m.description).slice(0, 180);
      const score = m.averageScore;
      return `
        <div class="hero-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
          <div class="hero-slide-bg" style="background-image:url('${bg}')"></div>
          <div class="hero-slide-overlay"></div>
          <div class="hero-content">
            <h2 class="hero-title">${title}</h2>
            <div class="hero-meta">
              ${genres}
              ${score ? `<span class="score-badge">${ICONS.star} ${formatScore(score)}</span>` : ''}
            </div>
            <p class="hero-synopsis">${desc}</p>
            <div class="hero-actions">
              <a href="watch.html?id=${m.id}&ep=1" class="btn btn-primary">${ICONS.play} Watch Now</a>
              <button class="btn btn-outline hero-watchlist-btn" data-id="${m.id}" data-title="${title}" data-cover="${m.coverImage?.large || ''}">${ICONS.bookmark} Add to Watchlist</button>
            </div>
          </div>
        </div>`;
    }).join('');

    const dotsHtml = media.map((_, i) => `
      <button class="hero-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}">
        <span class="hero-dot-progress"></span>
      </button>`).join('');

    container.innerHTML = `
      ${slidesHtml}
      <button class="hero-arrow prev" aria-label="Previous slide">${ICONS.chevronLeft}</button>
      <button class="hero-arrow next" aria-label="Next slide">${ICONS.chevronRight}</button>
      <div class="hero-dots">${dotsHtml}</div>`;

    // Hero carousel logic
    let current = 0;
    const slides = container.querySelectorAll('.hero-slide');
    const dots = container.querySelectorAll('.hero-dot');
    let autoTimer, paused = false;

    function goTo(idx) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      // Reset ken burns
      const oldBg = slides[current].querySelector('.hero-slide-bg');
      if (oldBg) { oldBg.style.animation = 'none'; oldBg.offsetHeight; oldBg.style.animation = ''; }
      current = ((idx % slides.length) + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      // Restart ken burns
      const newBg = slides[current].querySelector('.hero-slide-bg');
      if (newBg) { newBg.style.animation = 'none'; newBg.offsetHeight; newBg.style.animation = 'kenBurns 10s ease forwards'; }
      resetAuto();
    }

    function resetAuto() {
      clearInterval(autoTimer);
      // Restart dot progress
      dots.forEach(d => { const p = d.querySelector('.hero-dot-progress'); if(p) { p.style.animation = 'none'; p.offsetHeight; p.style.animation = ''; } });
      const activeDotProgress = dots[current].querySelector('.hero-dot-progress');
      if (activeDotProgress) { activeDotProgress.style.animation = 'dotFill 7s linear forwards'; }
      if (!paused) autoTimer = setInterval(() => goTo(current + 1), 7000);
    }

    dots.forEach(d => d.addEventListener('click', () => goTo(parseInt(d.dataset.index))));
    container.querySelector('.hero-arrow.prev')?.addEventListener('click', () => goTo(current - 1));
    container.querySelector('.hero-arrow.next')?.addEventListener('click', () => goTo(current + 1));
    container.addEventListener('mouseenter', () => { paused = true; clearInterval(autoTimer); });
    container.addEventListener('mouseleave', () => { paused = false; resetAuto(); });

    // Touch swipe
    let touchStartX = 0;
    container.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    container.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });

    resetAuto();

    // Watchlist buttons
    container.querySelectorAll('.hero-watchlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const added = toggleWatchlist({ animeId: parseInt(btn.dataset.id), title: btn.dataset.title, cover: btn.dataset.cover });
        showToast(added ? 'Added to Watchlist' : 'Removed from Watchlist', 'success');
      });
    });

  } catch (e) {
    console.error('Hero load failed:', e);
    container.innerHTML = '<div style="height:300px;display:flex;align-items:center;justify-content:center;color:var(--text-muted)">Could not load spotlight. Refresh to try again.</div>';
  }
}

/* ---------- Continue Watching ---------- */
function loadContinueWatching() {
  const section = document.getElementById('continueWatching');
  if (!section) return;
  const history = getHistory();
  if (!history.length) { section.style.display = 'none'; return; }
  const unique = [];
  const seen = new Set();
  for (const e of history) {
    if (!seen.has(e.animeId)) { seen.add(e.animeId); unique.push(e); }
    if (unique.length >= 12) break;
  }
  const items = unique.map(e => renderContinueWatchingCard(e)).join('');
  buildCarousel('continueWatching', items, { title: 'Continue Watching', link: 'history.html', linkText: 'View History' });
}

/* ---------- Trending Now ---------- */
async function loadTrending() {
  const container = document.getElementById('trendingNow');
  if (!container) return;
  container.innerHTML = `<div class="section-header"><h2 class="section-title">Trending Now</h2></div><div class="carousel-container"><div class="carousel-track">${renderSkeletonCards(8)}</div></div>`;
  try {
    const data = await fetchTrending(1, 20);
    const items = data.Page.media.map(m => renderPortraitCard(m)).join('');
    buildCarousel('trendingNow', items, { title: 'Trending Now', link: 'catalog.html?view=trending', linkText: 'View All' });
  } catch { renderErrorState('trendingNow'); }
}

/* ---------- Ticker ---------- */
async function loadTicker() {
  const wrap = document.getElementById('ticker');
  if (!wrap) return;
  try {
    const data = await fetchCurrentlyAiring(1, 20);
    const media = data.Page.media.filter(m => m.nextAiringEpisode);
    if (!media.length) { wrap.style.display = 'none'; return; }
    const itemsHtml = media.map(m => `
      <a href="watch.html?id=${m.id}&ep=${Math.max(1,(m.nextAiringEpisode?.episode||1)-1)}" class="ticker-item">
        <img src="${m.coverImage?.large || 'assets/img/placeholder-cover.svg'}" alt="${getTitle(m)}" onerror="imgError(this)">
        <span class="ti-title">${getTitle(m)}</span>
        <span class="ti-ep">EP ${(m.nextAiringEpisode?.episode || 1) - 1}</span>
      </a>
    `).join('');
    wrap.querySelector('.ticker-track').innerHTML = itemsHtml + itemsHtml;
  } catch { wrap.style.display = 'none'; }
}

/* ---------- Top 10 ---------- */
async function loadTop10() {
  const container = document.getElementById('top10');
  if (!container) return;
  container.innerHTML = `<div class="section-header"><h2 class="section-title">Top 10 This Week</h2></div><div class="carousel-container"><div class="carousel-track">${renderSkeletonCards(10)}</div></div>`;
  try {
    const data = await fetchTopRated(1, 10);
    const items = data.Page.media.map((m, i) => renderRankedCard(m, i + 1)).join('');
    buildCarousel('top10', items, { title: 'Top 10 This Week', link: 'catalog.html?view=top-rated', linkText: 'View All' });
  } catch { renderErrorState('top10'); }
}

/* ---------- Currently Airing ---------- */
async function loadCurrentlyAiring() {
  const container = document.getElementById('currentlyAiring');
  if (!container) return;
  container.innerHTML = `<div class="section-header"><h2 class="section-title">Currently Airing</h2></div><div class="carousel-container"><div class="carousel-track">${renderSkeletonCards(8)}</div></div>`;
  try {
    const data = await fetchCurrentlyAiring(1, 20);
    const items = data.Page.media.map(m => renderPortraitCard(m)).join('');
    buildCarousel('currentlyAiring', items, { title: 'Currently Airing', link: 'catalog.html?view=trending' });
  } catch { renderErrorState('currentlyAiring'); }
}

/* ---------- Collection Spotlight ---------- */
function loadCollectionSpotlight() {
  const container = document.getElementById('collectionSpotlight');
  if (!container) return;

  const collections = [
    { title: 'Award Winners', desc: 'Critically acclaimed masterpieces', link: 'catalog.html?view=top-rated', bg: 'radial-gradient(circle at 30% 70%, rgba(108,99,255,0.3), transparent 60%), linear-gradient(135deg, #1a0a2e, #0d1117)' },
    { title: 'Hidden Gems', desc: 'Underrated anime worth discovering', link: 'genre.html?name=Slice%20of%20Life', bg: 'radial-gradient(circle at 70% 30%, rgba(255,107,157,0.3), transparent 60%), linear-gradient(135deg, #0d1117, #1a0a2e)' },
    { title: 'Studio Picks', desc: 'Best from top animation studios', link: 'catalog.html?view=popular', bg: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.2), transparent 60%), linear-gradient(135deg, #0a0f0a, #111118)' },
  ];

  // "Because You Watched" personalized
  const history = getHistory();
  if (history.length > 0) {
    // We'll try to get a genre from the first history item
    collections.push({
      title: `Because You Watched "${history[0].title}"`,
      desc: 'Explore similar titles',
      link: 'catalog.html?view=trending',
      bg: 'radial-gradient(circle at 40% 60%, rgba(245,158,11,0.25), transparent 60%), linear-gradient(135deg, #1a1000, #111118)'
    });
  }

  container.innerHTML = `
    <div class="section-header"><h2 class="section-title">Collections</h2></div>
    <div class="collection-grid">
      ${collections.map(c => `
        <a href="${c.link}" class="collection-card">
          <div class="collection-card-bg" style="background:${c.bg}"></div>
          <div class="collection-card-content">
            <div class="collection-card-title">${c.title}</div>
            <div class="collection-card-desc">${c.desc}</div>
          </div>
        </a>
      `).join('')}
    </div>`;
}

/* ---------- Genre Showcase ---------- */
async function loadGenreShowcase() {
  const container = document.getElementById('byGenre');
  if (!container) return;

  const genres = ALL_GENRES.slice(0, 12);
  let activeGenre = genres[0];

  function renderPills() {
    return genres.map(g => `<button class="genre-pill ${g === activeGenre ? 'active' : ''}" data-genre="${g}">${g}</button>`).join('');
  }

  async function loadGenreGrid(genre) {
    const gridEl = container.querySelector('.genre-grid-content');
    if (gridEl) gridEl.innerHTML = renderSkeletonGrid(6);
    try {
      const data = await fetchByGenre(genre, 1, 12);
      if (gridEl) {
        gridEl.innerHTML = `<div class="card-grid">${data.Page.media.map(m => renderPortraitCard(m)).join('')}</div>`;
      }
    } catch { if (gridEl) gridEl.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:24px">Could not load. Try again.</p>'; }
  }

  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Browse by Genre</h2>
      <a href="search.html" class="section-link">All Genres ${ICONS.chevronRight}</a>
    </div>
    <div class="genre-pills" id="genrePills">${renderPills()}</div>
    <div class="genre-grid-content">${renderSkeletonGrid(6)}</div>`;

  loadGenreGrid(activeGenre);

  container.querySelector('#genrePills').addEventListener('click', e => {
    const btn = e.target.closest('.genre-pill');
    if (!btn) return;
    activeGenre = btn.dataset.genre;
    container.querySelector('#genrePills').innerHTML = renderPills();
    loadGenreGrid(activeGenre);
  });
}

/* ---------- Stats Counter ---------- */
function loadStatsCounter() {
  const bar = document.getElementById('statsBar');
  if (!bar) return;

  const stats = [
    { target: 12000, suffix: '+', label: 'Episodes Indexed' },
    { target: 5000, suffix: '+', label: 'Titles Available' },
    { target: 100, suffix: '%', label: 'Free Forever' },
    { target: 0, suffix: '', label: 'Zero Ads', display: 'Zero' },
  ];

  bar.innerHTML = stats.map((s, i) => `
    <div class="stat-item">
      <div class="stat-number" data-target="${s.target}" data-suffix="${s.suffix}" data-display="${s.display || ''}" id="stat${i}">0</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      stats.forEach((s, i) => {
        const el = document.getElementById(`stat${i}`);
        if (!el) return;
        if (s.display) { el.textContent = s.display; return; }
        animateCounter(el, s.target, s.suffix);
      });
    });
  }, { threshold: 0.3 });
  observer.observe(bar);
}

function animateCounter(el, target, suffix) {
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.floor(eased * target);
    el.textContent = val.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ---------- Movie Spotlight ---------- */
async function loadMovieSpotlight() {
  const container = document.getElementById('movieSpotlight');
  if (!container) return;
  container.innerHTML = `<div class="section-header"><h2 class="section-title">Movie Spotlight</h2></div><div class="carousel-container"><div class="carousel-track">${renderSkeletonCards(4, 'wide')}</div></div>`;
  try {
    const data = await fetchMovies(1, 10);
    const items = data.Page.media.map(m => renderWideCard(m)).join('');
    buildCarousel('movieSpotlight', items, { title: 'Movie Spotlight', link: 'catalog.html?view=movies', linkText: 'View All' });
  } catch { renderErrorState('movieSpotlight'); }
}

/* ---------- Seasonal Countdown ---------- */
function loadSeasonalCountdown() {
  const widget = document.getElementById('seasonCountdown');
  if (!widget) return;
  const target = getNextSeasonDate();
  function update() {
    const timeEl = widget.querySelector('.countdown-time');
    if (timeEl) timeEl.textContent = formatCountdown(target);
  }
  widget.innerHTML = `
    <div class="countdown-widget">
      <span class="countdown-label">Next Season Starts In</span>
      <span class="countdown-time">--:--:--:--</span>
    </div>`;
  update();
  setInterval(update, 1000);
}
