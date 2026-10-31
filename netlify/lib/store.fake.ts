import type { Store } from '@netlify/blobs';

// The parts of a Blobs store the functions use, with real ETags
export const createFakeStore = () => {
  const data = new Map<string, { value: string; etag: string }>();
  let version = 0;

  const write = (key: string, value: string, options: Record<string, unknown> = {}) => {
    const current = data.get(key);
    if (options.onlyIfNew && current) return { modified: false };
    if (options.onlyIfMatch && current?.etag !== options.onlyIfMatch) return { modified: false };
    version += 1;
    const etag = `"${version}"`;
    data.set(key, { value, etag });
    return { modified: true, etag };
  };
  const read = (key: string, type?: string) => {
    const entry = data.get(key);
    if (!entry) return null;
    return type === 'json' ? JSON.parse(entry.value) : entry.value;
  };

  const store = {
    delete: async (key: string): Promise<void> => {
      data.delete(key);
    },
    get: async (key: string, options?: { type?: string }) => read(key, options?.type),
    list: async ({ prefix }: { prefix: string }) => ({
      blobs: [...data.keys()]
        .filter((key) => key.startsWith(prefix))
        .map((key) => ({ key, etag: data.get(key).etag })),
      directories: [] as string[],
    }),
    set: async (key: string, value: string, options?: Record<string, unknown>) =>
      write(key, value, options),
    setJSON: async (key: string, value: unknown, options?: Record<string, unknown>) =>
      write(key, JSON.stringify(value), options),
  };
  return { store: store as unknown as Store, data, write };
};
