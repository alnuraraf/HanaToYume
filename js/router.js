import { CONFIG } from './config.js';

export class Router {
    constructor() {
        this.routes = [];
        this.beforeHooks = [];
        this.afterHooks = [];
        this.currentRoute = null;
        this.scrollRestoration = true;
    }

    add(path, handler, options = {}) {
        const keys = [];
        const regex = path.replace(/:([^/]+)/g, (match, key) => {
            keys.push(key);
            return '([^/]+)';
        });
        this.routes.push({ pattern: new RegExp(`^${regex}$`), keys, handler, options });
        return this;
    }

    navigate(path, options = {}) {
        const { replace = false, state = null } = options;
        const cleanPath = path.startsWith('/') ? path : '/' + path;
        const url = CONFIG.BASE_PATH + cleanPath;
        if (replace) history.replaceState(state, '', url);
        else history.pushState(state, '', url);
        this.resolve(cleanPath);
    }

    resolve(path) {
        const cleanPath = path.replace(CONFIG.BASE_PATH, '') || '/';
        for (const route of this.routes) {
            const match = cleanPath.match(route.pattern);
            if (match) {
                const params = {};
                route.keys.forEach((key, i) => { params[key] = decodeURIComponent(match[i + 1]); });
                this.runHooks(this.beforeHooks, route, params);
                if (this.scrollRestoration) window.scrollTo({ top: 0, behavior: 'smooth' });
                this.currentRoute = { path: cleanPath, params, route };
                route.handler(params);
                this.updateMeta(route, params);
                this.runHooks(this.afterHooks, route, params);
                return;
            }
        }
        this.render404();
    }

    updateMeta(route, params) {
        let title = 'NamiTube';
        const path = route.pattern.source.replace(/\\/g, '').replace(/^\^/, '').replace(/\$$/, '');
        if (path === '/') title = 'NamiTube — Watch Anime Online';
        else if (path.includes('anime')) title = `Anime Details — NamiTube`;
        else if (path.includes('watch')) title = `Watch Episode — NamiTube`;
        else if (path === '/search') title = 'Search Anime — NamiTube';
        else if (path === '/profile') title = 'Your Profile — NamiTube';
        else if (path === '/support') title = 'Support NamiTube';
        document.title = title;
    }

    runHooks(hooks, route, params) { hooks.forEach(hook => hook(route, params)); }
    beforeEach(hook) { this.beforeHooks.push(hook); }
    afterEach(hook) { this.afterHooks.push(hook); }

    init() {
        window.addEventListener('popstate', () => this.resolve(window.location.pathname));
        const redirect = sessionStorage.getItem('redirect');
        if (redirect) { sessionStorage.removeItem('redirect'); this.navigate(redirect, { replace: true }); }
        else this.resolve(window.location.pathname);
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-router]');
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href !== this.currentRoute?.path) this.navigate(href);
            }
        });
    }

    render404() {
        document.getElementById('main').innerHTML = `
            <div class="empty-state" style="padding: 20vh 2rem;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                <h3>Page Not Found</h3>
                <p>The page you are looking for does not exist.</p>
                <a href="/" data-router class="btn btn-accent mt-3">Go Home</a>
            </div>`;
    }
}
