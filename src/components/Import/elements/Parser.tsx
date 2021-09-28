import React from 'react';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import styles from './Parser.module.scss';

interface ParserProps {
  open: boolean;
}

const Parser: React.FC<ParserProps> = ({ open }) => {
  return (
    <Modal open={open}>
      <Modal.Content>Test</Modal.Content>
      <Modal.Actions>Test</Modal.Actions>
    </Modal>
  );
};

export default Parser;
