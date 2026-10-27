import { act, renderHook } from '@testing-library/react';
import useWindowSize from 'hooks/useWindowSize';

describe('useWindowSize', () => {
  test('reports the window size and follows resizes', () => {
    const { result, unmount } = renderHook(() => useWindowSize());
    expect(result.current).toEqual({ width: window.innerWidth, height: window.innerHeight });

    act(() => {
      window.innerWidth = 500;
      window.innerHeight = 300;
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toEqual({ width: 500, height: 300 });

    unmount();
    act(() => {
      window.innerWidth = 900;
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toEqual({ width: 500, height: 300 });
  });
});
