import toTopPosition from './toTopPosition';

describe('toTopPosition', () => {
  test('turns a translateY offset into top', () => {
    expect(
      toTopPosition({
        position: 'absolute',
        left: 0,
        transform: 'translateY(179.5px)',
        height: 180,
      })
    ).toEqual({ position: 'absolute', left: 0, top: 179.5, height: 180 });
  });

  test('keeps styles without a translateY as they are', () => {
    const noTransform = { position: 'absolute', height: 180 } as const;
    const otherTransform = { transform: 'scale(2)' };
    expect(toTopPosition(noTransform)).toBe(noTransform);
    expect(toTopPosition(otherTransform)).toBe(otherTransform);
  });
});
