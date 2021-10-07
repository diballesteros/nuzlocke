import React, { useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import NATURES from 'constants/natures';
import styles from './Natures.module.scss';

function Natures(): JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      closeOnDimmerClick
      onClose={() => setOpen(false)}
      open={open}
      trigger={
        <Button
          aria-label="nature chart"
          data-testid="nature-info"
          icon="question"
          onClick={() => setOpen(true)}
        />
      }
    >
      <Modal.Content className={styles.container}>
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Nature</th>
                <th>Increased Stat</th>
                <th>Decreased Stat</th>
              </tr>
            </thead>
            <tbody>
              {NATURES.map((nature) => {
                return (
                  <tr key={nature.nature}>
                    <td className={styles.nature}>{nature.nature}</td>
                    <td className={styles.increased}>{nature.increased}</td>
                    <td className={styles.decreased}>{nature.decreased}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button data-testid="nature-close" onClick={() => setOpen(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default Natures;
