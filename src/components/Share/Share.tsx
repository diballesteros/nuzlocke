import { useRef, useState } from 'react';
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

function Share({ disabled, icon = false, text }: ShareProps): JSX.Element {
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
        success: 'Sharing now available!',
        error: 'Unable to share',
      });
    } catch (err) {
      toast.error('Unable to share');
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
        <Button onClick={() => setShow(false)}>Close</Button>
        <Button onClick={handleCopy} primary>
          Copy
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default Share;
