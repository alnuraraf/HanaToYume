import React, { useState, useEffect } from 'react';
import HeroSlider from '../components/HeroSlider';
import AnimeRow from '../components/AnimeRow';
import ContinueWatchingRow from '../components/ContinueWatchingRow';
import { TrendingIcon, StarIcon, CalendarIcon } from '../components/Icons';
import * as api from '../lib/api';
import type { AnimeData } from '../types/anime';

const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<AnimeData[]>([]);
  const [topAnime, setTopAnime] = useState<AnimeData[]>([]);
  const [seasonal, setSeasonal] = useState<AnimeData[]>([]);
  const [upcoming, setUpcoming] = useState<AnimeData[]>([]);
  const [topMovies, setTopMovies] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState({
    trending: true,
    top: true,
    seasonal: true,
    upcoming: true,
    movies: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch trending
    api.getTrendingAnime().then(res => {
      setTrending(res.data || []);
      setLoading(l => ({ ...l, trending: false }));
    }).catch(() => setLoading(l => ({ ...l, trending: false })));

    // Fetch top anime with delay
    setTimeout(() => {
      api.getTopAnime(1).then(res => {
        setTopAnime(res.data || []);
        setLoading(l => ({ ...l, top: false }));
      }).catch(() => setLoading(l => ({ ...l, top: false })));
    }, 400);

    // Fetch seasonal with delay
    setTimeout(() => {
      api.getSeasonalAnime().then(res => {
        setSeasonal(res.data || []);
        setLoading(l => ({ ...l, seasonal: false }));
      }).catch(() => setLoading(l => ({ ...l, seasonal: false })));
    }, 800);

    // Fetch upcoming with delay
    setTimeout(() => {
      api.getUpcomingAnime().then(res => {
        setUpcoming(res.data || []);
        setLoading(l => ({ ...l, upcoming: false }));
      }).catch(() => setLoading(l => ({ ...l, upcoming: false })));
    }, 1200);

    // Fetch top movies
    setTimeout(() => {
      api.getTopAnime(1, 'bypopularity').then(res => {
        setTopMovies(res.data || []);
        setLoading(l => ({ ...l, movies: false }));
      }).catch(() => setLoading(l => ({ ...l, movies: false })));
    }, 1600);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider animeList={trending} loading={loading.trending} />

      {/* Content Sections */}
      <div className="mt-8 space-y-2">
        {/* Continue Watching */}
        <ContinueWatchingRow />

        {/* Trending Now */}
        <AnimeRow
          title="Trending Now"
          icon={<TrendingIcon size={22} />}
          animeList={trending}
          loading={loading.trending}
        />

        {/* Top Anime */}
        <AnimeRow
          title="Top Rated"
          icon={<StarIcon size={22} className="text-yellow-400" />}
          animeList={topAnime}
          loading={loading.top}
        />

        {/* This Season */}
        <AnimeRow
          title="This Season"
          icon={<CalendarIcon size={22} />}
          animeList={seasonal}
          loading={loading.seasonal}
        />

        {/* Most Popular */}
        <AnimeRow
          title="Most Popular"
          icon={<TrendingIcon size={22} />}
          animeList={topMovies}
          loading={loading.movies}
        />

        {/* Upcoming */}
        <AnimeRow
          title="Upcoming"
          icon={<CalendarIcon size={22} />}
          animeList={upcoming}
          loading={loading.upcoming}
        />
      </div>
    </div>
  );
};

export default HomePage;
