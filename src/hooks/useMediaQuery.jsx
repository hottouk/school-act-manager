import { useEffect, useState } from 'react'
//250213 생성
const useMediaQuery = (query) => {
  // const isMobile = useMediaQuery('(max-width: 768px)');
  //  @media(max-width: 768px) {
  // }
  const [matches, setMatches] = useState(window.matchMedia(query).matches);
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const listener = (e) => setMatches(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [query]);
  return matches;
}

export default useMediaQuery
