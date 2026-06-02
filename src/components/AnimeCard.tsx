import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { AnimeData } from '../types/anime';
import { PlayIcon, StarIcon } from './Icons';

interface Props {
  anime: AnimeData;
  index?: number;
}

const AnimeCard: React.FC<Props> = ({ anime, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-bg-card hover:bg-bg-hover transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-indigo-500/10 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        <img
          src={imageUrl}
          alt={anime.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 mx-auto mb-2 shadow-lg shadow-indigo-500/30">
              <PlayIcon size={22} className="text-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Score badge */}
        {anime.score && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm">
            <StarIcon size={12} className="text-yellow-400" />
            <span className="text-xs font-semibold text-white">{anime.score}</span>
          </div>
        )}

        {/* Type badge */}
        {anime.type && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-indigo-500/80 backdrop-blur-sm">
            <span className="text-xs font-medium text-white">{anime.type}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight mb-1.5 group-hover:text-indigo-300 transition-colors">
          {anime.title_english || anime.title}
        </h3>
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          <span>{anime.episodes ? `${anime.episodes} eps` : anime.status || ''}</span>
          {anime.year && <span>{anime.year}</span>}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
