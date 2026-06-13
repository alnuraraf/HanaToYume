/* ============================================
   NamiTube — Profile Page Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const user = ensureUser();
  renderProfile(user);
});

function renderProfile(user) {
  const avatarEl = document.getElementById('profileAvatar');
  const nameEl = document.getElementById('profileName');
  const sinceEl = document.getElementById('profileSince');
  const nameInput = document.getElementById('nameInput');
  const avatarInput = document.getElementById('avatarInput');
  const avatarPreview = document.getElementById('avatarPreview');

  if (avatarEl) {
    avatarEl.innerHTML = user.avatar
      ? `<img src="${user.avatar}" alt="Avatar" onerror="onImgError(this)">`
      : user.displayName.charAt(0).toUpperCase();
  }
  if (nameEl) nameEl.textContent = user.displayName;
  if (sinceEl) sinceEl.textContent = `Member since ${new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
  if (nameInput) nameInput.value = user.displayName;
  if (avatarInput) avatarInput.value = user.avatar || '';

  /* Stats */
  const history = getHistory();
  const watchlist = getWatchlist();
  const favorites = getFavorites();
  document.getElementById('statEpisodes').textContent = history.length;
  document.getElementById('statWatchlist').textContent = watchlist.length;
  document.getElementById('statFavorites').textContent = favorites.length;

  /* Avatar preview */
  avatarInput?.addEventListener('input', () => {
    const url = avatarInput.value.trim();
    if (avatarPreview) {
      avatarPreview.innerHTML = url ? `<img src="${url}" alt="Preview" style="width:80px;height:80px;border-radius:50%;object-fit:cover" onerror="onImgError(this)">` : '';
    }
  });

  /* Save */
  document.getElementById('saveProfile')?.addEventListener('click', () => {
    const name = nameInput?.value.trim() || 'Anime Watcher';
    const avatar = avatarInput?.value.trim() || '';
    const updated = { ...user, displayName: name, avatar };
    setUser(updated);
    renderProfile(updated);
    showToast('Profile saved!', 'success');
  });
}
