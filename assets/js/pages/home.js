import { api } from '../api.js';
import { AnimeCard } from '../components.js';

export async function HomePage() {
  const main = document.getElementById('main-content');
  main.innerHTML = '<div class="hero skeleton" style="height:85vh"></div><div class="row"><div class="skeleton" style="height:200px"></div></div>';

  try {
    const [topData, seasonData] = await Promise.all([
      api.getTopAnime(),
      api.getSeasonalAnime()
    ]);

    const topAnime = topData.data || [];
    const seasonAnime = seasonData.data || [];

    let html = '';

    if (topAnime.length > 0) {
      const hero = topAnime[0];
      const heroImg = hero.trailer?.images?.maximum_image_url || hero.images?.jpg?.large_image_url || '';
      html += `
        <section class="hero">
          <div class="hero-bg" style="background-image:url('${heroImg}')"></div>
          <div class="hero-gradient"></div>
          <div class="hero-content">
            <h1 class="hero-title">${hero.title_english || hero.title}</h1>
            <p class="hero-synopsis">${hero.synopsis || ''}</p>
            <div class="hero-buttons">
              <a href="/watch/${hero.mal_id}/1" class="btn btn-primary" data-link>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Watch Now
              </a>
              <a href="/anime/${hero.mal_id}" class="btn btn-secondary" data-link>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg> More Info
              </a>
            </div>
          </div>
        </section>
      `;
    }

    const cont = JSON.parse(localStorage.getItem('continueWatching') || '[]');
    if (cont.length > 0) {
      html += `<section class="row"><div class="row-header"><h2 class="row-title">Continue Watching</h2></div><div class="row-scroll">`;
      html += cont.slice(0, 10).map(item => `
        <a href="/watch/${item.malId}/${item.episodeId}" class="card" data-link>
          <img class="card-img lazy" data-src="${item.image}" alt="${item.title}">
          <div class="card-info">
            <div class="card-title">${item.title}</div>
            <div class="card-meta">Episode ${item.episodeId}</div>
          </div>
        </a>
      `).join('');
      html += `</div></section>`;
    }

    html += `<section class="row"><div class="row-header"><h2 class="row-title">Trending Now</h2></div><div class="row-scroll">`;
    html += topAnime.slice(0, 15).map(AnimeCard).join('');
    html += `</div></section>`;

    html += `<section class="row"><div class="row-header"><h2 class="row-title">Seasonal Anime</h2></div><div class="row-scroll">`;
    html += seasonAnime.slice(0, 15).map(AnimeCard).join('');
    html += `</div></section>`;

    main.innerHTML = html;
    initLazyLoad();
  } catch (err) {
    main.innerHTML = `<div class="row" style="padding-top:100px;text-align:center"><h2>Error loading content</h2><p>Please try again later.</p></div>`;
    console.error(err);
  }
}

function initLazyLoad() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.onload = () => img.classList.add('loaded');
        }
        observer.unobserve(img);
      }
    });
  });
  document.querySelectorAll('img.lazy').forEach(img => observer.observe(img));
}