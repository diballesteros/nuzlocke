import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import useStore from 'store';
import modalStyles from 'assets/styles/Modal.module.scss';
import styles from './AddGame.module.scss';

function AddGame(): JSX.Element {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const [gameName, setGameName] = useState('');
  const addGame = useStore(useCallback((state) => state.addGame, []));

  const handleAdd = () => {
    addGame(gameName);
    setOpen(false);
    setGameName('');
  };

  const handleClose = () => {
    setOpen(false);
    setGameName('');
  };

  return (
    <Modal
      closeOnDimmerClick
      onClose={handleClose}
      open={open}
      trigger={
        <Button
          aria-label="addgame"
          className={styles.button}
          data-testid="add-game"
          icon
          onClick={() => setOpen(true)}
          style={{ boxShadow: 'none' }}
        >
          <Icon name="plus" />
        </Button>
      }
    >
      <Modal.Content className={modalStyles.modal}>
        {t('please_enter')}
        <Input
          data-testid="add-game-input"
          onChange={(e, data) => setGameName(data.value)}
          value={gameName}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>{t('cancel')}</Button>
        <Button disabled={gameName?.length === 0} onClick={handleAdd} primary>
          {t('save')}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default AddGame;
