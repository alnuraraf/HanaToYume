/* ============================================
   NamiTube — Anime Detail Page Script
   ============================================ */

const DISQUS_SHORTNAME = 'coolsanime';

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const animeId = parseInt(params.get('id'));
  if (!animeId) { window.location.href = '404.html'; return; }

  try {
    const data = await fetchAnimeDetail(animeId);
    const media = data.Media;
    if (!media) { window.location.href = '404.html'; return; }

    const title = getTitle(media);
    document.title = `${title} — NamiTube`;

    /* Update OG tags */
    const setMeta = (sel, val) => { const m = document.querySelector(sel); if (m) m.setAttribute('content', val); };
    setMeta('meta[property="og:title"]', `${title} — NamiTube`);
    setMeta('meta[property="og:description"]', truncate(stripHtml(media.description), 155));
    setMeta('meta[property="og:image"]', getBanner(media));
    setMeta('meta[name="twitter:title"]', `${title} — NamiTube`);
    setMeta('meta[name="twitter:image"]', getBanner(media));

    renderAnimeDetail(media);
  } catch (e) {
    document.getElementById('animeContent').innerHTML = `
      <div class="empty-state" style="padding-top:120px;">
        ${ICONS.alertCircle}
        <h3>Failed to load anime details</h3>
        <p>Please try refreshing the page.</p>
        <a href="index.html" class="btn-primary">Go Home</a>
      </div>
    `;
  }
});

function renderAnimeDetail(media) {
  const container = document.getElementById('animeContent');
  const title = getTitle(media);
  const banner = getBanner(media);
  const cover = getCover(media);
  const desc = stripHtml(media.description) || 'No description available.';
  const score = media.averageScore || 0;
  const scorePercent = score;
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (scorePercent / 100) * circumference;
  const studio = media.studios?.nodes?.[0]?.name || 'Unknown';
  const epCount = media.episodes || '?';
  const duration = media.duration ? `${media.duration} min` : '?';
  const totalEps = media.episodes || (media.nextAiringEpisode ? media.nextAiringEpisode.episode - 1 : 24);

  const inWatchlist = isInWatchlist(media.id);
  const inFavorites = isInFavorites(media.id);

  container.innerHTML = `
    <!-- Hero Banner -->
    <div class="anime-hero">
      <div class="hero-bg" style="background-image:url('${banner}')"></div>
      <div class="hero-overlay"></div>
    </div>

    <!-- Detail Grid -->
    <div class="anime-detail-grid">
      <div class="anime-cover-col">
        <img src="${cover}" alt="${title}" loading="lazy" onerror="onImgError(this)">
        <div class="score-ring">
          <svg viewBox="0 0 76 76">
            <circle class="ring-bg" cx="38" cy="38" r="34"/>
            <circle class="ring-fill" cx="38" cy="38" r="34"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${offset}"/>
          </svg>
          <div class="ring-text">${formatScore(score)}</div>
        </div>
        <div class="anime-actions">
          <a href="watch.html?id=${media.id}&ep=1" class="btn-primary">${ICONS.play} Watch Now</a>
          <button class="btn-outline" id="wlBtn" data-id="${media.id}">${inWatchlist ? ICONS.bookmarkFilled : ICONS.bookmark} ${inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</button>
          <button class="btn-outline" id="favBtn" data-id="${media.id}">${inFavorites ? ICONS.heartFilled : ICONS.heart} ${inFavorites ? 'Favorited' : 'Add to Favorites'}</button>
        </div>
      </div>
      <div class="anime-info-col">
        <h1>${title}</h1>
        ${media.title.native ? `<p class="anime-native">${media.title.native}</p>` : ''}
        <div class="anime-genres">
          ${(media.genres || []).map(g => `<a href="genre.html?name=${encodeURIComponent(g)}" class="genre-pill">${g}</a>`).join('')}
        </div>
        <p class="anime-synopsis">${desc}</p>
        <div class="info-stats-grid">
          <div class="info-stat"><div class="label">Episodes</div><div class="value">${epCount}</div></div>
          <div class="info-stat"><div class="label">Duration</div><div class="value">${duration}</div></div>
          <div class="info-stat"><div class="label">Status</div><div class="value">${formatStatus(media.status)}</div></div>
          <div class="info-stat"><div class="label">Season</div><div class="value">${media.season || '?'} ${media.seasonYear || ''}</div></div>
          <div class="info-stat"><div class="label">Studio</div><div class="value">${studio}</div></div>
          <div class="info-stat"><div class="label">Format</div><div class="value">${formatFormat(media.format)}</div></div>
          <div class="info-stat"><div class="label">Source</div><div class="value">${media.source || '?'}</div></div>
          <div class="info-stat"><div class="label">Score</div><div class="value">${formatScore(score)}/10</div></div>
        </div>

        <!-- Episode List -->
        <div id="episodeSection">
          <h2 class="section-title" style="margin-bottom:12px">Episodes</h2>
          <div class="lang-tabs" style="margin-bottom:12px">
            <button class="lang-tab active" data-lang="sub">SUB</button>
            <button class="lang-tab" data-lang="dub">DUB</button>
          </div>
          <div class="episode-grid" id="episodeGrid"></div>
        </div>
      </div>
    </div>

    <!-- Characters -->
    ${media.characters?.edges?.length ? `
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Characters & Voice Actors</h2>
      </div>
      <div id="charCarousel"></div>
    </section>
    ` : ''}

    <!-- Relations -->
    ${media.relations?.edges?.length ? `
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Relations</h2>
      </div>
      <div id="relationsCarousel"></div>
    </section>
    ` : ''}

    <!-- Recommendations -->
    ${media.recommendations?.nodes?.length ? `
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Recommendations</h2>
      </div>
      <div id="recsCarousel"></div>
    </section>
    ` : ''}

    <!-- Comments -->
    <section class="section comment-section" aria-label="Comments">
      <h3 class="section-title">Discussion</h3>
      <div id="disqus_thread"></div>
      <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
    </section>
  `;

  /* Episode grid */
  const epGrid = document.getElementById('episodeGrid');
  let currentLang = 'sub';

  function renderEpisodes() {
    const history = getHistory();
    const watchedEps = new Set(history.filter(h => h.animeId === media.id).map(h => h.episode));
    let eps = '';
    for (let i = 1; i <= totalEps; i++) {
      const watched = watchedEps.has(i);
      eps += `<a href="watch.html?id=${media.id}&ep=${i}&lang=${currentLang}" class="ep-btn ${watched ? 'watched' : ''}">${i}</a>`;
    }
    epGrid.innerHTML = eps;
  }
  renderEpisodes();

  document.querySelectorAll('#episodeSection .lang-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#episodeSection .lang-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentLang = tab.dataset.lang;
      renderEpisodes();
    });
  });

  /* Watchlist / Favorite buttons */
  document.getElementById('wlBtn').addEventListener('click', () => {
    const anime = { animeId: media.id, title, cover: getCover(media), addedAt: new Date().toISOString() };
    const added = toggleWatchlist(anime);
    const btn = document.getElementById('wlBtn');
    btn.innerHTML = `${added ? ICONS.bookmarkFilled : ICONS.bookmark} ${added ? 'In Watchlist' : 'Add to Watchlist'}`;
    showToast(added ? 'Added to Watchlist' : 'Removed from Watchlist', 'success');
  });

  document.getElementById('favBtn').addEventListener('click', () => {
    const anime = { animeId: media.id, title, cover: getCover(media), addedAt: new Date().toISOString() };
    const added = toggleFavorite(anime);
    const btn = document.getElementById('favBtn');
    btn.innerHTML = `${added ? ICONS.heartFilled : ICONS.heart} ${added ? 'Favorited' : 'Add to Favorites'}`;
    showToast(added ? 'Added to Favorites' : 'Removed from Favorites', 'success');
  });

  /* Characters Carousel (5.6) */
  if (media.characters?.edges?.length) {
    const charCards = media.characters.edges.map(edge => {
      const char = edge.node;
      const va = edge.voiceActors?.[0];
      return `
        <div class="char-card">
          <img src="${char.image?.large || 'assets/img/placeholder-cover.svg'}" alt="${char.name.full}" loading="lazy" onerror="onImgError(this)">
          <div class="char-name">${char.name.full}</div>
          ${va ? `<div class="char-va">${va.name.full}</div>` : ''}
        </div>
      `;
    });
    buildCarousel('charCarousel', charCards, { scrollAmount: 300 });
  }

  /* Relations */
  if (media.relations?.edges?.length) {
    const relCards = media.relations.edges.filter(e => e.node.format !== 'MANGA' && e.node.format !== 'NOVEL').map(edge => {
      const r = edge.node;
      return renderPortraitCard({
        id: r.id,
        title: r.title,
        coverImage: r.coverImage,
        averageScore: r.averageScore,
        format: r.format,
        episodes: null
      });
    });
    if (relCards.length) buildCarousel('relationsCarousel', relCards);
  }

  /* Recommendations */
  if (media.recommendations?.nodes?.length) {
    const recCards = media.recommendations.nodes
      .filter(n => n.mediaRecommendation)
      .map(n => {
        const r = n.mediaRecommendation;
        return renderPortraitCard({
          id: r.id,
          title: r.title,
          coverImage: r.coverImage,
          averageScore: r.averageScore,
          format: r.format,
          episodes: r.episodes
        });
      });
    if (recCards.length) buildCarousel('recsCarousel', recCards);
  }

  /* Disqus */
  loadDisqus(`anime-${media.id}`, `${location.origin}${location.pathname}?id=${media.id}`);
}

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
