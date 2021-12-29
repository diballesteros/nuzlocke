import { useMemo } from 'react';

function useRemtoPx(multiplier = 7.143 /* 100px */): number {
  const itemSize = useMemo(() => {
    return parseInt(getComputedStyle(document.documentElement).fontSize) * multiplier;
  }, [multiplier]);

  return itemSize;
}

export default useRemtoPx;
