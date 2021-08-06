import React, { useRef, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import useStore from 'store';
import styles from 'assets/styles/Button.module.scss';

interface ShareProps {
  disabled: boolean;
  icon?: boolean;
  text: string;
}

const Share: React.FC<ShareProps> = ({ disabled, icon = false, text }) => {
  const appState = useStore((state) => state);
  const [show, setShow] = useState(false);
  const shareRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    shareRef.current.select();
    document.execCommand('copy');
  };

  return (
    <Modal
      closeOnDimmerClick
      onClose={() => setShow(false)}
      open={show}
      trigger={
        icon ? (
          <Button
            icon="share"
            circular
            className={styles.iconButton}
            color="blue"
            data-testid="share-encounters"
            disabled={disabled}
            onClick={() => setShow(true)}
          />
        ) : (
          <Button
            color="blue"
            disabled={disabled}
            data-testid="share-encounters"
            inverted={appState.darkMode}
            onClick={() => setShow(true)}
          >
            SHARE
            <Icon name="share" />
          </Button>
        )
      }
    >
      <Modal.Header>Share</Modal.Header>
      <Modal.Content
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          gap: '5px',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <textarea defaultValue={text} ref={shareRef} rows={5} />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleCopy}>Copy</Button>
        <Button onClick={() => setShow(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Share;
