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
import { FAB_ICON, FabButton } from '@/components/ui/fab-button';
import { PlusIcon, TOOLBAR_ICON } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { RADIUS } from '../buttons';

interface AddEncounterProps {
  icon?: boolean;
}

function AddEncounter({ icon = false }: AddEncounterProps): React.JSX.Element {
  const { t } = useTranslation('tracker');
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const addEncounter = useStore(useCallback((state) => state.addEncounter, []));
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('');

  const handleAdd = () => {
    addEncounter(location);
    setOpen(false);
    setLocation('');
  };

  const handleClose = () => {
    setOpen(false);
    setLocation('');
  };

  return (
    <>
      {icon ? (
        <FabButton
          aria-label={t('add_encounter')}
          colour="green"
          data-testid="add-encounter"
          disabled={!selectedGame}
          onClick={() => setOpen(true)}
        >
          <PlusIcon className={FAB_ICON} />
        </FabButton>
      ) : (
        <Button
          className={RADIUS}
          data-testid="add-encounter"
          disabled={!selectedGame}
          onClick={() => setOpen(true)}
          variant="green"
        >
          {t('add')}
          <PlusIcon className={TOOLBAR_ICON} />
        </Button>
      )}
      <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
        <DialogContent>
          <DialogTitle className="sr-only">{t('add_encounter')}</DialogTitle>
          <DialogBody className="flex flex-col flex-nowrap gap-(--spacing-1)">
            {t('please_location')}
            <Input
              data-testid="add-encounter-input"
              maxLength={100}
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            />
          </DialogBody>
          <DialogFooter>
            <Button onClick={handleClose} variant="secondary">
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button disabled={location?.length === 0} onClick={handleAdd} variant="primary">
              {t('save', { ns: 'common' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddEncounter;
