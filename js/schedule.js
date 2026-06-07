import { jikan } from './api.js';
import { getWatchlist, getReminders, addReminder, removeReminder } from './storage.js';
import { AnimeCard, Toast, SkeletonRow, CountdownTimer } from './components.js';
import { escapeHtml } from './utils.js';

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
let countdowns = [];

export function initSchedule() {
  const tabs = document.getElementById('day-tabs');
  const list = document.getElementById('schedule-list');
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  if (tabs) {
    tabs.innerHTML = DAYS.map((d, i) => `
      <button class="day-tab ${i === todayIndex ? 'active' : ''}" data-day="${d}" data-index="${i}">
        ${DAY_LABELS[i]}
      </button>
    `).join('');
    tabs.querySelectorAll('.day-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.querySelectorAll('.day-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadDay(btn.dataset.day);
      });
    });
  }

  loadDay(DAYS[todayIndex]);
  renderWatchingToday();
  renderCountdowns();
}

async function loadDay(day) {
  const list = document.getElementById('schedule-list');
  if (!list) return;
  list.innerHTML = SkeletonRow(6, 'sm');
  try {
    const data = await jikan(`/schedules?filter=${day}&page=1`);
    const items = data?.data || [];
    if (!items.length) {
      list.innerHTML = '<p class="empty-state">No anime scheduled for this day.</p>';
      return;
    }
    list.innerHTML = items.map(item => {
      const wl = getWatchlist().find(x => x.malId === item.mal_id);
      return `
        <div class="schedule-item ${wl ? 'in-watchlist' : ''}">
          <img src="${item.images?.jpg?.image_url || ''}" alt="" class="schedule-thumb" loading="lazy">
          <div class="schedule-info">
            <a href="anime.html?id=${item.mal_id}" class="schedule-title">${escapeHtml(item.title)}</a>
            <div class="schedule-meta">
              <span>EP ${item.episodes || '?'}</span>
              <span>${item.broadcast?.time || 'TBA'} JST</span>
              <span>${item.studios?.[0]?.name || ''}</span>
            </div>
            <div class="schedule-genres">${(item.genres || []).map(g => `<span class="genre-pill">${escapeHtml(g.name)}</span>`).join('')}</div>
          </div>
          <div class="schedule-actions">
            <span class="score-badge">${item.score ? item.score.toFixed(1) : 'N/A'}</span>
            <button class="remind-btn ${getReminders().some(r => r.malId === item.mal_id) ? 'active' : ''}" data-mal-id="${item.mal_id}" aria-label="Toggle reminder">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
            <a href="anime.html?id=${item.mal_id}" class="nt-btn nt-btn-secondary nt-btn-sm">More Info</a>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.remind-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const malId = Number(btn.dataset.malId);
        const item = items.find(i => i.mal_id === malId);
        if (getReminders().some(r => r.malId === malId)) {
          removeReminder(malId);
          btn.classList.remove('active');
          Toast('Reminder removed', 'info');
        } else {
          addReminder({
            malId,
            title: item.title,
            dayOfWeek: day,
            broadcastTime: item.broadcast?.time || ''
          });
          btn.classList.add('active');
          Toast('Reminder set', 'success');
        }
      });
    });
  } catch (e) {
    list.innerHTML = '<p class="empty-state">Failed to load schedule.</p>';
  }
}

function renderWatchingToday() {
  const container = document.getElementById('watching-today');
  if (!container) return;
  const wl = getWatchlist();
  if (!wl.length) { container.style.display = 'none'; return; }
  container.style.display = 'block';
  container.innerHTML = `
    <h3 class="section-title">Watching Today</h3>
    <div class="watching-today-list">
      ${wl.slice(0, 6).map(item => `
        <a href="anime.html?id=${item.malId}" class="watching-today-item">
          <img src="${item.posterUrl || ''}" alt="" loading="lazy">
          <span>${escapeHtml(item.title)}</span>
        </a>
      `).join('')}
    </div>
  `;
}

function renderCountdowns() {
  const container = document.getElementById('countdowns');
  if (!container) return;
  const reminders = getReminders();
  if (!reminders.length) { container.style.display = 'none'; return; }
  container.style.display = 'block';
  container.innerHTML = `
    <h3 class="section-title">Next Episodes</h3>
    <div class="countdown-list">
      ${reminders.map(r => {
        const target = getNextAiringTime(r.dayOfWeek, r.broadcastTime);
        return `
          <div class="countdown-item">
            <a href="anime.html?id=${r.malId}">${escapeHtml(r.title)}</a>
            <div class="countdown-timer" data-target="${target}">Loading...</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  container.querySelectorAll('.countdown-timer').forEach(el => {
    const target = Number(el.dataset.target);
    if (!isNaN(target)) {
      const clear = CountdownTimer(target, el);
      countdowns.push(clear);
    }
  });
}

function getNextAiringTime(day, time) {
  const dayMap = { monday:1, tuesday:2, wednesday:3, thursday:4, friday:5, saturday:6, sunday:0 };
  const now = new Date();
  const targetDay = dayMap[day] ?? 1;
  const diff = (targetDay - now.getDay() + 7) % 7;
  const d = new Date(now);
  d.setDate(d.getDate() + diff);
  if (time) {
    const [h, m] = time.split(':');
    d.setHours(Number(h) || 0, Number(m) || 0, 0, 0);
  } else {
    d.setHours(0, 0, 0, 0);
  }
  if (d <= now) d.setDate(d.getDate() + 7);
  return d.getTime();
}
