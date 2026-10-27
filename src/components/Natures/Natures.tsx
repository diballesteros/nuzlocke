import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NATURES from 'constants/natures';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BUTTON_ICON, QuestionIcon } from '@/components/ui/icons';

// The nature and ability tables: a sticky badge-coloured header row, then centred rows with the
// increased stat (or an ability's description) in pink and the decreased stat in blue. Their dialog
// body scrolls at 75% of the viewport's height.
export const TABLE_BODY = 'max-h-[75vh] overflow-auto';
export const TABLE =
  'relative w-full border-collapse [&_thead_tr]:h-[4.286rem] [&_thead_tr]:text-center [&_thead_tr]:text-(length:--font-size-4) [&_thead_tr]:font-bold [&_thead_tr]:text-table-head-foreground [&_th]:sticky [&_th]:top-[calc(-1*var(--spacing-6))] [&_th]:bg-badge [&_th]:px-(--spacing-2) [&_th]:py-0 [&_tbody_tr]:h-[3.429rem] [&_tbody_tr]:text-center';
export const NAME_CELL = 'px-(--spacing-2) py-0 text-(length:--font-size-4)';

// Semantic's `icon="question"` button beside a field. It forwards its ref, as a dialog trigger
export const InfoButton = forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  function InfoButton(props, ref) {
    return (
      <Button ref={ref} size="icon" type="button" variant="secondary" {...props}>
        <QuestionIcon className={BUTTON_ICON} />
      </Button>
    );
  }
);

function Natures(): React.JSX.Element {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <InfoButton aria-label="nature chart" data-testid="nature-info" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only">{t('nature_chart')}</DialogTitle>
        <DialogBody className={TABLE_BODY}>
          <table className={TABLE}>
            <thead>
              <tr>
                <th>{t('nature')}</th>
                <th>{t('increased_stat')}</th>
                <th>{t('decreased_stat')}</th>
              </tr>
            </thead>
            <tbody>
              {NATURES.map((nature) => {
                return (
                  <tr key={nature.nature}>
                    <td className={NAME_CELL}>{nature.nature}</td>
                    <td className="text-stat-increased">{nature.increased}</td>
                    <td className="text-stat-decreased">{nature.decreased}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </DialogBody>
        <DialogFooter>
          <Button data-testid="nature-close" onClick={() => setOpen(false)} variant="secondary">
            {t('cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Natures;
