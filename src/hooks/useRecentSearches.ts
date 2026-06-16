import { useState, useEffect } from 'react';

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 10;

// 쿠키 헬퍼 함수
const setCookie = (name: string, value: string) => {
  // Expires/Max-Age를 지정하지 않으면 세션 쿠키가 되어 브라우저 종료 시 삭제됨
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; samesite=lax`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = getCookie(RECENT_SEARCHES_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    }
  }, []);

  const addSearch = (term: string) => {
    if (!term || !term.trim()) return;
    const trimmed = term.trim();
    const newSearches = [trimmed, ...recentSearches.filter((t) => t !== trimmed)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(newSearches);
    setCookie(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
  };

  const removeSearch = (term: string) => {
    const newSearches = recentSearches.filter((t) => t !== term);
    setRecentSearches(newSearches);
    setCookie(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
  };

  const clearAll = () => {
    setRecentSearches([]);
    deleteCookie(RECENT_SEARCHES_KEY);
  };

  return { recentSearches, addSearch, removeSearch, clearAll };
};
