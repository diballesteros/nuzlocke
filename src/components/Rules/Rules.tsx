import React, { useCallback, useState } from 'react';
import { Button, Dropdown, Icon, Input, Modal } from 'semantic-ui-react';
import useStore from 'store';
import { TRule } from 'constants/types';
import styles from './Rules.module.scss';

const Rules: React.FC = () => {
  const rules = useStore(useCallback((state) => state.rules, []));
  const reorderRule = useStore(useCallback((state) => state.reorderRule, []));
  const addRule = useStore(useCallback((state) => state.addRule, []));
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

  return (
    <>
      <div className={styles.options}>
        <Button className={styles.buttonLarge} color="blue" data-testid="share-rules" type="button">
          SHARE
          <Icon name="share" />
        </Button>
        <Modal
          open={open}
          trigger={
            <Button
              className={styles.buttonLarge}
              color="green"
              data-testid="add-rule"
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
          onChange={null}
          options={[]}
          placeholder="Choose a ruleset"
          selection
        />
        <Button
          aria-label="addrule"
          className={styles.button}
          data-testid="add-rule"
          icon
          onClick={null}
          style={{ boxShadow: 'none' }}
          type="button"
        >
          <Icon name="plus" />
        </Button>
      </div>
      <div className={styles.rules}>
        {rules.map((rule, i) => {
          return (
            <div className={styles.rule}>
              <div className={styles.dnd}>
                {i !== 0 && (
                  <Button icon onClick={() => handleReorder(rule, i, true)} type="button">
                    <Icon name="arrow up" />
                  </Button>
                )}
                {i < rules.length - 1 && (
                  <Button icon onClick={() => handleReorder(rule, i, false)} type="button">
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
