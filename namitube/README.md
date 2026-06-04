# NamiTube — Premium Anime Streaming

A complete, multi-page anime streaming website built with **vanilla HTML, CSS, and JavaScript only** — no frameworks, no build step. Deploy anywhere static (GitHub Pages, Cloudflare Pages, Netlify, etc.) with zero configuration.

> Inspired by HiAnime, AnimeKai, Enma.lol, and Anikoto.to. Uses MyAnimeList (Jikan) and AniList public APIs for all data.

---

## ✨ Features

- **9 standalone pages** — splash landing, home hub, anime detail, watch/player, weekly schedule, personal library, profile, donate, and full search.
- **Dual API data layer** — Jikan REST v4 + AniList GraphQL, cross-referenced for the richest possible metadata (banners, trailers, next-airing countdowns, characters, staff, reviews).
- **In-memory 5‑minute cache** with exponential backoff retries (3 attempts) on every API call.
- **Embedded streaming** — primary `megaplay.buzz` provider with `vidnest.fun` as one‑click backup; sub/dub toggle; preference saved to `localStorage`.
- **Persistent profile system** in `localStorage` — watchlist, favourites, history, ratings, reminders, recent searches, custom avatar (base64, resized to 200×200), display name, theme accent colour, autoplay preferences.
- **Full keyboard navigation**, skip-to-content link, ARIA roles, focus-visible rings, `prefers-reduced-motion` support, WCAG AA contrast.
- **Lazy-loaded images**, skeleton shimmer loaders, stagger card reveals, smooth animations, custom thin scrollbar, debounced search (300ms), throttled scroll handlers.
- **Responsive across mobile, tablet, desktop** with slide-in mobile menu and overlay search.

---

## 📁 Structure

```
namitube/
├── index.html          Splash landing page
├── home.html           Main hub (spotlight, trending, seasonal, genres)
├── anime.html          Anime detail (?id=MAL_ID)
├── watch.html          Player (?id=MAL_ID&ep=N&lang=sub)
├── schedule.html       Weekly schedule with reminders
├── library.html        Watchlist / Favourites / History
├── profile.html        Profile + preferences + stats
├── search.html         Full search with filters + infinite scroll
├── donate.html         Support / tiers / supporters wall / FAQ
├── css/
│   ├── reset.css       Modern CSS reset
│   ├── variables.css   Design tokens
│   ├── animations.css  Keyframes + reduced-motion
│   ├── global.css      Header, footer, cards, modals, toasts
│   └── [page].css      Per-page styles
└── js/
    ├── utils.js        Helpers, skeletons, debounce, observers
    ├── api.js          Jikan + AniList with cache & retry
    ├── storage.js      Profile schema + CRUD
    ├── components.js   Header, footer, AnimeCard, Modal, Toast, etc.
    ├── player.js       Iframe player + server/lang switching
    ├── search.js       Search page logic
    ├── schedule.js     Schedule page logic
    ├── library.js      Library tabs logic
    └── profile.js      Profile management
```

---

## 🚀 Deploy

### GitHub Pages
1. Push the `namitube/` folder contents to the root of a GitHub repo (or to `docs/`).
2. Settings → Pages → Source = `main` branch → root (or `docs/`).
3. Visit `https://<user>.github.io/<repo>/`.

### Cloudflare Pages
1. Connect your repo on the Cloudflare Pages dashboard.
2. Build command: *(leave empty)*
3. Build output directory: `/` (or wherever the HTML files live).
4. Deploy.

### Local preview
```bash
cd namitube
python3 -m http.server 8000
# open http://localhost:8000
```

---

## 🎨 Theming

Edit `css/variables.css` to change any colour, radius, or shadow token. Users can also pick from 5 accent colour presets on the Profile page — the choice is persisted in `localStorage` and applied on every page load.

---

## 🔌 Streaming providers

- **Primary:** `https://megaplay.buzz/stream/mal/{mal_id}/{episode}/{sub|dub}`
- **Backup:** `https://vidnest.fun/anime/{anilist_id}/{episode}/{sub|dub}`

Switch via the **Server** buttons under the player. Preference is saved as `namitube_server` in localStorage.

---

## 📦 LocalStorage schema

Stored under the key `namitube_profile`:

```js
{
  displayName: "AnimeUser",
  avatarBase64: null,
  joinDate: "2025-01-01T00:00:00.000Z",
  preferences: { defaultLang, autoplay, matureWarning, accentColor },
  watchHistory: [{ malId, title, posterUrl, episode, totalEpisodes, timestamp }],
  watchlist:    [{ malId, title, posterUrl, score, status, addedAt }],
  favorites:    [{ malId, title, posterUrl, score }],
  userRatings:  { [malId]: 1–10 },
  reminders:    [{ malId, title, dayOfWeek, broadcastTime }],
  recentSearches: [string]
}
```

---

## ⚖️ Disclaimer

NamiTube does not store any video files. All content is loaded from independent third-party providers. Not affiliated with MyAnimeList or AniList. Provided for educational/demo purposes.

© 2025 NamiTube.
