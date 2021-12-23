import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import useStore from 'store';
import modalStyles from 'assets/styles/Modal.module.scss';

import styles from './CustomStatuses.module.scss';

function CustomStatuses(): JSX.Element {
  const { t } = useTranslation('settings');
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const statuses = useStore(useCallback((state) => state.customStatuses, []));
  const addCustomStatus = useStore(useCallback((state) => state.addCustomStatus, []));
  const deleteCustomStatus = useStore(useCallback((state) => state.deleteCustomStatus, []));

  const handleStatus = () => {
    addCustomStatus(text);
    setText('');
  };

  return (
    <Modal
      open={open}
      trigger={
        <Button
          aria-label="Edit custom statuses"
          className={styles.button}
          color="blue"
          inverted={darkMode}
          data-testid="edit-custom-statuses"
          onClick={() => setOpen(true)}
        >
          {t('edit_custom_status')}
        </Button>
      }
    >
      <Modal.Content className={modalStyles.modal} scrolling>
        {statuses?.map((status, i) => {
          return (
            <div className={styles.customStatus} key={`custom-status-${status}`}>
              {status.text}
              <Button
                data-testid={`remove-custom-status-${i}`}
                icon="minus"
                onClick={() => deleteCustomStatus(i)}
              />
            </div>
          );
        })}
        <div className={styles.input}>
          <Input
            data-testid="custom-status-input"
            label={t('custom_status')}
            onChange={(e, data) => setText(data.value)}
            value={text}
          />
          <Button data-testid="add-status" icon="plus" onClick={handleStatus} />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>{t('cancel', { ns: 'common' })}</Button>
      </Modal.Actions>
    </Modal>
  );
}

export default CustomStatuses;
