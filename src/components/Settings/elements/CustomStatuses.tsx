import { useCallback, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HINT, ROW, TEXT, TITLE } from 'components/Settings/elements/rows';
import { ROW_CONTROL } from 'components/Tracker/elements/buttons';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { BUTTON_ICON, MinusIcon, PencilIcon, PlusIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function CustomStatuses(): React.JSX.Element {
  const { t } = useTranslation('settings');
  const uid = useId();
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
      {/* The Tracker card's last row (5w): the count as its hint and an outlined Edit, named in full
          and described by the count */}
      <div className={ROW}>
        <span className={TEXT}>
          <span className={TITLE}>{t('custom_statuses')}</span>
          <span className={HINT} id={`${uid}-hint`}>
            {t('custom_status_count', { count: statuses?.length ?? 0 })}
          </span>
        </span>
        <button
          aria-describedby={`${uid}-hint`}
          aria-label={t('edit_custom_status')}
          className={cn(ROW_CONTROL, 'h-[2.571rem] gap-(--spacing-2) bg-card px-(--spacing-3)')}
          data-testid="edit-custom-statuses"
          onClick={() => setOpen(true)}
          type="button"
        >
          <PencilIcon aria-hidden />
          <span>{t('edit')}</span>
        </button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dismissible={false}>
          <DialogTitle className="sr-only">{t('edit_custom_status')}</DialogTitle>
          <DialogBody className="flex flex-col flex-nowrap gap-(--spacing-1)" scrolling>
            {statuses?.map((status, i) => {
              return (
                <div
                  className="flex items-center gap-(--spacing-2) border-0 border-b border-solid border-foreground px-(--spacing-1) py-(--spacing-2) text-(length:--font-size-4)"
                  key={`custom-status-${status.value}`}
                >
                  {status.text}
                  <Button
                    aria-label={t('remove', { ns: 'common' })}
                    data-testid={`remove-custom-status-${i}`}
                    onClick={() => deleteCustomStatus(i)}
                    size="icon"
                    variant="secondary"
                  >
                    <MinusIcon className={BUTTON_ICON} />
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
                <PlusIcon className={BUTTON_ICON} />
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
