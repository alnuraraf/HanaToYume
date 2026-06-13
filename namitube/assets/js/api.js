/* ============================================
   NamiTube — AniList GraphQL API Client + Cache
   ============================================ */

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
      if (!res.ok) throw new Error(`AniList ${res.status}`);
      return (await res.json()).data;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, (i + 1) * 500));
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

/* --- Media Fragment --- */
const MEDIA_FRAGMENT = `
  fragment mediaFields on Media {
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
    studios(isMain: true) { nodes { name } }
    trailer { id site }
    nextAiringEpisode { episode airingAt timeUntilAiring }
  }
`;

/* --- Current Season Helpers --- */
function getCurrentSeason() {
  const m = new Date().getMonth();
  if (m < 3) return { season: 'WINTER', year: new Date().getFullYear() };
  if (m < 6) return { season: 'SPRING', year: new Date().getFullYear() };
  if (m < 9) return { season: 'SUMMER', year: new Date().getFullYear() };
  return { season: 'FALL', year: new Date().getFullYear() };
}

function getNextSeasonDate() {
  const now = new Date();
  const y = now.getFullYear();
  const quarters = [new Date(y, 0, 1), new Date(y, 3, 1), new Date(y, 6, 1), new Date(y, 9, 1), new Date(y + 1, 0, 1)];
  for (const q of quarters) {
    if (q > now) return q;
  }
  return new Date(y + 1, 0, 1);
}

/* === API Methods === */

async function fetchSeasonalAnime(page = 1, perPage = 6) {
  const { season, year } = getCurrentSeason();
  return cachedQuery(`seasonal_${season}_${year}_${page}_${perPage}`, () => aniQuery(`
    ${MEDIA_FRAGMENT}
    query($season: MediaSeason, $year: Int, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { hasNextPage currentPage }
        media(season: $season, seasonYear: $year, sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
          ...mediaFields
        }
      }
    }
  `, { season, year, page, perPage }));
}

async function fetchTrending(page = 1, perPage = 20) {
  return cachedQuery(`trending_${page}_${perPage}`, () => aniQuery(`
    ${MEDIA_FRAGMENT}
    query($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { hasNextPage currentPage }
        media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
          ...mediaFields
        }
      }
    }
  `, { page, perPage }));
}

async function fetchPopular(page = 1, perPage = 20) {
  return cachedQuery(`popular_${page}_${perPage}`, () => aniQuery(`
    ${MEDIA_FRAGMENT}
    query($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { hasNextPage currentPage }
        media(sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
          ...mediaFields
        }
      }
    }
  `, { page, perPage }));
}

async function fetchTopRated(page = 1, perPage = 20) {
  return cachedQuery(`toprated_${page}_${perPage}`, () => aniQuery(`
    ${MEDIA_FRAGMENT}
    query($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { hasNextPage currentPage }
        media(sort: SCORE_DESC, type: ANIME, isAdult: false) {
          ...mediaFields
        }
      }
    }
  `, { page, perPage }));
}

async function fetchByFormat(format, page = 1, perPage = 20) {
  const isSingle = typeof format === 'string';
  const query = isSingle ? `
    ${MEDIA_FRAGMENT}
    query($format: MediaFormat, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { hasNextPage currentPage }
        media(format: $format, sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
          ...mediaFields
        }
      }
    }
  ` : `
    ${MEDIA_FRAGMENT}
    query($formats: [MediaFormat], $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { hasNextPage currentPage }
        media(format_in: $formats, sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
          ...mediaFields
        }
      }
    }
  `;
  const vars = isSingle
    ? { format, page, perPage }
    : { formats: format, page, perPage };
  const key = isSingle ? `format_${format}_${page}` : `format_${format.join('_')}_${page}`;
  return cachedQuery(key, () => aniQuery(query, vars));
}

async function fetchUpcoming(page = 1, perPage = 20) {
  return cachedQuery(`upcoming_${page}_${perPage}`, () => aniQuery(`
    ${MEDIA_FRAGMENT}
    query($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { hasNextPage currentPage }
        media(status: NOT_YET_RELEASED, sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
          ...mediaFields
        }
      }
    }
  `, { page, perPage }));
}

async function fetchAnimeDetail(id) {
  return cachedQuery(`detail_${id}`, () => aniQuery(`
    query($id: Int) {
      Media(id: $id, type: ANIME) {
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
        characters(perPage: 12, sort: FAVOURITES_DESC) {
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
            }
          }
        }
        recommendations(perPage: 8) {
          nodes {
            mediaRecommendation {
              id
              title { romaji english }
              coverImage { large extraLarge }
              format
              averageScore
              episodes
            }
          }
        }
        tags { name rank }
        externalLinks { url site }
        streamingEpisodes { title thumbnail url site }
      }
    }
  `, { id: parseInt(id) }));
}

async function searchAnime(params = {}) {
  const { search, genres, format, status, sort, page = 1, perPage = 20 } = params;
  let vars = { page, perPage };
  let filters = 'type: ANIME, isAdult: false';
  let varDefs = '$page: Int, $perPage: Int';

  if (search) { vars.search = search; filters += ', search: $search'; varDefs += ', $search: String'; }
  if (genres && genres.length) { vars.genres = genres; filters += ', genre_in: $genres'; varDefs += ', $genres: [String]'; }
  if (format) { vars.format = format; filters += ', format: $format'; varDefs += ', $format: MediaFormat'; }
  if (status) { vars.status = status; filters += ', status: $status'; varDefs += ', $status: MediaStatus'; }
  if (sort) { vars.sort = sort; filters += ', sort: [$sort]'; varDefs += ', $sort: MediaSort'; }
  else { filters += ', sort: [SEARCH_MATCH]'; }

  return cachedQuery(`search_${JSON.stringify(params)}`, () => aniQuery(`
    ${MEDIA_FRAGMENT}
    query(${varDefs}) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { hasNextPage currentPage lastPage total }
        media(${filters}) {
          ...mediaFields
        }
      }
    }
  `, vars));
}

async function fetchAiringSchedule(startTs, endTs, page = 1) {
  return cachedQuery(`schedule_${startTs}_${endTs}_${page}`, () => aniQuery(`
    ${MEDIA_FRAGMENT}
    query($page: Int, $start: Int, $end: Int) {
      Page(page: $page, perPage: 50) {
        pageInfo { hasNextPage }
        airingSchedules(airingAt_greater: $start, airingAt_lesser: $end, sort: TIME) {
          episode
          airingAt
          media { ...mediaFields }
        }
      }
    }
  `, { page, start: startTs, end: endTs }));
}

async function fetchGenreCollection() {
  return cachedQuery('genres', () => aniQuery(`
    query { GenreCollection }
  `));
}

async function fetchByGenre(genre, page = 1, perPage = 20, sort = 'POPULARITY_DESC') {
  return cachedQuery(`genre_${genre}_${page}_${sort}`, () => aniQuery(`
    ${MEDIA_FRAGMENT}
    query($page: Int, $perPage: Int, $genre: String, $sort: [MediaSort]) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { hasNextPage currentPage }
        media(genre: $genre, sort: $sort, type: ANIME, isAdult: false) {
          ...mediaFields
        }
      }
    }
  `, { page, perPage, genre, sort: [sort] }));
}

async function fetchCurrentlyAiring(page = 1, perPage = 20) {
  return cachedQuery(`airing_${page}_${perPage}`, () => aniQuery(`
    ${MEDIA_FRAGMENT}
    query($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { hasNextPage currentPage }
        media(status: RELEASING, sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
          ...mediaFields
        }
      }
    }
  `, { page, perPage }));
}

async function fetchRandomAnime() {
  const randomPage = Math.floor(Math.random() * 50) + 1;
  const data = await aniQuery(`
    query($page: Int) {
      Page(page: $page, perPage: 50) {
        media(sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
          id
        }
      }
    }
  `, { page: randomPage });
  if (data && data.Page && data.Page.media.length) {
    const rIdx = Math.floor(Math.random() * data.Page.media.length);
    return data.Page.media[rIdx].id;
  }
  return 1;
}

async function fetchMovies(page = 1, perPage = 20) {
  return fetchByFormat('MOVIE', page, perPage);
}
