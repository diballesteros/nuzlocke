import React, { useCallback, useState } from 'react';
import { Button, Confirm, Dropdown, DropdownProps, Icon, Input, Modal } from 'semantic-ui-react';
import useStore from 'store';
import { TRule } from 'constants/types';
import { Share } from 'components';
import styles from './Rules.module.scss';

const Rules: React.FC = () => {
  const rules = useStore(useCallback((state) => state.rules, []));
  const reorderRule = useStore(useCallback((state) => state.reorderRule, []));
  const addRule = useStore(useCallback((state) => state.addRule, []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const selectedRuleset = useStore(useCallback((state) => state.selectedRuleset, []));
  const rulesets = useStore(useCallback((state) => state.rulesets, []));
  const changeRuleset = useStore(useCallback((state) => state.changeRuleset, []));
  const addRuleset = useStore(useCallback((state) => state.addRuleset, []));
  const deleteRuleset = useStore(useCallback((state) => state.deleteRuleset, []));
  const deleteRule = useStore(useCallback((state) => state.deleteRule, []));
  const [ruleText, setRuleText] = useState('');
  const [rulesetName, setRulesetName] = useState('');
  const [open, setOpen] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleReorder = (rule: TRule, i: number, up: boolean) => {
    if (up) {
      reorderRule(i - 1, rule, i);
    } else {
      reorderRule(i + 1, rule, i);
    }
  };

  const handleAdd = () => {
    addRule(ruleText);
    setOpen(false);
    setRuleText('');
  };

  const handleClose = () => {
    setOpen(false);
    setRuleText('');
  };

  const handleRuleset = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    changeRuleset(data.value as string);
  };

  const handleAddRuleset = () => {
    addRuleset(rulesetName);
    setAddModal(false);
    setRulesetName('');
  };

  const handleCloseRulesetModal = () => {
    setAddModal(false);
    setRulesetName('');
  };

  const handleDeleteRuleset = () => {
    deleteRuleset();
    setConfirm(false);
  };

  return (
    <>
      <div className={styles.options}>
        <Share
          disabled={!selectedRuleset}
          text={
            selectedRuleset
              ? rules[selectedRuleset]?.reduce(
                  (str, rule, i) => {
                    return `${str}
      ${i + 1}. - ${rule.content || 'N/A'}`;
                  },
                  `Ruleset
        `
                )
              : ''
          }
        />
        <Modal
          open={open}
          trigger={
            <Button
              className={styles.buttonLarge}
              color="green"
              data-testid="add-rule"
              disabled={!selectedRuleset}
              inverted={darkMode}
              onClick={() => setOpen(true)}
              type="button"
            >
              ADD RULE
              <Icon name="plus" />
            </Button>
          }
        >
          <Modal.Header>Add Rule</Modal.Header>
          <Modal.Content style={{ display: 'flex', flexFlow: 'column nowrap', gap: '5px' }}>
            Please enter the rule description
            <Input
              data-testid="add-rule-input"
              onChange={(e, data) => setRuleText(data.value)}
              value={ruleText}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button disabled={ruleText?.length === 0} onClick={handleAdd}>
              Save
            </Button>
          </Modal.Actions>
        </Modal>
        <Dropdown
          aria-label="rules"
          className={styles.ruleSelect}
          data-testid="rule-select"
          inline
          lazyLoad
          onChange={handleRuleset}
          options={rulesets}
          placeholder="Choose a ruleset"
          selection
          value={selectedRuleset}
        />
        <Modal
          open={addModal}
          trigger={
            <Button
              aria-label="addruleset"
              className={styles.button}
              data-testid="add-ruleset"
              icon
              inverted={darkMode}
              onClick={() => setAddModal(true)}
              style={{ boxShadow: 'none' }}
              type="button"
            >
              <Icon name="plus" />
            </Button>
          }
        >
          <Modal.Header>Add Ruleset</Modal.Header>
          <Modal.Content style={{ display: 'flex', flexFlow: 'column nowrap', gap: '5px' }}>
            Please enter the ruleset name
            <Input
              data-testid="add-ruleset-input"
              onChange={(e, data) => setRulesetName(data.value)}
              value={rulesetName}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleCloseRulesetModal}>Cancel</Button>
            <Button disabled={rulesetName?.length === 0} onClick={handleAddRuleset}>
              Save
            </Button>
          </Modal.Actions>
        </Modal>
        {!!selectedRuleset && selectedRuleset !== '1' && selectedRuleset !== '2' && (
          <Button
            aria-label="deleteruleset"
            className={styles.button}
            color="red"
            data-testid="delete-ruleset"
            icon
            inverted={darkMode}
            onClick={() => setConfirm(true)}
            style={{ boxShadow: 'none' }}
            type="button"
          >
            <Icon name="trash" />
          </Button>
        )}
        <Confirm
          content="This will delete the custom ruleset. Are you sure?"
          onCancel={() => setConfirm(false)}
          onConfirm={handleDeleteRuleset}
          open={confirm}
        />
      </div>
      <div className={styles.rules} data-testid="ruleslist">
        {rules[selectedRuleset].map((rule, i) => {
          return (
            <div className={styles.rule} key={`rule-${i + 1}`}>
              <div className={styles.dnd}>
                {i !== 0 && (
                  <Button
                    data-testid={`arrow-up-${i}`}
                    icon
                    inverted={darkMode}
                    onClick={() => handleReorder(rule, i, true)}
                    type="button"
                  >
                    <Icon name="arrow up" />
                  </Button>
                )}
                {i < rules[selectedRuleset]?.length - 1 && (
                  <Button
                    data-testid={`arrow-down-${i}`}
                    icon
                    inverted={darkMode}
                    onClick={() => handleReorder(rule, i, false)}
                    type="button"
                  >
                    <Icon name="arrow down" />
                  </Button>
                )}
              </div>
              <span className={styles.number}>{`${i + 1}.`}</span>
              <p>{rule.content}</p>
              <Button
                aria-label="delete rule"
                basic
                className={styles.delete}
                compact
                icon
                inverted={darkMode}
                onClick={() => deleteRule(i)}
                type="button"
              >
                <Icon name="trash" />
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Rules;
