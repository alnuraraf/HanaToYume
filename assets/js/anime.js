/* ===== NamiTube — Anime Detail Page ===== */
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { window.location.href = 'index.html'; return; }

  const main = document.getElementById('animeContent');
  main.innerHTML = '<div class="page-loader"><div class="spinner"></div></div>';

  try {
    const data = await fetchAnimeDetail(parseInt(id));
    const media = data.Media;
    const title = getTitle(media);

    // Update page meta
    document.title = `${title} — NamiTube`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', stripHtml(media.description || '').slice(0, 155));
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${title} — NamiTube`);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', media.bannerImage || media.coverImage?.extraLarge || '');

    const banner = media.bannerImage || media.coverImage?.extraLarge || '';
    const cover = media.coverImage?.extraLarge || media.coverImage?.large || 'assets/img/placeholder-cover.svg';
    const genres = (media.genres || []).map(g => `<a href="genre.html?name=${encodeURIComponent(g)}" class="genre-pill">${g}</a>`).join('');
    const score = media.averageScore;
    const studio = media.studios?.nodes?.[0]?.name || 'Unknown';
    const synopsis = stripHtml(media.description || 'No description available.');
    const epCount = media.episodes || '?';
    const inWatchlist = isInWatchlist(media.id);
    const inFavorites = isInFavorites(media.id);

    // Stats grid
    const stats = [
      { label: 'Episodes', value: epCount },
      { label: 'Duration', value: media.duration ? `${media.duration} min` : '?' },
      { label: 'Status', value: formatStatus(media.status) },
      { label: 'Season', value: media.season ? `${media.season} ${media.seasonYear || ''}` : '?' },
      { label: 'Format', value: formatFormat(media.format) },
      { label: 'Studio', value: studio },
      { label: 'Source', value: media.source || '?' },
      { label: 'Score', value: score ? `${formatScore(score)} / 10` : 'N/A' },
    ];

    // Episode list
    const totalEps = typeof epCount === 'number' ? epCount : 24;
    let episodeHtml = '';
    if (totalEps && totalEps !== '?') {
      const eps = Array.from({ length: totalEps }, (_, i) => i + 1);
      episodeHtml = `
        <div class="section" id="episodeSection">
          <div class="section-header"><h2 class="section-title">Episodes</h2></div>
          <div class="episode-grid">
            ${eps.map(n => `<a href="watch.html?id=${media.id}&ep=${n}" class="episode-btn" title="Episode ${n}">${n}</a>`).join('')}
          </div>
        </div>`;
    }

    // Characters
    let charHtml = '';
    if (media.characters?.edges?.length) {
      const chars = media.characters.edges.map(e => {
        const ch = e.node;
        const va = e.voiceActors?.[0];
        return `
          <div class="char-card">
            <div class="char-avatar">
              <img src="${ch.image?.large || 'assets/img/placeholder-cover.svg'}" alt="${ch.name?.full}" loading="lazy" onerror="imgError(this)">
            </div>
            <div class="char-name">${ch.name?.full || 'Unknown'}</div>
            ${va ? `<div class="char-va">${va.name?.full || ''}</div>` : ''}
          </div>`;
      }).join('');
      charHtml = `<div class="section" id="characters"><div class="section-header"><h2 class="section-title">Characters</h2></div><div class="carousel-container"><div class="carousel-track">${chars}</div></div></div>`;
    }

    // Relations
    let relHtml = '';
    if (media.relations?.edges?.length) {
      const rels = media.relations.edges.filter(e => e.node.type === 'ANIME').map(e => {
        const n = e.node;
        return renderPortraitCard({ ...n, coverImage: n.coverImage, genres: [], title: n.title });
      }).join('');
      if (rels) relHtml = `<div class="section" id="relations"><div class="section-header"><h2 class="section-title">Relations</h2></div><div class="carousel-container"><div class="carousel-track">${rels}</div></div></div>`;
    }

    // Recommendations
    let recHtml = '';
    if (media.recommendations?.nodes?.length) {
      const recs = media.recommendations.nodes.filter(n => n.mediaRecommendation).map(n => renderPortraitCard(n.mediaRecommendation)).join('');
      if (recs) recHtml = `<div class="section" id="recommendations"></div>`;
    }

    main.innerHTML = `
      <!-- Hero Banner -->
      <div class="anime-hero">
        <div class="anime-hero-bg" style="background-image:url('${banner}')"></div>
        <div class="anime-hero-overlay"></div>
      </div>

      <!-- Info Grid -->
      <div class="anime-info-grid">
        <div class="anime-poster">
          <img src="${cover}" alt="${title}" onerror="imgError(this)">
        </div>
        <div class="anime-details">
          <h1>${title}</h1>
          ${media.title?.native ? `<div class="anime-native">${media.title.native}</div>` : ''}
          <div class="hero-meta" style="margin-bottom:16px">${genres} ${score ? `<span class="score-badge">${ICONS.star} ${formatScore(score)}</span>` : ''}</div>
          <div class="anime-actions">
            <a href="watch.html?id=${media.id}&ep=1" class="btn btn-primary">${ICONS.play} Watch Now</a>
            <button class="btn btn-outline" id="watchlistBtn" data-id="${media.id}" data-title="${title}" data-cover="${cover}">
              ${inWatchlist ? ICONS.bookmarkFilled : ICONS.bookmark} ${inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
            <button class="btn btn-outline" id="favoriteBtn" data-id="${media.id}" data-title="${title}" data-cover="${cover}">
              ${inFavorites ? ICONS.heartFilled : ICONS.heart} ${inFavorites ? 'Favorited' : 'Favorite'}
            </button>
          </div>
          <div style="display:flex;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:20px">
            ${renderScoreRing(score)}
            <div style="flex:1;min-width:200px">
              <p class="anime-synopsis">${synopsis}</p>
            </div>
          </div>
          <div class="anime-stats-grid">
            ${stats.map(s => `<div class="anime-stat"><div class="anime-stat-label">${s.label}</div><div class="anime-stat-value">${s.value}</div></div>`).join('')}
          </div>
        </div>
      </div>

      ${episodeHtml}
      ${charHtml}
      ${relHtml}
      ${recHtml}

      <!-- Disqus -->
      <div class="section">
        <section class="comment-section" aria-label="Comments">
          <h3 class="section-title">Discussion</h3>
          <div id="disqus_thread"></div>
          <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
        </section>
      </div>
    `;

    // Wire up carousel arrows
    main.querySelectorAll('.carousel-container').forEach(cc => {
      const track = cc.querySelector('.carousel-track');
      const prev = cc.querySelector('.carousel-arrow.prev');
      const next = cc.querySelector('.carousel-arrow.next');
      if (!track) return;
      if (!prev) {
        const p = document.createElement('button');
        p.className = 'carousel-arrow prev'; p.setAttribute('aria-label','Scroll left'); p.innerHTML = ICONS.chevronLeft;
        cc.insertBefore(p, track);
        p.addEventListener('click', () => track.scrollBy({ left: -track.clientWidth * 0.8, behavior: 'smooth' }));
      }
      if (!next) {
        const n = document.createElement('button');
        n.className = 'carousel-arrow next'; n.setAttribute('aria-label','Scroll right'); n.innerHTML = ICONS.chevronRight;
        cc.appendChild(n);
        n.addEventListener('click', () => track.scrollBy({ left: track.clientWidth * 0.8, behavior: 'smooth' }));
      }
    });

    // Recommendations carousel
    if (media.recommendations?.nodes?.length) {
      const recContainer = document.getElementById('recommendations');
      if (recContainer) {
        const recs = media.recommendations.nodes.filter(n => n.mediaRecommendation).map(n => renderPortraitCard(n.mediaRecommendation)).join('');
        buildCarousel('recommendations', recs, { title: 'Recommendations' });
      }
    }

    // Watchlist / Favorite buttons
    document.getElementById('watchlistBtn')?.addEventListener('click', function() {
      const added = toggleWatchlist({ animeId: parseInt(this.dataset.id), title: this.dataset.title, cover: this.dataset.cover });
      this.innerHTML = added ? `${ICONS.bookmarkFilled} In Watchlist` : `${ICONS.bookmark} Add to Watchlist`;
      showToast(added ? 'Added to Watchlist' : 'Removed from Watchlist', 'success');
    });
    document.getElementById('favoriteBtn')?.addEventListener('click', function() {
      const added = toggleFavorite({ animeId: parseInt(this.dataset.id), title: this.dataset.title, cover: this.dataset.cover });
      this.innerHTML = added ? `${ICONS.heartFilled} Favorited` : `${ICONS.heart} Favorite`;
      showToast(added ? 'Added to Favorites' : 'Removed from Favorites', 'success');
    });

    // Load Disqus
    loadDisqus(`anime-${id}`, `${location.origin}${location.pathname}?id=${id}`);

  } catch (e) {
    console.error(e);
    main.innerHTML = '<div class="empty-state"><h3>Could not load anime details</h3><p>The anime might not exist or AniList may be unavailable. Please try again.</p><a href="index.html" class="btn btn-primary">Go Home</a></div>';
  }
});
