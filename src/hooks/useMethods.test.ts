import { renderHook, waitFor } from '@testing-library/react';
import METHODS from 'constants/methods';
import useMethods from 'hooks/useMethods';

describe('useMethods', () => {
  test('loads the encounter methods once, and later rows get them at once', async () => {
    const { result } = renderHook(() => useMethods());
    expect(result.current).toBeNull();
    await waitFor(() => expect(result.current).toBe(METHODS));
    const { result: next } = renderHook(() => useMethods());
    expect(next.current).toBe(METHODS);
  });
});
