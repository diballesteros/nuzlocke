import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { MinusIcon, PlusIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';

// Semantic's icon in an icon button: a 1em × 1.18em slot. The one-path glyphs are drawn in a larger
// box, so the negative margins keep the button the size it was.
const ICON = '-my-[0.08em] mr-[-0.03em] ml-[0.05em] size-[1.16em] align-top opacity-90';

function CustomStatuses(): React.JSX.Element {
  const { t } = useTranslation('settings');
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const statuses = useStore(useCallback((state) => state.customStatuses, []));
  const addCustomStatus = useStore(useCallback((state) => state.addCustomStatus, []));
  const deleteCustomStatus = useStore(useCallback((state) => state.deleteCustomStatus, []));

  const handleStatus = () => {
    addCustomStatus(text);
    setText('');
  };

  return (
    <>
      <Button
        aria-label="Edit custom statuses"
        className="max-w-fit"
        data-testid="edit-custom-statuses"
        onClick={() => setOpen(true)}
        variant="blue"
      >
        {t('edit_custom_status')}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dismissible={false}>
          <DialogTitle className="sr-only">{t('edit_custom_status')}</DialogTitle>
          <DialogBody className="flex flex-col flex-nowrap gap-(--spacing-1)" scrolling>
            {statuses?.map((status, i) => {
              return (
                <div
                  className="flex items-center gap-(--spacing-2) border-0 border-b border-solid border-foreground px-(--spacing-1) py-(--spacing-2) text-(length:--font-size-4)"
                  key={`custom-status-${status}`}
                >
                  {status.text}
                  <Button
                    aria-label={t('remove', { ns: 'common' })}
                    data-testid={`remove-custom-status-${i}`}
                    onClick={() => deleteCustomStatus(i)}
                    size="icon"
                    variant="secondary"
                  >
                    <MinusIcon className={ICON} />
                  </Button>
                </div>
              );
            })}
            <div className="flex items-center gap-(--spacing-2)">
              <Input
                data-testid="custom-status-input"
                label={t('custom_status')}
                maxLength={20}
                onChange={(e) => setText(e.target.value)}
                value={text}
              />
              <Button
                aria-label={t('add', { ns: 'common' })}
                data-testid="add-status"
                onClick={handleStatus}
                size="icon"
                variant="secondary"
              >
                <PlusIcon className={ICON} />
              </Button>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="secondary">
              {t('cancel', { ns: 'common' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CustomStatuses;
