import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { HomePage } from './pages/HomePage';
import { AnimeDetailPage } from './pages/AnimeDetailPage';
import { WatchPage } from './pages/WatchPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { ProfilePage } from './pages/ProfilePage';
import { SupportPage } from './pages/SupportPage';
import { SearchPage } from './pages/SearchPage';
import { useStore } from './store/useStore';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function App() {
  const currentPage = useStore((s) => s.currentPage);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Escape closes search/menus
      if (e.key === 'Escape') {
        useStore.getState().setSearchOpen(false);
        useStore.getState().setMobileMenu(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'search':
        return <SearchPage />;
      case 'anime':
        return <AnimeDetailPage />;
      case 'watch':
        return <WatchPage />;
      case 'watchlist':
        return <WatchlistPage />;
      case 'profile':
        return <ProfilePage />;
      case 'support':
        return <SupportPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="bg-nami-bg text-white min-h-screen">
      <ScrollProgress />

      {/* Hide main navbar on watch page */}
      {currentPage !== 'watch' && <Navbar />}

      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      {currentPage !== 'watch' && <Footer />}

      {/* Bottom navigation for mobile */}
      {currentPage !== 'watch' && <BottomNav />}
    </div>
  );
}

const Footer: React.FC = () => {
  const navigate = useStore((s) => s.navigate);

  return (
    <footer className="border-t border-nami-border bg-nami-surface/50 py-8 px-4 md:px-12 hidden md:block">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwxClcajSZy1q1gj_1kf_9y1J7mutn4jWfqdhlBVbFjLkViz_Z3-nuIZ11W0qOd1jlFgMFYi-g_XrpIiRbQjZd-wPwg4RWWyhbR0QLw0-ZgX5DFncVPNOxrDBouMlbdz2sLvQS65JbQaLJpQReWhjceG8Rn5cxrNusoQAXieXFcX_q_LZthCYS1AsCR30/s320/NamiTube%20Original%20banner.png"
              alt="NamiTube"
              className="h-7 opacity-60"
            />
            <span className="text-xs text-nami-muted">
              Free anime streaming platform
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <button onClick={() => navigate('home')} className="text-nami-muted hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => navigate('search')} className="text-nami-muted hover:text-white transition-colors">
              Explore
            </button>
            <button onClick={() => navigate('watchlist')} className="text-nami-muted hover:text-white transition-colors">
              My List
            </button>
            <button onClick={() => navigate('support')} className="text-nami-muted hover:text-white transition-colors">
              Support
            </button>
          </div>

          <p className="text-xs text-nami-muted/50">
            NamiTube 2025. Powered by Jikan API.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default App;
