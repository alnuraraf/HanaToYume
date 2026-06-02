import { Store } from '../store.js';

export function ProfilePage() {
  const main = document.getElementById('main-content');
  const profile = Store.getProfile();

  main.innerHTML = `
    <div class="profile-page">
      <div class="profile-header">
        <div class="profile-avatar">${profile.name ? profile.name[0].toUpperCase() : 'G'}</div>
        <div>
          <h1>${profile.name || 'Guest'}</h1>
          <p style="color:var(--text-muted)">${profile.email || ''}</p>
        </div>
      </div>
      <div class="profile-form">
        <input type="text" id="p-name" placeholder="Display Name" value="${profile.name || ''}">
        <input type="email" id="p-email" placeholder="Email" value="${profile.email || ''}">
        <button class="btn btn-primary" id="save-profile" style="width:fit-content">Save Profile</button>
      </div>
      <div class="profile-tabs">
        <button class="profile-tab active" data-tab="continue">Continue Watching</button>
        <button class="profile-tab" data-tab="watchlist">Watchlist</button>
        <button class="profile-tab" data-tab="favorites">Favorites</button>
        <button class="profile-tab" data-tab="history">History</button>
      </div>
      <div id="profile-content" class="profile-grid"></div>
    </div>
  `;

  const content = document.getElementById('profile-content');
  const tabs = document.querySelectorAll('.profile-tab');

  const renderTab = (tab) => {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    let items = [];
    if (tab === 'continue') items = Store.getContinueWatching();
    else if (tab === 'watchlist') items = Store.getWatchlist();
    else if (tab === 'favorites') items = Store.getFavorites();
    else if (tab === 'history') items = Store.getWatchHistory();

    if (items.length === 0) {
      content.innerHTML = `<p style="grid-column:1/-1;color:var(--text-muted)">No items found.</p>`;
      return;
    }

    content.innerHTML = items.map(item => {
      if (tab === 'history' || tab === 'continue') {
        return `
          <a href="/watch/${item.malId}/${item.episodeId}" class="card" data-link>
            <img class="card-img" src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="card-info">
              <div class="card-title">${item.title}</div>
              <div class="card-meta">Ep ${item.episodeId}</div>
            </div>
          </a>
        `;
      } else {
        return `
          <a href="/anime/${item.malId}" class="card" data-link>
            <img class="card-img" src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="card-info">
              <div class="card-title">${item.title}</div>
            </div>
          </a>
        `;
      }
    }).join('');
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => renderTab(tab.dataset.tab));
  });

  document.getElementById('save-profile').addEventListener('click', () => {
    const name = document.getElementById('p-name').value.trim();
    const email = document.getElementById('p-email').value.trim();
    Store.setProfile({ name, email });
    alert('Profile saved!');
    ProfilePage();
  });

  renderTab('continue');
}