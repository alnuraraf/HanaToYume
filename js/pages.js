import { CONFIG } from './config.js';
import { API } from './api.js';
import { Storage } from './storage.js';
import { renderSectionRow, renderAnimeCard, renderSkeletonCard, renderSkeletonText, initRowScroll, initCardClicks, ICONS } from './components.js';
import { debounce, formatDate, formatDuration, escapeHtml, showToast, toggleLoading, lazyLoadImages, getStreamUrl } from './utils.js';

let heroInterval = null;

export function renderHome(router) {
    const main = document.getElementById('main');
    main.innerHTML = `
        <div class="hero" id="hero">
            <div class="hero-slides" id="heroSlides"></div>
            <div class="hero-nav" id="heroDots"></div>
        </div>
        <div id="homeRows"></div>`;
    loadHero(router);
    loadHomeRows(router);
}

async function loadHero(router) {
    try {
        const data = await API.getTopAnime(1, 5);
        const animeList = data.data || [];
        const slidesContainer = document.getElementById('heroSlides');
        const dotsContainer = document.getElementById('heroDots');
        if (!animeList.length) { document.getElementById('hero').style.display = 'none'; return; }
        slidesContainer.innerHTML = animeList.map((anime, i) => {
            const image = anime.trailer?.images?.maximum_image_url || anime.images?.jpg?.large_image_url || '';
            const synopsis = anime.synopsis || '';
            return `
                <div class="hero-slide ${i === 0 ? 'active' : ''}" data-slide="${i}">
                    <div class="hero-bg" style="background-image: url('${escapeHtml(image)}')"></div>
                    <div class="hero-gradient"></div>
                    <div class="hero-content">
                        <h1 class="hero-title">${escapeHtml(anime.title)}</h1>
                        <p class="hero-synopsis">${escapeHtml(synopsis)}</p>
                        <div class="hero-meta">
                            <span class="hero-score">${anime.score ? anime.score.toFixed(1) : ''}</span>
                            <span>${anime.type || 'TV'}</span>
                            <span>${anime.episodes || '?'} Episodes</span>
                            <span>${anime.year || 'Unknown'}</span>
                        </div>
                        <div class="hero-buttons">
                            <a href="/watch/${anime.mal_id}/1" data-router class="btn btn-primary">${ICONS.play} Watch Now</a>
                            <a href="/anime/${anime.mal_id}" data-router class="btn btn-secondary">${ICONS.info} More Info</a>
                        </div>
                    </div>
                </div>`;
        }).join('');
        dotsContainer.innerHTML = animeList.map((_, i) => `<button class="hero-dot ${i === 0 ? 'active' : ''}" data-slide="${i}" aria-label="Slide ${i + 1}"></button>`).join('');
        let currentSlide = 0;
        const slides = slidesContainer.querySelectorAll('.hero-slide');
        const dots = dotsContainer.querySelectorAll('.hero-dot');
        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }
        dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
        if (heroInterval) clearInterval(heroInterval);
        heroInterval = setInterval(() => goToSlide((currentSlide + 1) % slides.length), CONFIG.HERO_SLIDE_INTERVAL);
    } catch (err) { console.error('Hero load error:', err); document.getElementById('hero').style.display = 'none'; }
}

async function loadHomeRows(router) {
    const container = document.getElementById('homeRows');
    container.innerHTML = renderSkeletonCard(12);
    try {
        const [trending, season, topRated, action, romance] = await Promise.all([
            API.getTopAnime(1, 15), API.getSeasonNow(1), API.getTopRated(1),
            API.getAnimeByGenre(1, 1), API.getAnimeByGenre(22, 1)
        ]);
        container.innerHTML = `
            ${renderSectionRow('Trending Now', trending.data?.slice(0, 15) || [], '/search')}
            ${renderSectionRow('Current Season', season.data?.slice(0, 15) || [], '/search')}
            ${renderSectionRow('Top Rated', topRated.data?.slice(0, 15) || [], '/search')}
            ${renderSectionRow('Action', action.data?.slice(0, 15) || [], '/search')}
            ${renderSectionRow('Romance', romance.data?.slice(0, 15) || [], '/search')}`;
        initRowScroll(); initCardClicks(router); lazyLoadImages();
    } catch (err) { console.error('Home rows error:', err); container.innerHTML = '<p class="search-status">Failed to load content. Please try again later.</p>'; }
}

export async function renderAnimeDetail(router, params) {
    const main = document.getElementById('main');
    const id = params.id;
    main.innerHTML = `
        <div class="anime-hero">
            <div class="skeleton" style="position:absolute;inset:0;"></div>
            <div class="anime-hero-content" style="opacity:0;">
                <div class="anime-poster skeleton"></div>
                <div class="anime-info">${renderSkeletonText(4)}</div>
            </div>
        </div>
        <div class="detail-sections"><div class="skeleton" style="height:200px;"></div></div>`;
    try {
        const { data: anime } = await API.getAnimeById(id);
        const episodesRes = await API.getAnimeEpisodes(id).catch(() => ({ data: [] }));
        const episodes = episodesRes.data || [];
        const image = anime.images?.jpg?.large_image_url || '';
        const poster = anime.images?.jpg?.image_url || '';
        const bgImage = anime.trailer?.images?.maximum_image_url || image;
        const episodeList = episodes.length ? episodes : Array.from({ length: anime.episodes || 12 }, (_, i) => ({ mal_id: i + 1, episode: i + 1, title: `Episode ${i + 1}`, aired: null }));
        const isFav = Storage.isFavorite(parseInt(id));
        const isList = Storage.isInWatchlist(parseInt(id));
        main.innerHTML = `
            <div class="anime-hero">
                <div class="anime-hero-bg" style="background-image: url('${escapeHtml(bgImage)}')"></div>
                <div class="anime-hero-content">
                    <div class="anime-poster"><img src="${escapeHtml(poster)}" alt="${escapeHtml(anime.title)}"></div>
                    <div class="anime-info">
                        <h1 class="anime-title">${escapeHtml(anime.title)}</h1>
                        ${anime.title_english && anime.title_english !== anime.title ? `<p class="anime-alt-title">${escapeHtml(anime.title_english)}</p>` : ''}
                        <div class="anime-meta-row">
                            <span class="score">${anime.score ? anime.score.toFixed(1) : 'N/A'}</span>
                            <span class="dot"></span><span>${anime.type || 'TV'}</span>
                            <span class="dot"></span><span>${anime.episodes || '?'} Episodes</span>
                            <span class="dot"></span><span>${anime.status}</span>
                            <span class="dot"></span><span>${anime.year || 'Unknown'}</span>
                        </div>
                        <div class="anime-genres">${(anime.genres || []).map(g => `<span class="genre-tag">${escapeHtml(g.name)}</span>`).join('')}</div>
                        <p class="anime-synopsis">${escapeHtml(anime.synopsis || 'No synopsis available.')}</p>
                        <div class="anime-actions">
                            <a href="/watch/${id}/1" data-router class="btn btn-primary">${ICONS.play} Watch Now</a>
                            <button class="btn btn-secondary" id="btnWatchlist">${isList ? ICONS.check : ICONS.plus} ${isList ? 'In Watchlist' : 'Watchlist'}</button>
                            <button class="btn btn-secondary" id="btnFavorite">${isFav ? ICONS.heartFilled : ICONS.heart} ${isFav ? 'Favorited' : 'Favorite'}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="detail-sections">
                <div class="detail-tabs">
                    <button class="detail-tab active" data-tab="episodes">Episodes</button>
                    <button class="detail-tab" data-tab="info">Information</button>
                </div>
                <div id="tabContent">
                    <div class="episodes-grid" id="episodesTab">
                        ${episodeList.map(ep => `
                            <a href="/watch/${id}/${ep.mal_id || ep.episode}" data-router class="episode-card">
                                <div class="episode-number">${ep.mal_id || ep.episode}</div>
                                <div class="episode-info">
                                    <div class="episode-title">${escapeHtml(ep.title || `Episode ${ep.mal_id || ep.episode}`)}</div>
                                    <div class="episode-duration">${ep.aired ? formatDate(ep.aired) : ''}</div>
                                </div>
                            </a>`).join('')}
                    </div>
                    <div id="infoTab" class="hidden">
                        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem;">
                            <div>
                                <h3 style="margin-bottom:0.75rem;font-size:1.1rem;">Details</h3>
                                <p class="text-secondary" style="line-height:2;">
                                    <strong>Studio:</strong> ${(anime.studios || []).map(s => s.name).join(', ') || 'Unknown'}<br>
                                    <strong>Aired:</strong> ${anime.aired?.string || 'Unknown'}<br>
                                    <strong>Duration:</strong> ${anime.duration || 'Unknown'}<br>
                                    <strong>Rating:</strong> ${anime.rating || 'Unknown'}<br>
                                    <strong>Source:</strong> ${anime.source || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <h3 style="margin-bottom:0.75rem;font-size:1.1rem;">Statistics</h3>
                                <p class="text-secondary" style="line-height:2;">
                                    <strong>Score:</strong> ${anime.score || 'N/A'} (${anime.scored_by?.toLocaleString() || '0'} users)<br>
                                    <strong>Ranked:</strong> #${anime.rank || 'N/A'}<br>
                                    <strong>Popularity:</strong> #${anime.popularity || 'N/A'}<br>
                                    <strong>Members:</strong> ${anime.members?.toLocaleString() || '0'}<br>
                                    <strong>Favorites:</strong> ${anime.favorites?.toLocaleString() || '0'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        document.querySelectorAll('.detail-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const target = tab.dataset.tab;
                document.getElementById('episodesTab').classList.toggle('hidden', target !== 'episodes');
                document.getElementById('infoTab').classList.toggle('hidden', target !== 'info');
            });
        });
        document.getElementById('btnWatchlist')?.addEventListener('click', function() {
            const added = Storage.toggleWatchlist({ id: parseInt(id), title: anime.title, image: anime.images?.jpg?.image_url });
            this.innerHTML = `${added ? ICONS.check : ICONS.plus} ${added ? 'In Watchlist' : 'Watchlist'}`;
            showToast(added ? 'Added to watchlist' : 'Removed from watchlist', 'success');
        });
        document.getElementById('btnFavorite')?.addEventListener('click', function() {
            const added = Storage.toggleFavorite({ id: parseInt(id), title: anime.title, image: anime.images?.jpg?.image_url });
            this.innerHTML = `${added ? ICONS.heartFilled : ICONS.heart} ${added ? 'Favorited' : 'Favorite'}`;
            showToast(added ? 'Added to favorites' : 'Removed from favorites', 'success');
        });
    } catch (err) {
        console.error('Anime detail error:', err);
        main.innerHTML = `
            <div class="empty-state" style="padding: 20vh 2rem;">
                ${ICONS.info}
                <h3>Failed to Load Anime</h3>
                <p>Could not load anime details. Please check the ID and try again.</p>
                <a href="/" data-router class="btn btn-accent mt-3">Back to Home</a>
            </div>`;
    }
}

export async function renderWatch(router, params) {
    const main = document.getElementById('main');
    const { id, episode } = params;
    const epNum = parseInt(episode) || 1;
    main.innerHTML = `
        <div class="watch-layout">
            <div class="watch-main">
                <div class="player-container">
                    <div class="player-placeholder">${ICONS.film}<p>Loading player...</p></div>
                </div>
                <div class="skeleton" style="height:100px;"></div>
            </div>
            <div class="watch-sidebar"><div class="skeleton" style="height:300px;"></div></div>
        </div>`;
    try {
        const { data: anime } = await API.getAnimeById(id);
        const totalEpisodes = anime.episodes || 12;
        const streamUrl = getStreamUrl(id, epNum);
        Storage.updateContinueWatching(parseInt(id), epNum, anime.title, anime.images?.jpg?.image_url, totalEpisodes);
        Storage.addToHistory(parseInt(id), epNum, anime.title, anime.images?.jpg?.image_url);
        main.innerHTML = `
            <div class="watch-layout">
                <div class="watch-main">
                    <div class="player-container">
                        <iframe src="${escapeHtml(streamUrl)}" allowfullscreen sandbox="allow-scripts allow-same-origin allow-presentation"></iframe>
                    </div>
                    <div class="watch-info">
                        <h1 class="watch-info-title">${escapeHtml(anime.title)} — Episode ${epNum}</h1>
                        <div class="watch-info-meta">
                            <span>${anime.type || 'TV'}</span>
                            <span class="dot" style="width:4px;height:4px;border-radius:50%;background:var(--text-muted);"></span>
                            <span>Episode ${epNum} of ${totalEpisodes}</span>
                            <span class="dot" style="width:4px;height:4px;border-radius:50%;background:var(--text-muted);"></span>
                            <span>${anime.rating || 'PG-13'}</span>
                        </div>
                        <div class="watch-controls">
                            ${epNum > 1 ? `<a href="/watch/${id}/${epNum - 1}" data-router class="btn btn-secondary">${ICONS.chevronLeft} Prev</a>` : ''}
                            ${epNum < totalEpisodes ? `<a href="/watch/${id}/${epNum + 1}" data-router class="btn btn-accent">Next ${ICONS.chevronRight}</a>` : ''}
                            <a href="/anime/${id}" data-router class="btn btn-secondary">${ICONS.info} Details</a>
                        </div>
                    </div>
                </div>
                <div class="watch-sidebar">
                    <h3 class="sidebar-title">Episodes</h3>
                    <div class="episode-list">
                        ${Array.from({ length: Math.min(totalEpisodes, 50) }, (_, i) => {
                            const num = i + 1;
                            return `<a href="/watch/${id}/${num}" data-router class="episode-list-item ${num === epNum ? 'active' : ''}"><div class="ep-num">${num}</div><div class="ep-title">Episode ${num}</div></a>`;
                        }).join('')}
                    </div>
                </div>
            </div>`;
    } catch (err) {
        console.error('Watch page error:', err);
        main.innerHTML = `
            <div class="empty-state" style="padding: 20vh 2rem;">
                ${ICONS.info}
                <h3>Failed to Load Episode</h3>
                <p>Could not load the requested episode. Please try again later.</p>
                <a href="/" data-router class="btn btn-accent mt-3">Back to Home</a>
            </div>`;
    }
}

export function renderSearch(router) {
    const main = document.getElementById('main');
    main.innerHTML = `
        <div class="search-page">
            <div class="search-header">
                <div class="search-bar">
                    ${ICONS.search}
                    <input type="text" id="searchInput" placeholder="Search anime by title..." autocomplete="off">
                </div>
            </div>
            <div id="searchResults">
                <div class="search-status">
                    ${ICONS.search}
                    <h3>Start Searching</h3>
                    <p>Type an anime title to find what you want to watch.</p>
                </div>
            </div>
        </div>`;
    const input = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResults');
    const performSearch = debounce(async (query) => {
        if (!query.trim()) {
            resultsContainer.innerHTML = `
                <div class="search-status">
                    ${ICONS.search}
                    <h3>Start Searching</h3>
                    <p>Type an anime title to find what you want to watch.</p>
                </div>`;
            return;
        }
        resultsContainer.innerHTML = renderSkeletonCard(12);
        toggleLoading(true);
        try {
            const data = await API.searchAnime(query, 1, CONFIG.ITEMS_PER_PAGE);
            const animeList = data.data || [];
            if (!animeList.length) {
                resultsContainer.innerHTML = `
                    <div class="search-status">
                        ${ICONS.info}
                        <h3>No Results Found</h3>
                        <p>We couldn't find any anime matching "${escapeHtml(query)}".</p>
                    </div>`;
                return;
            }
            resultsContainer.innerHTML = `<div class="search-results">${animeList.map(a => renderAnimeCard(a)).join('')}</div>`;
            initCardClicks(router); lazyLoadImages();
        } catch (err) {
            resultsContainer.innerHTML = `
                <div class="search-status">
                    ${ICONS.info}
                    <h3>Search Error</h3>
                    <p>Failed to search. Please try again.</p>
                </div>`;
        } finally { toggleLoading(false); }
    });
    input.addEventListener('input', (e) => performSearch(e.target.value));
    input.focus();
}

export function renderProfile(router) {
    const main = document.getElementById('main');
    const profile = Storage.getProfile();
    const stats = Storage.getStats();
    main.innerHTML = `
        <div class="profile-page">
            <div class="profile-header">
                <div class="profile-avatar">
                    ${profile.avatar ? `<img src="${escapeHtml(profile.avatar)}" alt="">` : profile.name.charAt(0).toUpperCase()}
                </div>
                <div class="profile-info">
                    <h1>${escapeHtml(profile.name)}</h1>
                    <p>Member since ${formatDate(profile.joined)}</p>
                    <div class="profile-stats">
                        <div class="stat"><div class="stat-value">${stats.history}</div><div class="stat-label">Watched</div></div>
                        <div class="stat"><div class="stat-value">${stats.watchlist}</div><div class="stat-label">Watchlist</div></div>
                        <div class="stat"><div class="stat-value">${stats.favorites}</div><div class="stat-label">Favorites</div></div>
                        <div class="stat"><div class="stat-value">${stats.continue}</div><div class="stat-label">Continue</div></div>
                    </div>
                </div>
            </div>
            <div class="profile-tabs">
                <button class="profile-tab active" data-tab="continue">Continue Watching</button>
                <button class="profile-tab" data-tab="watchlist">Watchlist</button>
                <button class="profile-tab" data-tab="favorites">Favorites</button>
                <button class="profile-tab" data-tab="history">History</button>
            </div>
            <div class="profile-content" id="profileContent"></div>
        </div>`;

    function renderTabContent(tab) {
        const content = document.getElementById('profileContent');
        let items = [], emptyTitle = '', emptyDesc = '';
        switch(tab) {
            case 'continue': items = Storage.getContinueWatching(); emptyTitle = 'No Continue Watching'; emptyDesc = 'Episodes you start watching will appear here.'; break;
            case 'watchlist': items = Storage.getWatchlist(); emptyTitle = 'Watchlist Empty'; emptyDesc = 'Add anime to your watchlist to see them here.'; break;
            case 'favorites': items = Storage.getFavorites(); emptyTitle = 'No Favorites'; emptyDesc = 'Mark anime as favorites to see them here.'; break;
            case 'history': items = Storage.getWatchHistory(); emptyTitle = 'No History'; emptyDesc = 'Your watch history will appear here.'; break;
        }
        if (!items.length) {
            content.innerHTML = `<div class="empty-state">${ICONS.list}<h3>${emptyTitle}</h3><p>${emptyDesc}</p></div>`;
            return;
        }
        content.innerHTML = `<div class="search-results">${items.map(item => `
            <article class="anime-card" data-router-link="/${tab === 'continue' || tab === 'history' ? 'watch' : 'anime'}/${item.animeId || item.id}${tab === 'continue' || tab === 'history' ? '/1' : ''}">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" class="card-image" loading="lazy">
                <div class="card-overlay">
                    <h3 class="card-title">${escapeHtml(item.title)}</h3>
                    ${item.episode ? `<div class="card-meta">Episode ${item.episode}</div>` : ''}
                </div>
            </article>`).join('')}</div>`;
        initCardClicks(router);
    }

    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderTabContent(tab.dataset.tab);
        });
    });
    renderTabContent('continue');
}

export function renderSupport() {
    document.getElementById('main').innerHTML = `
        <div class="support-page">
            <svg class="support-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                <path d="M12 18c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z" opacity="0.3"/>
            </svg>
            <h1>Support NamiTube</h1>
            <p>NamiTube is free and open for everyone. Your support helps us keep the servers running and improve the platform for all anime fans.</p>
            <div class="donation-options">
                <div class="donation-card">
                    <h3>Supporter</h3>
                    <div class="amount">$3</div>
                    <p>Buy us a coffee and keep the servers warm.</p>
                    <button class="btn btn-accent" onclick="showToast('Thank you for your support!', 'success')">Donate $3</button>
                </div>
                <div class="donation-card">
                    <h3>Fan</h3>
                    <div class="amount">$5</div>
                    <p>Help us add new features and improve quality.</p>
                    <button class="btn btn-accent" onclick="showToast('Thank you for your support!', 'success')">Donate $5</button>
                </div>
                <div class="donation-card">
                    <h3>Hero</h3>
                    <div class="amount">$10</div>
                    <p>Become a hero and get a special badge.</p>
                    <button class="btn btn-accent" onclick="showToast('Thank you for your support!', 'success')">Donate $10</button>
                </div>
            </div>
            <div class="support-message">
                <h3>Why Support Us?</h3>
                <p>All donations go directly toward infrastructure costs, API improvements, and keeping NamiTube ad-free. We believe anime should be accessible to everyone without intrusive advertisements or paywalls.</p>
            </div>
        </div>`;
}
