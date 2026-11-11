import { renderHook, waitFor } from '@testing-library/react';
import FILTERS from 'constants/filters';
import useFilters from 'hooks/useFilters';

describe('useFilters', () => {
  test('loads the encounter tables once, and later rows get them at once', async () => {
    const { result } = renderHook(() => useFilters());
    expect(result.current).toBeNull();
    await waitFor(() => expect(result.current).toBe(FILTERS));
    const { result: next } = renderHook(() => useFilters());
    expect(next.current).toBe(FILTERS);
  });
});
