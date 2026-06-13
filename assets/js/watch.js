/* ============================================
   NamiTube — Watch Page Script
   ============================================ */

const SERVERS = {
  MegaCloud: {
    sub: (id, ep) => `https://megaplay.buzz/stream/ani/${id}/${ep}/sub`,
    dub: (id, ep) => `https://megaplay.buzz/stream/ani/${id}/${ep}/dub`,
  },
  VidNest: {
    sub: (id, ep) => `https://vidnest.fun/anime/${id}/${ep}/sub`,
    dub: (id, ep) => `https://vidnest.fun/anime/${id}/${ep}/dub`,
  },
  AnimePahe: {
    sub: (id, ep) => `https://vidnest.fun/animepahe/${id}/${ep}/sub`,
    dub: (id, ep) => `https://vidnest.fun/animepahe/${id}/${ep}/dub`,
  },
};

const SANDBOX_DEFAULT = 'allow-scripts allow-same-origin allow-presentation allow-forms';
const DISQUS_SHORTNAME = 'coolsanime';

let anilistId, episodeNum, currentLang, currentServer, animeData;

function getSandboxDisabled() {
  return JSON.parse(localStorage.getItem('namiTube_sandboxDisabled') || 'false');
}

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  anilistId = parseInt(params.get('id'));
  episodeNum = parseInt(params.get('ep')) || 1;

  if (!anilistId) { window.location.href = '404.html'; return; }

  const prefs = getPrefs();
  currentLang = params.get('lang') || prefs.defaultLang || 'sub';
  currentServer = params.get('server') || prefs.defaultServer || 'MegaCloud';

  try {
    const data = await fetchAnimeDetail(anilistId);
    animeData = data.Media;
    if (!animeData) { window.location.href = '404.html'; return; }

    const title = getTitle(animeData);
    document.title = `${title} — Episode ${episodeNum} — NamiTube`;

    const setMeta = (sel, val) => { const m = document.querySelector(sel); if (m) m.setAttribute('content', val); };
    setMeta('meta[property="og:title"]', document.title);
    setMeta('meta[property="og:image"]', getBanner(animeData));

    renderWatchPage(animeData);

    /* Add to history */
    addToHistory({
      animeId: anilistId,
      title,
      cover: getCover(animeData),
      episode: episodeNum,
      progress: 0,
      duration: (animeData.duration || 24) * 60,
      watchedAt: new Date().toISOString()
    });

  } catch (e) {
    document.getElementById('watchContent').innerHTML = `
      <div class="empty-state" style="padding-top:120px">
        ${ICONS.alertCircle}
        <h3>Failed to load</h3>
        <p>Please try refreshing the page.</p>
        <a href="index.html" class="btn-primary">Go Home</a>
      </div>
    `;
  }
});

function renderPlayer() {
  const iframe = document.getElementById('player-iframe');
  const skeleton = document.getElementById('playerSkeleton');
  if (!iframe) return;

  if (skeleton) skeleton.hidden = false;

  if (getSandboxDisabled()) {
    iframe.removeAttribute('sandbox');
  } else {
    iframe.setAttribute('sandbox', SANDBOX_DEFAULT);
  }

  const serverObj = SERVERS[currentServer];
  if (serverObj && serverObj[currentLang]) {
    iframe.src = serverObj[currentLang](anilistId, episodeNum);
  }

  iframe.onload = () => { if (skeleton) skeleton.hidden = true; };
}

function renderWatchPage(media) {
  const container = document.getElementById('watchContent');
  const title = getTitle(media);
  const totalEps = media.episodes || (media.nextAiringEpisode ? media.nextAiringEpisode.episode - 1 : 24);
  const hasPrev = episodeNum > 1;
  const hasNext = episodeNum < totalEps;
  const sandboxChecked = getSandboxDisabled() ? 'checked' : '';
  const history = getHistory();
  const watchedEps = new Set(history.filter(h => h.animeId === media.id).map(h => h.episode));

  container.innerHTML = `
    <!-- Sticky Now Playing Bar (5.10) -->
    <div class="now-playing-bar" id="nowPlayingBar">
      <img src="${getCover(media)}" alt="${title}" onerror="onImgError(this)">
      <span class="npb-title">${title}</span>
      <span class="npb-ep">Episode ${episodeNum}</span>
      ${hasPrev ? `<a href="watch.html?id=${anilistId}&ep=${episodeNum - 1}&lang=${currentLang}&server=${currentServer}" class="header-btn" aria-label="Previous episode">${ICONS.skipBack}</a>` : ''}
      ${hasNext ? `<a href="watch.html?id=${anilistId}&ep=${episodeNum + 1}&lang=${currentLang}&server=${currentServer}" class="header-btn" aria-label="Next episode">${ICONS.skipForward}</a>` : ''}
      <button class="header-btn" id="backToPlayerBtn" aria-label="Back to player">${ICONS.arrowUp}</button>
    </div>

    <div class="watch-layout">
      <div class="watch-main">
        <!-- Player -->
        <div class="player-wrapper" id="playerWrapper">
          <div class="player-skeleton" id="playerSkeleton" aria-hidden="true"></div>
          <iframe
            id="player-iframe"
            title="Video player"
            src=""
            allowfullscreen
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            referrerpolicy="no-referrer"
          ></iframe>
        </div>

        <!-- Controls -->
        <div class="player-controls-bar">
          <div class="lang-tabs" role="tablist" aria-label="Audio language">
            <button class="lang-tab ${currentLang === 'sub' ? 'active' : ''}" data-lang="sub" role="tab" aria-selected="${currentLang === 'sub'}">SUB</button>
            <button class="lang-tab ${currentLang === 'dub' ? 'active' : ''}" data-lang="dub" role="tab" aria-selected="${currentLang === 'dub'}">DUB</button>
          </div>
          <div class="server-list" role="group" aria-label="Streaming server">
            ${Object.keys(SERVERS).map(s => `<button class="server-btn ${s === currentServer ? 'active' : ''}" data-server="${s}">${s}</button>`).join('')}
          </div>
          <label class="sandbox-toggle" for="sandboxToggle">
            <input type="checkbox" id="sandboxToggle" ${sandboxChecked}>
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
          full permissions, same as opening it in its own tab. Turn it back off afterward for
          extra protection against pop-ups when browsing other servers.
        </p>

        <!-- Episode Nav -->
        <div class="ep-nav">
          ${hasPrev ? `<a href="watch.html?id=${anilistId}&ep=${episodeNum - 1}&lang=${currentLang}&server=${currentServer}" class="btn-outline">${ICONS.skipBack} Previous</a>` : '<span></span>'}
          ${hasNext ? `<a href="watch.html?id=${anilistId}&ep=${episodeNum + 1}&lang=${currentLang}&server=${currentServer}" class="btn-primary">Next ${ICONS.skipForward}</a>` : '<span></span>'}
        </div>

        <!-- Anime Info Accordion -->
        <details class="watch-anime-info">
          <summary>
            <span>${title}</span>
            <span>${ICONS.chevronDown}</span>
          </summary>
          <div class="wai-body">
            <p>${stripHtml(media.description) || 'No description available.'}</p>
            <p style="margin-top:12px;color:var(--text-muted);font-size:.8rem">
              ${formatFormat(media.format)} · ${media.episodes || '?'} Episodes · ${formatStatus(media.status)} · ${media.season || ''} ${media.seasonYear || ''}
            </p>
            <a href="anime.html?id=${anilistId}" class="btn-outline" style="margin-top:12px;display:inline-flex">${ICONS.info} Full Details</a>
          </div>
        </details>

        <!-- Comments -->
        <section class="comment-section" aria-label="Comments">
          <h3 class="section-title">Discussion</h3>
          <div id="disqus_thread"></div>
          <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
        </section>
      </div>

      <!-- Sidebar: Episode List -->
      <div class="watch-sidebar">
        <div class="sidebar-title">Episodes</div>
        <div class="episode-grid" id="sidebarEpisodes">
          ${Array.from({ length: totalEps }, (_, i) => {
            const ep = i + 1;
            const isActive = ep === episodeNum;
            const isWatched = watchedEps.has(ep);
            return `<a href="watch.html?id=${anilistId}&ep=${ep}&lang=${currentLang}&server=${currentServer}" class="ep-btn ${isActive ? 'active' : ''} ${isWatched && !isActive ? 'watched' : ''}">${ep}</a>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  /* Render player */
  renderPlayer();

  /* Language tabs */
  container.querySelectorAll('.lang-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentLang = tab.dataset.lang;
      container.querySelectorAll('.lang-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.lang === currentLang);
        t.setAttribute('aria-selected', t.dataset.lang === currentLang);
      });
      renderPlayer();
    });
  });

  /* Server buttons */
  container.querySelectorAll('.server-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentServer = btn.dataset.server;
      container.querySelectorAll('.server-btn').forEach(b => b.classList.toggle('active', b.dataset.server === currentServer));
      renderPlayer();
    });
  });

  /* Sandbox toggle */
  document.getElementById('sandboxToggle').addEventListener('change', (e) => {
    localStorage.setItem('namiTube_sandboxDisabled', JSON.stringify(e.target.checked));
    renderPlayer();
    showToast(e.target.checked
      ? 'Sandbox disabled — the player has full permissions.'
      : 'Sandbox enabled — restricted mode.', 'info');
  });

  document.getElementById('sandboxInfoBtn').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const hint = document.getElementById('sandboxHint');
    hint.hidden = !hint.hidden;
  });

  /* Sticky Now Playing Bar (5.10) */
  const playerWrapper = document.getElementById('playerWrapper');
  const npBar = document.getElementById('nowPlayingBar');
  if (playerWrapper && npBar) {
    const observer = new IntersectionObserver(([entry]) => {
      npBar.classList.toggle('visible', !entry.isIntersecting);
    }, { threshold: 0 });
    observer.observe(playerWrapper);

    document.getElementById('backToPlayerBtn')?.addEventListener('click', () => {
      playerWrapper.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* Disqus */
  loadDisqusWatch(`anime-${anilistId}-ep-${episodeNum}`, `${location.origin}${location.pathname}?id=${anilistId}&ep=${episodeNum}`);
}

function loadDisqusWatch(identifier, url) {
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
