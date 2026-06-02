import React from 'react';
import { Home, Search, Bookmark, User } from 'lucide-react';
import { useStore } from '../store/useStore';

export const BottomNav: React.FC = () => {
  const { currentPage, navigate, setSearchOpen } = useStore();

  const items = [
    { icon: Home, label: 'Home', page: 'home' as const, action: () => navigate('home') },
    { icon: Search, label: 'Search', page: 'search' as const, action: () => setSearchOpen(true) },
    { icon: Bookmark, label: 'List', page: 'watchlist' as const, action: () => navigate('watchlist') },
    { icon: User, label: 'Profile', page: 'profile' as const, action: () => navigate('profile') },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-nami-border">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map(({ icon: Icon, label, page, action }) => {
          const active = currentPage === page;
          return (
            <button
              key={label}
              onClick={action}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                active ? 'text-nami-accent' : 'text-nami-muted'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
