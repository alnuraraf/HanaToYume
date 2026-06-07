import { getPlayerPrefs, savePlayerPrefs, addToHistory } from './storage.js';
import { Toast } from './components.js';
import { setTitle } from './utils.js';

export function initPlayer(malId, epNumber, animeData, episodes) {
  const prefs = getPlayerPrefs();
  let currentLang = new URLSearchParams(window.location.search).get('lang') || prefs.lang || 'sub';
  let currentServer = prefs.server || 1;
  let currentEp = Number(epNumber) || 1;

  const iframe = document.getElementById('player-iframe');
  const serverBtns = document.querySelectorAll('.server-btn');
  const langBtns = document.querySelectorAll('.lang-btn');
  const prevBtn = document.getElementById('prev-ep');
  const nextBtn = document.getElementById('next-ep');

  function getSrc() {
    const base = currentServer === 1
      ? `https://megaplay.buzz/stream/mal/${malId}/${currentEp}/${currentLang}`
      : `https://vidwish.live/stream/mal/${malId}/${currentEp}/${currentLang}`;
    return base;
  }

  function loadPlayer() {
    if (!iframe) return;
    iframe.src = getSrc();
    iframe.onerror = () => {
      if (currentServer === 1) {
        currentServer = 2;
        updateServerButtons();
        iframe.src = getSrc();
        Toast('Switched to backup server automatically', 'warning');
      }
    };
  }

  function updateServerButtons() {
    serverBtns.forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.server) === currentServer);
    });
  }

  function updateLangButtons() {
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
  }

  function updateEpisodeInfo() {
    const ep = episodes?.find(e => (e.mal_id || e.episode) == currentEp);
    const titleEl = document.getElementById('ep-title');
    const synEl = document.getElementById('ep-synopsis');
    if (titleEl) titleEl.textContent = ep?.title || `Episode ${currentEp}`;
    if (synEl) synEl.textContent = ep?.synopsis || '';
    setTitle(`${animeData?.title || 'Anime'} — Episode ${currentEp}`);
  }

  function updateHistory() {
    addToHistory({
      malId: Number(malId),
      title: animeData?.title || 'Anime',
      posterUrl: animeData?.images?.jpg?.image_url || '',
      episode: currentEp,
      totalEpisodes: animeData?.episodes || null,
      lang: currentLang
    });
  }

  if (serverBtns) {
    serverBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentServer = Number(btn.dataset.server);
        updateServerButtons();
        savePlayerPrefs({ ...prefs, server: currentServer });
        loadPlayer();
      });
    });
  }

  if (langBtns) {
    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentLang = btn.dataset.lang;
        updateLangButtons();
        savePlayerPrefs({ ...prefs, lang: currentLang });
        loadPlayer();
      });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentEp > 1) {
        window.location.href = `watch.html?id=${malId}&ep=${currentEp - 1}&lang=${currentLang}`;
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const maxEp = animeData?.episodes || episodes?.length || 999;
      if (currentEp < maxEp) {
        window.location.href = `watch.html?id=${malId}&ep=${currentEp + 1}&lang=${currentLang}`;
      }
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch (e.key.toLowerCase()) {
      case 'f':
        if (iframe) iframe.requestFullscreen?.();
        break;
      case 'n':
        if (nextBtn && !nextBtn.disabled) nextBtn.click();
        break;
      case 'p':
        if (prevBtn && !prevBtn.disabled) prevBtn.click();
        break;
    }
  });

  updateServerButtons();
  updateLangButtons();
  updateEpisodeInfo();
  loadPlayer();
  updateHistory();
}

export function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? (window.scrollY / h) * 100 : 0;
    bar.style.width = p + '%';
  }, { passive: true });
}
