import { ChevronDown, EllipsisVertical } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Share } from 'components';
import { AddRule, RuleEditor } from 'components/Rules/elements';
import {
  focusBack,
  ROW_GHOST,
  TOOLBAR_BUTTON,
  TOOLBAR_DANGER,
} from 'components/Tracker/elements/buttons';
import { DEFAULT_RULESET_NAMES, getRuleContent } from 'constants/constant';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowDownIcon, ArrowUpIcon, PencilIcon, PlusIcon, TrashIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// The Rules page (5u): a toolbar with the ruleset Select and its New ruleset (and Delete ruleset
// for a custom one), then Add rule and Share, outlined. The rules are an <ol> of flat rows: the
// number, the text, then the actions in fixed slots (up, down, edit, delete) so a rule with one
// arrow doesn't shift. Below 640px the actions move into a ⋮ menu that lists only the row's own
const ROW =
  'grid grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-x-(--spacing-3) rounded-md border border-solid border-contrast-border bg-card py-(--spacing-2) pr-(--spacing-2) pl-(--spacing-3) text-foreground max-sm:grid-cols-[1.571rem_minmax(0,1fr)_auto] max-sm:gap-x-(--spacing-2)';
const ACTION = cn(ROW_GHOST, 'text-row-muted hover:text-foreground');
// The toolbar's outlined buttons, on the card colour over the grey page
const RULES_TOOL = cn(TOOLBAR_BUTTON, 'bg-card');
// The text sits on the actions' first line: their 32px less its own line
const TEXT_TOP = 'pt-[calc((2.286rem-1.45em)/2)]';

type Editing = { index: number; opening: number; open: boolean; returnFocus?: HTMLElement | null };

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
  const [editing, setEditing] = useState<Editing>({ index: -1, opening: 0, open: false });
  const list = useRef<HTMLOListElement>(null);
  // Rows are keyed by their place, so after a move focus would stay with the neighbour that took
  // the rule's place. It follows the rule instead: to the same arrow (or the other one at an end)
  // from the row's buttons, to its ⋮ from the menu. These lookups and handleDelete's go by test id
  // and DOM position after the re-render; RulesKeyboard.spec.ts fails if the row's markup breaks them
  const movedTo = useRef<number>(null);
  const ruleset = rules[selectedRuleset];
  const takeMovedTo = () => {
    const to = movedTo.current;
    movedTo.current = null;
    return to;
  };

  const move = (i: number, up: boolean) => {
    const to = up ? i - 1 : i + 1;
    reorderRule(to, ruleset[i], i);
    return to;
  };

  const handleArrow = (i: number, up: boolean) => {
    const to = move(i, up);
    setTimeout(() => {
      const button = (direction: string) =>
        list.current?.querySelector<HTMLElement>(`[data-testid="arrow-${direction}-${to}"]`);
      (button(up ? 'up' : 'down') ?? button(up ? 'down' : 'up'))?.focus();
    });
  };

  // After Delete focus goes to the rule that took its place, else the one before (its first action
  // shown: an arrow, or ⋮ on phones), else Add rule
  const handleDelete = (i: number) => {
    deleteRule(i);
    setTimeout(() => {
      const rows = list.current?.children;
      const row = rows?.[i] ?? rows?.[i - 1];
      const action = [...(row?.querySelectorAll<HTMLElement>('button') ?? [])].find(
        (button) => button.offsetParent !== null
      );
      (action ?? document.querySelector<HTMLElement>('[data-testid="add-rule"]'))?.focus();
    });
  };

  // An edit can't move rows, so the pencil or ⋮ that opened the editor is still the rule's
  const openEditor = (index: number, returnFocus?: HTMLElement | null) =>
    setEditing((prev) => ({ index, opening: prev.opening + 1, open: true, returnFocus }));

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

  const editedRule = ruleset?.[editing.index];

  return (
    <div className="flex h-[calc(100%-var(--spacing-3))] flex-col flex-nowrap gap-(--spacing-2) p-(--spacing-3)">
      <div className="flex flex-wrap items-center gap-(--spacing-2)">
        <Select
          aria-label={t('ruleset')}
          className="w-[18.571rem] max-sm:w-auto max-sm:min-w-[10.714rem] max-sm:flex-1"
          contained
          data-testid="rule-select"
          look="row"
          onChange={changeRuleset}
          options={Object.keys(rules).map((key) => {
            return { text: key, value: key };
          })}
          icon={<ChevronDown aria-hidden className="size-[1.143rem] shrink-0" strokeWidth={2.5} />}
          placeholder={t('choose_ruleset')}
          triggerClassName="h-[2.571rem] bg-card leading-[1.4]!"
          value={selectedRuleset}
        />
        <button
          aria-label={t('new_ruleset')}
          className={RULES_TOOL}
          data-testid="add-ruleset"
          onClick={() => setAddModal(true)}
          title={t('new_ruleset')}
          type="button"
        >
          <PlusIcon aria-hidden />
          <span aria-hidden>{t('ruleset')}</span>
        </button>
        {!!selectedRuleset && !DEFAULT_RULESET_NAMES.includes(selectedRuleset) && (
          <button
            aria-label={t('delete_ruleset')}
            className={cn(RULES_TOOL, TOOLBAR_DANGER, 'w-[2.571rem] px-0')}
            data-testid="delete-ruleset"
            onClick={() => setConfirm(true)}
            title={t('delete_ruleset')}
            type="button"
          >
            <TrashIcon aria-hidden />
          </button>
        )}
        {/* Add rule and Share go to the end of the row, or to a row of their own on phones */}
        <span aria-hidden className="flex-1 max-sm:h-0 max-sm:basis-full" />
        <AddRule />
        {!!selectedRuleset && (
          <Share
            disabled={!selectedRuleset}
            text={ruleset?.reduce(
              (str, rule, i) => {
                return `${str}
      ${Number(i) + 1}. ${getRuleContent(rule.content, rule.type) || 'N/A'}`;
              },
              `Ruleset
        `
            )}
            className="bg-card"
            toolbar
          />
        )}
      </div>
      <ol
        className="m-0 flex min-h-0 flex-1 list-none flex-col flex-nowrap gap-(--spacing-2) overflow-auto p-0"
        data-testid="ruleslist"
        ref={list}
      >
        {ruleset?.map((rule, i) => {
          const n = i + 1;
          const up = i !== 0;
          const down = i < ruleset.length - 1;
          const custom = !rule.default;
          return (
            <li className={ROW} key={`rule-${n}`}>
              {/* The list already gives the position */}
              <span
                aria-hidden
                className={cn(
                  TEXT_TOP,
                  'text-right leading-[1.45] font-bold text-row-muted tabular-nums'
                )}
              >
                {`${n}.`}
              </span>
              <div
                className={cn(TEXT_TOP, 'flex min-w-0 flex-col gap-(--spacing-1) leading-[1.45]')}
              >
                {rule.type !== 'TEXT' && (
                  <span className="text-(length:--font-size-1) text-row-muted">
                    <b className="text-foreground">SMART RULE</b>
                    {' - '}
                    {t('if_broken')} <b className="text-foreground">Tracker</b>
                  </span>
                )}
                <p className="m-0! break-words">{getRuleContent(rule.content, rule.type)}</p>
              </div>
              <div className="grid grid-cols-[repeat(4,2.286rem)] gap-px max-sm:hidden">
                {up ? (
                  <button
                    aria-label={t('move_rule_up', { n })}
                    className={ACTION}
                    data-testid={`arrow-up-${i}`}
                    onClick={() => handleArrow(i, true)}
                    title={t('move_up')}
                    type="button"
                  >
                    <ArrowUpIcon aria-hidden />
                  </button>
                ) : (
                  <span />
                )}
                {down ? (
                  <button
                    aria-label={t('move_rule_down', { n })}
                    className={ACTION}
                    data-testid={`arrow-down-${i}`}
                    onClick={() => handleArrow(i, false)}
                    title={t('move_down')}
                    type="button"
                  >
                    <ArrowDownIcon aria-hidden />
                  </button>
                ) : (
                  <span />
                )}
                {custom ? (
                  <>
                    <button
                      aria-label={t('edit_rule', { n })}
                      className={ACTION}
                      data-testid={`edit-rule-${i}`}
                      onClick={() => openEditor(i)}
                      title={t('edit', { ns: 'tracker' })}
                      type="button"
                    >
                      <PencilIcon aria-hidden />
                    </button>
                    <button
                      aria-label={t('delete_rule', { n })}
                      className={ACTION}
                      data-testid={`delete-rule-${i}`}
                      onClick={() => handleDelete(i)}
                      title={t('delete', { ns: 'common' })}
                      type="button"
                    >
                      <TrashIcon aria-hidden />
                    </button>
                  </>
                ) : (
                  <>
                    <span />
                    <span />
                  </>
                )}
              </div>
              {(up || down || custom) && (
                <RuleMenu
                  custom={custom}
                  down={down}
                  index={i}
                  label={t('rule_options', { n })}
                  list={list}
                  onDelete={() => handleDelete(i)}
                  onEdit={openEditor}
                  onMove={(isUp) => {
                    movedTo.current = move(i, isUp);
                  }}
                  takeMovedTo={takeMovedTo}
                  up={up}
                />
              )}
            </li>
          );
        })}
      </ol>
      {editedRule && (
        <RuleEditor
          content={editedRule.content}
          index={editing.index}
          key={editing.opening}
          onClose={() => setEditing((prev) => ({ ...prev, open: false }))}
          open={editing.open}
          returnFocus={editing.returnFocus}
          type={editedRule.type}
        />
      )}
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
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent
          // Back to Delete ruleset after Cancel; after OK it's gone with the ruleset, so to the
          // ruleset Select
          onCloseAutoFocus={(e: Event) =>
            focusBack(
              e,
              document.querySelector<HTMLElement>('[data-testid="delete-ruleset"]') ??
                document.querySelector<HTMLElement>('[data-testid="rule-select"] button')
            )
          }
          size="small"
        >
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
  );
}

interface RuleMenuProps {
  custom: boolean;
  down: boolean;
  index: number;
  label: string;
  list: React.RefObject<HTMLOListElement | null>;
  // The place a move from this menu sent the rule to, read once
  takeMovedTo: () => number | null;
  onDelete: () => void;
  onEdit: (index: number, returnFocus: HTMLElement | null) => void;
  onMove: (up: boolean) => void;
  up: boolean;
}

// A rule's ⋮ menu on phones, the tracker row's (5m): non-modal, it lists exactly the row's actions.
// After a move focus goes to the moved rule's ⋮; the editor hands focus back to this ⋮
function RuleMenu({
  custom,
  down,
  index,
  label,
  list,
  onDelete,
  onEdit,
  onMove,
  takeMovedTo,
  up,
}: RuleMenuProps): React.JSX.Element {
  const { t } = useTranslation('rules');
  const trigger = useRef<HTMLButtonElement>(null);
  // Delete moves focus itself (the page's handleDelete), so the menu leaves it there
  const deleted = useRef(false);
  const onCloseAutoFocus = (e: Event) => {
    if (deleted.current) {
      deleted.current = false;
      e.preventDefault();
      return;
    }
    const to = takeMovedTo();
    if (to == null) return;
    focusBack(
      e,
      list.current?.querySelector<HTMLElement>(`[data-testid="rule-options-${to}"]`) ??
        trigger.current
    );
  };
  return (
    <div className="sm:hidden">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            aria-label={label}
            className={cn(ACTION, 'size-[2.571rem]')}
            data-testid={`rule-options-${index}`}
            ref={trigger}
            title={label}
            type="button"
          >
            <EllipsisVertical aria-hidden strokeWidth={2.5} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          aria-label={label}
          collisionPadding={4}
          onCloseAutoFocus={onCloseAutoFocus}
        >
          {up && (
            <DropdownMenuItem onSelect={() => onMove(true)}>
              <ArrowUpIcon aria-hidden />
              {t('move_up')}
            </DropdownMenuItem>
          )}
          {down && (
            <DropdownMenuItem onSelect={() => onMove(false)}>
              <ArrowDownIcon aria-hidden />
              {t('move_down')}
            </DropdownMenuItem>
          )}
          {custom && (
            <>
              <DropdownMenuItem onSelect={() => onEdit(index, trigger.current)}>
                <PencilIcon aria-hidden />
                {t('edit', { ns: 'tracker' })}
              </DropdownMenuItem>
              <DropdownMenuItem // The menu's red lightened on the dark card for contrast, as the Builder's Delete
                className="dark:data-[variant=destructive]:text-[color-mix(in_srgb,var(--color-red-inverted)_70%,white)]"
                onSelect={() => {
                  deleted.current = true;
                  onDelete();
                }}
                variant="destructive"
              >
                <TrashIcon aria-hidden />
                {t('delete', { ns: 'common' })}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Rules;
