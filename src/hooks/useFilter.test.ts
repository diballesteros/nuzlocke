import { act, renderHook } from '@testing-library/react';
import useFilter from 'hooks/useFilter';

describe('useFilter', () => {
  test('upper-cases the search text', () => {
    const { result } = renderHook(() => useFilter());
    act(() => result.current.setSearch('pika'));
    expect(result.current.search).toBe('PIKA');
  });

  test('toggles generations and types', () => {
    const { result } = renderHook(() => useFilter());
    act(() => result.current.setGens(1));
    act(() => result.current.setGens(3));
    act(() => result.current.setTypes('FIRE'));
    expect(result.current.gens).toEqual([1, 3]);
    expect(result.current.types).toEqual(['FIRE']);

    act(() => result.current.setGens(1));
    act(() => result.current.setTypes('FIRE'));
    expect(result.current.gens).toEqual([3]);
    expect(result.current.types).toEqual([]);
  });

  test('reset clears every filter', () => {
    const { result } = renderHook(() => useFilter());
    act(() => {
      result.current.setSearch('x');
      result.current.setGens(2);
      result.current.setTypes('WATER');
    });
    act(() => result.current.reset());
    expect(result.current).toMatchObject({ search: '', gens: [], types: [] });
  });
});
