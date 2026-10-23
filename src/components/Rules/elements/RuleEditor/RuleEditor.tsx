import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GENERATIONS, TYPE_COUNT } from 'constants/constant';
import type { TRule, TRuleContent } from 'constants/types';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { BUTTON_ICON, PencilIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';

interface RuleEditorProps {
  content: TRuleContent;
  index: number;
  type: TRule;
}

function RuleEditor({ content, index, type }: RuleEditorProps): React.JSX.Element {
  const { t } = useTranslation('rules');
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
          <MultiSelect
            aria-label={t('allow_only_types')}
            data-testid="edit-rule-type"
            onChange={setTypes}
            options={Object.keys(TYPE_COUNT).map((key) => {
              return { text: key, value: key };
            })}
            placeholder={t('please_type')}
            value={types as string[]}
          />
        );
      case 'LEVEL':
        return (
          <Input
            aria-label={t('max_level_allowed')}
            data-testid="edit-rule-level-input"
            fluid
            max={100}
            onChange={(e) => setLevel(e.target.value)}
            placeholder={t('please_max')}
            type="number"
            value={level as string}
          />
        );
      case 'GENERATION':
        return (
          <MultiSelect
            aria-label={t('allow_only_generations')}
            data-testid="edit-rule-generation"
            onChange={setGens}
            options={GENERATIONS.map((gen) => {
              return { text: String(gen), value: gen };
            })}
            placeholder={t('please_generation')}
            value={gens as number[]}
          />
        );
      default:
        return (
          <Input
            aria-label={t('rule_description')}
            data-testid="edit-rule-input"
            maxLength={500}
            onChange={(e) => setRuleText(e.target.value)}
            value={ruleText as string}
          />
        );
    }
  };

  return (
    <>
      <Button
        aria-label="edit rule"
        data-testid={`edit-rule-${index}`}
        onClick={handleEditModal}
        size="compact-icon"
        type="button"
        variant="basic"
      >
        <PencilIcon className={BUTTON_ICON} />
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) handleEditClose();
        }}
      >
        <DialogContent>
          <DialogTitle className="sr-only">{t('rule_description')}</DialogTitle>
          <DialogBody className="flex flex-col flex-nowrap gap-(--spacing-1)">
            {getInput()}
          </DialogBody>
          <DialogFooter>
            <Button onClick={handleEditClose} variant="secondary">
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button onClick={handleEditRule} variant="primary">
              {t('save', { ns: 'common' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RuleEditor;
