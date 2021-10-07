import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { Share } from 'components';
import { AddRule, RuleContent, RuleEditor } from 'components/Rules/elements';
import { DEFAULT_RULESET_NAMES, getRuleContent } from 'constants/constant';
import { TRuleEntry } from 'constants/types';
import useStore from 'store';
import styles from './Rules.module.scss';

const Rules: React.FC = () => {
  const rules = useStore(useCallback((state) => state.rules, []));
  const reorderRule = useStore(useCallback((state) => state.reorderRule, []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const selectedRuleset = useStore(useCallback((state) => state.selectedRuleset, []));
  const changeRuleset = useStore(useCallback((state) => state.changeRuleset, []));
  const addRuleset = useStore(useCallback((state) => state.addRuleset, []));
  const deleteRuleset = useStore(useCallback((state) => state.deleteRuleset, []));
  const deleteRule = useStore(useCallback((state) => state.deleteRule, []));
  const [rulesetName, setRulesetName] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleReorder = (rule: TRuleEntry, i: number, up: boolean) => {
    if (up) {
      reorderRule(i - 1, rule, i);
    } else {
      reorderRule(i + 1, rule, i);
    }
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
    toast.success('Succesfully deleted ruleset');
  };

  return (
    <div className={styles.container}>
      <div className={styles.options}>
        {!!selectedRuleset && (
          <Share
            disabled={!selectedRuleset}
            text={rules[selectedRuleset]?.reduce(
              (str, rule, i) => {
                return `${str}
      ${i + 1}. ${getRuleContent(rule.content, rule.type) || 'N/A'}`;
              },
              `Ruleset
        `
            )}
          />
        )}
        <AddRule />
        <Dropdown
          aria-label="rules"
          className={styles.ruleSelect}
          data-testid="rule-select"
          inline
          lazyLoad
          onChange={handleRuleset}
          options={Object.keys(rules).map((key) => {
            return { key, text: key, value: key };
          })}
          placeholder="Choose a ruleset"
          selection
          value={selectedRuleset}
        />
        <Modal
          closeOnDimmerClick
          onClose={handleCloseRulesetModal}
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
            {!!rules[rulesetName] && (
              <span style={{ color: 'red' }}>Ruleset with this name already exists</span>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleCloseRulesetModal}>Cancel</Button>
            <Button
              disabled={rulesetName?.length === 0 || !!rules[rulesetName]}
              onClick={handleAddRuleset}
            >
              Save
            </Button>
          </Modal.Actions>
        </Modal>
        {!!selectedRuleset && !DEFAULT_RULESET_NAMES.includes(selectedRuleset) && (
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
          closeOnDimmerClick
          content="This will delete the custom ruleset. Are you sure?"
          onCancel={() => setConfirm(false)}
          onConfirm={handleDeleteRuleset}
          open={confirm}
        />
      </div>
      <div className={styles.rules} data-testid="ruleslist">
        {rules[selectedRuleset]?.map((rule, i) => {
          return (
            <div className={styles.rule} key={`rule-${i + 1}`}>
              <div className={styles.reorder}>
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
              <RuleContent i={i} rule={rule} />
              <div className={styles.buttons}>
                {!rule.default && (
                  <>
                    <Button
                      aria-label="delete rule"
                      basic
                      compact
                      data-testid={`delete-rule-${i}`}
                      icon
                      inverted={darkMode}
                      onClick={() => deleteRule(i)}
                      type="button"
                    >
                      <Icon name="trash" />
                    </Button>
                    <RuleEditor content={rule.content} index={i} type={rule.type} />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rules;
