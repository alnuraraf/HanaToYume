/* js/schedule.js */

const SchedulePage = {
  activeDay: '',
  timerInterval: null,

  init() {
    if (!document.getElementById('schedule-page-identifier')) return;

    // Detect today's day of week
    const today = getCurrentWeekdayName();
    this.activeDay = today;

    // Highlight today's tab button
    const activeTab = document.querySelector(`.day-tab-btn[data-day="${today}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
    }

    // Bind click events on day tabs
    const tabs = document.querySelectorAll('.day-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeDay = tab.getAttribute('data-day');
        this.loadScheduleForActiveDay();
      });
    });

    this.loadScheduleForActiveDay();
    this.setupCountdown();
  },

  async loadScheduleForActiveDay() {
    const listContainer = document.getElementById('schedule-list-items');
    if (!listContainer) return;

    // Show loading state
    listContainer.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px; width:100%;">
        ${Array(5).fill().map(() => `
          <div class="skeleton-card" style="height: 120px; display:flex; flex-direction:row; gap:20px; width:100%;">
            <div class="skeleton-shimmer" style="width:72px; height:96px; border-radius: var(--radius-sm);"></div>
            <div style="display:flex; flex-direction:column; gap:10px; flex-grow:1; justify-content:center;">
              <div class="skeleton-shimmer" style="height:20px; width:40%;"></div>
              <div class="skeleton-shimmer" style="height:14px; width:20%;"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    try {
      const response = await NamiAPI.getSchedule(this.activeDay);
      if (response && response.data && response.data.length > 0) {
        listContainer.innerHTML = '';
        response.data.forEach(anime => {
          const malId = anime.mal_id;
          const title = anime.title;
          const posterUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
          const score = anime.score ? anime.score.toFixed(1) : 'N/A';
          const broadcastTime = anime.broadcast?.time || 'TBA';
          const timezone = anime.broadcast?.timezone || 'JST';
          const genres = anime.genres ? anime.genres.map(g => g.name).slice(0, 3).join(', ') : 'TBA';
          
          // Next episode calculations
          // In standard Jikan, airing episodes of currently airing show can be estimated
          const airingEp = anime.episodes ? `Episode ${anime.episodes}` : 'New Episode';

          const isReminderSet = hasReminder(malId);
          const reminderText = isReminderSet ? 'Reminder Set' : 'Set Reminder';
          const reminderIcon = isReminderSet ? 'bell-ring' : 'bell';
          const reminderActiveCls = isReminderSet ? 'active' : '';

          const itemCard = document.createElement('div');
          itemCard.className = 'schedule-item-card reveal active';
          itemCard.innerHTML = `
            <img src="${posterUrl}" alt="${title}" class="schedule-poster" loading="lazy">
            <div class="schedule-info">
              <h3 class="schedule-anime-title">
                <a href="anime.html?id=${malId}">${title}</a>
              </h3>
              <div class="schedule-broadcast-time">
                <i data-lucide="clock" style="width:14px; height:14px;"></i>
                <span>${broadcastTime} (${timezone}) • ${airingEp}</span>
              </div>
              <p class="schedule-genres">${genres}</p>
              <div class="schedule-score">
                <i data-lucide="star" style="width:12px; height:12px; fill:var(--color-gold); color:var(--color-gold);"></i>
                <span>${score}</span>
              </div>
            </div>
            <div class="schedule-actions">
              <button class="btn btn-secondary reminder-btn ${reminderActiveCls}" data-id="${malId}">
                <i data-lucide="${reminderIcon}" style="width:14px; height:14px;"></i>
                <span>${reminderText}</span>
              </button>
            </div>
          `;

          // Bind Reminder toggle button
          const btn = itemCard.querySelector('.reminder-btn');
          btn.addEventListener('click', () => {
            const added = toggleReminder({
              malId,
              title,
              dayOfWeek: this.activeDay,
              broadcastTime: `${broadcastTime} ${timezone}`
            });

            if (added) {
              btn.classList.add('active');
              btn.innerHTML = `<i data-lucide="bell-ring" style="width:14px; height:14px;"></i> <span>Reminder Set</span>`;
              Toast(`Set reminder for: ${title}`, 'success');
            } else {
              btn.classList.remove('active');
              btn.innerHTML = `<i data-lucide="bell" style="width:14px; height:14px;"></i> <span>Set Reminder</span>`;
              Toast(`Removed reminder for: ${title}`, 'info');
            }
            if (window.lucide) window.lucide.createIcons();
            this.setupCountdown(); // Refresh countdown to nearest reminder
          });

          listContainer.appendChild(itemCard);
        });
      } else {
        listContainer.innerHTML = `
          <div class="schedule-empty">
            <i data-lucide="calendar-x" style="width:48px; height:48px; margin-bottom:12px; color:var(--color-text-muted);"></i>
            <p>No airing anime scheduled for ${capitalizeFirstLetter(this.activeDay)}.</p>
          </div>
        `;
      }
    } catch (err) {
      console.error("Failed to load schedule", err);
      listContainer.innerHTML = `<div class="schedule-empty">Failed to load airing schedules. Please try again.</div>`;
    } finally {
      if (window.lucide) window.lucide.createIcons();
    }
  },

  setupCountdown() {
    clearInterval(this.timerInterval);
    const profile = getProfile();
    const reminders = profile.reminders;

    const titleEl = document.getElementById('countdown-anime-title');
    const timeBlocks = {
      days: document.getElementById('timer-days'),
      hours: document.getElementById('timer-hours'),
      minutes: document.getElementById('timer-mins'),
      seconds: document.getElementById('timer-secs')
    };

    if (reminders.length === 0) {
      if (titleEl) titleEl.textContent = "No reminders set";
      const subtitleEl = document.getElementById('countdown-anime-subtitle');
      if (subtitleEl) subtitleEl.textContent = "Set reminders on airing anime to track countdowns.";
      
      // Set timer blocks to zero
      Object.values(timeBlocks).forEach(block => { if (block) block.textContent = '00'; });
      return;
    }

    // Parse broadcast times and find the nearest one in the future
    // DayOfWeek mapping to JS day index
    const dayIndices = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };

    const getNextOccurrence = (dayOfWeek, timeStr) => {
      const targetDayIdx = dayIndices[dayOfWeek.toLowerCase()];
      const [hour, min] = timeStr.split(' ')[0].split(':').map(Number);
      
      const now = new Date();
      let target = new Date();
      target.setHours(hour || 0, min || 0, 0, 0);

      const currentDayIdx = now.getDay();
      let daysToAdd = targetDayIdx - currentDayIdx;

      // If occurrence is today but time has passed, or target day is earlier in week, add days to go to next week
      if (daysToAdd < 0 || (daysToAdd === 0 && target.getTime() < now.getTime())) {
        daysToAdd += 7;
      }
      target.setDate(target.getDate() + daysToAdd);
      return target.getTime();
    };

    // Calculate nearest reminder
    let nearestReminder = null;
    let minDiff = Infinity;

    reminders.forEach(r => {
      if (!r.broadcastTime || r.broadcastTime.includes('TBA')) return;
      const targetTime = getNextOccurrence(r.dayOfWeek, r.broadcastTime);
      const diff = targetTime - Date.now();
      if (diff < minDiff) {
        minDiff = diff;
        nearestReminder = { ...r, targetTimestamp: targetTime };
      }
    });

    if (!nearestReminder) {
      if (titleEl) titleEl.textContent = "Schedule Pending...";
      return;
    }

    if (titleEl) titleEl.textContent = `Airing: ${nearestReminder.title}`;
    const subtitleEl = document.getElementById('countdown-anime-subtitle');
    if (subtitleEl) subtitleEl.textContent = `Next episode on ${capitalizeFirstLetter(nearestReminder.dayOfWeek)} at ${nearestReminder.broadcastTime}`;

    // Update timer every second
    const updateTimer = () => {
      const diff = nearestReminder.targetTimestamp - Date.now();
      if (diff <= 0) {
        clearInterval(this.timerInterval);
        this.setupCountdown(); // Recalculate next occurrence
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      if (timeBlocks.days) timeBlocks.days.textContent = String(d).padStart(2, '0');
      if (timeBlocks.hours) timeBlocks.hours.textContent = String(h).padStart(2, '0');
      if (timeBlocks.minutes) timeBlocks.minutes.textContent = String(m).padStart(2, '0');
      if (timeBlocks.seconds) timeBlocks.seconds.textContent = String(s).padStart(2, '0');
    };

    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  SchedulePage.init();
});
