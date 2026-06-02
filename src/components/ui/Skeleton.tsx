import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton-shimmer rounded-lg ${className}`} />
      ))}
    </>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="flex-shrink-0 w-[160px] md:w-[200px]">
    <Skeleton className="w-full aspect-[3/4] rounded-xl" />
    <Skeleton className="w-3/4 h-4 mt-2" />
    <Skeleton className="w-1/2 h-3 mt-1" />
  </div>
);

export const BannerSkeleton: React.FC = () => (
  <div className="w-full h-[60vh] md:h-[80vh] skeleton-shimmer rounded-none" />
);

export const DetailSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 pt-20">
    <Skeleton className="w-full h-[40vh] rounded-2xl" />
    <div className="flex gap-6 mt-6">
      <Skeleton className="w-48 h-72 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton className="w-3/4 h-8" />
        <Skeleton className="w-1/2 h-5" />
        <Skeleton className="w-full h-4" count={4} />
      </div>
    </div>
  </div>
);
