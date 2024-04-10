import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { GENERATIONS, TYPE_COUNT } from 'constants/constant';
import type { TRule, TRuleContent } from 'constants/types';
import useStore from 'store';
import modalStyles from 'assets/styles/Modal.module.scss';

interface RuleEditorProps {
  content: TRuleContent;
  index: number;
  type: TRule;
}

function RuleEditor({ content, index, type }: RuleEditorProps): React.JSX.Element {
  const { t } = useTranslation('rules');
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const editRule = useStore(useCallback((state) => state.editRule, []));
  const [open, setOpen] = useState(false);
  const [ruleText, setRuleText] = useState(content);
  const [level, setLevel] = useState(content);
  const [types, setTypes] = useState(content);
  const [gens, setGens] = useState<TRuleContent>(content);

  const handleEditModal = () => {
    setRuleText(content);
    setOpen(true);
  };

  const handleEditRule = () => {
    switch (type) {
      case 'GENERATION':
        editRule(gens, index);
        break;
      case 'LEVEL':
        editRule(level, index);
        break;
      case 'TYPE':
        editRule(types, index);
        break;
      default:
        editRule(ruleText, index);
        break;
    }
    setOpen(false);
  };

  const handleEditClose = () => {
    setRuleText(content);
    setLevel(content);
    setTypes(content);
    setGens(content);
    setOpen(false);
  };

  const getInput = () => {
    switch (type) {
      case 'TYPE':
        return (
          <Dropdown
            data-testid="edit-rule-type"
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
        );
      case 'LEVEL':
        return (
          <Input
            data-testid="edit-rule-level-input"
            fluid
            max={100}
            onChange={(e, data) => setLevel(data.value)}
            placeholder={t('please_max')}
            type="number"
            value={level}
          />
        );
      case 'GENERATION':
        return (
          <Dropdown
            data-testid="edit-rule-generation"
            fluid
            multiple
            onChange={(e, data) => setGens([...(data.value as number[])])}
            options={GENERATIONS.map((gen) => {
              return { key: gen, text: gen, value: gen };
            })}
            placeholder={t('please_generation')}
            selection
            value={gens}
          />
        );
      default:
        return (
          <Input
            data-testid="edit-rule-input"
            maxLength={500}
            onChange={(e, data) => setRuleText(data.value)}
            value={ruleText}
          />
        );
    }
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
      <Modal.Content className={modalStyles.modal}>{getInput()}</Modal.Content>
      <Modal.Actions>
        <Button onClick={handleEditClose}>{t('cancel', { ns: 'common' })}</Button>
        <Button disabled={false} onClick={handleEditRule} primary>
          {t('save', { ns: 'common' })}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default RuleEditor;
