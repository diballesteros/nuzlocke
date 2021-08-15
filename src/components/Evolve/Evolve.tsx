import React, { useCallback, useState } from 'react';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import useStore from 'store';
import styles from './Evolve.module.scss';

const Evolve: React.FC = () => {
  const [open, setOpen] = useState(false);
  const darkMode = useStore(useCallback((state) => state.darkMode, []));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      closeOnDimmerClick
      onClose={handleClose}
      open={open}
      trigger={
        <Button
          aria-label="evolve"
          className={styles.button}
          icon="dna"
          inverted={darkMode}
          onClick={() => setOpen(true)}
          title="Evolve"
          type="button"
        />
      }
    >
      <Modal.Header>Evolve Options</Modal.Header>
      <Modal.Content>Evolve</Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>Cancel</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Evolve;
