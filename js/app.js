document.addEventListener('DOMContentLoaded', () => {
    // Load User Avatar into Header
    const profile = UserSystem.getProfile();
    const avatarEl = document.querySelector('.user-avatar');
    if (avatarEl) avatarEl.src = profile.avatarUrl;

    // Render Logic for Home Page Grids
    const trendingContainer = document.getElementById('trending-grid');
    if (trendingContainer) {
        renderSkeletons(trendingContainer, 12);
        API.getTrending().then(animeList => {
            trendingContainer.innerHTML = '';
            animeList.forEach(anime => {
                trendingContainer.appendChild(createAnimeCard(anime));
            });
        });
    }
});

function createAnimeCard(anime) {
    const a = document.createElement('a');
    a.href = `details.html?id=${anime.mal_id}`;
    a.className = 'anime-card';
    
    a.innerHTML = `
        <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}" class="anime-poster" loading="lazy">
        <div class="anime-info">
            <div class="anime-title">${anime.title}</div>
            <div class="anime-meta">
                <span><i class="fa-solid fa-star"></i> ${anime.score || 'N/A'}</span>
                <span>${anime.type || 'TV'}</span>
            </div>
        </div>
    `;
    return a;
}

function renderSkeletons(container, count) {
    container.innerHTML = '';
    for(let i=0; i<count; i++) {
        const div = document.createElement('div');
        div.className = 'anime-card skeleton';
        div.style.height = '270px';
        container.appendChild(div);
    }
}
