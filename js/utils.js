/* utils.js — formatters, helpers, skeleton generators */
const Utils = (() => {

  const debounce = (fn, delay = 300) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  };

  const throttle = (fn, delay = 100) => {
    let last = 0, timer;
    return (...args) => {
      const now = Date.now();
      const remaining = delay - (now - last);
      if (remaining <= 0) { last = now; fn(...args); }
      else { clearTimeout(timer); timer = setTimeout(() => { last = Date.now(); fn(...args); }, remaining); }
    };
  };

  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  const getParam = (k) => new URLSearchParams(window.location.search).get(k);

  const escapeHtml = (str = '') => String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const truncate = (str = '', len = 160) => {
    if (!str) return '';
    return str.length > len ? str.slice(0, len).trim() + '…' : str;
  };

  const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '');

  const formatNumber = (n) => {
    if (n == null) return '—';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return String(n);
  };

  const timeAgo = (ts) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff/60) + 'm ago';
    if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
    if (diff < 2592000) return Math.floor(diff/86400) + 'd ago';
    if (diff < 31536000) return Math.floor(diff/2592000) + 'mo ago';
    return Math.floor(diff/31536000) + 'y ago';
  };

  const formatDuration = (mins) => {
    if (!mins) return '—';
    const h = Math.floor(mins / 60), m = mins % 60;
    return h ? `${h}h ${m}m` : `${m}m`;
  };

  const skeletonCard = (size = 'md') => {
    const w = size === 'sm' ? 120 : (size === 'lg' ? 220 : 180);
    return `<div class="skel-card" style="width:100%;max-width:${w}px;">
      <div class="skel skel-poster"></div>
      <div class="skel skel-line"></div>
      <div class="skel skel-line short"></div>
    </div>`;
  };

  const skeletonGrid = (n = 12, size = 'md') => {
    return Array(n).fill(0).map(() => skeletonCard(size)).join('');
  };

  const lazyLoad = (img) => {
    if ('loading' in HTMLImageElement.prototype) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          el.src = el.dataset.src;
          obs.unobserve(el);
        }
      });
    });
    obs.observe(img);
  };

  // Initialise lazy images & reveal
  const initObservers = () => {
    // reveal on scroll
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    qsa('.reveal').forEach(el => ro.observe(el));
  };

  const initIcons = () => {
    if (window.lucide) window.lucide.createIcons();
  };

  const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const setActiveNav = () => {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    qsa('.nav-link, .mobile-menu a').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      const aPath = href.split('/').pop();
      if (aPath === path) a.classList.add('active');
    });
  };

  return {
    debounce, throttle, qs, qsa, getParam, escapeHtml, truncate, stripHtml,
    formatNumber, timeAgo, formatDuration, skeletonCard, skeletonGrid,
    lazyLoad, initObservers, initIcons, getCurrentDay, setActiveNav
  };
})();

window.Utils = Utils;
