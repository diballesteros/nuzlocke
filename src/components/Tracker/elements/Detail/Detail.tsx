import { ABILITIES } from '@smogon/calc';
import { ChevronDown, Link2 } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ItemSelector, PkmImage, PokemonSelector } from 'common';
import { MoveSelector, Natures, PokemonType } from 'components';
import { STATUS_DOT } from 'components/Status/Status';
import { Abilities, RangeSelector } from 'components/Tracker/elements';
import { TYPE_COLOR } from 'constants/colors';
import { GAME_GENERATION, GENDERS } from 'constants/constant';
import { POKEMAP } from 'constants/pokemon';
import type { Gender, TEncounter } from 'constants/types';
import { useNatureOptions } from 'hooks/useNatures';
import { selectItemGeneration, selectNAGeneration } from 'selectors';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import { CheckboxOption } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { BUTTON_ICON, PencilIcon, TrashIcon } from '@/components/ui/icons';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { returnFocusTo, ROW_CONTROL, ROW_GHOST, ROW_ICON_CONTROL } from '../buttons';

const ABILITY_OPTIONS = [...new Set(ABILITIES[8])].map((smogonAbility) => {
  return { text: smogonAbility, value: smogonAbility };
});

// The editor's look (5m): a header with the sprite on a tile of its type, then the Details, Moves
// and Stats sections under rules, each opened by its chevron. Every field has a caption above it
const SUMMARY =
  'flex cursor-pointer list-none items-center gap-(--spacing-2) py-(--spacing-3) font-bold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-row-ring [&::-webkit-details-marker]:hidden';
const CHEVRON =
  'size-[1.143rem] shrink-0 -rotate-90 text-row-muted transition-transform duration-250 group-open:rotate-0 motion-reduce:transition-none';
const DETAILS = 'group border-0 border-t border-solid border-contrast-border first:border-t-0';
const SECTION = 'pb-(--spacing-4)';
const FIELD = 'flex min-w-0 flex-col gap-(--spacing-1)';
const CAPTION = 'text-(length:--font-size-1) font-bold text-row-muted';
const TEXT_FIELD =
  'm-0 h-[2.286rem] w-[5.5rem] rounded-md border border-solid border-contrast-border bg-transparent px-(--spacing-3) text-(length:--font-size-2) font-bold text-foreground tabular-nums outline-none hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-row-ring';
const SPRITE =
  'flex size-[4rem] shrink-0 items-center justify-center rounded-lg border border-solid border-[color-mix(in_srgb,var(--t1,transparent)_35%,transparent)] bg-[color-mix(in_srgb,var(--t1,transparent)_19%,transparent)] dark:bg-[color-mix(in_srgb,var(--t1,transparent)_10%,transparent)]';

// The soul link: a dashed box that darkens its border on hover
const SOUL_LINK =
  'relative mt-(--spacing-3) flex min-h-[3.429rem] w-full cursor-pointer items-center gap-(--spacing-2) rounded-lg border border-dashed border-contrast-border px-(--spacing-3) py-(--spacing-1) text-foreground hover:border-foreground';

// The ? beside Nature and Ability, outlined like the fields
const INFO = cn(ROW_ICON_CONTROL, 'text-row-muted shadow-none');
// A stat's row: its name, then IV and EV; on phones IV over EV beside the name
const STAT_ROW =
  'grid grid-cols-[2.857rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-(--spacing-4) gap-y-(--spacing-1) max-sm:grid-cols-[2.857rem_minmax(0,1fr)]';
const FOOTER_BUTTON = cn(
  ROW_CONTROL,
  'h-[2.571rem] px-(--spacing-3) max-sm:h-auto max-sm:min-h-[2.857rem] max-sm:whitespace-normal'
);

const STATS = [
  { iv: 'ivhp', ev: 'evhp', label: 'HP' },
  { iv: 'ivatk', ev: 'evatk', label: 'Atk' },
  { iv: 'ivdef', ev: 'evdef', label: 'Def' },
  { iv: 'ivspatk', ev: 'evspatk', label: 'SpA' },
  { iv: 'ivspdef', ev: 'evspdef', label: 'SpD' },
  { iv: 'ivspeed', ev: 'evspeed', label: 'Spe' },
] as const;

interface DetailProps {
  className?: string;
  encounter?: TEncounter;
  // Opened from the row's menu in compact mode: no button of its own
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  returnFocus?: React.RefObject<HTMLElement | null>;
  trigger?: boolean;
}

// The editor's form copies the encounter into its state when it mounts, so it mounts afresh for
// each opening (the row itself stays mounted, and with it the focus on its buttons)
function Detail({
  className,
  encounter,
  onOpenChange,
  open,
  returnFocus,
  trigger = true,
}: DetailProps): React.JSX.Element {
  const { t } = useTranslation('tracker');
  const [showState, setShowState] = useState(false);
  const show = open ?? showState;
  const [session, setSession] = useState(0);
  const [wasShown, setWasShown] = useState(show);
  if (show !== wasShown) {
    setWasShown(show);
    if (show) setSession(session + 1);
  }
  const setShow = (next: boolean) => {
    setShowState(next);
    onOpenChange?.(next);
  };

  return (
    <>
      {trigger && (
        <button
          aria-label={t('edit_details')}
          className={cn(ROW_GHOST, className)}
          data-testid={`edit-encounter-${encounter.id}`}
          onClick={() => setShow(true)}
          title={t('edit_details')}
          type="button"
        >
          <PencilIcon aria-hidden />
        </button>
      )}
      <DetailDialog
        encounter={encounter}
        key={session}
        onOpenChange={setShow}
        open={show}
        returnFocus={returnFocus}
      />
    </>
  );
}

interface DetailDialogProps {
  encounter: TEncounter;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  returnFocus?: React.RefObject<HTMLElement | null>;
}

function DetailDialog({
  encounter,
  onOpenChange,
  open,
  returnFocus,
}: DetailDialogProps): React.JSX.Element {
  const { t } = useTranslation('tracker');
  const natureOptions = useNatureOptions();
  const changeDetails = useStore(useCallback((state) => state.changeDetails, []));
  const exportTeamMember = useStore(useCallback((state) => state.exportTeamMember, []));
  const exportToGame = useStore(useCallback((state) => state.exportToGame, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const gamesList = useStore(useCallback((state) => state.gamesList, []));
  const soulink = useStore(useCallback((state) => state.soulink, []));
  const isNatureAbilityGen = useStore(selectNAGeneration);
  const isItemGenderGen = useStore(selectItemGeneration);
  const foundPokemon = POKEMAP.get(encounter.pokemon);
  const show = open;
  const setShow = onOpenChange;
  const [level, setLevel] = useState(encounter?.details?.level);
  const [metLevel, setMetLevel] = useState(encounter?.details?.metLevel);
  const [gender, setGender] = useState(encounter?.details?.gender);
  const [ability, setAbility] = useState(encounter?.details?.ability);
  const [nature, setNature] = useState(encounter?.details?.nature);
  const [item, setItem] = useState(encounter?.details?.item);
  const [faint, setFaint] = useState(encounter?.details?.faint);
  const [moveOne, setMoveOne] = useState(encounter?.details?.moves[0]);
  const [moveTwo, setMoveTwo] = useState(encounter?.details?.moves[1]);
  const [moveThree, setMoveThree] = useState(encounter?.details?.moves[2]);
  const [moveFour, setMoveFour] = useState(encounter?.details?.moves[3]);
  const [shiny, setShiny] = useState(encounter?.details?.shiny);
  const [ivhp, setIvhp] = useState(encounter?.details?.ivhp);
  const [ivatk, setIvatk] = useState(encounter?.details?.ivatk);
  const [ivdef, setIvdef] = useState(encounter?.details?.ivdef);
  const [ivspatk, setIvspatk] = useState(encounter?.details?.ivspatk);
  const [ivspeed, setIvspeed] = useState(encounter?.details?.ivspeed);
  const [ivspdef, setIvspdef] = useState(encounter?.details?.ivspdef);
  const [evhp, setEvhp] = useState(encounter?.details?.evhp);
  const [evatk, setEvatk] = useState(encounter?.details?.evatk);
  const [evdef, setEvdef] = useState(encounter?.details?.evdef);
  const [evspatk, setEvspatk] = useState(encounter?.details?.evspatk);
  const [evspeed, setEvspeed] = useState(encounter?.details?.evspeed);
  const [evspdef, setEvspdef] = useState(encounter?.details?.evspdef);
  const [soulLink, setSoulLink] = useState(encounter?.details?.soulink);

  const limitGen = GAME_GENERATION[selectedGame?.value] || undefined;
  const foundSoulLink = POKEMAP.get(soulLink);

  const handleClose = () => {
    setShow(false);
    setLevel(encounter?.details?.level);
    setMetLevel(encounter?.details?.metLevel);
    setGender(encounter?.details?.gender);
    setAbility(encounter?.details?.ability);
    setNature(encounter?.details?.nature);
    setItem(encounter?.details?.item);
    setFaint(encounter?.details?.faint);
    setMoveOne(encounter?.details?.moves[0]);
    setMoveTwo(encounter?.details?.moves[1]);
    setMoveThree(encounter?.details?.moves[2]);
    setMoveFour(encounter?.details?.moves[3]);
    setShiny(encounter?.details?.shiny);
    setIvhp(encounter?.details?.ivhp);
    setIvatk(encounter?.details?.ivatk);
    setIvdef(encounter?.details?.ivdef);
    setIvspatk(encounter?.details?.ivspatk);
    setIvspeed(encounter?.details?.ivspeed);
    setIvspdef(encounter?.details?.ivspdef);
    setEvhp(encounter?.details?.evhp);
    setEvatk(encounter?.details?.evatk);
    setEvdef(encounter?.details?.evdef);
    setEvspatk(encounter?.details?.evspatk);
    setEvspeed(encounter?.details?.evspeed);
    setEvspdef(encounter?.details?.evspdef);
    setSoulLink(encounter?.details?.soulink);
  };

  const handleSave = () => {
    changeDetails(
      encounter.id,
      level,
      metLevel,
      gender,
      ability,
      nature,
      item,
      faint,
      moveOne,
      moveTwo,
      moveThree,
      moveFour,
      shiny,
      ivhp,
      ivatk,
      ivdef,
      ivspatk,
      ivspdef,
      ivspeed,
      evhp,
      evatk,
      evdef,
      evspatk,
      evspdef,
      evspeed,
      soulLink
    );
    setShow(false);
  };

  const handleExport = () => {
    exportTeamMember({
      ability,
      id: encounter.pokemon,
      level,
      item,
      nature,
      moves: [moveOne, moveTwo, moveThree, moveFour],
    });
    toast.success(t('pokemon_export'));
  };

  const handleGameExport = (game: string) => {
    if (game !== selectedGame?.value) {
      exportToGame(encounter, game, `From ${selectedGame?.text} - ${new Date().toLocaleString()}`);
      handleClose();
      toast.success(t('pokemon_export'));
    }
  };

  const handleDeleteSoulLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setSoulLink(null);
  };

  const statValues: Record<string, [number, (value: number) => void]> = {
    ivhp: [ivhp, setIvhp],
    ivatk: [ivatk, setIvatk],
    ivdef: [ivdef, setIvdef],
    ivspatk: [ivspatk, setIvspatk],
    ivspdef: [ivspdef, setIvspdef],
    ivspeed: [ivspeed, setIvspeed],
    evhp: [evhp, setEvhp],
    evatk: [evatk, setEvatk],
    evdef: [evdef, setEvdef],
    evspatk: [evspatk, setEvspatk],
    evspdef: [evspdef, setEvspdef],
    evspeed: [evspeed, setEvspeed],
  };
  const moves: [number, (moveId: number) => void][] = [
    [moveOne, setMoveOne],
    [moveTwo, setMoveTwo],
    [moveThree, setMoveThree],
    [moveFour, setMoveFour],
  ];
  const levelId = `level-${encounter.id}`;
  const metLevelId = `metlevel-${encounter.id}`;
  const statusDot = encounter?.status
    ? (STATUS_DOT[encounter.status.value] ?? 'bg-contrast-border')
    : null;

  const summary = (testId: string, text: string) => (
    <summary className={SUMMARY} data-testid={testId}>
      <ChevronDown aria-hidden className={CHEVRON} strokeWidth={2.5} />
      {text}
    </summary>
  );

  const levelField = (
    id: string,
    testId: string,
    label: string,
    value: number,
    onChange: (value: number) => void
  ) => (
    <div className={FIELD}>
      <label className={CAPTION} htmlFor={id}>
        {label}
      </label>
      <div data-testid={testId}>
        <input
          className={TEXT_FIELD}
          id={id}
          inputMode="numeric"
          maxLength={3}
          onChange={(e) => onChange(Number(e.target.value))}
          value={Number.isNaN(value) ? '' : (value ?? '')}
        />
      </div>
    </div>
  );

  const shinyBox = (
    <CheckboxOption
      checked={!!shiny}
      className="h-[2.286rem] w-fit"
      data-testid="shiny"
      label="Shiny"
      labelClassName="font-bold text-foreground"
      onCheckedChange={(checked) => setShiny(checked === true)}
    />
  );

  return (
    <>
      <Dialog open={show}>
        <DialogContent
          className="flex max-h-[92dvh] flex-col overflow-hidden bg-background min-[992px]:w-[720px] min-[1200px]:w-[720px] min-[1920px]:w-[720px]"
          dismissible={false}
          {...returnFocusTo(returnFocus)}
        >
          <DialogTitle className="sr-only">{t('encounter_details')}</DialogTitle>
          <div
            className="flex shrink-0 items-center gap-(--spacing-4) rounded-t-md border-0 border-b border-solid border-contrast-border px-(--spacing-5) py-(--spacing-4) text-foreground max-sm:px-(--spacing-4)"
            style={{ ['--t1' as string]: foundPokemon ? TYPE_COLOR[foundPokemon.type] : undefined }}
          >
            <div className={SPRITE}>
              <PkmImage name={foundPokemon?.text} shiny={shiny} />
            </div>
            <div className="flex min-w-0 flex-col items-start gap-(--spacing-1)">
              <span className="max-w-full truncate text-(length:--font-size-5) leading-tight font-bold">
                {encounter.nickname ? (
                  <>
                    {encounter.nickname}{' '}
                    <span className="text-(length:--font-size-2) font-normal text-row-muted">
                      {foundPokemon?.text}
                    </span>
                  </>
                ) : (
                  foundPokemon?.text
                )}
              </span>
              {foundPokemon && <PokemonType pokemon={foundPokemon} />}
              <span className="flex max-w-full items-center gap-(--spacing-2) text-(length:--font-size-1) text-row-muted">
                {statusDot && (
                  <span
                    aria-hidden
                    className={cn('size-[0.571rem] shrink-0 rounded-full', statusDot)}
                  />
                )}
                <span className="truncate">
                  {encounter.location}
                  {encounter.status?.text ? ` · ${encounter.status.text}` : ''}
                </span>
              </span>
            </div>
          </div>
          <DialogBody className="max-h-none min-h-0 flex-1 overflow-auto py-(--spacing-1) [&_details[open]>summary~*]:animate-sweep motion-reduce:[&_details[open]>summary~*]:animate-none">
            <details className={DETAILS} open>
              {summary('detail-summary', t('details', { ns: 'badges' }))}
              <div className={SECTION}>
                <div className="grid grid-cols-2 gap-x-(--spacing-4) gap-y-(--spacing-3) max-sm:grid-cols-1">
                  <div className="col-span-full flex flex-wrap items-end gap-(--spacing-3)">
                    {levelField(levelId, 'level', t('level', { ns: 'rules' }), level, setLevel)}
                    {levelField(metLevelId, 'metlevel', t('met_level'), metLevel, setMetLevel)}
                    {isItemGenderGen && (
                      <div
                        className={cn(
                          FIELD,
                          'min-w-[10rem] flex-1 max-sm:order-last max-sm:basis-full'
                        )}
                      >
                        <span aria-hidden className={CAPTION}>
                          {t('gender')}
                        </span>
                        <Select
                          aria-label={t('gender')}
                          clearable
                          contained
                          data-testid="gender"
                          icon={
                            <ChevronDown
                              aria-hidden
                              className="size-[1.143rem] shrink-0"
                              strokeWidth={2.5}
                            />
                          }
                          look="row"
                          onChange={(value) => setGender(value as unknown as Gender)}
                          options={GENDERS}
                          placeholder={`${t('gender')}…`}
                          value={gender ?? ''}
                        />
                      </div>
                    )}
                    {shinyBox}
                  </div>
                  {isNatureAbilityGen && (
                    <div className={FIELD}>
                      <span aria-hidden className={CAPTION}>
                        {t('nature')}
                      </span>
                      <div className="flex gap-(--spacing-2)">
                        <Combobox
                          aria-label={t('nature')}
                          className="flex-1"
                          clearable
                          data-testid="nature"
                          look="row"
                          onChange={(value) => setNature(value)}
                          options={natureOptions}
                          placeholder={t('select_nature', { ns: 'calculator' })}
                          value={nature ?? ''}
                        />
                        <Natures className={INFO} label={t('nature_chart', { ns: 'common' })} />
                      </div>
                    </div>
                  )}
                  {isNatureAbilityGen && (
                    <div className={FIELD}>
                      <span aria-hidden className={CAPTION}>
                        {t('ability')}
                      </span>
                      <div className="flex gap-(--spacing-2)">
                        <Combobox
                          aria-label={t('ability')}
                          className="flex-1"
                          clearable
                          data-testid="ability"
                          look="row"
                          onChange={(value) => setAbility(value)}
                          options={ABILITY_OPTIONS}
                          placeholder={t('select_ability', { ns: 'calculator' })}
                          value={ability ?? ''}
                        />
                        <Abilities
                          className={INFO}
                          label={t('ability_list', { ns: 'common' })}
                          text={ability ?? ''}
                        />
                      </div>
                    </div>
                  )}
                  {isItemGenderGen && (
                    <div className={cn(FIELD, 'col-span-full')}>
                      <span aria-hidden className={CAPTION}>
                        {t('held_item')}
                      </span>
                      <ItemSelector
                        aria-label={t('held_item')}
                        item={item}
                        look="row"
                        onChange={(newItem) => setItem(newItem)}
                      />
                    </div>
                  )}
                </div>
                {soulink && (
                  <PokemonSelector handlePokemon={(pokemonId) => setSoulLink(pokemonId)}>
                    <div className={SOUL_LINK} data-testid={`soullink-${encounter.id}`}>
                      <Link2 aria-hidden className="size-[1.143rem] shrink-0 text-row-muted" />
                      <span className="text-(length:--font-size-2) text-row-muted">
                        Soul Link Pokémon:
                      </span>
                      {soulLink ? (
                        <>
                          <div className="flex h-[2.857rem] w-[3.429rem] items-center justify-center">
                            <PkmImage name={foundSoulLink.text} />
                          </div>
                          <span className="font-bold">{foundSoulLink.text}</span>
                          <Button
                            aria-label="delete-soullink"
                            className="ml-auto shadow-none"
                            data-testid={`delete-soullink-${encounter.id}`}
                            onClick={handleDeleteSoulLink}
                            size="icon"
                            variant="secondary"
                          >
                            <TrashIcon className={BUTTON_ICON} />
                          </Button>
                        </>
                      ) : (
                        <span
                          className="text-(length:--font-size-2) text-placeholder"
                          data-testid={`soullink-empty-${encounter.id}`}
                        >
                          Pokémon...
                        </span>
                      )}
                    </div>
                  </PokemonSelector>
                )}
              </div>
            </details>
            <details className={DETAILS}>
              {summary('move-summary', t('moves'))}
              <div
                className={cn(
                  SECTION,
                  'grid grid-cols-2 gap-x-(--spacing-3) gap-y-(--spacing-2) max-sm:grid-cols-1'
                )}
              >
                {moves.map(([moveId, setMove], index) => (
                  <div data-testid={`move-${index + 1}`} key={index}>
                    <MoveSelector
                      currentMoveId={moveId}
                      handleMove={(newMove: number) => setMove(newMove)}
                      limitGen={limitGen}
                      look="tile"
                      slot={t('move_slot', { n: index + 1 })}
                    />
                  </div>
                ))}
              </div>
            </details>
            <details className={DETAILS} style={{ display: limitGen > 2 ? undefined : 'none' }}>
              {summary('stats-summary', t('stats', { ns: 'stats' }))}
              <div className={cn(SECTION, 'flex flex-col gap-(--spacing-2)')}>
                <div aria-hidden className={cn(STAT_ROW, CAPTION, 'max-sm:hidden')}>
                  <span>{t('stat')}</span>
                  <span>IV</span>
                  <span>EV</span>
                </div>
                {STATS.map((stat) => (
                  <div aria-label={stat.label} className={STAT_ROW} key={stat.label} role="group">
                    <span aria-hidden className="font-bold max-sm:row-span-2">
                      {stat.label}
                    </span>
                    {[stat.iv, stat.ev].map((name) => (
                      <RangeSelector
                        key={name}
                        name={name}
                        onChange={(newValue: number) => statValues[name][1](newValue)}
                        stat={stat.label}
                        value={statValues[name][0] ?? 0}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </details>
            {encounter?.status?.value === 2 && (
              <label
                className={cn(
                  FIELD,
                  'border-0 border-t border-solid border-contrast-border py-(--spacing-3)'
                )}
              >
                <span className={CAPTION}>{t('cause_of_fainting')}</span>
                <textarea
                  className="w-full resize-none rounded-md border border-solid border-contrast-border bg-transparent p-(--spacing-2) text-(length:--font-size-2) text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-row-ring"
                  data-testid="cause of fainting"
                  maxLength={250}
                  onChange={(e) => setFaint(e.target.value)}
                  rows={5}
                  value={faint}
                />
              </label>
            )}
          </DialogBody>
          <DialogFooter className="flex shrink-0 flex-wrap items-center gap-(--spacing-2) rounded-b-md border-contrast-border px-(--spacing-5) py-(--spacing-3) text-left max-[768px]:pb-(--spacing-3) max-sm:px-(--spacing-4)">
            <div className="flex items-center gap-(--spacing-2) max-sm:grid max-sm:w-full max-sm:grid-cols-2">
              <button className={FOOTER_BUTTON} onClick={handleExport} type="button">
                {t('export_to_builder')}
              </button>
              <Select
                aria-label={t('export_to_game')}
                className="min-w-0 max-sm:w-full"
                contained
                data-testid="export-to-game"
                icon={
                  <ChevronDown aria-hidden className="size-[1.143rem] shrink-0" strokeWidth={2.5} />
                }
                look="row"
                onChange={handleGameExport}
                options={gamesList.map((game) => ({ text: game.text, value: game.value }))}
                text={t('export_to_game')}
                triggerClassName={cn(
                  FOOTER_BUTTON,
                  'w-auto max-sm:w-full justify-between leading-[1.4]! text-left pr-(--spacing-2) whitespace-normal max-sm:h-auto max-sm:[&>[data-select-text]]:overflow-visible max-sm:[&>[data-select-text]]:whitespace-normal max-sm:[&>[data-select-text]]:[text-overflow:clip] max-sm:min-h-[2.857rem] max-sm:py-(--spacing-1)'
                )}
                value={selectedGame?.value}
              />
            </div>
            <div className="ml-auto flex items-center gap-(--spacing-2)">
              <button
                className={cn(FOOTER_BUTTON, 'border-transparent')}
                onClick={handleClose}
                type="button"
              >
                {t('cancel', { ns: 'common' })}
              </button>
              <Button className="m-0!" onClick={handleSave} variant="primary">
                {t('save', { ns: 'common' })}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Detail;
