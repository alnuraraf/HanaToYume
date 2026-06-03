const JikanAPI = {
  base: 'https://api.jikan.moe/v4',
  queue: [],
  processing: false,
  cache: new Map(),
  cacheTTL: 3600000,

  async request(endpoint) {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.time < this.cacheTTL) {
      return cached.data;
    }
    return new Promise((resolve, reject) => {
      this.queue.push({ endpoint, resolve, reject });
      this.processQueue();
    });
  },

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;
    const { endpoint, resolve, reject } = this.queue.shift();
    try {
      await new Promise(r => setTimeout(r, 350));
      const response = await fetch(`${this.base}${endpoint}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.cache.set(endpoint, { data, time: Date.now() });
      resolve(data);
    } catch (error) {
      reject(error);
    } finally {
      this.processing = false;
      if (this.queue.length > 0) {
        setTimeout(() => this.processQueue(), 350);
      }
    }
  },

  getAnime(id) {
    return this.request(`/anime/${id}`);
  },

  getAnimeEpisodes(id, page = 1) {
    return this.request(`/anime/${id}/episodes?page=${page}`);
  },

  getTopAnime(filter = '', page = 1, limit = 25) {
    const filterParam = filter ? `?filter=${filter}&` : '?';
    return this.request(`/top/anime${filterParam}page=${page}&limit=${limit}`);
  },

  getSeasonNow(page = 1, limit = 25) {
    return this.request(`/seasons/now?page=${page}&limit=${limit}`);
  },

  getSeasonUpcoming(page = 1, limit = 25) {
    return this.request(`/seasons/upcoming?page=${page}&limit=${limit}`);
  },

  getSchedule(day = '') {
    const dayParam = day ? `/${day}` : '';
    return this.request(`/schedules${dayParam}`);
  },

  searchAnime(query, page = 1, limit = 25) {
    return this.request(`/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  },

  getRecommendations(id) {
    return this.request(`/anime/${id}/recommendations`);
  },

  getAnimeByGenre(genreId, page = 1) {
    return this.request(`/anime?genres=${genreId}&page=${page}`);
  }
};

const AniListAPI = {
  endpoint: 'https://graphql.anilist.co',

  async query(query, variables = {}) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query, variables })
    });
    if (!response.ok) throw new Error(`AniList HTTP ${response.status}`);
    const data = await response.json();
    return data.data;
  },

  async getAnime(id) {
    const query = `
      query($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          idMal
          title { english romaji native }
          description
          coverImage { large medium }
          bannerImage
          episodes
          duration
          status
          season
          seasonYear
          format
          source
          averageScore
          popularity
          favourites
          genres
          studios { nodes { name } }
          trailer { id site }
          startDate { year month day }
          endDate { year month day }
          relations { edges { relationType node { id idMal title { english } coverImage { medium } } } }
          recommendations { nodes { mediaRecommendation { id idMal title { english } coverImage { medium } } } }
        }
      }
    `;
    return this.query(query, { id });
  },

  async searchAnime(query, page = 1, perPage = 25) {
    const q = `
      query($search: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(search: $search, type: ANIME) {
            id
            idMal
            title { english romaji }
            coverImage { medium }
            episodes
            score: averageScore
            format
          }
        }
      }
    `;
    const data = await this.query(q, { search: query, page, perPage });
    return { data: data.Page.media.map(m => ({
      mal_id: m.idMal || m.id,
      title: m.title.english || m.title.romaji,
      title_english: m.title.english,
      images: { jpg: { image_url: m.coverImage.medium } },
      episodes: m.episodes,
      score: m.score ? m.score / 10 : null,
      type: m.format
    }))};
  },

  async getAiringSchedule(page = 1, perPage = 50) {
    const query = `
      query($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          airingSchedules(notYetAired: false, sort: TIME) {
            id
            episode
            airingAt
            media { id idMal title { english romaji } coverImage { medium } }
          }
        }
      }
    `;
    return this.query(query, { page, perPage });
  }
};
