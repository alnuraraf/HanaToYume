/* ===== NamiTube — Watch Page ===== */
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const anilistId = parseInt(params.get('id'));
  let episodeNum = parseInt(params.get('ep') || '1');
  let currentLang = params.get('lang') || ensurePrefs().defaultLang || 'sub';
  let currentServer = params.get('server') || ensurePrefs().defaultServer || 'MegaCloud';

  if (!anilistId) { window.location.href = 'index.html'; return; }

  const SANDBOX_DEFAULT = 'allow-scripts allow-same-origin allow-presentation allow-forms';
  const mainEl = document.getElementById('watchContent');

  function getSandboxDisabled() {
    return JSON.parse(localStorage.getItem('namiTube_sandboxDisabled') || 'false');
  }

  try {
    const data = await fetchAnimeDetail(anilistId);
    const media = data.Media;
    const title = getTitle(media);
    const cover = media.coverImage?.extraLarge || media.coverImage?.large || 'assets/img/placeholder-cover.svg';
    const banner = media.bannerImage || '';
    const totalEps = media.episodes || 24;
    const score = media.averageScore;
    const genres = (media.genres || []).slice(0, 4);
    const synopsis = stripHtml(media.description || '');
    const coverColor = media.coverImage?.color;

    // Dynamic title
    document.title = `${title} — Episode ${episodeNum} — NamiTube`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', `Watch ${title} Episode ${episodeNum} on NamiTube — free, no sign-up.`);

    // Dynamic accent
    if (coverColor) {
      document.documentElement.style.setProperty('--accent', coverColor);
    }

    // Ambient background
    const ambientEl = document.getElementById('ambientBg');
    if (ambientEl && banner) {
      ambientEl.style.backgroundImage = `url('${banner}')`;
    }

    function renderPlayer() {
      const iframe = document.getElementById('player-iframe');
      if (!iframe) return;
      const skeleton = document.getElementById('playerSkeleton');
      if (skeleton) skeleton.classList.remove('hidden');
      if (getSandboxDisabled()) {
        iframe.removeAttribute('sandbox');
      } else {
        iframe.setAttribute('sandbox', SANDBOX_DEFAULT);
      }
      iframe.src = SERVERS[currentServer][currentLang](anilistId, episodeNum);
      iframe.onload = () => { if (skeleton) skeleton.classList.add('hidden'); };
    }

    function updateURL() {
      const url = new URL(window.location);
      url.searchParams.set('ep', episodeNum);
      url.searchParams.set('lang', currentLang);
      url.searchParams.set('server', currentServer);
      window.history.replaceState({}, '', url);
      document.title = `${title} — Episode ${episodeNum} — NamiTube`;
    }

    // Build episode grid
    const epArr = Array.from({ length: totalEps }, (_, i) => i + 1);
    const history = getHistory();

    // Build page
    mainEl.innerHTML = `
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <a href="index.html">Home</a>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
        <a href="anime.html?id=${anilistId}">${title}</a>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
        <span>Episode ${episodeNum}</span>
      </div>

      <!-- Title Block -->
      <div class="section" style="padding-bottom:0">
        <h1 style="font-family:var(--font-display);font-weight:700;font-size:clamp(1.3rem,3vw,2rem);margin-bottom:4px">${title}</h1>
        <p style="color:var(--text-secondary);margin-bottom:12px;font-size:.95rem">Episode ${episodeNum}</p>
        <div class="hero-meta" style="margin-bottom:16px">
          ${genres.map(g => `<a href="genre.html?name=${encodeURIComponent(g)}" class="genre-pill">${g}</a>`).join('')}
          ${score ? `<span class="score-badge">${ICONS.star} ${formatScore(score)}</span>` : ''}
        </div>
      </div>

      <!-- Watch Layout -->
      <div class="watch-layout">
        <div class="watch-main">
          <!-- Player -->
          <div class="player-wrapper" id="playerWrapper">
            <div class="player-skeleton" id="playerSkeleton" aria-hidden="true"></div>
            <iframe id="player-iframe" title="Video player" src="" allowfullscreen
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              referrerpolicy="no-referrer"
              sandbox="${SANDBOX_DEFAULT}"></iframe>
          </div>

          <!-- Controls -->
          <div class="player-controls-bar">
            <div class="lang-tabs" role="tablist" aria-label="Audio language">
              <button class="lang-tab ${currentLang === 'sub' ? 'active' : ''}" data-lang="sub" role="tab" aria-selected="${currentLang === 'sub'}">SUB</button>
              <button class="lang-tab ${currentLang === 'dub' ? 'active' : ''}" data-lang="dub" role="tab" aria-selected="${currentLang === 'dub'}">DUB</button>
            </div>
            <div class="server-list" role="group" aria-label="Streaming server">
              <button class="server-btn ${currentServer === 'MegaCloud' ? 'active' : ''}" data-server="MegaCloud">MegaCloud</button>
              <button class="server-btn ${currentServer === 'VidNest' ? 'active' : ''}" data-server="VidNest">VidNest</button>
              <button class="server-btn ${currentServer === 'AnimePahe' ? 'active' : ''}" data-server="AnimePahe">AnimePahe</button>
            </div>
            <label class="sandbox-toggle" for="sandboxToggle">
              <input type="checkbox" id="sandboxToggle" ${getSandboxDisabled() ? 'checked' : ''}>
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
              <span class="toggle-label">Disable Sandbox</span>
              <button type="button" class="info-btn" id="sandboxInfoBtn" aria-label="What does Disable Sandbox do?">
                ${ICONS.info}
              </button>
            </label>
          </div>

          <p class="sandbox-hint" id="sandboxHint" hidden>
            If the player shows <strong>"Please disable sandbox"</strong> instead of the video,
            turn on <strong>Disable Sandbox</strong> above — the player reloads automatically with
            full permissions. Turn it back off afterward for extra protection.
          </p>

          <!-- Prev/Next -->
          <div style="display:flex;gap:8px;margin:12px 0;flex-wrap:wrap">
            <button class="btn btn-outline" id="prevEpBtn" ${episodeNum <= 1 ? 'disabled style="opacity:0.4"' : ''}>
              ${ICONS.skipBack} Previous
            </button>
            <button class="btn btn-outline" id="nextEpBtn" ${episodeNum >= totalEps ? 'disabled style="opacity:0.4"' : ''}>
              Next ${ICONS.skipForward}
            </button>
          </div>

          <!-- Glass Info Card -->
          <div class="glass-card" style="display:flex;gap:16px;margin-bottom:20px;flex-wrap:wrap">
            <img src="${cover}" alt="${title}" style="width:80px;aspect-ratio:2/3;object-fit:cover;border-radius:var(--radius-sm)" onerror="imgError(this)">
            <div style="flex:1;min-width:160px">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
                ${renderScoreRing(score, 56)}
                <div>
                  <div style="font-weight:600;font-size:.9rem">${formatStatus(media.status)}</div>
                  <div style="font-family:var(--font-mono);font-size:.75rem;color:var(--text-secondary)">${totalEps} episodes</div>
                </div>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                <button class="btn btn-outline" style="padding:6px 12px;font-size:.78rem" id="watchGlassWatchlist" data-id="${media.id}" data-title="${title}" data-cover="${cover}">
                  ${isInWatchlist(media.id) ? ICONS.bookmarkFilled : ICONS.bookmark} Watchlist
                </button>
                <button class="btn btn-outline" style="padding:6px 12px;font-size:.78rem" id="watchGlassFavorite" data-id="${media.id}" data-title="${title}" data-cover="${cover}">
                  ${isInFavorites(media.id) ? ICONS.heartFilled : ICONS.heart} Favorite
                </button>
                <button class="btn btn-outline" style="padding:6px 12px;font-size:.78rem" id="shareBtn">
                  ${ICONS.share} Share
                </button>
              </div>
            </div>
          </div>

          <!-- Accordion Synopsis -->
          <details class="glass-card" style="margin-bottom:20px;cursor:pointer">
            <summary style="font-family:var(--font-display);font-weight:600;font-size:.95rem">Synopsis &amp; Info</summary>
            <p style="margin-top:12px;color:var(--text-secondary);font-size:.88rem;line-height:1.7">${synopsis}</p>
            <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px">${genres.map(g => `<span class="genre-pill">${g}</span>`).join('')}</div>
          </details>

          <!-- Recommendations -->
          <div id="watchRecommendations"></div>

          <!-- Disqus -->
          <section class="comment-section" aria-label="Comments">
            <h3 class="section-title">Discussion</h3>
            <div id="disqus_thread"></div>
            <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
          </section>
        </div>

        <!-- Sidebar: Episodes -->
        <div class="watch-sidebar">
          <h3 style="font-family:var(--font-display);font-weight:600;font-size:.95rem;margin-bottom:12px">Episodes</h3>
          <div class="episode-grid">
            ${epArr.map(n => {
              const watched = history.some(h => h.animeId === anilistId && h.episode === n);
              return `<button class="episode-btn ${n === episodeNum ? 'active' : ''} ${watched ? 'watched' : ''}" data-ep="${n}" title="Episode ${n}">${n}</button>`;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    // Init player
    renderPlayer();

    // Add to history
    addHistory({ animeId: anilistId, title, cover, episode: episodeNum, progress: 0, duration: (media.duration || 24) * 60 });

    // Language tabs
    mainEl.querySelectorAll('.lang-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        mainEl.querySelectorAll('.lang-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected','true');
        currentLang = tab.dataset.lang;
        updateURL();
        renderPlayer();
      });
    });

    // Server buttons
    mainEl.querySelectorAll('.server-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        mainEl.querySelectorAll('.server-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentServer = btn.dataset.server;
        updateURL();
        renderPlayer();
      });
    });

    // Sandbox toggle
    document.getElementById('sandboxToggle')?.addEventListener('change', (e) => {
      localStorage.setItem('namiTube_sandboxDisabled', JSON.stringify(e.target.checked));
      renderPlayer();
      showToast(e.target.checked ? 'Sandbox disabled — full permissions.' : 'Sandbox enabled — restricted mode.', 'info');
    });
    document.getElementById('sandboxInfoBtn')?.addEventListener('click', () => {
      const hint = document.getElementById('sandboxHint');
      if (hint) hint.hidden = !hint.hidden;
    });

    // Prev/Next
    document.getElementById('prevEpBtn')?.addEventListener('click', () => {
      if (episodeNum > 1) { episodeNum--; navigateEp(); }
    });
    document.getElementById('nextEpBtn')?.addEventListener('click', () => {
      if (episodeNum < totalEps) { episodeNum++; navigateEp(); }
    });

    function navigateEp() {
      window.location.href = `watch.html?id=${anilistId}&ep=${episodeNum}&lang=${currentLang}&server=${currentServer}`;
    }

    // Episode buttons
    mainEl.querySelectorAll('.episode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        episodeNum = parseInt(btn.dataset.ep);
        navigateEp();
      });
    });

    // Watchlist / Favorite on glass card
    document.getElementById('watchGlassWatchlist')?.addEventListener('click', function() {
      const added = toggleWatchlist({ animeId: parseInt(this.dataset.id), title: this.dataset.title, cover: this.dataset.cover });
      showToast(added ? 'Added to Watchlist' : 'Removed from Watchlist', 'success');
    });
    document.getElementById('watchGlassFavorite')?.addEventListener('click', function() {
      const added = toggleFavorite({ animeId: parseInt(this.dataset.id), title: this.dataset.title, cover: this.dataset.cover });
      showToast(added ? 'Added to Favorites' : 'Removed from Favorites', 'success');
    });

    // Share
    document.getElementById('shareBtn')?.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({ title: `${title} — Episode ${episodeNum}`, url: window.location.href });
      } else {
        navigator.clipboard?.writeText(window.location.href);
        showToast('Link copied to clipboard', 'success');
      }
    });

    // Recommendations
    if (media.recommendations?.nodes?.length) {
      const recs = media.recommendations.nodes.filter(n => n.mediaRecommendation).map(n => renderPortraitCard(n.mediaRecommendation)).join('');
      buildCarousel('watchRecommendations', recs, { title: 'You Might Also Like' });
    }

    // Sticky Now Playing Bar
    const npBar = document.getElementById('nowPlayingBar');
    const playerWrapper = document.getElementById('playerWrapper');
    if (npBar && playerWrapper) {
      const npTitle = npBar.querySelector('.np-title');
      const npThumb = npBar.querySelector('.np-thumb');
      if (npTitle) npTitle.textContent = `${title} — Episode ${episodeNum}`;
      if (npThumb) npThumb.src = cover;

      const observer = new IntersectionObserver(([entry]) => {
        npBar.classList.toggle('visible', !entry.isIntersecting);
      }, { threshold: 0 });
      observer.observe(playerWrapper);

      npBar.querySelector('.np-back')?.addEventListener('click', () => {
        playerWrapper.scrollIntoView({ behavior: 'smooth' });
      });
      npBar.querySelector('.np-prev')?.addEventListener('click', () => {
        if (episodeNum > 1) { episodeNum--; navigateEp(); }
      });
      npBar.querySelector('.np-next')?.addEventListener('click', () => {
        if (episodeNum < totalEps) { episodeNum++; navigateEp(); }
      });
    }

    // Disqus
    loadDisqus(`anime-${anilistId}-ep-${episodeNum}`, `${location.origin}${location.pathname}?id=${anilistId}&ep=${episodeNum}`);

  } catch (e) {
    console.error(e);
    mainEl.innerHTML = '<div class="empty-state"><h3>Could not load this episode</h3><p>Please try again or go back to the homepage.</p><a href="index.html" class="btn btn-primary">Go Home</a></div>';
  }
});
