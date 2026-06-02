import React, { useRef, useState } from 'react';
import type { AnimeData } from '../types/anime';
import AnimeCard from './AnimeCard';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface Props {
  title: string;
  icon?: React.ReactNode;
  animeList: AnimeData[];
  loading?: boolean;
}

const AnimeRow: React.FC<Props> = ({ title, icon, animeList, loading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  if (loading) {
    return (
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5 px-4 sm:px-6 lg:px-8">
          <div className="h-6 w-40 skeleton rounded" />
        </div>
        <div className="flex gap-4 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="shrink-0 w-[160px] sm:w-[180px]">
              <div className="aspect-[3/4] skeleton rounded-xl mb-3" />
              <div className="h-4 skeleton rounded w-3/4 mb-2" />
              <div className="h-3 skeleton rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!animeList.length) return null;

  return (
    <section className="mb-10 relative group/row">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        {icon && <span className="text-indigo-400">{icon}</span>}
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-4" />
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white hover:bg-indigo-500 transition-all opacity-0 group-hover/row:opacity-100"
          >
            <ChevronLeftIcon size={20} />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white hover:bg-indigo-500 transition-all opacity-0 group-hover/row:opacity-100"
          >
            <ChevronRightIcon size={20} />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 pb-2 max-w-[1440px] mx-auto"
        >
          {animeList.map((anime, idx) => (
            <div key={anime.mal_id} className="shrink-0 w-[155px] sm:w-[175px] lg:w-[190px]">
              <AnimeCard anime={anime} index={idx} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimeRow;
