import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimeCard } from './AnimeCard';
import { CardSkeleton } from './ui/Skeleton';
import type { AnimeBasic } from '../store/useStore';

interface AnimeRowProps {
  title: string;
  anime: AnimeBasic[];
  loading?: boolean;
  showRank?: boolean;
}

export const AnimeRow: React.FC<AnimeRowProps> = ({
  title,
  anime,
  loading = false,
  showRank = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!loading && anime.length === 0) return null;

  return (
    <section className="mb-8 md:mb-12">
      <div className="flex items-center justify-between px-4 md:px-12 mb-4">
        <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-4 px-4 md:px-12 overflow-x-auto hide-scrollbar scroll-smooth pb-2"
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          : anime.map((a, i) => (
              <AnimeCard key={a.mal_id} anime={a} index={i} showRank={showRank} />
            ))}
      </div>
    </section>
  );
};
