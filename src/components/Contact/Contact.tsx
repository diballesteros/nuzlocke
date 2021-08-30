import React, { useState } from 'react';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';

const Contact: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      closeOnDimmerClick
      onClose={() => setOpen(false)}
      open={open}
      trigger={
        <Menu.Item onClick={() => setOpen(true)}>
          Report
          <Icon name="bug" />
        </Menu.Item>
      }
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
            <select name="type" data-testid="report-type">
              <option value="bug">Bug</option>
              <option value="suggestion">Suggestion</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
            Device:
            <select name="device" data-testid="report-device">
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
            OS:
            <select name="os" data-testid="report-os">
              <option value="windows">Windows</option>
              <option value="mac">MAC</option>
              <option value="linux">Linux</option>
              <option value="ios">iOS</option>
              <option value="android">Android</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
            Browser:
            <select name="browser" data-testid="report-browser">
              <option value="googlechrome">Google Chrome</option>
              <option value="firefox">Firefox</option>
              <option value="edge">Edge</option>
              <option value="safari">Safari</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
            Selected Game:
            <input name="selectedgame" data-testid="report-selectedgame" type="text" />
          </label>
          <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
            Description:
            <textarea name="description" data-testid="report-description" />
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
