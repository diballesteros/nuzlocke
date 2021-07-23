import React, { useState } from 'react';
import { Modal, Dropdown, Button } from 'semantic-ui-react';

const Contact: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      closeOnDimmerClick
      open={open}
      trigger={<Dropdown.Item icon="bug" onClick={() => setOpen(true)} text="Report" />}
    >
      <Modal.Header>Report a bug or suggest a feature</Modal.Header>
      <Modal.Content
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          gap: '5px',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <form
          name="contact"
          method="post"
          style={{ display: 'flex', flexFlow: 'column nowrap', gap: '7px' }}
        >
          <input type="hidden" name="form-name" value="contact" />
          <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
            Type:
            <select name="type">
              <option value="bug">Bug</option>
              <option value="bug">Suggestion</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
            Device:
            <select name="device">
              <option value="Desktop">Desktop</option>
              <option value="Mobile">Mobile</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
            Description:
            <textarea name="description" />
          </label>
          <button style={{ width: '80px' }} type="submit">
            Send
          </button>
        </form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Contact;
