import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Menu, X, Heart, Clock, Bookmark } from 'lucide-react';
import { useStore } from '../store/useStore';
import { searchAnime } from '../lib/api';
import { useDebounce } from '../hooks/useDebounce';
import type { AnimeBasic } from '../store/useStore';

const LOGO_URL =
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwxClcajSZy1q1gj_1kf_9y1J7mutn4jWfqdhlBVbFjLkViz_Z3-nuIZ11W0qOd1jlFgMFYi-g_XrpIiRbQjZd-wPwg4RWWyhbR0QLw0-ZgX5DFncVPNOxrDBouMlbdz2sLvQS65JbQaLJpQReWhjceG8Rn5cxrNusoQAXieXFcX_q_LZthCYS1AsCR30/s320/NamiTube%20Original%20banner.png';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchResults, setSearchResults] = useState<AnimeBasic[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [searching, setSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    navigate,
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setSearchOpen,
    isMobileMenuOpen,
    setMobileMenu,
  } = useStore();

  const debouncedQuery = useDebounce(searchQuery, 400);

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Search effect
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    searchAnime(debouncedQuery, 1, 8)
      .then((res) => setSearchResults(res.data || []))
      .catch(() => setSearchResults([]))
      .finally(() => setSearching(false));
  }, [debouncedQuery]);

  // Keyboard shortcut: Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Keyboard navigation in search
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((prev) => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIdx >= 0) {
      e.preventDefault();
      const anime = searchResults[selectedIdx];
      if (anime) {
        navigate('anime', anime.mal_id);
        setSearchOpen(false);
        setSearchQuery('');
      }
    }
  };

  return (
    <>
      {/* Main navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass shadow-lg'
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 md:px-8 h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src={LOGO_URL} alt="NamiTube" className="h-8 md:h-10 object-contain" />
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink label="Home" onClick={() => navigate('home')} />
            <NavLink label="Trending" onClick={() => navigate('search')} />
            <NavLink label="Watchlist" onClick={() => navigate('watchlist')} />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Search trigger */}
            <button
              onClick={() => {
                setSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate('profile')}
              className="hidden md:flex w-9 h-9 rounded-full bg-gradient-to-br from-nami-accent to-nami-accent-2 items-center justify-center hover:scale-105 transition-transform"
              aria-label="Profile"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenu(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full bg-white/5 flex items-center justify-center"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSearchOpen(false);
                setSearchQuery('');
              }
            }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-2xl"
            >
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-nami-muted" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIdx(-1);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search anime... (Ctrl+K)"
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-nami-surface border border-nami-border text-white placeholder:text-nami-muted focus:outline-none focus:border-nami-accent text-lg"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-nami-muted hover:text-white" />
                  </button>
                )}
              </div>

              {/* Results */}
              {(searchResults.length > 0 || searching) && (
                <div className="mt-2 bg-nami-surface border border-nami-border rounded-2xl overflow-hidden max-h-[60vh] overflow-y-auto">
                  {searching ? (
                    <div className="p-6 text-center text-nami-muted">
                      Searching...
                    </div>
                  ) : (
                    searchResults.map((anime, i) => (
                      <button
                        key={anime.mal_id}
                        onClick={() => {
                          navigate('anime', anime.mal_id);
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full flex items-center gap-4 p-3 hover:bg-white/5 transition-colors text-left ${
                          i === selectedIdx ? 'bg-white/10' : ''
                        }`}
                      >
                        <img
                          src={anime.images?.jpg?.image_url}
                          alt={anime.title}
                          className="w-12 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {anime.title_english || anime.title}
                          </p>
                          <p className="text-xs text-nami-muted">
                            {anime.type} {anime.episodes ? `· ${anime.episodes} eps` : ''} {anime.score ? `· ${anime.score}` : ''}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {searchQuery && !searching && searchResults.length === 0 && (
                <div className="mt-2 bg-nami-surface border border-nami-border rounded-2xl p-6 text-center text-nami-muted">
                  No results found for "{searchQuery}"
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 bottom-0 z-[55] w-72 glass border-l border-nami-border p-6 pt-20"
          >
            <div className="space-y-2">
              <MobileNavItem
                icon={<Menu className="w-5 h-5" />}
                label="Home"
                onClick={() => navigate('home')}
              />
              <MobileNavItem
                icon={<Bookmark className="w-5 h-5" />}
                label="Watchlist"
                onClick={() => navigate('watchlist')}
              />
              <MobileNavItem
                icon={<Heart className="w-5 h-5" />}
                label="Favorites"
                onClick={() => navigate('watchlist')}
              />
              <MobileNavItem
                icon={<Clock className="w-5 h-5" />}
                label="History"
                onClick={() => navigate('watchlist')}
              />
              <MobileNavItem
                icon={<User className="w-5 h-5" />}
                label="Profile"
                onClick={() => navigate('profile')}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const NavLink: React.FC<{ label: string; onClick: () => void }> = ({
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="text-sm text-nami-muted hover:text-white transition-colors font-medium"
  >
    {label}
  </button>
);

const MobileNavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-nami-text"
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);
