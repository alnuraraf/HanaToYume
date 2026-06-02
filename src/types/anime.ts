export interface AnimeImage {
  jpg: {
    image_url: string;
    small_image_url?: string;
    large_image_url?: string;
  };
  webp?: {
    image_url: string;
    small_image_url?: string;
    large_image_url?: string;
  };
}

export interface AnimeTrailer {
  youtube_id: string | null;
  url: string | null;
}

export interface AnimeGenre {
  mal_id: number;
  name: string;
}

export interface AnimeData {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  images: AnimeImage;
  trailer?: AnimeTrailer;
  synopsis: string | null;
  type: string | null;
  episodes: number | null;
  status: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  season: string | null;
  year: number | null;
  studios: AnimeGenre[];
  genres: AnimeGenre[];
  themes: AnimeGenre[];
  demographics: AnimeGenre[];
  duration: string | null;
  rating: string | null;
  source: string | null;
  aired?: {
    string: string;
  };
}

export interface AnimeEpisode {
  mal_id: number;
  title: string | null;
  title_japanese: string | null;
  aired: string | null;
  filler: boolean;
  recap: boolean;
}

export interface JikanResponse<T> {
  data: T;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
  };
}

export interface WatchHistoryItem {
  animeId: number;
  episode: number;
  timestamp: number;
  title: string;
  image: string;
  progress?: number;
}

export interface UserProfile {
  username: string;
  avatar: string;
  joinDate: string;
}
