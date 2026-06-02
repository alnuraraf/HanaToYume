export const Router = {
  routes: [],
  add(path, handler) {
    const regex = new RegExp('^' + path.replace(/:\w+/g, '([^/]+)') + '$');
    this.routes.push({ path, handler, regex });
  },
  navigate(path) {
    if (path === location.pathname + location.search) return;
    history.pushState(null, '', path);
    this.resolve();
  },
  resolve() {
    const path = location.pathname;
    const route = this.routes.find(r => r.regex.test(path));
    const main = document.getElementById('main-content');
    if (route) {
      const matches = path.match(route.regex);
      const params = matches.slice(1);
      main.innerHTML = '';
      route.handler(params);
      this.updateActiveNav();
    } else {
      main.innerHTML = '<div class="row" style="padding-top:100px;text-align:center"><h1>404 - Page Not Found</h1></div>';
    }
    window.scrollTo(0, 0);
  },
  updateActiveNav() {
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === location.pathname);
    });
  },
  init() {
    window.addEventListener('popstate', () => this.resolve());
    this.resolve();
  }
};