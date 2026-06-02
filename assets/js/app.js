import { Router } from './router.js';
import { Header, Footer } from './components.js';
import { HomePage } from './pages/home.js';
import { AnimePage } from './pages/anime.js';
import { WatchPage } from './pages/watch.js';
import { SearchPage } from './pages/search.js';
import { ProfilePage } from './pages/profile.js';
import { SupportPage } from './pages/support.js';

function init() {
  document.getElementById('header').innerHTML = Header();
  document.getElementById('footer').innerHTML = Footer();

  window.addEventListener('scroll', () => {
    document.getElementById('header').classList.toggle('scrolled', window.scrollY > 50);
  });

  const trigger = document.getElementById('search-trigger');
  const box = document.getElementById('search-box');
  const input = document.getElementById('global-search');
  const closeBtn = document.getElementById('close-search');

  trigger?.addEventListener('click', () => {
    box.classList.add('active');
    input.focus();
  });
  closeBtn?.addEventListener('click', () => {
    box.classList.remove('active');
    input.value = '';
  });
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) Router.navigate(`/search?q=${encodeURIComponent(q)}`);
      box.classList.remove('active');
      input.value = '';
    }
  });

  Router.add('/', () => HomePage());
  Router.add('/anime/:id', (params) => AnimePage(params[0]));
  Router.add('/watch/:id/:episode', (params) => WatchPage(params[0], params[1]));
  Router.add('/search', () => SearchPage());
  Router.add('/profile', () => ProfilePage());
  Router.add('/support', () => SupportPage());

  Router.init();

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-link]');
    if (a) {
      e.preventDefault();
      const href = a.getAttribute('href');
      if (href) Router.navigate(href);
    }
  });
}

init();