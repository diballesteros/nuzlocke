import { cn } from './utils';

describe('cn', () => {
  test('joins conditional classes', () => {
    const hidden = false;
    expect(cn('p-2', hidden && 'hidden', ['text-sm', { 'font-bold': true }])).toBe(
      'p-2 text-sm font-bold'
    );
  });

  test('lets a later Tailwind class win a conflict', () => {
    expect(cn('px-2 py-1 bg-primary', 'px-4 bg-destructive')).toBe('py-1 px-4 bg-destructive');
  });
});
