import { useTranslation } from 'react-i18next';
import { ROW_GHOST } from 'components/Tracker/elements/buttons';
import { QuestionCircleIcon } from '@/components/ui/icons';
import { HoverPopover } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface HelpProps {
  className?: string;
  content: string;
}

// A ghost ? button (5s): hovering or clicking it shows the help text
function Help({ className, content }: HelpProps): React.JSX.Element {
  const { t } = useTranslation('calculator');

  return (
    <HoverPopover content={<b>{content}</b>}>
      <button
        aria-label={t('help')}
        className={cn(ROW_GHOST, 'cursor-help text-row-muted hover:text-foreground', className)}
        type="button"
      >
        <QuestionCircleIcon aria-hidden />
      </button>
    </HoverPopover>
  );
}

export default Help;
