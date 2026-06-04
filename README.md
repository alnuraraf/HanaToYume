# NamiTube

> A premium, multi-page anime streaming website built with vanilla HTML, CSS, and JavaScript. No frameworks, no build step, no server. Drop the folder on GitHub Pages or Cloudflare Pages and it just works.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Landing splash — fullscreen hero with crossfading backgrounds, info cards, trending row |
| `home.html` | Main hub — spotlight carousel, trending, today's schedule, this season, genres, top rated, upcoming |
| `anime.html` | Detail page — synopsis, characters, staff, recommendations, reviews, episode list with pagination |
| `watch.html` | Streaming page — 16:9 player, sub/dub toggle, server switch, episode nav, related |
| `schedule.html` | Weekly schedule — Mon–Sun tabs, current day highlight, "next up" countdown |
| `library.html` | Personal library — watchlist, favourites, history tabs |
| `profile.html` | User profile — avatar upload, name editing, preferences, accent color, stats, danger zone |
| `donate.html` | Support page — tier cards, perks, supporters wall, FAQ |
| `search.html` | Search — debounced input, filters sidebar, infinite scroll, recent searches |

## Tech

- **HTML5** with semantic landmarks and ARIA
- **CSS3** with custom properties (no preprocessor), 11 stylesheet files
- **Vanilla JS (ES2017+)** — 8 modules, no bundler
- **Jikan REST API v4** (MyAnimeList) for all data — with 5-min in-memory cache and exponential backoff retry
- **LocalStorage** for all user data (no backend required)

## File structure

```
namitube/
├── index.html
├── home.html
├── anime.html
├── watch.html
├── schedule.html
├── library.html
├── profile.html
├── donate.html
├── search.html
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── global.css       (header, footer, typography, utilities)
│   ├── home.css
│   ├── anime.css
│   ├── watch.css
│   ├── schedule.css
│   ├── library.css
│   ├── profile.css
│   ├── donate.css
│   ├── search.css
│   ├── index.css
│   └── animations.css
└── js/
    ├── utils.js         (formatters, debounce, skeleton, lazy images)
    ├── api.js           (Jikan client + cache + retry)
    ├── storage.js       (localStorage abstraction)
    ├── components.js    (AnimeCard, HeroSpotlight, Toast, Modal, etc.)
    ├── player.js        (megaplay + vidnest provider URLs)
    ├── search.js        (search page logic)
    ├── schedule.js      (schedule page logic)
    └── library.js       (library page logic)
```

## Streaming providers

- **Primary**: `https://megaplay.buzz/stream/mal/{mal-id}/{episode}/{sub|dub}`
- **Backup**: `https://vidnest.fun/anime/{anilist-id}/{episode}/{sub|dub}` (with curated MAL → AniList mapping in `js/player.js`)
- Server preference is stored in `localStorage` under `namitube_server_pref`

## Deploy

### GitHub Pages
1. Push this folder to a GitHub repo
2. Settings → Pages → Branch: `main`, Folder: `/` (or `/docs` if you move it)
3. Visit `https://<user>.github.io/<repo>/`

### Cloudflare Pages
1. Push to GitHub
2. New Project → Pages → Connect to Git
3. Build command: _none_  •  Build directory: `/`
4. Deploy

### Local preview
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

> ⚠️ The Jikan API does not need a key but rate-limits aggressively. The 5-minute in-memory cache means rapid page navigation won't re-hit the API.

## Features

- **Spotlight carousel** with crossfade + Ken Burns
- **Genre quick-filter tabs** that re-fetch with the genre ID
- **Stagger-load animations** on every grid
- **Skeleton shimmer loaders** during async fetches
- **IntersectionObserver-based** reveal-on-scroll + lazy image loading
- **Toast notifications** for every action
- **Modal dialogs** with focus trap
- **Mobile responsive** down to 360px
- **Accessibility**: skip link, focus-visible rings, ARIA roles, prefers-reduced-motion
- **Custom theme accent** stored in localStorage and applied as a CSS variable

## Disclaimer

This site does not store any files on its server. All contents are provided by non-affiliated third parties. © 2025 NamiTube. Not affiliated with MyAnimeList or AniList.
