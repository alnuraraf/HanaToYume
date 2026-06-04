/* schedule.js */
const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

document.addEventListener('DOMContentLoaded', () => {
  Components.mount();
  renderTabs();
  renderBanner();
  const today = Utils.getCurrentDay();
  loadDay(today === 'sunday' ? 'sunday' : today);
});

function renderTabs() {
  const today = Utils.getCurrentDay();
  const wrap = document.getElementById('dayTabs');
  wrap.innerHTML = DAYS.map(d => {
    const label = d.charAt(0).toUpperCase() + d.slice(1, 3);
    return `<button class="day-tab ${d === today ? 'today active' : ''}" data-day="${d}">${label}</button>`;
  }).join('');
  wrap.querySelectorAll('.day-tab').forEach(b => {
    b.onclick = () => {
      wrap.querySelectorAll('.day-tab').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      loadDay(b.dataset.day);
    };
  });
}

function renderBanner() {
  const wl = Storage.get().watchlist;
  const banner = document.getElementById('scheduleBanner');
  if (!wl.length) {
    banner.innerHTML = `
      <div>
        <h3>Build your schedule</h3>
        <p>Add anime to your watchlist to track upcoming episodes here.</p>
      </div>
      <a href="home.html" class="btn btn-primary"><i data-lucide="compass"></i>Browse Anime</a>`;
    Utils.initIcons();
    return;
  }
  banner.innerHTML = `
    <div>
      <h3>Your Schedule</h3>
      <p>You're tracking ${wl.length} anime in your watchlist.</p>
    </div>
    <a href="library.html" class="btn btn-secondary"><i data-lucide="bookmark"></i>View Watchlist</a>`;
  Utils.initIcons();
}

async function loadDay(day) {
  const list = document.getElementById('scheduleList');
  list.innerHTML = `<div class="spinner" style="margin:60px auto;"></div>`;
  try {
    const r = await API.getSchedule(day);
    const items = r.data || [];
    if (!items.length) {
      list.innerHTML = `<div class="empty-state"><h3>No airing anime</h3><p>Nothing scheduled for ${day}.</p></div>`;
      return;
    }
    list.innerHTML = items.map(a => {
      const time = a.broadcast?.time || '—';
      const hasReminder = Storage.hasReminder(a.mal_id);
      return `
        <div class="schedule-item">
          <a href="anime.html?id=${a.mal_id}"><img src="${a.images?.jpg?.image_url||''}" alt="${Utils.escapeHtml(a.title)}"/></a>
          <div class="schedule-info">
            <h3><a href="anime.html?id=${a.mal_id}">${Utils.escapeHtml(a.title)}</a></h3>
            <div class="schedule-meta">
              ${a.score ? `<span style="color:var(--color-gold);"><i data-lucide="star" style="width:11px;height:11px;display:inline;"></i> ${a.score}</span>` : ''}
              <span>${a.type || 'TV'}</span>
              <span>· ${a.episodes || '?'} eps</span>
              <span>· ${Utils.escapeHtml(a.status||'')}</span>
            </div>
            <div class="schedule-genres">${(a.genres||[]).slice(0,3).map(g => `<span class="tag tag-static" style="font-size:10px;">${Utils.escapeHtml(g.name)}</span>`).join('')}</div>
          </div>
          <div class="schedule-actions">
            <div class="schedule-time">${time}</div>
            <button class="btn ${hasReminder?'btn-primary':'btn-secondary'} btn-sm" data-reminder="${a.mal_id}" data-title="${Utils.escapeHtml(a.title)}" data-time="${time}" data-day="${day}">
              <i data-lucide="${hasReminder?'bell-ring':'bell'}"></i>${hasReminder?'Reminder set':'Set Reminder'}
            </button>
          </div>
        </div>`;
    }).join('');
    Utils.initIcons();

    list.querySelectorAll('[data-reminder]').forEach(btn => {
      btn.onclick = () => {
        const id = Number(btn.dataset.reminder);
        if (Storage.hasReminder(id)) {
          Storage.removeReminder(id);
          Components.Toast('Reminder removed', 'info');
        } else {
          Storage.addReminder({ malId: id, title: btn.dataset.title, dayOfWeek: btn.dataset.day, broadcastTime: btn.dataset.time });
          Components.Toast('Reminder set', 'success');
        }
        loadDay(day);
      };
    });
  } catch (e) {
    list.innerHTML = '<p class="text-muted">Failed to load schedule.</p>';
  }
}
