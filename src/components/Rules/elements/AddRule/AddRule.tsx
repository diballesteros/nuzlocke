import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GENERATIONS, TYPE_COUNT } from 'constants/constant';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlusIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function AddRule(): React.JSX.Element {
  const { t } = useTranslation('rules');
  const addRule = useStore(useCallback((state) => state.addRule, []));
  const rules = useStore(useCallback((state) => state.rules, []));
  const selectedRuleset = useStore(useCallback((state) => state.selectedRuleset, []));
  const [open, setOpen] = useState(false);
  const [ruleText, setRuleText] = useState('');
  const [level, setLevel] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [gens, setGens] = useState<number[]>([]);
  const [tab, setTab] = useState(0);
  const containsType = rules[selectedRuleset]?.some((rule) => rule.type === 'TYPE');
  const containsGen = rules[selectedRuleset]?.some((rule) => rule.type === 'GENERATION');
  const containsLevel = rules[selectedRuleset]?.some((rule) => rule.type === 'LEVEL');

  const panes = [
    {
      menuItem: t('text'),
      render: () => (
        <>
          {t('rule_description')}:
          <Input
            aria-label={t('rule_description')}
            data-testid="add-rule-input"
            fluid
            maxLength={500}
            onChange={(e) => setRuleText(e.target.value)}
            placeholder={t('please_rule')}
            value={ruleText}
          />
        </>
      ),
    },
    {
      menuItem: t('type'),
      render: () => (
        <>
          {t('allow_only_types')}:
          <MultiSelect
            aria-label={t('allow_only_types')}
            data-testid="add-rule-type"
            disabled={!!containsType}
            onChange={setTypes}
            options={Object.keys(TYPE_COUNT).map((key) => {
              return { text: key, value: key };
            })}
            placeholder={t('please_type')}
            value={types}
          />
          {!!containsType && (
            <span style={{ color: 'red' }}>{t('already_exists', { rule: t('type') })}</span>
          )}
        </>
      ),
    },
    {
      menuItem: t('generation'),
      render: () => (
        <>
          {t('allow_only_generations')}:
          <MultiSelect
            aria-label={t('allow_only_generations')}
            data-testid="add-rule-generation"
            disabled={!!containsGen}
            onChange={setGens}
            options={GENERATIONS.map((gen) => {
              return { text: String(gen), value: gen };
            })}
            placeholder={t('please_generation')}
            value={gens}
          />
          {!!containsGen && (
            <span style={{ color: 'red' }}>{t('already_exists', { rule: t('generation') })}</span>
          )}
        </>
      ),
    },
    {
      menuItem: t('level'),
      render: () => (
        <>
          {t('max_level_allowed')}:
          <Input
            aria-label={t('max_level_allowed')}
            data-testid="add-rule-level-input"
            disabled={!!containsLevel}
            fluid
            max={100}
            onChange={(e) => setLevel(e.target.value)}
            placeholder={t('please_max')}
            type="number"
            value={level}
          />
          {!!containsLevel && (
            <span style={{ color: 'red' }}>{t('already_exists', { rule: t('level') })}</span>
          )}
        </>
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
    <>
      <Button
        data-testid="add-rule"
        disabled={!selectedRuleset}
        onClick={() => setOpen(true)}
        type="button"
        variant="green"
      >
        {t('add_rule')}
        <PlusIcon className="-my-[0.08em] mr-[-0.03em] ml-[0.336em] size-[1.16em] -translate-y-[0.05em] align-[-0.15em] opacity-80" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dismissible={false}>
          <DialogTitle className="sr-only">{t('add_rule')}</DialogTitle>
          <DialogBody className="flex flex-col flex-nowrap gap-(--spacing-1)">
            <Tabs onValueChange={(value) => setTab(Number(value))} value={String(tab)}>
              <TabsList>
                {panes.map((pane, i) => (
                  <TabsTrigger key={pane.menuItem} value={String(i)}>
                    {pane.menuItem}
                  </TabsTrigger>
                ))}
              </TabsList>
              {panes.map((pane, i) => (
                <TabsContent key={pane.menuItem} value={String(i)}>
                  {pane.render()}
                </TabsContent>
              ))}
            </Tabs>
          </DialogBody>
          <DialogFooter>
            <Button onClick={handleClose} variant="secondary">
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button disabled={getDisabled()} onClick={handleAdd} variant="primary">
              {t('save', { ns: 'common' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddRule;
