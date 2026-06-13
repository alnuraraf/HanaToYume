/* ===== NamiTube — AniList GraphQL API Client ===== */

const ANILIST_URL = 'https://graphql.anilist.co';
const apiCache = new Map();

async function aniQuery(query, variables = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(ANILIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ query, variables })
      });
      if (res.status === 429) {
        await new Promise(r => setTimeout(r, (i + 1) * 1500));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0].message);
      return json.data;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, (i + 1) * 1000));
    }
  }
}

async function cachedQuery(key, queryFn, ttl = 10 * 60 * 1000) {
  const c = apiCache.get(key);
  if (c && Date.now() < c.expires) return c.data;
  const data = await queryFn();
  apiCache.set(key, { data, expires: Date.now() + ttl });
  return data;
}

/* ---------- Shared Query Fragments ---------- */
const MEDIA_FIELDS = `
  id
  title { romaji english native }
  description(asHtml: false)
  coverImage { large extraLarge color }
  bannerImage
  genres
  averageScore
  episodes
  status
  season
  seasonYear
  format
  duration
  source
  countryOfOrigin
  studios(isMain: true) { nodes { name } }
  trailer { id site }
  nextAiringEpisode { episode airingAt timeUntilAiring }
`;

const MEDIA_DETAIL_FIELDS = `
  ${MEDIA_FIELDS}
  tags { name rank }
  characters(perPage: 12, sort: [ROLE, FAVOURITES_DESC]) {
    edges {
      role
      node { name { full } image { large } }
      voiceActors(language: JAPANESE) { name { full } image { large } }
    }
  }
  relations {
    edges {
      relationType
      node {
        id
        title { romaji english }
        coverImage { large }
        format
        status
        averageScore
        type
      }
    }
  }
  recommendations(perPage: 8, sort: RATING_DESC) {
    nodes {
      mediaRecommendation {
        id
        title { romaji english }
        coverImage { large extraLarge }
        averageScore
        format
        episodes
        genres
      }
    }
  }
  streamingEpisodes { title thumbnail url site }
  externalLinks { url site icon color }
`;

/* ---------- Current Season Helper ---------- */
function getCurrentSeason() {
  const month = new Date().getMonth();
  const seasons = ['WINTER','SPRING','SUMMER','FALL'];
  return seasons[Math.floor(month / 3)];
}
function getCurrentYear() { return new Date().getFullYear(); }

/* ---------- API Functions ---------- */

async function fetchTrending(page = 1, perPage = 20) {
  return cachedQuery(`trending_${page}_${perPage}`, () => aniQuery(`
    query($page:Int,$perPage:Int){
      Page(page:$page,perPage:$perPage){
        pageInfo{hasNextPage currentPage lastPage total}
        media(sort:TRENDING_DESC,type:ANIME,isAdult:false){${MEDIA_FIELDS}}
      }
    }
  `, { page, perPage }));
}

async function fetchPopular(page = 1, perPage = 20) {
  return cachedQuery(`popular_${page}_${perPage}`, () => aniQuery(`
    query($page:Int,$perPage:Int){
      Page(page:$page,perPage:$perPage){
        pageInfo{hasNextPage currentPage lastPage total}
        media(sort:POPULARITY_DESC,type:ANIME,isAdult:false){${MEDIA_FIELDS}}
      }
    }
  `, { page, perPage }));
}

async function fetchTopRated(page = 1, perPage = 20) {
  return cachedQuery(`toprated_${page}_${perPage}`, () => aniQuery(`
    query($page:Int,$perPage:Int){
      Page(page:$page,perPage:$perPage){
        pageInfo{hasNextPage currentPage lastPage total}
        media(sort:SCORE_DESC,type:ANIME,isAdult:false){${MEDIA_FIELDS}}
      }
    }
  `, { page, perPage }));
}

async function fetchSeasonal(page = 1, perPage = 20) {
  const season = getCurrentSeason();
  const year = getCurrentYear();
  return cachedQuery(`seasonal_${season}_${year}_${page}`, () => aniQuery(`
    query($page:Int,$perPage:Int,$season:MediaSeason,$year:Int){
      Page(page:$page,perPage:$perPage){
        pageInfo{hasNextPage currentPage lastPage total}
        media(season:$season,seasonYear:$year,sort:POPULARITY_DESC,type:ANIME,isAdult:false){${MEDIA_FIELDS}}
      }
    }
  `, { page, perPage, season, year }));
}

async function fetchCurrentlyAiring(page = 1, perPage = 20) {
  return cachedQuery(`airing_${page}_${perPage}`, () => aniQuery(`
    query($page:Int,$perPage:Int){
      Page(page:$page,perPage:$perPage){
        pageInfo{hasNextPage currentPage lastPage total}
        media(status:RELEASING,sort:POPULARITY_DESC,type:ANIME,isAdult:false){${MEDIA_FIELDS}}
      }
    }
  `, { page, perPage }));
}

async function fetchMovies(page = 1, perPage = 20) {
  return cachedQuery(`movies_${page}_${perPage}`, () => aniQuery(`
    query($page:Int,$perPage:Int){
      Page(page:$page,perPage:$perPage){
        pageInfo{hasNextPage currentPage lastPage total}
        media(format:MOVIE,sort:POPULARITY_DESC,type:ANIME,isAdult:false){${MEDIA_FIELDS}}
      }
    }
  `, { page, perPage }));
}

async function fetchTVShows(page = 1, perPage = 20) {
  return cachedQuery(`tv_${page}_${perPage}`, () => aniQuery(`
    query($page:Int,$perPage:Int){
      Page(page:$page,perPage:$perPage){
        pageInfo{hasNextPage currentPage lastPage total}
        media(format:TV,sort:POPULARITY_DESC,type:ANIME,isAdult:false){${MEDIA_FIELDS}}
      }
    }
  `, { page, perPage }));
}

async function fetchOVA(page = 1, perPage = 20) {
  return cachedQuery(`ova_${page}_${perPage}`, () => aniQuery(`
    query($page:Int,$perPage:Int){
      Page(page:$page,perPage:$perPage){
        pageInfo{hasNextPage currentPage lastPage total}
        media(format_in:[OVA,ONA,SPECIAL],sort:POPULARITY_DESC,type:ANIME,isAdult:false){${MEDIA_FIELDS}}
      }
    }
  `, { page, perPage }));
}

async function fetchUpcoming(page = 1, perPage = 20) {
  return cachedQuery(`upcoming_${page}_${perPage}`, () => aniQuery(`
    query($page:Int,$perPage:Int){
      Page(page:$page,perPage:$perPage){
        pageInfo{hasNextPage currentPage lastPage total}
        media(status:NOT_YET_RELEASED,sort:POPULARITY_DESC,type:ANIME,isAdult:false){${MEDIA_FIELDS}}
      }
    }
  `, { page, perPage }));
}

async function fetchAnimeDetail(id) {
  return cachedQuery(`detail_${id}`, () => aniQuery(`
    query($id:Int){
      Media(id:$id,type:ANIME){${MEDIA_DETAIL_FIELDS}}
    }
  `, { id: parseInt(id) }));
}

async function fetchSearch(search, page = 1, perPage = 20, filters = {}) {
  const vars = { page, perPage, search: search || undefined };
  let filterStr = '';
  if (filters.format) { vars.format = filters.format; filterStr += ',format:$format'; }
  if (filters.status) { vars.status = filters.status; filterStr += ',status:$status'; }
  if (filters.genre) { vars.genre = filters.genre; filterStr += ',genre:$genre'; }
  if (filters.sort) { vars.sort = filters.sort; } else { vars.sort = 'SEARCH_MATCH'; }
  if (filters.season) { vars.season = filters.season; filterStr += ',season:$season'; }
  if (filters.seasonYear) { vars.seasonYear = parseInt(filters.seasonYear); filterStr += ',seasonYear:$seasonYear'; }

  const typeDefs = `$page:Int,$perPage:Int,$search:String,$sort:MediaSort${
    filters.format ? ',$format:MediaFormat' : ''}${
    filters.status ? ',$status:MediaStatus' : ''}${
    filters.genre ? ',$genre:String' : ''}${
    filters.season ? ',$season:MediaSeason' : ''}${
    filters.seasonYear ? ',$seasonYear:Int' : ''}`;

  return aniQuery(`
    query(${typeDefs}){
      Page(page:$page,perPage:$perPage){
        pageInfo{hasNextPage currentPage lastPage total}
        media(search:$search,sort:[$sort],type:ANIME,isAdult:false${filterStr}){${MEDIA_FIELDS}}
      }
    }
  `, vars);
}

async function fetchGenreCollection() {
  return cachedQuery('genres', () => aniQuery(`{ GenreCollection }`));
}

async function fetchByGenre(genre, page = 1, perPage = 20, sort = 'POPULARITY_DESC') {
  return cachedQuery(`genre_${genre}_${sort}_${page}`, () => aniQuery(`
    query($page:Int,$perPage:Int,$genre:String,$sort:[MediaSort]){
      Page(page:$page,perPage:$perPage){
        pageInfo{hasNextPage currentPage lastPage total}
        media(genre:$genre,sort:$sort,type:ANIME,isAdult:false){${MEDIA_FIELDS}}
      }
    }
  `, { page, perPage, genre, sort: [sort] }));
}

async function fetchAiringSchedule(startTs, endTs, page = 1) {
  return cachedQuery(`schedule_${startTs}_${endTs}_${page}`, () => aniQuery(`
    query($page:Int,$start:Int,$end:Int){
      Page(page:$page,perPage:50){
        pageInfo{hasNextPage}
        airingSchedules(airingAt_greater:$start,airingAt_lesser:$end,sort:TIME){
          episode
          airingAt
          timeUntilAiring
          media{${MEDIA_FIELDS}}
        }
      }
    }
  `, { page, start: startTs, end: endTs }));
}

async function fetchRandomAnime() {
  const randomPage = Math.floor(Math.random() * 50) + 1;
  const data = await aniQuery(`
    query($page:Int){
      Page(page:$page,perPage:20){
        media(sort:POPULARITY_DESC,type:ANIME,isAdult:false){id}
      }
    }
  `, { page: randomPage });
  const media = data.Page.media;
  if (media.length === 0) return null;
  return media[Math.floor(Math.random() * media.length)].id;
}

/* ---------- SERVERS ---------- */
const SERVERS = {
  MegaCloud: {
    sub: (id, ep) => `https://megaplay.buzz/stream/ani/${id}/${ep}/sub`,
    dub: (id, ep) => `https://megaplay.buzz/stream/ani/${id}/${ep}/dub`,
  },
  VidNest: {
    sub: (id, ep) => `https://vidnest.fun/anime/${id}/${ep}/sub`,
    dub: (id, ep) => `https://vidnest.fun/anime/${id}/${ep}/dub`,
  },
  AnimePahe: {
    sub: (id, ep) => `https://vidnest.fun/animepahe/${id}/${ep}/sub`,
    dub: (id, ep) => `https://vidnest.fun/animepahe/${id}/${ep}/dub`,
  },
};
