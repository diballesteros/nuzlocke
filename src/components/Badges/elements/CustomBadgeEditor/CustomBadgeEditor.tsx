import { useCallback, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import styles from 'components/Badges/elements/BadgeEditor/BadgeEditor.module.scss';
import useStore from 'store';
import buttonStyles from 'assets/styles/Button.module.scss';
import modalStyles from 'assets/styles/Modal.module.scss';

interface CustomBadgeEditorProps {
  icon?: boolean;
}

function CustomBadgeEditor({ icon }: CustomBadgeEditorProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const badges = useStore(useCallback((state) => state.customBadges, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const addCustomBadge = useStore(useCallback((state) => state.addCustomBadge, []));
  const deleteCustomBadge = useStore(useCallback((state) => state.deleteCustomBadge, []));
  const editCustomBadge = useStore(useCallback((state) => state.editCustomBadge, []));

  const handleChange = (newBadge: string, index: number) => {
    editCustomBadge(newBadge, index);
  };

  return selectedGame?.value && Number(selectedGame.value) > 13 ? (
    <Modal
      closeOnDimmerClick
      onClose={() => setOpen(false)}
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
            icon
            onClick={() => setOpen(true)}
          >
            <Icon name="pencil" />
          </Button>
        )
      }
    >
      <Modal.Header>Edit Badge Level Caps</Modal.Header>
      <Modal.Content className={modalStyles.maxModal}>
        {badges[selectedGame.value] &&
          badges[selectedGame.value]?.map((val, i) => {
            return (
              <div className={styles.custom} key={`badge-${i + 1}`}>
                <Input
                  data-testid={`custom-badge-input-${i}`}
                  label={i + 1}
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
        <Button data-testid="add-cap" icon="plus" onClick={addCustomBadge}>
          Add level cap <Icon className="icon plus" />
        </Button>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  ) : null;
}

export default CustomBadgeEditor;
