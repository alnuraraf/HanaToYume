/* ===== NamiTube — Settings Page ===== */
document.addEventListener('DOMContentLoaded', () => {
  const prefs = ensurePrefs();

  // Default Lang
  const langSub = document.getElementById('langSub');
  const langDub = document.getElementById('langDub');
  if (prefs.defaultLang === 'dub') { if (langDub) langDub.checked = true; }
  else { if (langSub) langSub.checked = true; }

  langSub?.addEventListener('change', () => { if (langSub.checked) saveP('defaultLang', 'sub'); });
  langDub?.addEventListener('change', () => { if (langDub.checked) saveP('defaultLang', 'dub'); });

  // Default Server
  document.querySelectorAll('input[name="server"]').forEach(r => {
    if (r.value === prefs.defaultServer) r.checked = true;
    r.addEventListener('change', () => { if (r.checked) saveP('defaultServer', r.value); });
  });

  // Autoplay
  const autoplay = document.getElementById('autoplayToggle');
  if (autoplay) {
    autoplay.checked = prefs.autoplay !== false;
    autoplay.addEventListener('change', () => saveP('autoplay', autoplay.checked));
  }

  // Skip Intro
  const skipIntro = document.getElementById('skipIntroToggle');
  if (skipIntro) {
    skipIntro.checked = !!prefs.skipIntro;
    skipIntro.addEventListener('change', () => saveP('skipIntro', skipIntro.checked));
  }

  // Sandbox
  const sandbox = document.getElementById('settingsSandbox');
  if (sandbox) {
    sandbox.checked = JSON.parse(localStorage.getItem('namiTube_sandboxDisabled') || 'false');
    sandbox.addEventListener('change', () => {
      localStorage.setItem('namiTube_sandboxDisabled', JSON.stringify(sandbox.checked));
      showToast(sandbox.checked ? 'Sandbox disabled globally' : 'Sandbox re-enabled', 'info');
    });
  }

  // Clear All Data
  document.getElementById('clearAllBtn')?.addEventListener('click', () => {
    showModal('Clear All Data?', 'This will erase your profile, watch history, watchlist, favorites, and all settings. This cannot be undone.', () => {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('namiTube_'));
      keys.forEach(k => localStorage.removeItem(k));
      showToast('All data cleared', 'success');
      setTimeout(() => location.reload(), 1000);
    });
  });

  function saveP(key, val) {
    const p = ensurePrefs();
    p[key] = val;
    setPrefs(p);
    showToast('Settings saved', 'success');
  }
});
