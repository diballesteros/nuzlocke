import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { FAB_ICON, FabButton } from '@/components/ui/fab-button';
import { TOOLBAR_ICON, XIcon } from '@/components/ui/icons';
import { RADIUS } from '../buttons';

interface ResetEncounterProps {
  icon?: boolean;
}

function ResetEncounters({ icon = false }: ResetEncounterProps): React.JSX.Element {
  const { t } = useTranslation('tracker');
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const resetAll = useStore(useCallback((state) => state.resetAll, []));
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    resetAll();
    setOpen(false);
    toast.success(t('reset_success'));
  };

  return (
    <>
      {icon ? (
        <FabButton
          aria-label={t('reset_encounters', { count: 2 }).trim()}
          colour="red"
          data-testid="reset-all"
          disabled={!selectedGame}
          onClick={() => setOpen(true)}
        >
          <XIcon className={FAB_ICON} />
        </FabButton>
      ) : (
        <Button
          className={RADIUS}
          data-testid="reset-all"
          disabled={!selectedGame}
          onClick={() => setOpen(true)}
          variant="red"
        >
          {t('reset')}
          <XIcon className={TOOLBAR_ICON} />
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle className="sr-only">
            {t('reset_encounters', { count: 2 }).trim()}
          </DialogTitle>
          <DialogBody className="flex flex-col flex-nowrap gap-(--spacing-1)">
            {t('reset_confirm')}
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="secondary">
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button onClick={handleReset} variant="primary">
              {t('save', { ns: 'common' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ResetEncounters;
