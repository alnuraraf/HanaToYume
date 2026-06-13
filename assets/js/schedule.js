/* ===== NamiTube — Schedule Page ===== */
document.addEventListener('DOMContentLoaded', () => {
  const tabsContainer = document.getElementById('scheduleTabs');
  const listContainer = document.getElementById('scheduleList');
  if (!tabsContainer || !listContainer) return;

  const days = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  tabsContainer.innerHTML = days.map((d, i) => {
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${dayNames[d.getDay()]}`;
    const dateStr = `${monthNames[d.getMonth()]} ${d.getDate()}`;
    return `<button class="schedule-tab ${i === 0 ? 'active' : ''}" data-index="${i}">${label}<br><span style="font-size:.7rem;color:var(--text-muted)">${dateStr}</span></button>`;
  }).join('');

  let activeIndex = 0;
  tabsContainer.addEventListener('click', e => {
    const tab = e.target.closest('.schedule-tab');
    if (!tab) return;
    tabsContainer.querySelectorAll('.schedule-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeIndex = parseInt(tab.dataset.index);
    loadDay(activeIndex);
  });

  async function loadDay(idx) {
    const day = days[idx];
    const start = new Date(day); start.setHours(0,0,0,0);
    const end = new Date(day); end.setHours(23,59,59,999);
    const startTs = Math.floor(start.getTime() / 1000);
    const endTs = Math.floor(end.getTime() / 1000);

    listContainer.innerHTML = '<div class="page-loader"><div class="spinner"></div></div>';

    try {
      const data = await fetchAiringSchedule(startTs, endTs);
      const items = data?.Page?.airingSchedules || [];

      if (items.length === 0) {
        listContainer.innerHTML = '<div class="empty-state"><p style="color:var(--text-secondary)">No scheduled airings for this day.</p></div>';
        return;
      }

      listContainer.innerHTML = items.map(item => {
        const m = item.media;
        if (!m) return '';
        const title = getTitle(m);
        const cover = m.coverImage?.large || 'assets/img/placeholder-cover.svg';
        const airDate = new Date(item.airingAt * 1000);
        const timeStr = airDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const countdown = item.timeUntilAiring > 0
          ? `${Math.floor(item.timeUntilAiring / 3600)}h ${Math.floor((item.timeUntilAiring % 3600) / 60)}m`
          : 'Aired';
        return `
          <a href="anime.html?id=${m.id}" class="schedule-item">
            <img src="${cover}" alt="${title}" loading="lazy" onerror="imgError(this)">
            <div class="schedule-item-info">
              <div class="schedule-item-title">${title}</div>
              <div class="schedule-item-meta">Episode ${item.episode} · ${formatFormat(m.format)}</div>
            </div>
            <div class="schedule-item-time">${timeStr}<br><span style="font-size:.72rem;color:var(--text-secondary)">${countdown}</span></div>
          </a>`;
      }).join('');
    } catch {
      listContainer.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:32px">Failed to load schedule.</p>';
    }
  }

  loadDay(0);

  // Live countdown update
  setInterval(() => {
    listContainer.querySelectorAll('.schedule-item-time').forEach(el => {
      // The countdowns are static snapshots; for live updates we'd need to store timestamps
      // This is a visual nicety - the page can be refreshed for accurate times
    });
  }, 60000);
});
