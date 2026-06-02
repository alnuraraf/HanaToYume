import { api } from '../api.js';
import { Store } from '../store.js';

export async function AnimePage(id) {
  const main = document.getElementById('main-content');
  main.innerHTML = '<div class="anime-hero skeleton" style="height:70vh"></div><div class="anime-detail-content" style="padding-top:40px"><div class="skeleton" style="height:400px"></div><div class="skeleton" style="height:400px"></div></div>';

  try {
    const data = await api.getAnime(id);
    const anime = data.data;
    const img = anime.images?.jpg?.large_image_url || '';
    const banner = anime.trailer?.images?.maximum_image_url || anime.images?.jpg?.large_image_url || '';
    const title = anime.title_english || anime.title;
    const episodes = anime.episodes || 0;
    const isFav = Store.getFavorites().some(f => f.malId == id);
    const isWL = Store.getWatchlist().some(w => w.malId == id);

    let episodesHtml = '';
    if (episodes > 0) {
      const eps = Array.from({length: Math.min(episodes, 100)}, (_, i) => i + 1);
      episodesHtml = `
        <section class="episodes-section">
          <h2 class="episodes-header">Episodes ${episodes > 100 ? '(Showing first 100)' : ''}</h2>
          <div class="episodes-grid">
            ${eps.map(ep => `<a href="/watch/${id}/${ep}" class="episode-btn" data-link>${ep}</a>`).join('')}
          </div>
        </section>
      `;
    } else {
      episodesHtml = `<section class="episodes-section"><h2 class="episodes-header">Episodes</h2><p style="color:var(--text-muted)">No episode information available.</p></section>`;
    }

    main.innerHTML = `
      <div class="anime-hero">
        <div class="anime-hero-bg" style="background-image:url('${banner}')"></div>
        <div class="anime-hero-gradient"></div>
      </div>
      <div class="anime-detail-content">
        <img class="anime-poster" src="${img}" alt="${title}">
        <div class="anime-info">
          <h1 class="anime-title">${title}</h1>
          <div class="anime-alt-title">${anime.title_japanese || ''}</div>
          <div class="anime-meta">
            <span><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg> ${anime.score || 'N/A'}</span>
            <span>${anime.year || 'N/A'}</span>
            <span>${anime.episodes || '?'} Episodes</span>
            <span>${anime.status || ''}</span>
          </div>
          <div class="anime-actions">
            <a href="/watch/${id}/1" class="btn btn-primary" data-link>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Watch Episode 1
            </a>
            <button class="btn btn-secondary" id="btn-watchlist" data-mal="${id}" data-title="${title}" data-img="${img}">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> ${isWL ? 'In Watchlist' : 'Watchlist'}
            </button>
            <button class="btn btn-secondary" id="btn-favorite" data-mal="${id}" data-title="${title}" data-img="${img}">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> ${isFav ? 'Favorited' : 'Favorite'}
            </button>
          </div>
          <p class="anime-synopsis">${anime.synopsis || 'No synopsis available.'}</p>
          <div class="anime-genres">
            ${(anime.genres || []).map(g => `<span class="genre-tag">${g.name}</span>`).join('')}
          </div>
        </div>
      </div>
      ${episodesHtml}
    `;

    document.getElementById('btn-watchlist')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      const item = { malId: id, title: btn.dataset.title, image: btn.dataset.img };
      const added = Store.toggleWatchlist(item);
      btn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> ${added ? 'In Watchlist' : 'Watchlist'}`;
    });

    document.getElementById('btn-favorite')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      const item = { malId: id, title: btn.dataset.title, image: btn.dataset.img };
      const added = Store.toggleFavorite(item);
      btn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> ${added ? 'Favorited' : 'Favorite'}`;
    });

  } catch (err) {
    main.innerHTML = `<div class="row" style="padding-top:100px;text-align:center"><h2>Anime not found</h2></div>`;
    console.error(err);
  }
}