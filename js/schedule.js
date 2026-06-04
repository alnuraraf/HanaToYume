/* ============================================
   NamiTube — Schedule page logic
   ============================================ */

window.NamiTube = window.NamiTube || {};
const NT = window.NamiTube;
const { $, h, lazyImage, Icons, Toast, Formatters, CountdownTimer } = { ...NT.utils, ...NT.components };

const DAYS = [
  { key: 'monday',    short: 'Mon' },
  { key: 'tuesday',   short: 'Tue' },
  { key: 'wednesday', short: 'Wed' },
  { key: 'thursday',  short: 'Thu' },
  { key: 'friday',    short: 'Fri' },
  { key: 'saturday',  short: 'Sat' },
  { key: 'sunday',    short: 'Sun' }
];

const SchedulePage = {
  currentDay: Formatters.weekday(),
  cache: {},

  async init() {
    this.renderTabs();
    this.computeNextEpisode();
    await this.loadDay(this.currentDay);
    this.bindTabs();
  },

  renderTabs() {
    const wrap = $('#dayTabs');
    if (!wrap) return;
    wrap.innerHTML = '';
    const today = new Date().getDay();
    DAYS.forEach((d, i) => {
      const date = Formatters.weekdayDate(i);
      const isToday = i === today;
      const isActive = d.key === this.currentDay;
      const tab = h('button', {
        class: `day-tab ${isActive ? 'active' : ''} ${isToday ? 'today' : ''}`,
        type: 'button',
        'aria-label': d.key,
        'aria-pressed': String(isActive),
        onclick: () => this.switchDay(d.key)
      });
      tab.appendChild(h('div', { class: 'day-name' }, d.short));
      tab.appendChild(h('div', { class: 'day-date' }, date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })));
      wrap.appendChild(tab);
    });
  },

  bindTabs() {
    // Allow horizontal scroll-snap to keep active tab in view
    const active = $('.day-tab.active');
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  },

  switchDay(day) {
    this.currentDay = day;
    this.renderTabs();
    this.loadDay(day);
    this.bindTabs();
  },

  async loadDay(day) {
    const list = $('#scheduleList');
    if (!list) return;
    list.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      list.appendChild(h('div', { class: 'schedule-row', style: { opacity: 0.5 } }, [
        h('div', { class: 'time skeleton', style: { height: '36px' } }),
        h('div', { class: 'thumb skeleton' }),
        h('div', { class: 'info', style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, [
          h('div', { class: 'skeleton', style: { width: '60%', height: '14px' } }),
          h('div', { class: 'skeleton', style: { width: '40%', height: '12px' } })
        ]),
        h('div', { class: 'actions' })
      ]));
    }

    try {
      let res = this.cache[day];
      if (!res) {
        res = await NT.api.schedule(day);
        this.cache[day] = res;
      }
      const items = (res.data || []).slice().sort((a, b) => {
        const ta = (a.broadcast?.time || '99:99');
        const tb = (b.broadcast?.time || '99:99');
        return ta.localeCompare(tb);
      });
      list.innerHTML = '';

      if (items.length === 0) {
        list.appendChild(h('div', { class: 'schedule-empty' }, [
          h('div', { html: Icons.calendar, style: { width: '64px', height: '64px', margin: '0 auto var(--space-3)' } }),
          h('h3', {}, 'No scheduled episodes'),
          h('p', {}, `Nothing airing on ${day}. Check other days or browse all anime.`)
        ]));
        return;
      }

      items.forEach((a, i) => {
        list.appendChild(this.renderRow(a, i));
      });
    } catch (e) {
      console.error('schedule error', e);
      list.innerHTML = '';
      list.appendChild(h('div', { class: 'schedule-empty' }, [
        h('h3', {}, 'Failed to load schedule'),
        h('p', {}, 'Please try again in a moment.')
      ]));
    }
  },

  renderRow(a, i) {
    const time = a.broadcast?.time || '';
    const [hh, mm] = time.split(':');
    const hour = parseInt(hh, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 === 0 ? 12 : hour % 12;

    const isReminded = NT.storage.hasReminder(a.mal_id);

    const row = h('div', { class: 'schedule-row', style: { animationDelay: (i * 30) + 'ms' } }, [
      h('div', { class: 'time' }, [
        h('div', {}, `${String(h12).padStart(2, '0')}:${mm || '00'}`),
        h('span', { class: 'ampm' }, ampm)
      ]),
      lazyImage(a.images?.jpg?.small_image_url || a.images?.jpg?.image_url, a.title, 'thumb'),
      h('div', { class: 'info' }, [
        h('h3', {}, [h('a', { href: `anime.html?id=${a.mal_id}` }, a.title)]),
        h('div', { class: 'meta' }, [
          h('span', {}, `EP ${a.episodes || '?'}`),
          a.score ? h('span', { class: 'score' }, `★ ${Formatters.score(a.score)}`) : null,
          a.type ? h('span', {}, a.type) : null
        ].filter(Boolean)),
        h('div', { class: 'genres' }, (a.genres || []).slice(0, 3).map(g => h('span', { class: 'tag tag-genre' }, g.name)))
      ]),
      h('div', { class: 'actions' }, [
        h('button', {
          class: `btn btn-sm ${isReminded ? 'btn-primary' : 'btn-ghost'}`,
          type: 'button',
          'aria-label': isReminded ? 'Remove reminder' : 'Set reminder',
          onclick: () => {
            if (isReminded) {
              NT.storage.removeReminder(a.mal_id);
              Toast('Reminder removed', 'info');
            } else {
              NT.storage.addReminder({
                malId: a.mal_id,
                title: a.title,
                dayOfWeek: this.currentDay,
                broadcastTime: time
              });
              Toast('Reminder set!', 'success');
            }
            this.loadDay(this.currentDay);
          }
        }, [
          isReminded ? Icons.check : Icons.bell,
          isReminded ? ' Reminded' : ' Remind'
        ])
      ])
    ]);
    return row;
  },

  /** Find the next upcoming episode from user's watchlist and show countdown */
  async computeNextEpisode() {
    const wrap = $('#nextUp');
    if (!wrap) return;
    const watchlist = NT.storage.getWatchlist();
    if (watchlist.length === 0) {
      wrap.style.display = 'none';
      return;
    }
    // Pull broadcast for first few watchlist items
    const candidates = [];
    for (const item of watchlist.slice(0, 6)) {
      try {
        const res = await NT.api.animeById(item.malId);
        const a = res.data;
        if (a?.broadcast?.day && a.broadcast?.time) {
          candidates.push({ anime: a, day: a.broadcast.day, time: a.broadcast.time });
        }
      } catch (e) { /* ignore */ }
    }
    if (candidates.length === 0) {
      wrap.style.display = 'none';
      return;
    }
    // Find earliest next broadcast
    const now = new Date();
    const dayMap = { sundays: 0, mondays: 1, tuesdays: 2, wednesdays: 3, thursdays: 4, fridays: 5, saturdays: 6 };
    let best = null;
    for (const c of candidates) {
      const targetDay = dayMap[c.day];
      const [hh, mm] = c.time.split(':').map(Number);
      let daysAhead = (targetDay - now.getDay() + 7) % 7;
      const target = new Date(now);
      target.setDate(now.getDate() + daysAhead);
      target.setHours(hh, mm, 0, 0);
      if (target.getTime() < now.getTime()) {
        target.setDate(target.getDate() + 7);
      }
      if (!best || target.getTime() < best.target.getTime()) {
        best = { ...c, target };
      }
    }
    if (!best) { wrap.style.display = 'none'; return; }

    wrap.style.display = 'flex';
    wrap.innerHTML = '';
    wrap.appendChild(lazyImage(best.anime.images?.jpg?.small_image_url || best.anime.images?.jpg?.image_url, best.anime.title, 'poster'));
    const info = h('div', { class: 'info' });
    info.appendChild(h('div', { class: 'label' }, 'Next Episode'));
    info.appendChild(h('a', { class: 'title', href: `anime.html?id=${best.anime.mal_id}` }, best.anime.title));
    info.appendChild(h('div', { class: 'sub' }, `Airs ${best.day} at ${best.time}`));
    wrap.appendChild(info);
    const timer = CountdownTimer(best.target.getTime());
    wrap.appendChild(timer.element);
  }
};

NT.schedulePage = SchedulePage;
