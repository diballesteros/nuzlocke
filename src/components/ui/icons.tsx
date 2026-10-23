import { Icon, type LucideProps } from 'lucide-react';

// Lucide's plus and minus, drawn as one path each. Lucide's own plus is two paths, and inside a
// button the text colour is translucent, so its crossing painted twice. Square caps match the old
// FontAwesome glyphs.
type GlyphProps = Omit<LucideProps, 'ref'>;

export function PlusIcon(props: GlyphProps) {
  return (
    <Icon
      aria-hidden
      iconNode={[['path', { d: 'M5 12h14M12 5v14', key: 'plus' }]]}
      strokeLinecap="square"
      strokeWidth={4.5}
      {...props}
    />
  );
}

export function MinusIcon(props: GlyphProps) {
  return (
    <Icon
      aria-hidden
      iconNode={[['path', { d: 'M5 12h14', key: 'minus' }]]}
      strokeLinecap="square"
      strokeWidth={4.5}
      {...props}
    />
  );
}
