import React, { useRef, useState } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';
import useStore from 'store';

interface ShareProps {
  text: string;
}

const Share: React.FC<ShareProps> = ({ text }) => {
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
      open={show}
      trigger={
        <Button
          color="blue"
          data-testid="share-encounters"
          inverted={appState.darkMode}
          onClick={() => setShow(true)}
        >
          SHARE
          <Icon name="share" />
        </Button>
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
