import { useCallback, useState } from 'react';
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
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const resetAll = useStore(useCallback((state) => state.resetAll, []));
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    resetAll();
    setOpen(false);
    toast.success('Successfully reset encounters');
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
            RESET
            <Icon className="icon close" />
          </Button>
        )
      }
    >
      <Modal.Header>Reset all encounters</Modal.Header>
      <Modal.Content className={modalStyles.modal}>
        This will reset all encounters for the selected game and delete custom encounters. Are you
        sure?
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleReset} primary>
          OK
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default ResetEncounters;
