import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { GAMES } from 'constants/constant';
import useStore from 'store';
import modalStyles from 'assets/styles/Modal.module.scss';
import styles from './AddGame.module.scss';

const NONE = 'none';

function AddGame(): React.JSX.Element {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const [template, setTemplate] = useState(NONE);
  const [gameName, setGameName] = useState('');
  const addGame = useStore(useCallback((state) => state.addGame, []));

  const handleAdd = () => {
    addGame(gameName, template === NONE ? null : template);
    setOpen(false);
    setTemplate(NONE);
    setGameName('');
  };

  const handleClose = () => {
    setOpen(false);
    setTemplate(NONE);
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
          aria-label="custom-game-text"
          data-testid="add-game-input"
          maxLength={50}
          onChange={(e, data) => setGameName(data.value)}
          value={gameName}
        />
        <section className={styles.template}>
          <span>{t('encounter_template')}:</span>
          <Dropdown
            aria-label="encounter-template"
            data-testid="encounter-template"
            onChange={(e, data) => setTemplate(data.value as string)}
            options={[{ key: NONE, text: t('none'), value: NONE }].concat(GAMES)}
            selection
            value={template}
          />
          <em>{t('template_hint')}</em>
        </section>
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
