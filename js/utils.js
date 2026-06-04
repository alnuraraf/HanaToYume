const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function formatNumber(num) {
  if (!num) return 'N/A';
  return num.toLocaleString();
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function debounce(fn, ms = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function throttle(fn, ms = 100) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}

function getUrlParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

function setUrlParams(params, push = true) {
  const url = new URL(window.location);
  Object.entries(params).forEach(([k, v]) => {
    if (v == null) url.searchParams.delete(k);
    else url.searchParams.set(k, v);
  });
  if (push) history.pushState({}, '', url);
  else history.replaceState({}, '', url);
}

function setupReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  $$('.reveal').forEach(el => obs.observe(el));
}

function setupLazyImages() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  $$('img[data-src]').forEach(img => obs.observe(img));
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getDayName() {
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  return days[new Date().getDay()];
}

function getGenreId(name) {
  const map = {
    action: 1, adventure: 2, comedy: 4, drama: 8, fantasy: 10,
    horror: 14, magic: 16, mecha: 18, music: 19, romance: 22,
    school: 23, sci_fi: 24, shoujo: 25, shounen: 27, space: 29,
    sports: 30, supernatural: 37, military: 38, police: 39,
    psychological: 40, thriller: 41, seinen: 42, josei: 43,
    isekai: 62, harem: 35, slice_of_life: 36
  };
  return map[name.toLowerCase().replace(/\s+/g, '_')] || null;
}