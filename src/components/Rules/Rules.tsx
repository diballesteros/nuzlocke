import React, { useCallback, useState } from 'react';
import { Button, Dropdown, DropdownProps, Icon, Input, Modal } from 'semantic-ui-react';
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
  const [ruleText, setRuleText] = useState('');
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <div className={styles.options}>
        <Share
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
              data-testid="add-encounter-input"
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
        <Button
          aria-label="addruleset"
          className={styles.button}
          data-testid="add-ruleset"
          icon
          inverted={darkMode}
          onClick={null}
          style={{ boxShadow: 'none' }}
          type="button"
        >
          <Icon name="plus" />
        </Button>
        {selectedRuleset !== '1' && selectedRuleset !== '2' && (
          <Button
            aria-label="deleteruleset"
            className={styles.button}
            color="red"
            data-testid="delete-ruleset"
            icon
            inverted={darkMode}
            onClick={null}
            style={{ boxShadow: 'none' }}
            type="button"
          >
            <Icon name="trash" />
          </Button>
        )}
      </div>
      <div className={styles.rules}>
        {rules[selectedRuleset].map((rule, i) => {
          return (
            <div className={styles.rule} key={`rule-${i + 1}`}>
              <div className={styles.dnd}>
                {i !== 0 && (
                  <Button
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
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Rules;
