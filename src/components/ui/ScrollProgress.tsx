import React, { useState, useEffect } from 'react';

export const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / winHeight) * 100;
      setProgress(Math.min(scrolled, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress < 1) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[100]">
      <div
        className="h-full bg-gradient-to-r from-nami-accent to-nami-accent-2 transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
