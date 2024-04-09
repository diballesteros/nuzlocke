import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import { GENERATIONS, TYPE_COUNT } from 'constants/constant';
import useStore from 'store';
import modalStyles from 'assets/styles/Modal.module.scss';
import styles from './AddRule.module.scss';

function AddRule(): React.JSX.Element {
  const { t } = useTranslation('rules');
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
      menuItem: t('text'),
      render: () => (
        <Tab.Pane>
          {t('rule_description')}:
          <Input
            data-testid="add-rule-input"
            maxLength={500}
            fluid
            onChange={(e, data) => setRuleText(data.value)}
            placeholder={t('please_rule')}
            value={ruleText}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: t('type'),
      render: () => (
        <Tab.Pane>
          {t('allow_only_types')}:
          <Dropdown
            data-testid="add-rule-type"
            disabled={!!containsType}
            fluid
            multiple
            onChange={(e, data) => setTypes([...(data.value as string[])])}
            options={Object.keys(TYPE_COUNT).map((key) => {
              return { key, text: key, value: key };
            })}
            placeholder={t('please_type')}
            selection
            value={types}
          />
          {!!containsType && (
            <span style={{ color: 'red' }}>{t('already_exists', { rule: t('type') })}</span>
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: t('generation'),
      render: () => (
        <Tab.Pane>
          {t('allow_only_generations')}:
          <Dropdown
            data-testid="add-rule-generation"
            fluid
            disabled={!!containsGen}
            multiple
            onChange={(e, data) => setGens([...(data.value as number[])])}
            options={GENERATIONS.map((gen) => {
              return { key: gen, text: gen, value: gen };
            })}
            placeholder={t('please_generation')}
            selection
            value={gens}
          />
          {!!containsGen && (
            <span style={{ color: 'red' }}>{t('already_exists', { rule: t('generation') })}</span>
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: t('level'),
      render: () => (
        <Tab.Pane>
          {t('max_level_allowed')}:
          <Input
            data-testid="add-rule-level-input"
            disabled={!!containsLevel}
            fluid
            max={100}
            onChange={(e, data) => setLevel(data.value)}
            placeholder={t('please_max')}
            type="number"
            value={level}
          />
          {!!containsLevel && (
            <span style={{ color: 'red' }}>{t('already_exists', { rule: t('level') })}</span>
          )}
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

  const handleTabChange = (newIndex: string | number) => {
    setTab(Number(newIndex));
  };

  const getDisabled = () => {
    switch (tab) {
      case 1:
        return types?.length === 0 || containsType;
      case 2:
        return gens?.length === 0 || containsGen;
      case 3:
        return !level || containsLevel;
      case 0:
      default:
        return ruleText?.length === 0;
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
          {t('add_rule')}
          <Icon name="plus" />
        </Button>
      }
    >
      <Modal.Content className={modalStyles.modal}>
        <Tab
          activeIndex={tab}
          className={styles.tabs}
          onTabChange={(e, data) => handleTabChange(data.activeIndex)}
          panes={panes}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>{t('cancel', { ns: 'common' })}</Button>
        <Button disabled={getDisabled()} onClick={handleAdd} primary>
          {t('save', { ns: 'common' })}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default AddRule;
