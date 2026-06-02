import { CONFIG } from './config.js';
import { Storage } from './storage.js';
import { escapeHtml, showToast } from './utils.js';

const ICONS = {
    play: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
    chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
    heartFilled: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    film: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/></svg>`,
    list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
    discord: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>`
};

export function renderHeader(router) {
    const profile = Storage.getProfile();
    const header = document.getElementById('header');
    header.innerHTML = `
        <div class="header-inner">
            <a href="/" data-router class="header-logo">
                <svg viewBox="0 0 280 60" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="hdrGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#e50914"/>
                            <stop offset="100%" stop-color="#ff4757"/>
                        </linearGradient>
                    </defs>
                    <text x="4" y="48" fill="url(#hdrGrad)" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="44" letter-spacing="-2">NamiTube</text>
                    <circle cx="268" cy="30" r="10" fill="#e50914"/>
                    <circle cx="268" cy="30" r="4" fill="#0f0f0f"/>
                </svg>
            </a>
            <nav class="header-nav">
                <a href="/" data-router class="nav-link ${router.currentRoute?.path === '/' ? 'active' : ''}">Home</a>
                <a href="/search" data-router class="nav-link ${router.currentRoute?.path === '/search' ? 'active' : ''}">Browse</a>
                <a href="/profile" data-router class="nav-link ${router.currentRoute?.path === '/profile' ? 'active' : ''}">My List</a>
                <a href="/support" data-router class="nav-link ${router.currentRoute?.path === '/support' ? 'active' : ''}">Support</a>
            </nav>
            <div class="header-actions">
                <button class="search-trigger" id="searchTrigger" aria-label="Search">${ICONS.search}</button>
                <a href="/profile" data-router class="header-profile" aria-label="Profile">
                    ${profile.avatar ? `<img src="${escapeHtml(profile.avatar)}" alt="">` : profile.name.charAt(0).toUpperCase()}
                </a>
                <button class="mobile-menu-btn" aria-label="Menu">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                </button>
            </div>
        </div>`;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    document.getElementById('searchTrigger')?.addEventListener('click', () => router.navigate('/search'));
}

export function renderFooter() {
    document.getElementById('footer').innerHTML = `
        <div class="footer-inner">
            <div class="footer-logo">
                <svg viewBox="0 0 280 60" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="ftrGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#e50914"/>
                            <stop offset="100%" stop-color="#ff4757"/>
                        </linearGradient>
                    </defs>
                    <text x="4" y="48" fill="url(#ftrGrad)" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="44" letter-spacing="-2">NamiTube</text>
                    <circle cx="268" cy="30" r="10" fill="#e50914"/>
                    <circle cx="268" cy="30" r="4" fill="#0f0f0f"/>
                </svg>
            </div>
            <p class="footer-desc">
                NamiTube is a free anime streaming platform powered by public APIs.
                Watch your favorite anime in high quality, anytime and anywhere.
                No subscription required.
            </p>
            <div class="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">${ICONS.facebook}</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">${ICONS.twitter}</a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">${ICONS.github}</a>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord">${ICONS.discord}</a>
            </div>
            <p class="footer-disclaimer">
                This site does not store any files on its server. All contents are provided by non-affiliated third parties.
            </p>
            <p class="footer-copyright">
                &copy; 2026 NamiTube. All rights reserved.
            </p>
        </div>`;
}

export function renderAnimeCard(anime, wide = false) {
    const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '';
    const title = anime.title || 'Unknown';
    const score = anime.score ? anime.score.toFixed(1) : '';
    const episodes = anime.episodes || '?';
    const id = anime.mal_id;
    return `
        <article class="anime-card ${wide ? 'wide' : ''}" data-router-link="/anime/${id}">
            <img data-src="${escapeHtml(image)}" alt="${escapeHtml(title)}" class="card-image" loading="lazy">
            ${anime.rank && anime.rank <= 10 ? '<span class="card-badge">TOP ' + anime.rank + '</span>' : ''}
            <div class="card-overlay">
                <h3 class="card-title">${escapeHtml(title)}</h3>
                <div class="card-meta">
                    ${score ? `<span class="card-score">${score}</span>` : ''}
                    <span>${episodes} EPS</span>
                </div>
            </div>
        </article>`;
}

export function renderSkeletonCard(count = 6) {
    return Array(count).fill(0).map(() => `<div class="skeleton skeleton-card"></div>`).join('');
}

export function renderSkeletonText(lines = 3) {
    return Array(lines).fill(0).map((_, i) => `<div class="skeleton skeleton-text ${i === lines - 1 ? 'short' : ''}"></div>`).join('');
}

export function renderSectionRow(title, animeList, link = null, wide = false) {
    if (!animeList?.length) return '';
    const id = 'row-' + Math.random().toString(36).substr(2, 9);
    return `
        <section class="row">
            <div class="row-header">
                <h2 class="row-title">${escapeHtml(title)}</h2>
                ${link ? `<a href="${link}" data-router class="row-more">View All</a>` : ''}
            </div>
            <div class="row-container">
                <button class="row-nav prev" data-scroll="${id}" data-dir="-1" aria-label="Scroll left">${ICONS.chevronLeft}</button>
                <div class="row-scroll" id="${id}">
                    ${animeList.map(a => renderAnimeCard(a, wide)).join('')}
                </div>
                <button class="row-nav next" data-scroll="${id}" data-dir="1" aria-label="Scroll right">${ICONS.chevronRight}</button>
            </div>
        </section>`;
}

export function initRowScroll() {
    document.querySelectorAll('[data-scroll]').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.scroll;
            const direction = parseInt(btn.dataset.dir);
            const container = document.getElementById(targetId);
            if (container) {
                const scrollAmount = container.clientWidth * 0.8;
                container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
            }
        });
    });
}

export function initCardClicks(router) {
    document.querySelectorAll('[data-router-link]').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const href = card.dataset.routerLink;
            router.navigate(href);
        });
    });
}

export { ICONS };
