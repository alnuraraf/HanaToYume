import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ─── Types ─── */
export interface AnimeBasic {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: { image_url: string; large_image_url?: string };
    webp?: { image_url: string; large_image_url?: string };
  };
  score?: number;
  episodes?: number;
  synopsis?: string;
  genres?: { mal_id: number; name: string }[];
  type?: string;
  status?: string;
  rating?: string;
  year?: number;
  season?: string;
  aired?: { string?: string };
  studios?: { name: string }[];
  trailer?: { youtube_id?: string; url?: string };
}

export interface WatchProgress {
  mal_id: number;
  title: string;
  image: string;
  currentEpisode: number;
  totalEpisodes: number;
  language: 'sub' | 'dub';
  lastWatched: number;
  progress: number; // 0-100
}

export interface UserProfile {
  name: string;
  avatar: string;
}

interface AppState {
  // Navigation
  currentPage: 'home' | 'search' | 'anime' | 'watch' | 'watchlist' | 'profile' | 'support';
  currentAnimeId: number | null;
  currentEpisode: number;
  currentLanguage: 'sub' | 'dub';
  previousPage: string | null;

  // User
  profile: UserProfile;
  watchHistory: WatchProgress[];
  watchlist: number[];
  favorites: number[];

  // UI
  searchQuery: string;
  isSearchOpen: boolean;
  isTheaterMode: boolean;
  isMobileMenuOpen: boolean;

  // Actions
  navigate: (page: AppState['currentPage'], animeId?: number | null) => void;
  setEpisode: (ep: number) => void;
  setLanguage: (lang: 'sub' | 'dub') => void;
  setSearchQuery: (q: string) => void;
  setSearchOpen: (open: boolean) => void;
  setTheaterMode: (mode: boolean) => void;
  setMobileMenu: (open: boolean) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addToWatchHistory: (progress: WatchProgress) => void;
  toggleWatchlist: (id: number) => void;
  toggleFavorite: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  isFavorite: (id: number) => boolean;
  getWatchProgress: (mal_id: number) => WatchProgress | undefined;
  clearHistory: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentPage: 'home',
      currentAnimeId: null,
      currentEpisode: 1,
      currentLanguage: 'sub',
      previousPage: null,

      // User
      profile: {
        name: 'Otaku',
        avatar: '',
      },
      watchHistory: [],
      watchlist: [],
      favorites: [],

      // UI
      searchQuery: '',
      isSearchOpen: false,
      isTheaterMode: false,
      isMobileMenuOpen: false,

      // Actions
      navigate: (page, animeId = null) => {
        const prev = get().currentPage;
        set({
          currentPage: page,
          currentAnimeId: animeId ?? get().currentAnimeId,
          previousPage: prev,
          isSearchOpen: false,
          isMobileMenuOpen: false,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      setEpisode: (ep) => set({ currentEpisode: ep }),
      setLanguage: (lang) => set({ currentLanguage: lang }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      setTheaterMode: (mode) => set({ isTheaterMode: mode }),
      setMobileMenu: (open) => set({ isMobileMenuOpen: open }),

      updateProfile: (profile) =>
        set((s) => ({ profile: { ...s.profile, ...profile } })),

      addToWatchHistory: (progress) =>
        set((s) => {
          const filtered = s.watchHistory.filter(
            (w) => w.mal_id !== progress.mal_id
          );
          return {
            watchHistory: [progress, ...filtered].slice(0, 50),
          };
        }),

      toggleWatchlist: (id) =>
        set((s) => ({
          watchlist: s.watchlist.includes(id)
            ? s.watchlist.filter((w) => w !== id)
            : [...s.watchlist, id],
        })),

      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),

      isInWatchlist: (id) => get().watchlist.includes(id),
      isFavorite: (id) => get().favorites.includes(id),

      getWatchProgress: (mal_id) =>
        get().watchHistory.find((w) => w.mal_id === mal_id),

      clearHistory: () => set({ watchHistory: [] }),
    }),
    {
      name: 'namitube-storage',
      partialize: (state) => ({
        profile: state.profile,
        watchHistory: state.watchHistory,
        watchlist: state.watchlist,
        favorites: state.favorites,
        currentLanguage: state.currentLanguage,
      }),
    }
  )
);
