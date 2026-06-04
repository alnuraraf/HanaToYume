/* ============================================
   NamiTube — Utility helpers
   formatters, debounce, skeleton generators
   ============================================ */

window.NamiTube = window.NamiTube || {};
const NT = window.NamiTube;

/* ---------- Formatters ---------- */
const Formatters = {
  /** Format a number 1234 -> "1.2K" */
  compact(n) {
    if (n == null || isNaN(n)) return '—';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  },

  /** Format a date string into a readable form */
  date(iso) {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return '—'; }
  },

  /** Relative time: "2 hours ago" */
  relative(timestamp) {
    if (!timestamp) return '';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  },

  /** Format score: 8.45 -> "8.5" */
  score(n) {
    if (n == null || isNaN(n)) return '—';
    return Number(n).toFixed(1);
  },

  /** Title-case: "naruto shippuden" -> "Naruto Shippuden" */
  titleCase(s) {
    if (!s) return '';
    return s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
  },

  /** Truncate text with ellipsis */
  truncate(s, n = 100) {
    if (!s) return '';
    return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;
  },

  /** Get current weekday name lowercase: "monday" */
  weekday() {
    return ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][new Date().getDay()];
  },

  /** Get current weekday short label */
  weekdayShort() {
    return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()];
  },

  /** Get date offset for given weekday (0=Sun) */
  weekdayDate(weekdayIndex) {
    const today = new Date();
    const diff = (weekdayIndex - today.getDay() + 7) % 7;
    const d = new Date(today);
    d.setDate(today.getDate() + diff);
    return d;
  }
};

/* ---------- Debounce ---------- */
function debounce(fn, wait = 300) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/* ---------- Throttle (last call within window) ---------- */
function throttle(fn, wait = 100) {
  let last = 0;
  let t;
  return function (...args) {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      clearTimeout(t); t = null;
      last = now;
      fn.apply(this, args);
    } else if (!t) {
      t = setTimeout(() => {
        last = Date.now();
        t = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

/* ---------- DOM helpers ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Create an element with attributes and children */
function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const k in attrs) {
    if (k === 'class')       el.className = attrs[k];
    else if (k === 'html')   el.innerHTML = attrs[k];
    else if (k === 'text')   el.textContent = attrs[k];
    else if (k === 'style' && typeof attrs[k] === 'object') Object.assign(el.style, attrs[k]);
    else if (k.startsWith('on') && typeof attrs[k] === 'function') el.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
    else if (k === 'dataset' && typeof attrs[k] === 'object') Object.assign(el.dataset, attrs[k]);
    else if (attrs[k] === true) el.setAttribute(k, '');
    else if (attrs[k] != null && attrs[k] !== false) el.setAttribute(k, attrs[k]);
  }
  const arr = Array.isArray(children) ? children : [children];
  for (const c of arr) {
    if (c == null || c === false) continue;
    el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return el;
}

/** HTML string version */
function htm(strings, ...values) {
  return strings.reduce((acc, s, i) => acc + s + (i < values.length ? String(values[i] ?? '') : ''), '');
}

/* ---------- Image lazy loading observer ---------- */
const _imgObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const img = entry.target;
      const src = img.dataset.src;
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
      }
      _imgObserver.unobserve(img);
    }
  }
}, { rootMargin: '200px' });

function lazyImage(src, alt = '', className = '') {
  const img = h('img', {
    class: className,
    alt,
    loading: 'lazy',
    decoding: 'async',
    'data-src': src
  });
  _imgObserver.observe(img);
  return img;
}

/* ---------- Generic reveal observer (intersection observer) ---------- */
const _revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      _revealObserver.unobserve(entry.target);
    }
  }
}, { threshold: 0.1 });

function setupReveal(root = document) {
  $$('.reveal', root).forEach(el => _revealObserver.observe(el));
}

/* ---------- Skeleton generators ---------- */
const Skeletons = {
  card(size = 'md') {
    const sizes = { sm: 150, md: 180, lg: 220 };
    return h('div', { class: 'skeleton-card', style: { width: sizes[size] + 'px' } }, [
      h('div', { class: 's-post skeleton' }),
      h('div', { class: 's-body' }, [
        h('div', { class: 's-line skeleton' }),
        h('div', { class: 's-line skeleton short' })
      ])
    ]);
  },

  row(count = 8, size = 'md') {
    const wrap = h('div', { class: 'anime-row' });
    for (let i = 0; i < count; i++) wrap.appendChild(Skeletons.card(size));
    return wrap;
  },

  grid(count = 12, size = 'md') {
    const wrap = h('div', { class: 'anime-grid' });
    for (let i = 0; i < count; i++) wrap.appendChild(Skeletons.card(size));
    return wrap;
  },

  text(width = '100%', height = '12px') {
    return h('div', { class: 'skeleton', style: { width, height } });
  }
};

/* ---------- Apply accent color from profile ---------- */
function applyAccentColor(hex) {
  if (!hex) return;
  document.documentElement.style.setProperty('--color-accent', hex);
  // Derive a slightly darker shade
  const darker = shadeColor(hex, -15);
  document.documentElement.style.setProperty('--color-accent-dark', darker);
  // Lighter version
  const lighter = shadeColor(hex, 20);
  document.documentElement.style.setProperty('--color-accent-light', lighter);
  // Glow rgba
  const rgb = hexToRgb(hex);
  if (rgb) {
    document.documentElement.style.setProperty('--color-accent-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`);
    document.documentElement.style.setProperty('--color-accent-subtle', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`);
    document.documentElement.style.setProperty('--color-tag-bg', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`);
  }
}

function hexToRgb(hex) {
  const m = hex.replace('#', '').match(/^([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function shadeColor(hex, percent) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const adj = (c) => Math.max(0, Math.min(255, Math.round(c + (percent / 100) * 255)));
  const toHex = (c) => c.toString(16).padStart(2, '0');
  return '#' + toHex(adj(rgb.r)) + toHex(adj(rgb.g)) + toHex(adj(rgb.b));
}

/* ---------- Highlight active nav link ---------- */
function highlightActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.header-nav a, .mobile-nav-body a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
}

/* ---------- Resize image to 200x200 before base64 encoding ---------- */
function resizeImageToDataURL(file, max = 200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = max;
        canvas.height = max;
        const ctx = canvas.getContext('2d');
        // Cover crop
        const ratio = Math.max(max / img.width, max / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        ctx.drawImage(img, (max - w) / 2, (max - h) / 2, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------- Export utilities ---------- */
function downloadJSON(data, filename = 'export.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------- Expose to global namespace ---------- */
NT.utils = {
  Formatters, debounce, throttle, $, $$, h, htm,
  lazyImage, setupReveal, Skeletons,
  applyAccentColor, hexToRgb, shadeColor,
  highlightActiveNav, resizeImageToDataURL, downloadJSON
};
