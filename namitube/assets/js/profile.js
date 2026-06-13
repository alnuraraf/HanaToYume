/* ===== NamiTube — Profile Page ===== */
document.addEventListener('DOMContentLoaded', () => {
  const user = ensureUser();
  const history = getHistory();
  const watchlist = getWatchlist();
  const favorites = getFavorites();

  // Avatar
  const avatarEl = document.getElementById('profileAvatarLarge');
  if (avatarEl) {
    if (user.avatar) {
      avatarEl.innerHTML = `<img src="${user.avatar}" alt="${user.displayName}" onerror="this.style.display='none';this.parentElement.textContent='${(user.displayName||'A')[0].toUpperCase()}'">`;
    } else {
      avatarEl.textContent = (user.displayName || 'A')[0].toUpperCase();
    }
  }

  // Name & join
  const nameEl = document.getElementById('profileDisplayName');
  const joinEl = document.getElementById('profileJoinDate');
  if (nameEl) nameEl.textContent = user.displayName || 'Anime Watcher';
  if (joinEl) joinEl.textContent = `Member since ${user.joinDate || 'today'}`;

  // Stats
  const epCount = document.getElementById('statEpisodes');
  const wlCount = document.getElementById('statWatchlist');
  const favCount = document.getElementById('statFavorites');
  if (epCount) epCount.textContent = history.length;
  if (wlCount) wlCount.textContent = watchlist.length;
  if (favCount) favCount.textContent = favorites.length;

  // Edit form
  const nameInput = document.getElementById('editName');
  const avatarInput = document.getElementById('editAvatar');
  const previewEl = document.getElementById('avatarPreview');
  const saveBtn = document.getElementById('saveProfile');

  if (nameInput) nameInput.value = user.displayName || '';
  if (avatarInput) avatarInput.value = user.avatar || '';
  updatePreview();

  avatarInput?.addEventListener('input', updatePreview);

  function updatePreview() {
    if (!previewEl) return;
    const url = avatarInput?.value?.trim();
    if (url) {
      previewEl.innerHTML = `<img src="${url}" alt="Preview" onerror="this.style.display='none';this.parentElement.textContent='?'">`;
    } else {
      const initial = (nameInput?.value || 'A')[0].toUpperCase();
      previewEl.textContent = initial;
    }
  }

  saveBtn?.addEventListener('click', () => {
    const name = nameInput?.value?.trim() || 'Anime Watcher';
    const avatar = avatarInput?.value?.trim() || '';
    setUser({ ...user, displayName: name, avatar });
    showToast('Profile saved!', 'success');
    // Update page display
    if (nameEl) nameEl.textContent = name;
    if (avatarEl) {
      if (avatar) {
        avatarEl.innerHTML = `<img src="${avatar}" alt="${name}" onerror="this.style.display='none';this.parentElement.textContent='${name[0].toUpperCase()}'">`;
      } else {
        avatarEl.textContent = name[0].toUpperCase();
      }
    }
  });
});
