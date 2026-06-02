import { CONFIG } from './config.js';

export function debounce(fn, delay = CONFIG.DEBOUNCE_DELAY) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); };
}

export function throttle(fn, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) { fn.apply(this, args); inThrottle = true; setTimeout(() => inThrottle = false, limit); }
    };
}

export function formatDate(dateStr) {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDuration(minutes) {
    if (!minutes) return 'Unknown';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

export function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('toast-out'); toast.addEventListener('animationend', () => toast.remove()); }, duration);
}

export function toggleLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (show) overlay.removeAttribute('hidden');
    else overlay.setAttribute('hidden', '');
}

export function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });
    images.forEach(img => observer.observe(img));
}

export function getStreamUrl(malId, episode = 1, lang = CONFIG.DEFAULT_LANG) {
    return `${CONFIG.STREAM_BASE}/${malId}/${episode}/${lang}`;
}
