import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Share } from 'components';
import { AddRule, RuleContent, RuleEditor } from 'components/Rules/elements';
import { DEFAULT_RULESET_NAMES, getRuleContent } from 'constants/constant';
import type { TRuleEntry } from 'constants/types';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BUTTON_ICON,
  PlusIcon,
  TrashIcon,
} from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

// The toolbar's buttons share its width, up to 12rem each (any width on narrow screens). Share is
// still a Semantic button, so its icon's margins need !
const TOOLBAR =
  'flex flex-row flex-wrap items-center justify-end gap-(--spacing-2) mb-(--spacing-2) [&>button]:max-h-[2.571rem] [&>button]:max-w-[12rem] [&>button]:flex-1 [&>button]:whitespace-nowrap max-[45rem]:[&>button]:max-w-none [&>button>i]:mr-0! [&>button>i]:ml-(--spacing-1)!';

function Rules(): React.JSX.Element {
  const { t } = useTranslation('rules');
  const rules = useStore(useCallback((state) => state.rules, []));
  const reorderRule = useStore(useCallback((state) => state.reorderRule, []));
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
    toast.success(t('delete_ruleset_success'));
  };

  return (
    <div className="flex h-[calc(100%-var(--spacing-3))] flex-col flex-nowrap p-(--spacing-3)">
      <div className={TOOLBAR}>
        {!!selectedRuleset && (
          <Share
            disabled={!selectedRuleset}
            text={rules[selectedRuleset]?.reduce(
              (str, rule, i) => {
                return `${str}
      ${Number(i) + 1}. ${getRuleContent(rule.content, rule.type) || 'N/A'}`;
              },
              `Ruleset
        `
            )}
          />
        )}
        <AddRule />
        <Select
          aria-label="rules"
          className="flex-1"
          contained
          data-testid="rule-select"
          inline
          onChange={changeRuleset}
          options={Object.keys(rules).map((key) => {
            return { text: key, value: key };
          })}
          placeholder={t('choose_ruleset')}
          value={selectedRuleset}
        />
        <Button
          aria-label="addruleset"
          className="flex-initial!"
          data-testid="add-ruleset"
          onClick={() => setAddModal(true)}
          size="icon"
          type="button"
        >
          <PlusIcon className={BUTTON_ICON} />
        </Button>
        <Dialog
          open={addModal}
          onOpenChange={(open) => {
            if (!open) handleCloseRulesetModal();
          }}
        >
          <DialogContent>
            <DialogTitle className="sr-only">{t('please_ruleset')}</DialogTitle>
            <DialogBody className="flex flex-col flex-nowrap gap-(--spacing-1)">
              {t('please_ruleset')}
              <Input
                aria-label={t('please_ruleset')}
                data-testid="add-ruleset-input"
                maxLength={50}
                onChange={(e) => setRulesetName(e.target.value)}
                value={rulesetName}
              />
              {!!rules[rulesetName] && <span style={{ color: 'red' }}>{t('ruleset_already')}</span>}
            </DialogBody>
            <DialogFooter>
              <Button onClick={handleCloseRulesetModal} variant="secondary">
                {t('cancel', { ns: 'common' })}
              </Button>
              <Button
                disabled={rulesetName?.length === 0 || !!rules[rulesetName]}
                onClick={handleAddRuleset}
                variant="primary"
              >
                {t('save', { ns: 'common' })}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {!!selectedRuleset && !DEFAULT_RULESET_NAMES.includes(selectedRuleset) && (
          <Button
            aria-label="deleteruleset"
            className="flex-initial!"
            data-testid="delete-ruleset"
            onClick={() => setConfirm(true)}
            size="icon"
            type="button"
            variant="red"
          >
            <TrashIcon className={BUTTON_ICON} />
          </Button>
        )}
        <Dialog open={confirm} onOpenChange={setConfirm}>
          <DialogContent size="small">
            <DialogTitle className="sr-only">{t('confirm_deletion')}</DialogTitle>
            <DialogBody>{t('confirm_deletion')}</DialogBody>
            <DialogFooter>
              <Button onClick={() => setConfirm(false)} variant="secondary">
                {t('cancel', { ns: 'common' })}
              </Button>
              <Button onClick={handleDeleteRuleset} variant="primary">
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div
        className="flex flex-1 flex-col flex-nowrap gap-(--spacing-3) overflow-auto"
        data-testid="ruleslist"
      >
        {rules[selectedRuleset]?.map((rule, i) => {
          return (
            <div
              className="relative flex flex-row flex-nowrap gap-(--spacing-3) rounded-[4px] bg-card p-(--spacing-3) text-foreground shadow-[0_3px_6px_rgba(0,0,0,0.16),0_3px_6px_rgba(0,0,0,0.23)] transition-all duration-500"
              key={`rule-${Number(i) + 1}`}
            >
              <div className="flex flex-col flex-nowrap gap-(--spacing-2)">
                {i !== 0 && (
                  <Button
                    aria-label={t('move_up')}
                    className="p-(--spacing-2)"
                    data-testid={`arrow-up-${i}`}
                    onClick={() => handleReorder(rule, i, true)}
                    size="icon"
                    type="button"
                  >
                    <ArrowUpIcon className={BUTTON_ICON} />
                  </Button>
                )}
                {i < (rules[selectedRuleset]?.length ?? 0) - 1 && (
                  <Button
                    aria-label={t('move_down')}
                    className="p-(--spacing-2)"
                    data-testid={`arrow-down-${i}`}
                    onClick={() => handleReorder(rule, i, false)}
                    size="icon"
                    type="button"
                  >
                    <ArrowDownIcon className={BUTTON_ICON} />
                  </Button>
                )}
              </div>
              <RuleContent i={i} rule={rule} />
              <div className="ml-auto flex flex-col flex-nowrap gap-(--spacing-2)">
                {!rule.default && (
                  <>
                    <Button
                      aria-label="delete rule"
                      data-testid={`delete-rule-${i}`}
                      onClick={() => deleteRule(i)}
                      size="compact-icon"
                      type="button"
                      variant="basic"
                    >
                      <TrashIcon className={BUTTON_ICON} />
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
}

export default Rules;
