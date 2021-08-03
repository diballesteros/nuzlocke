import React, { useCallback, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import useStore from 'store';

interface RuleEditorProps {
  content: string;
  index: number;
}

const RuleEditor: React.FC<RuleEditorProps> = ({ content, index }) => {
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const editRule = useStore(useCallback((state) => state.editRule, []));
  const [open, setOpen] = useState(false);
  const [ruleText, setRuleText] = useState('');

  const handleEditModal = () => {
    setRuleText(content);
    setOpen(true);
  };

  const handleEditRule = () => {
    editRule(ruleText, index);
    setOpen(false);
  };

  const handleEditClose = () => {
    setRuleText('');
    setOpen(false);
  };

  return (
    <Modal
      closeOnDimmerClick
      onClose={handleEditClose}
      open={open}
      trigger={
        <Button
          aria-label="edit rule"
          basic
          compact
          data-testid={`edit-rule-${index}`}
          icon
          inverted={darkMode}
          onClick={handleEditModal}
          type="button"
        >
          <Icon name="pencil" />
        </Button>
      }
    >
      <Modal.Header>Edit Rule</Modal.Header>
      <Modal.Content style={{ display: 'flex', flexFlow: 'column nowrap', gap: '5px' }}>
        Edit the rule description
        <Input
          data-testid="edit-rule-input"
          onChange={(e, data) => setRuleText(data.value)}
          value={ruleText}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleEditClose}>Cancel</Button>
        <Button disabled={ruleText?.length === 0} onClick={handleEditRule}>
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default RuleEditor;
