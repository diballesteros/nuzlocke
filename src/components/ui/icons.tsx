import { Icon, type LucideProps } from 'lucide-react';
import { useId } from 'react';
import { cn } from '@/lib/utils';

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

export const ChevronRightIcon = glyph('chevron-right', 'm9.5 6 6 6-6 6', { strokeWidth: 4 });

export const DownloadIcon = glyph(
  'download',
  'M12 15V3M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5',
  { strokeWidth: 3 }
);

// FontAwesome's share is a curved forward arrow
export const ShareIcon = glyph('share', 'M15 17l5-5-5-5M4 18v-2a4 4 0 0 1 4-4h12', {
  strokeWidth: 3,
});

// Lucide's settings cog, with its centre circle as a second subpath of the same path
export const SettingsIcon = glyph(
  'settings',
  'M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915zM15 12a3 3 0 1 0-6 0 3 3 0 1 0 6 0',
  { strokeWidth: 2.5 }
);

export const RefreshIcon = glyph(
  'refresh',
  'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5',
  { strokeWidth: 3 }
);

export const CheckIcon = glyph('check', 'M20 6 9 17l-5-5', { strokeWidth: 3.5 });

export const EyeIcon = glyph(
  'eye',
  'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0M15 12a3 3 0 1 1-6 0 3 3 0 1 1 6 0',
  { strokeWidth: 2.5 }
);

export const EyeOffIcon = glyph(
  'eye-off',
  'M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49M14.084 14.158a3 3 0 0 1-4.242-4.242M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143M2 2l20 20',
  { strokeWidth: 2.5 }
);

export const RepeatIcon = glyph(
  'repeat',
  'm17 2 4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3',
  { strokeWidth: 2.5 }
);

export const ShuffleIcon = glyph(
  'shuffle',
  'm18 14 4 4-4 4M18 2l4 4-4 4M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-7.6a4 4 0 0 1 3.3-1.7H22M2 6h1.972a4 4 0 0 1 3.289 1.722l.35.414M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45',
  { strokeWidth: 2.5 }
);

export const ArrowRightIcon = glyph('arrow-right', 'M5 12h14M12 5l7 7-7 7', { strokeWidth: 3 });

export const SearchIcon = glyph('search', 'M11 4a7 7 0 1 0 0 14 7 7 0 1 0 0-14zM21 21l-5-5', {
  strokeWidth: 3,
});

// FontAwesome's filter is a solid funnel
export const FilterIcon = glyph('filter', 'M1 2.5h22l-8.5 10v8.5l-5 2.5v-11z', SOLID);

// An icon after a button's text, in Semantic's icon slot: 4px from the text, nothing after it. The
// margins and alignment keep its box inside the line, so the button stays 1em + padding tall
export const TRAILING_ICON =
  '-my-[0.09em] mr-[-0.03em] ml-[0.336em] size-[1.16em] -translate-y-[0.05em] align-[-0.14em] opacity-80';

// A trailing icon set exactly --spacing-1 after the text (the tracker and Rules toolbars' buttons,
// whose SCSS gave the icon that margin and none after it)
export const TOOLBAR_ICON = cn(TRAILING_ICON, 'mr-[0.01em] ml-[calc(var(--spacing-1)+0.01em)]');

// FontAwesome's `question circle`: a solid disc with the question mark cut out, so the background
// shows through it. It's opaque text, never a translucent button's, so a mask is safe here
export function QuestionCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  const mask = useId();
  return (
    <svg aria-hidden fill="currentColor" viewBox="0 0 24 24" {...props}>
      <mask id={mask}>
        <rect fill="white" height="24" width="24" />
        <path
          d="M9.3 9.4a2.8 2.8 0 1 1 4.1 2.5c-.9.5-1.4 1.1-1.4 2.1v.4"
          fill="none"
          stroke="black"
          strokeLinecap="round"
          strokeWidth="2.6"
        />
        <circle cx="12" cy="17.4" fill="black" r="1.5" />
      </mask>
      <circle cx="12" cy="12" mask={`url(#${mask})`} r="10.3" />
    </svg>
  );
}
