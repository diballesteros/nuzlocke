import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
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
  const [show, setShow] = useState(false);
  const shareRef = useRef<HTMLTextAreaElement>(null);
  const appState = useStore((state) => state);

  const handleCopy = () => {
    shareRef.current.select();
    document.execCommand('copy');
  };

  const handleShare = async (data: ShareData) => {
    try {
      await navigator.share(data);
      toast.promise(navigator.share(data), {
        pending: 'Validating sharing options',
        success: 'Share the image!',
        error: 'Unable to share image',
      });
    } catch (err) {
      toast.error('Unable to share image');
    }
  };

  const handleClick = () => {
    const data = { title: 'Nuzlocke', text };
    if ('share' in navigator && 'canShare' in navigator && navigator.canShare(data)) {
      handleShare(data);
    } else {
      setShow(true);
    }
  };

  return (
    <Modal
      closeOnDimmerClick
      onClose={() => setShow(false)}
      open={show}
      trigger={
        icon ? (
          <Button
            circular
            className={styles.iconButton}
            color="blue"
            data-testid="share-encounters"
            disabled={disabled}
            icon="share"
            onClick={handleClick}
          />
        ) : (
          <Button
            color="blue"
            data-testid="share-encounters"
            disabled={disabled}
            inverted={appState.darkMode}
            onClick={handleClick}
          >
            SHARE
            <Icon name="share" />
          </Button>
        )
      }
    >
      <Modal.Content
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          gap: '5px',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <textarea data-testid="share-textarea" defaultValue={text} ref={shareRef} rows={5} />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleCopy}>Copy</Button>
        <Button onClick={() => setShow(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Share;
