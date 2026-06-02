import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Star, Check } from 'lucide-react';
import { LazyImage } from './ui/LazyImage';
import { useStore, type AnimeBasic } from '../store/useStore';

interface AnimeCardProps {
  anime: AnimeBasic;
  index?: number;
  showRank?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, index, showRank }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useStore((s) => s.navigate);
  const toggleWatchlist = useStore((s) => s.toggleWatchlist);
  const isInWatchlist = useStore((s) => s.isInWatchlist);
  const inList = isInWatchlist(anime.mal_id);

  const image = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const title = anime.title_english || anime.title;

  return (
    <motion.div
      className="flex-shrink-0 w-[150px] sm:w-[170px] md:w-[200px] cursor-pointer group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ delay: (index || 0) * 0.05, duration: 0.3 }}
      onClick={() => navigate('anime', anime.mal_id)}
    >
      {/* Rank badge */}
      {showRank && index !== undefined && (
        <div className="absolute -left-2 -top-2 z-10 w-8 h-8 rounded-full bg-gradient-to-br from-nami-accent to-nami-accent-2 flex items-center justify-center text-sm font-bold shadow-lg">
          {index + 1}
        </div>
      )}

      {/* Image container */}
      <div className="relative rounded-xl overflow-hidden aspect-[3/4] shadow-lg group-hover:shadow-nami-accent/20 group-hover:shadow-2xl transition-all duration-300">
        <LazyImage
          src={image}
          alt={title}
          className="w-full h-full"
        />

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3 transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex gap-2 mb-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('watch', anime.mal_id);
              }}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Play className="w-4 h-4 text-black fill-black ml-0.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWatchlist(anime.mal_id);
              }}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {inList ? (
                <Check className="w-4 h-4 text-nami-accent" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>

          {anime.score && (
            <div className="flex items-center gap-1 text-xs text-yellow-400">
              <Star className="w-3 h-3 fill-yellow-400" />
              {anime.score}
            </div>
          )}

          {anime.type && (
            <span className="text-[10px] text-nami-muted mt-0.5">
              {anime.type} {anime.episodes ? `· ${anime.episodes} eps` : ''}
            </span>
          )}
        </div>

        {/* Score badge (always visible) */}
        {anime.score && !hovered && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-[11px] font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            {anime.score}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-2 text-sm font-medium text-nami-text line-clamp-2 group-hover:text-white transition-colors">
        {title}
      </h3>
      {anime.genres && anime.genres.length > 0 && (
        <p className="text-[11px] text-nami-muted mt-0.5 line-clamp-1">
          {anime.genres.slice(0, 2).map((g) => g.name).join(' · ')}
        </p>
      )}
    </motion.div>
  );
};
