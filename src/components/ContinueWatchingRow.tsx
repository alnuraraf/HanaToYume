import React from 'react';
import { Link } from 'react-router-dom';
import { getContinueWatching, removeContinueWatching } from '../lib/store';
import { PlayIcon, CloseIcon, ClockIcon } from './Icons';

const ContinueWatchingRow: React.FC = () => {
  const [items, setItems] = React.useState(getContinueWatching());

  if (items.length === 0) return null;

  const handleRemove = (e: React.MouseEvent, animeId: number) => {
    e.preventDefault();
    e.stopPropagation();
    removeContinueWatching(animeId);
    setItems(getContinueWatching());
  };

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-5 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <ClockIcon size={20} className="text-indigo-400" />
        <h2 className="text-xl font-bold text-white">Continue Watching</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-4" />
      </div>

      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 pb-2 max-w-[1440px] mx-auto">
        {items.map(item => (
          <Link
            key={item.animeId}
            to={`/watch/${item.animeId}/${item.episode}`}
            className="shrink-0 w-[280px] sm:w-[320px] group relative rounded-xl overflow-hidden bg-bg-card hover:bg-bg-hover transition-all duration-300"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-indigo-500/90 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                  <PlayIcon size={24} className="text-white ml-1" />
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={(e) => handleRemove(e, item.animeId)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
              >
                <CloseIcon size={14} />
              </button>

              {/* Progress bar */}
              {item.progress !== undefined && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                  <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${Math.min(item.progress, 100)}%` }}
                  />
                </div>
              )}
            </div>

            <div className="p-3">
              <h3 className="text-sm font-semibold text-white line-clamp-1">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-1">Episode {item.episode}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ContinueWatchingRow;
