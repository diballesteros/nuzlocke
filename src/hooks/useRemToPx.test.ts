import { renderHook } from '@testing-library/react';
import useRemtoPx from 'hooks/useRemToPx';

const root = document.documentElement;

afterEach(() => {
  root.style.fontSize = '';
});

describe('useRemtoPx', () => {
  test('multiplies the root font size, 7.143 rem (100px at 14px) by default', () => {
    root.style.fontSize = '14px';
    const { result } = renderHook(() => useRemtoPx());
    expect(result.current).toBeCloseTo(100.002);

    const { result: custom } = renderHook(() => useRemtoPx(2));
    expect(custom.current).toBe(28);
  });

  // parseInt drops the fraction of a fractional root font size
  test('truncates the root font size to whole pixels', () => {
    root.style.fontSize = '14.9px';
    const { result } = renderHook(() => useRemtoPx(10));
    expect(result.current).toBe(140);
  });

  test('recomputes when the multiplier changes', () => {
    root.style.fontSize = '16px';
    const { result, rerender } = renderHook(({ multiplier }) => useRemtoPx(multiplier), {
      initialProps: { multiplier: 2 },
    });
    expect(result.current).toBe(32);

    rerender({ multiplier: 3 });
    expect(result.current).toBe(48);
  });

  // The value is memoised on the multiplier only, so a later root font size change is missed
  test('keeps the first root font size while the multiplier stays the same', () => {
    root.style.fontSize = '16px';
    const { result, rerender } = renderHook(() => useRemtoPx(2));
    root.style.fontSize = '20px';
    rerender();
    expect(result.current).toBe(32);
  });
});
