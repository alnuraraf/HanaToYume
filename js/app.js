import { Router } from './router.js';
import { renderHeader, renderFooter } from './components.js';
import { renderHome, renderAnimeDetail, renderWatch, renderSearch, renderProfile, renderSupport } from './pages.js';

const router = new Router();

router.add('/', () => renderHome(router));
router.add('/anime/:id', (params) => renderAnimeDetail(router, params));
router.add('/watch/:id/:episode', (params) => renderWatch(router, params));
router.add('/search', () => renderSearch(router));
router.add('/profile', () => renderProfile(router));
router.add('/support', () => renderSupport());

router.beforeEach(() => {
    const overlay = document.querySelector('.search-overlay.active');
    if (overlay) overlay.classList.remove('active');
});

router.afterEach(() => {
    renderHeader(router);
    renderFooter();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('DOMContentLoaded', () => {
    renderHeader(router);
    renderFooter();
    router.init();
});
