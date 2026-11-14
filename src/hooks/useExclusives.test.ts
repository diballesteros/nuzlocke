import { renderHook, waitFor } from '@testing-library/react';
import EXCLUSIVES from 'constants/exclusives';
import useExclusives from 'hooks/useExclusives';

describe('useExclusives', () => {
  test('loads nothing until a run has a version', () => {
    const { result } = renderHook(() => useExclusives(false));
    expect(result.current).toBeNull();
  });

  test('loads the version tags once, and later rows get them at once', async () => {
    const { result } = renderHook(() => useExclusives(true));
    await waitFor(() => expect(result.current).toBe(EXCLUSIVES));
    const { result: next } = renderHook(() => useExclusives(true));
    expect(next.current).toBe(EXCLUSIVES);
  });
});
