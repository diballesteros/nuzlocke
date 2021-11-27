import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import useStore from 'store';
import styles from 'assets/styles/Button.module.scss';
import modalStyles from 'assets/styles/Modal.module.scss';

interface ResetEncounterProps {
  icon?: boolean;
}

function ResetEncounters({ icon = false }: ResetEncounterProps): JSX.Element {
  const { t } = useTranslation('tracker');
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const resetAll = useStore(useCallback((state) => state.resetAll, []));
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    resetAll();
    setOpen(false);
    toast.success(t('reset_success'));
  };

  return (
    <Modal
      closeOnDimmerClick
      onClose={() => setOpen(false)}
      open={open}
      trigger={
        icon ? (
          <Button
            icon="close"
            circular
            className={styles.iconButton}
            color="red"
            data-testid="reset-all"
            disabled={!selectedGame}
            onClick={() => setOpen(true)}
          />
        ) : (
          <Button
            color="red"
            data-testid="reset-all"
            disabled={!selectedGame}
            inverted={darkMode}
            onClick={() => setOpen(true)}
          >
            {t('reset')}
            <Icon className="icon close" />
          </Button>
        )
      }
    >
      <Modal.Content className={modalStyles.modal}>{t('reset_confirm')}</Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>{t('cancel', { ns: 'common' })}</Button>
        <Button onClick={handleReset} primary>
          {t('save', { ns: 'common' })}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default ResetEncounters;
