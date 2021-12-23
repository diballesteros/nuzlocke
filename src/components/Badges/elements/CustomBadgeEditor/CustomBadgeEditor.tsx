import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import styles from 'components/Badges/elements/BadgeEditor/BadgeEditor.module.scss';
import { MAX_GAME } from 'constants/constant';
import useStore from 'store';
import buttonStyles from 'assets/styles/Button.module.scss';
import modalStyles from 'assets/styles/Modal.module.scss';

interface CustomBadgeEditorProps {
  icon?: boolean;
}

function CustomBadgeEditor({ icon }: CustomBadgeEditorProps): JSX.Element {
  const { t } = useTranslation('badges');
  const [open, setOpen] = useState(false);
  const badges = useStore(useCallback((state) => state.customBadges, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const addCustomBadge = useStore(useCallback((state) => state.addCustomBadge, []));
  const deleteCustomBadge = useStore(useCallback((state) => state.deleteCustomBadge, []));
  const editCustomBadge = useStore(useCallback((state) => state.editCustomBadge, []));

  const handleChange = (newBadge: string, index: number) => {
    editCustomBadge(newBadge, index);
  };

  return selectedGame?.value && Number(selectedGame.value) > MAX_GAME ? (
    <Modal
      open={open}
      trigger={
        icon ? (
          <Button
            icon="pencil"
            circular
            className={buttonStyles.iconButton}
            color="yellow"
            data-testid="custom-edit-badges"
            disabled={!selectedGame}
            onClick={() => setOpen(true)}
          />
        ) : (
          <Button
            aria-label="editgame"
            className={styles.button}
            data-testid="custom-edit-badges"
            icon="pencil"
            onClick={() => setOpen(true)}
          />
        )
      }
    >
      <Modal.Content className={modalStyles.modal} scrolling>
        {badges[selectedGame.value] &&
          badges[selectedGame.value]?.map((val, i) => {
            return (
              <div className={styles.custom} key={`custombadge-${Number(i) + 1}`}>
                <Input
                  data-testid={`custom-badge-input-${i}`}
                  label={Number(i) + 1}
                  onChange={(e, data) => handleChange(data.value, i)}
                  value={val}
                />
                <Button
                  data-testid={`remove-custom-badge-${i}`}
                  icon="minus"
                  onClick={() => deleteCustomBadge(i)}
                />
              </div>
            );
          })}
        <Button data-testid="add-cap" onClick={addCustomBadge}>
          {t('add_level_cap')} <Icon className="icon plus" />
        </Button>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>{t('cancel', { ns: 'common' })}</Button>
      </Modal.Actions>
    </Modal>
  ) : null;
}

export default CustomBadgeEditor;
