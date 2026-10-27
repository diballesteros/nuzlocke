import { useTranslation } from 'react-i18next';
import { QuestionCircleIcon } from '@/components/ui/icons';
import { HoverPopover } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface HelpProps {
  className?: string;
  content: string;
}

// Semantic's `question circle` icon with a Popup: hovering or clicking it shows the help text. The
// icon takes Semantic's 1em × 1.18em slot and its 0.25rem right margin, and its glyph sits on the
// text line (1lh) as the icon font's did, not in the middle of the slot. Semantic's reset styles
// every <button>, so font, size, line height and margin need !
function Help({ className, content }: HelpProps): React.JSX.Element {
  const { t } = useTranslation('calculator');

  return (
    <HoverPopover content={<b>{content}</b>}>
      <button
        aria-label={t('help')}
        className={cn(
          'm-0! mr-[0.25rem]! flex cursor-help appearance-none items-center border-0 bg-transparent p-0 [font-family:inherit]! text-[length:inherit]! leading-[inherit]! text-foreground',
          className
        )}
        type="button"
      >
        <QuestionCircleIcon className="h-[1em] w-[1.18em] translate-y-[calc((1lh-1em)/2)]" />
      </button>
    </HoverPopover>
  );
}

export default Help;
