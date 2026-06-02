import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore, type AnimeBasic } from '../store/useStore';

interface HeroBannerProps {
  anime: AnimeBasic[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ anime }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const navigate = useStore((s) => s.navigate);

  const bannerAnime = anime.slice(0, 6);
  const current = bannerAnime[currentIdx];

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % bannerAnime.length);
  }, [bannerAnime.length]);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + bannerAnime.length) % bannerAnime.length);
  }, [bannerAnime.length]);

  // Auto rotate
  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (!current) return null;

  const bgImage = current.images?.webp?.large_image_url || current.images?.jpg?.large_image_url || current.images?.jpg?.image_url;
  const title = current.title_english || current.title;

  return (
    <section className="relative w-full h-[65vh] md:h-[85vh] overflow-hidden">
      {/* Background images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.mal_id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={bgImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-nami-bg via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-nami-bg to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1440px] mx-auto w-full px-4 md:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.mal_id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl"
            >
              {/* Tags */}
              <div className="flex items-center gap-2 mb-3">
                {current.score && (
                  <span className="px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-400 text-xs font-semibold">
                    {current.score}
                  </span>
                )}
                {current.type && (
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-medium">
                    {current.type}
                  </span>
                )}
                {current.year && (
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-medium">
                    {current.year}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-3 line-clamp-2">
                {title}
              </h1>

              {/* Synopsis */}
              <p className="text-sm md:text-base text-gray-300 line-clamp-3 mb-6 max-w-lg leading-relaxed">
                {current.synopsis?.replace(/\[Written by MAL Rewrite\]/g, '').trim()}
              </p>

              {/* Genres */}
              {current.genres && current.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {current.genres.slice(0, 4).map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-nami-text"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('watch', current.mal_id)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-nami-accent to-nami-accent-2 text-white font-semibold hover:scale-105 transition-transform shadow-lg shadow-nami-accent/30"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Watch Now
                </button>
                <button
                  onClick={() => navigate('anime', current.mal_id)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors backdrop-blur"
                >
                  <Info className="w-5 h-5" />
                  Details
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass hover:bg-white/10 flex items-center justify-center transition-colors opacity-0 hover:opacity-100 focus:opacity-100"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass hover:bg-white/10 flex items-center justify-center transition-colors opacity-0 hover:opacity-100 focus:opacity-100"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerAnime.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIdx
                ? 'w-8 bg-gradient-to-r from-nami-accent to-nami-accent-2'
                : 'w-1.5 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
