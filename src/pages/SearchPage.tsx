import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import { SearchIcon, FilterIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/Icons';
import { useDebounce } from '../hooks/useAnime';
import * as api from '../lib/api';
import type { AnimeData } from '../types/anime';

const GENRES = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' },
  { id: 10, name: 'Fantasy' },
  { id: 14, name: 'Horror' },
  { id: 22, name: 'Romance' },
  { id: 24, name: 'Sci-Fi' },
  { id: 36, name: 'Slice of Life' },
  { id: 30, name: 'Sports' },
  { id: 37, name: 'Supernatural' },
  { id: 7, name: 'Mystery' },
  { id: 25, name: 'Shoujo' },
  { id: 27, name: 'Shounen' },
];

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  const doSearch = useCallback(async (q: string, p: number, genre: number | null) => {
    setLoading(true);
    try {
      let res;
      if (genre && !q) {
        res = await api.getAnimeByGenre(genre, p);
      } else if (q.trim()) {
        res = await api.searchAnime(q, p);
      } else {
        res = await api.getTopAnime(p);
      }
      setResults(res.data || []);
      setTotalPages(res.pagination?.last_visible_page || 1);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (debouncedQuery !== queryParam) {
      setSearchParams(debouncedQuery ? { q: debouncedQuery } : {});
    }
    setPage(1);
    doSearch(debouncedQuery, 1, selectedGenre);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, selectedGenre]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    doSearch(debouncedQuery, newPage, selectedGenre);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenreClick = (genreId: number) => {
    setSelectedGenre(selectedGenre === genreId ? null : genreId);
  };

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Browse Anime</h1>

          {/* Search Input */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-2xl">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for anime..."
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/8 transition-all text-base"
              />
              <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-4 rounded-2xl border transition-all ${
                showFilters || selectedGenre
                  ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <FilterIcon size={18} />
              <span className="hidden sm:inline text-sm">Filters</span>
            </button>
          </div>

          {/* Genre Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white/3 rounded-2xl border border-white/5 animate-fade-in">
              <p className="text-sm text-gray-400 mb-3">Genres</p>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreClick(genre.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedGenre === genre.id
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] skeleton rounded-xl mb-3" />
                <div className="h-4 skeleton rounded w-3/4 mb-2" />
                <div className="h-3 skeleton rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((anime, idx) => (
                <AnimeCard key={anime.mal_id} anime={anime} index={idx} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white/5 text-sm text-gray-400 hover:bg-white/10 disabled:opacity-30 transition-all"
                >
                  <ChevronLeftIcon size={16} />
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                          pageNum === page
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white/5 text-sm text-gray-400 hover:bg-white/10 disabled:opacity-30 transition-all"
                >
                  Next
                  <ChevronRightIcon size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <SearchIcon size={32} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {query ? 'No results found' : 'Start searching'}
            </h3>
            <p className="text-gray-600">
              {query ? `We couldn't find any anime matching "${query}"` : 'Type in the search box to discover anime'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
