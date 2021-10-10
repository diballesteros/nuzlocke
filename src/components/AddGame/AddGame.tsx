import { useCallback, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import useStore from 'store';
import styles from './AddGame.module.scss';

function AddGame(): JSX.Element {
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
      <Modal.Header>Add Game</Modal.Header>
      <Modal.Content style={{ display: 'flex', flexFlow: 'column nowrap', gap: '5px' }}>
        Please enter the game name
        <Input
          data-testid="add-game-input"
          onChange={(e, data) => setGameName(data.value)}
          value={gameName}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={gameName?.length === 0} onClick={handleAdd}>
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default AddGame;
