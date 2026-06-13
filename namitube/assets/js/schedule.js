/* ============================================
   NamiTube — Schedule Page Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScheduleTabs();
});

function initScheduleTabs() {
  const tabsContainer = document.getElementById('scheduleTabs');
  const listContainer = document.getElementById('scheduleList');
  if (!tabsContainer || !listContainer) return;

  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    days.push({ date: d, label: dayName, dateStr });
  }

  tabsContainer.innerHTML = days.map((d, i) => `
    <button class="schedule-tab ${i === 0 ? 'active' : ''}" data-index="${i}">
      ${d.label}<br><small style="font-weight:400;font-size:.75rem;color:var(--text-secondary)">${d.dateStr}</small>
    </button>
  `).join('');

  tabsContainer.querySelectorAll('.schedule-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.schedule-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadDay(days[+tab.dataset.index].date);
    });
  });

  loadDay(days[0].date);

  async function loadDay(date) {
    const start = Math.floor(date.getTime() / 1000);
    const end = start + 86400;

    listContainer.innerHTML = Array(6).fill('<div class="schedule-item"><div class="skeleton" style="width:60px;height:85px"></div><div style="flex:1"><div class="skeleton skeleton-text medium"></div><div class="skeleton skeleton-text short"></div></div></div>').join('');

    try {
      const data = await fetchAiringSchedule(start, end);
      const schedules = data.Page.airingSchedules;

      if (!schedules.length) {
        listContainer.innerHTML = `
          <div class="empty-state">
            ${ICONS.calendarDays}
            <h3>No episodes scheduled</h3>
            <p>Check back later for new episodes.</p>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = schedules.map(s => {
        const m = s.media;
        const airDate = new Date(s.airingAt * 1000);
        const timeStr = airDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const now = Date.now() / 1000;
        const diff = s.airingAt - now;
        let countdown = '';
        if (diff > 0) {
          const h = Math.floor(diff / 3600);
          const min = Math.floor((diff % 3600) / 60);
          countdown = `<div class="si-countdown">in ${h}h ${min}m</div>`;
        } else {
          countdown = `<div style="color:var(--success);font-size:.75rem">Aired</div>`;
        }

        return `
          <a href="anime.html?id=${m.id}" class="schedule-item">
            <img src="${getCover(m)}" alt="${getTitle(m)}" loading="lazy" onerror="onImgError(this)">
            <div class="si-info">
              <div class="si-title">${getTitle(m)}</div>
              <div class="si-ep">Episode ${s.episode}</div>
            </div>
            <div class="si-time">
              <div>${timeStr}</div>
              ${countdown}
            </div>
          </a>
        `;
      }).join('');

    } catch {
      listContainer.innerHTML = '<div class="empty-state"><p>Failed to load schedule. Refresh to try again.</p></div>';
    }
  }
}
