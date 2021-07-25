import React, { useRef, useState } from 'react';
import { Button, Dropdown, Modal } from 'semantic-ui-react';
import useStore from 'store';

const Share: React.FC = () => {
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
      trigger={<Dropdown.Item icon="share" onClick={() => setShow(true)} text="Share" />}
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
        <textarea
          defaultValue={appState?.games[appState?.selectedGame?.value]?.encounters?.reduce(
            (str, enc) => {
              return `${str}
      ${enc.location} - ${enc.pokemon?.text || 'N/A'} - ${enc.status?.text || 'N/A'}`;
            },
            `Nuzlocke Encounter List
        `
          )}
          ref={shareRef}
          rows={5}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleCopy}>Copy</Button>
        <Button onClick={() => setShow(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Share;
