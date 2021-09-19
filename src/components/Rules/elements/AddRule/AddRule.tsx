import React, { ReactText, useCallback, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import useStore from 'store';
import { GENERATIONS, TYPE_COUNT } from 'constants/constant';
import styles from './AddRule.module.scss';

const AddRule: React.FC = () => {
  const addRule = useStore(useCallback((state) => state.addRule, []));
  const rules = useStore(useCallback((state) => state.rules, []));
  const selectedRuleset = useStore(useCallback((state) => state.selectedRuleset, []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const [open, setOpen] = useState(false);
  const [ruleText, setRuleText] = useState('');
  const [level, setLevel] = useState('');
  const [types, setTypes] = useState([]);
  const [gens, setGens] = useState([]);
  const [tab, setTab] = useState(0);
  const containsType = rules[selectedRuleset]?.some((rule) => rule.type === 'TYPE');
  const containsGen = rules[selectedRuleset]?.some((rule) => rule.type === 'GENERATION');
  const containsLevel = rules[selectedRuleset]?.some((rule) => rule.type === 'LEVEL');

  const panes = [
    {
      menuItem: 'Text',
      render: () => (
        <Tab.Pane>
          Rule Description:
          <Input
            data-testid="add-rule-input"
            fluid
            onChange={(e, data) => setRuleText(data.value)}
            placeholder="Please enter the rule description"
            value={ruleText}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Type',
      render: () => (
        <Tab.Pane>
          Allow only these types:
          <Dropdown
            data-testid="add-rule-type"
            disabled={!!containsType}
            fluid
            multiple
            onChange={(e, data) => setTypes([...(data.value as string[])])}
            options={Object.keys(TYPE_COUNT).map((key) => {
              return { key, text: key, value: key };
            })}
            placeholder="Please select a type..."
            selection
            value={types}
          />
          {!!containsType && <span style={{ color: 'red' }}>Type rule already exists</span>}
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Generation',
      render: () => (
        <Tab.Pane>
          Allow only these generations:
          <Dropdown
            data-testid="add-rule-generation"
            fluid
            disabled={!!containsGen}
            multiple
            onChange={(e, data) => setGens([...(data.value as number[])])}
            options={GENERATIONS.map((gen) => {
              return { key: gen, text: gen, value: gen };
            })}
            placeholder="Please select a generation..."
            selection
            value={gens}
          />
          {!!containsGen && <span style={{ color: 'red' }}>Generation rule already exists</span>}
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Level',
      render: () => (
        <Tab.Pane>
          Maximum level allowed:
          <Input
            data-testid="add-rule-level-input"
            disabled={!!containsLevel}
            fluid
            onChange={(e, data) => setLevel(data.value)}
            placeholder="Please enter maximum level"
            type="number"
            value={level}
          />
          {!!containsLevel && <span style={{ color: 'red' }}>Level rule already exists</span>}
        </Tab.Pane>
      ),
    },
  ];

  const handleClose = () => {
    setOpen(false);
    setRuleText('');
  };

  const handleAdd = () => {
    switch (tab) {
      case 1:
        addRule({ content: types, default: false, type: 'TYPE' });
        break;
      case 2:
        addRule({ content: gens, default: false, type: 'GENERATION' });
        break;
      case 3:
        addRule({ content: level, default: false, type: 'LEVEL' });
        break;
      case 0:
      default:
        addRule({ content: ruleText, default: false, type: 'TEXT' });
        break;
    }
    setOpen(false);
    setRuleText('');
    setLevel('');
    setTypes([]);
    setGens([]);
  };

  const handleTabChange = (newIndex: ReactText) => {
    setTab(Number(newIndex));
  };

  const getDisabled = () => {
    switch (tab) {
      case 0:
        return ruleText?.length === 0;
      case 1:
        return types?.length === 0 || containsType;
      case 2:
        return gens?.length === 0 || containsGen;
      case 3:
        return !level || containsLevel;
      default:
        return true;
    }
  };

  return (
    <Modal
      className={styles.addRule}
      open={open}
      trigger={
        <Button
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
        <Tab
          activeIndex={tab}
          className={styles.tabs}
          onTabChange={(e, data) => handleTabChange(data.activeIndex)}
          panes={panes}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={getDisabled()} onClick={handleAdd}>
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default AddRule;
