/* player.js — video player logic */
const Player = (() => {

  const PRIMARY = 'https://megaplay.buzz/stream/mal';
  const BACKUP = 'https://vidnest.fun/anime';

  let currentServer = localStorage.getItem('namitube_server') || 'primary';
  let currentLang = 'sub';
  let malId = null;
  let anilistId = null;
  let episode = 1;

  const buildUrl = () => {
    if (currentServer === 'backup' && anilistId) {
      return `${BACKUP}/${anilistId}/${episode}/${currentLang}`;
    }
    return `${PRIMARY}/${malId}/${episode}/${currentLang}`;
  };

  const renderPlayer = () => {
    const wrap = document.getElementById('playerWrap');
    if (!wrap) return;
    const url = buildUrl();
    wrap.innerHTML = `<iframe src="${url}" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="no-referrer" title="Player"></iframe>`;
  };

  const setServer = (srv) => {
    currentServer = srv;
    localStorage.setItem('namitube_server', srv);
    renderPlayer();
    updateButtons();
  };

  const setLang = (lng) => {
    currentLang = lng;
    Storage.setPref('defaultLang', lng);
    renderPlayer();
    updateButtons();
    const u = new URL(window.location);
    u.searchParams.set('lang', lng);
    history.replaceState(null, '', u);
  };

  const setEpisode = (ep) => {
    episode = Number(ep);
    renderPlayer();
    const u = new URL(window.location);
    u.searchParams.set('ep', ep);
    history.pushState(null, '', u);
    document.dispatchEvent(new CustomEvent('episode-changed', { detail: { ep } }));
  };

  const updateButtons = () => {
    document.querySelectorAll('[data-lang-btn]').forEach(b => {
      b.classList.toggle('active', b.dataset.langBtn === currentLang);
    });
    document.querySelectorAll('[data-srv-btn]').forEach(b => {
      b.classList.toggle('active', b.dataset.srvBtn === currentServer);
    });
  };

  const init = (opts) => {
    malId = opts.malId;
    anilistId = opts.anilistId;
    episode = Number(opts.episode || 1);
    currentLang = opts.lang || Storage.get().preferences.defaultLang || 'sub';
    renderPlayer();
    updateButtons();
  };

  const setAnilistId = (id) => { anilistId = id; };

  return { init, setServer, setLang, setEpisode, setAnilistId, buildUrl };
})();

window.Player = Player;
