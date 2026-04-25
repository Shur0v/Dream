/**
 * Lightweight development delay helper.
 * No sample/mock entity data is stored in this file.
 */

export const mockApiDelay = (ms: number = 1000): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    return Promise.resolve();
  }
  const capped = Math.min(ms, 50);
  return new Promise((resolve) => setTimeout(resolve, capped));
};
