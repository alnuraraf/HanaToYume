import { api } from '../api.js';
import { Store } from '../store.js';

export async function WatchPage(id, episode) {
  const main = document.getElementById('main-content');
  main.innerHTML = '<div class="watch-page"><div class="skeleton" style="height:60vh"></div></div>';

  try {
    const data = await api.getAnime(id);
    const anime = data.data;
    const title = anime.title_english || anime.title;
    const episodes = anime.episodes || 0;
    const epNum = parseInt(episode) || 1;
    const nextEp = epNum + 1;
    const hasNext = episodes ? epNum < episodes : true;

    let epListHtml = '';
    const maxEp = episodes || 24;
    for (let i = 1; i <= Math.min(maxEp, 100); i++) {
      epListHtml += `
        <a href="/watch/${id}/${i}" class="episode-item ${i === epNum ? 'active' : ''}" data-link>
          <span class="episode-num">${i}</span>
          <span class="episode-name">Episode ${i}</span>
        </a>
      `;
    }

    main.innerHTML = `
      <div class="watch-page">
        <div class="watch-layout">
          <div>
            <div class="player-container">
              <iframe src="https://megaplay.buzz/stream/mal/${id}/${epNum}/sub" allowfullscreen loading="eager"></iframe>
            </div>
            <div class="watch-meta">
              <h1>${title}</h1>
              <p>Episode ${epNum} ${episodes ? `of ${episodes}` : ''}</p>
              ${hasNext ? `
                <a href="/watch/${id}/${nextEp}" class="btn btn-primary" style="margin-top:12px" data-link>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg> Next Episode
                </a>
              ` : ''}
            </div>
          </div>
          <div class="episode-sidebar">
            <div class="sidebar-title">Episodes</div>
            <div class="episode-list">
              ${epListHtml}
            </div>
          </div>
        </div>
      </div>
    `;

    Store.addToHistory({
      malId: id,
      episodeId: epNum,
      title: title,
      image: anime.images?.jpg?.image_url || '',
      timestamp: Date.now()
    });

  } catch (err) {
    main.innerHTML = `<div class="row" style="padding-top:100px;text-align:center"><h2>Video not found</h2></div>`;
    console.error(err);
  }
}