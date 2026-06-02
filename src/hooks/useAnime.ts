import { useState, useEffect, useCallback, useRef } from 'react';
import type { AnimeData, AnimeEpisode } from '../types/anime';
import * as api from '../lib/api';

export function useAnimeList(fetchFn: () => Promise<{ data: AnimeData[] }>, deps: unknown[] = []) {
  const [data, setData] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchFn()
      .then(res => {
        if (!cancelled) {
          setData(res.data || []);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

export function useAnimeDetail(id: number) {
  const [anime, setAnime] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.getAnimeById(id)
      .then(res => {
        if (!cancelled) {
          setAnime(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [id]);

  return { anime, loading, error };
}

export function useAnimeEpisodes(id: number) {
  const [episodes, setEpisodes] = useState<AnimeEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPage = useCallback(async (page: number) => {
    try {
      const res = await api.getAnimeEpisodes(id, page);
      return res;
    } catch {
      return null;
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function loadAll() {
      const firstPage = await fetchPage(1);
      if (!firstPage || cancelled) { setLoading(false); return; }

      let allEps = [...(firstPage.data || [])];
      const lastPage = firstPage.pagination?.last_visible_page || 1;
      setTotalPages(lastPage);

      // Load remaining pages sequentially to respect rate limits
      for (let p = 2; p <= lastPage && !cancelled; p++) {
        await new Promise(r => setTimeout(r, 400));
        const page = await fetchPage(p);
        if (page && page.data) {
          allEps = [...allEps, ...page.data];
        }
      }

      if (!cancelled) {
        setEpisodes(allEps);
        setLoading(false);
      }
    }

    loadAll();
    return () => { cancelled = true; };
  }, [id, fetchPage]);

  return { episodes, loading, totalPages };
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useIntersectionObserver(
  callback: () => void,
  options?: IntersectionObserverInit
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [callback, options]);

  return ref;
}
