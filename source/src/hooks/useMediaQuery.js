import { useEffect, useState } from 'react';

/** Live CSS media query match, e.g. useMediaQuery('(max-width: 767px)'). */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const useIsSmallScreen = () => useMediaQuery('(max-width: 767px)');
