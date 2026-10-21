import type { CSSProperties } from 'react';

// react-window 2 positions rows with a transform, which gives each row its own stacking context
// and hides open dropdowns under the next row. Position with top instead, as react-window 1 did
export default function toTopPosition(style: CSSProperties): CSSProperties {
  const { transform, ...rest } = style;
  const offset = /translateY\((-?[\d.]+)px\)/.exec(String(transform ?? ''));
  return offset ? { ...rest, top: Number(offset[1]) } : style;
}
