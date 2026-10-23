import { Icon, type LucideProps } from 'lucide-react';

// Lucide glyphs redrawn as one path each. Most lucide icons are several paths, and inside a button
// the text colour is translucent, so wherever two paths cross the stroke painted twice. Square caps
// on the plus and minus match the old FontAwesome glyphs.
type GlyphProps = Omit<LucideProps, 'ref'>;

// A glyph alone in an icon button, in Semantic's 1em × 1.18em icon slot. The glyphs are drawn in a
// larger box, so the negative margins keep the button the size it was.
export const BUTTON_ICON =
  '-my-[0.08em] mr-[-0.03em] ml-[0.05em] size-[1.16em] align-top opacity-90';

const glyph = (name: string, d: string, defaults: GlyphProps = {}) =>
  function Glyph(props: GlyphProps) {
    return <Icon aria-hidden iconNode={[['path', { d, key: name }]]} {...defaults} {...props} />;
  };

export const PlusIcon = glyph('plus', 'M5 12h14M12 5v14', {
  strokeLinecap: 'square',
  strokeWidth: 4.5,
});

export const MinusIcon = glyph('minus', 'M5 12h14', { strokeLinecap: 'square', strokeWidth: 4.5 });

export const ArrowUpIcon = glyph('arrow-up', 'M12 19V5M5 12l7-7 7 7', { strokeWidth: 3 });

export const ArrowDownIcon = glyph('arrow-down', 'M12 5v14M19 12l-7 7-7-7', { strokeWidth: 3 });

// FontAwesome's trash and pencil are solid, so these two are filled shapes with no stroke
const SOLID: GlyphProps = { fill: 'currentColor', stroke: 'none' };

export const TrashIcon = glyph(
  'trash',
  'M9 2h6l.75 1.5H21V6.5H3V3.5h5.25zM4.5 8h15l-1.2 13.2A1.5 1.5 0 0 1 16.8 22.5H7.2a1.5 1.5 0 0 1-1.5-1.3z',
  SOLID
);

export const PencilIcon = glyph(
  'pencil',
  'M15 5.5l3.5 3.5L8 19.5l-5 1.5 1.5-5zM16.5 4l2-2a1.4 1.4 0 0 1 2 0l1.5 1.5a1.4 1.4 0 0 1 0 2l-2 2z',
  SOLID
);

export const XIcon = glyph('x', 'M18 6 6 18M6 6l12 12', { strokeWidth: 3 });

export const QuestionIcon = glyph(
  'question',
  'M6.5 8.5a5.5 5.5 0 1 1 7.7 5c-1.3.5-2.2 1.3-2.2 2.6v.1M12 20h.01',
  {
    strokeWidth: 4.5,
  }
);
