import { ABILITIES } from '@smogon/calc';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ItemSelector, PkmImage, PokemonSelector } from 'common';
import { MoveSelector, Natures, PokemonType } from 'components';
import { Abilities, RangeSelector } from 'components/Tracker/elements';
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
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { RADIUS, ROW_ICON } from '../buttons';

const ABILITY_OPTIONS = [...new Set(ABILITIES[8])].map((smogonAbility) => {
  return { text: smogonAbility, value: smogonAbility };
});

// A section's toggle: a --contrast triangle that turns down as the section opens (its <details>
// carries `group`). Semantic's normalize makes <summary> a list item outside cascade layers
const SUMMARY =
  "relative block! cursor-pointer p-(--spacing-4) pl-(--spacing-8) group-open:before:rotate-90 before:absolute before:top-[1.3rem] before:left-[1rem] before:origin-[0.2rem_50%] before:rotate-0 before:border-[0.4rem] before:border-solid before:border-transparent before:border-l-foreground before:transition-transform before:duration-250 before:ease-[ease] before:content-[''] [&::-webkit-details-marker]:[display:none]";

const SECTION = 'flex flex-col flex-nowrap gap-(--spacing-3)';
// The Moves and Stats sections lay out like their contents (normalize sets <details> to block
// outside cascade layers)
const DETAILS = 'group flex! flex-col flex-nowrap gap-(--spacing-3)';

// A stat's IV and EV rows. Semantic's normalize sets a fieldset's padding outside cascade layers
const FIELDSET =
  'grid grid-cols-[2.857rem_minmax(0,1fr)_repeat(3,2.857rem)] gap-x-(--spacing-3) gap-y-(--spacing-4) rounded-[4px] p-(--spacing-5)! text-foreground';

// The level fields: Semantic's labeled input with a transparent field in the page's colours
const LEVEL_INPUT = 'border-contrast-border bg-transparent text-foreground focus:text-foreground';

// The soul link: a bordered box that darkens its border on hover
const SOUL_LINK =
  'relative flex h-auto w-[calc(100%-var(--spacing-3))] cursor-pointer flex-col flex-nowrap items-start gap-(--spacing-2) rounded-[4px] border border-solid border-contrast-border pl-(--spacing-3) text-foreground [box-sizing:content-box]! hover:border-foreground max-sm:text-(length:--font-size-2)';

interface DetailProps {
  encounter?: TEncounter;
}

function Detail({ encounter }: DetailProps): React.JSX.Element {
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
  const [show, setShow] = useState(false);
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

  return (
    <>
      <Button
        aria-label="edit encounter"
        className={RADIUS}
        data-testid={`edit-encounter-${encounter.id}`}
        onClick={() => setShow(true)}
        size="compact-icon"
        type="button"
        variant="basic"
      >
        <PencilIcon className={ROW_ICON} />
      </Button>
      <Dialog open={show}>
        <DialogContent dismissible={false}>
          <DialogTitle className="sr-only">{t('encounter_details')}</DialogTitle>
          <DialogBody
            className="flex flex-col flex-nowrap gap-(--spacing-3) [&_details[open]_summary~*]:animate-sweep motion-reduce:[&_details[open]_summary~*]:animate-none"
            scrolling
          >
            <div className="flex items-center justify-evenly">
              <div className="flex flex-col flex-nowrap">
                <div className="flex h-[5.714rem] w-[7.143rem] items-center justify-center self-center">
                  <PkmImage name={foundPokemon?.text} shiny={shiny} />
                </div>
                <span className="self-center font-bold">{foundPokemon.text}</span>
              </div>
              <PokemonType pokemon={foundPokemon} />
            </div>
            {soulink && (
              <div className="flex flex-col flex-nowrap gap-(--spacing-2)">
                <span>Soul Link Pokémon:</span>
                <PokemonSelector handlePokemon={(pokemonId) => setSoulLink(pokemonId)}>
                  {soulLink ? (
                    <div className={SOUL_LINK} data-testid={`soullink-${encounter.id}`}>
                      <div className="flex h-[3.5rem] w-[4.8rem] items-end justify-center">
                        <PkmImage name={foundSoulLink.text} />
                      </div>
                      <span className="mt-auto mb-(--spacing-2)">{foundSoulLink.text}</span>
                      <Button
                        aria-label="delete-soullink"
                        className="absolute top-(--spacing-3) right-(--spacing-3) shadow-none"
                        data-testid={`delete-soullink-${encounter.id}`}
                        onClick={handleDeleteSoulLink}
                        size="icon"
                        variant="secondary"
                      >
                        <TrashIcon className={BUTTON_ICON} />
                      </Button>
                    </div>
                  ) : (
                    <div className={SOUL_LINK} data-testid={`soullink-${encounter.id}`}>
                      <span
                        className="mx-auto my-(--spacing-2) flex h-(--spacing-9) items-center justify-center text-placeholder"
                        data-testid={`soullink-empty-${encounter.id}`}
                      >
                        Pokémon...
                      </span>
                    </div>
                  )}
                </PokemonSelector>
              </div>
            )}
            <details className="group" open>
              <summary className={SUMMARY} data-testid="detail-summary">
                {t('details', { ns: 'badges' })}
              </summary>
              <div className={SECTION}>
                <Input
                  data-testid="level"
                  fluid
                  inputClassName={LEVEL_INPUT}
                  label={t('level', { ns: 'rules' })}
                  maxLength={3}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  value={Number.isNaN(level) ? '' : (level ?? '')}
                />
                <Input
                  data-testid="metlevel"
                  fluid
                  inputClassName={LEVEL_INPUT}
                  label={t('met_level')}
                  maxLength={3}
                  onChange={(e) => setMetLevel(Number(e.target.value))}
                  value={Number.isNaN(metLevel) ? '' : (metLevel ?? '')}
                />
                {isItemGenderGen && (
                  <Select
                    aria-label="gender-selector"
                    caret="font"
                    className="block w-full"
                    clearable
                    contained
                    data-testid="gender"
                    look="contrast"
                    onChange={(value) => setGender(value as unknown as Gender)}
                    options={GENDERS}
                    placeholder={t('gender', { ns: 'calculator' })}
                    value={gender ?? ''}
                  />
                )}
                {isNatureAbilityGen && (
                  <div className="flex gap-(--spacing-1)">
                    <Combobox
                      aria-label="nature-selector"
                      caret="font"
                      clearable
                      data-testid="nature"
                      onChange={(value) => setNature(value)}
                      options={natureOptions}
                      placeholder={t('select_nature', { ns: 'calculator' })}
                      value={nature ?? ''}
                    />
                    <Natures />
                  </div>
                )}
                {isNatureAbilityGen && (
                  <div className="flex gap-(--spacing-1)">
                    <Combobox
                      aria-label="ability"
                      caret="font"
                      clearable
                      data-testid="ability"
                      onChange={(value) => setAbility(value)}
                      options={ABILITY_OPTIONS}
                      placeholder={t('select_ability', { ns: 'calculator' })}
                      value={ability ?? ''}
                    />
                    <Abilities text={ability ?? ''} />
                  </div>
                )}
                {isItemGenderGen && (
                  <ItemSelector item={item} onChange={(newItem) => setItem(newItem)} />
                )}
                <CheckboxOption
                  checked={!!shiny}
                  className="w-fit"
                  data-testid="shiny"
                  label="Shiny"
                  labelClassName="text-foreground"
                  onCheckedChange={(checked) => setShiny(checked === true)}
                />
              </div>
            </details>
            <details className={DETAILS}>
              <summary className={SUMMARY} data-testid="move-summary">
                Moves
              </summary>
              <div className={SECTION}>
                <div data-testid="move-1">
                  <span>Move 1:</span>
                  <MoveSelector
                    currentMoveId={moveOne}
                    handleMove={(moveId: number) => setMoveOne(moveId)}
                    limitGen={limitGen}
                  />
                </div>
                <div data-testid="move-2">
                  <span>Move 2:</span>
                  <MoveSelector
                    currentMoveId={moveTwo}
                    handleMove={(moveId: number) => setMoveTwo(moveId)}
                    limitGen={limitGen}
                  />
                </div>
                <div data-testid="move-3">
                  <span>Move 3:</span>
                  <MoveSelector
                    currentMoveId={moveThree}
                    handleMove={(moveId: number) => setMoveThree(moveId)}
                    limitGen={limitGen}
                  />
                </div>
                <div data-testid="move-4">
                  <span>Move 4:</span>
                  <MoveSelector
                    currentMoveId={moveFour}
                    handleMove={(moveId: number) => setMoveFour(moveId)}
                    limitGen={limitGen}
                  />
                </div>
              </div>
            </details>

            <details className={DETAILS} style={{ display: limitGen > 2 ? undefined : 'none' }}>
              <summary className={SUMMARY} data-testid="stats-summary">
                Stats
              </summary>
              <div className={SECTION}>
                HP:
                <fieldset className={FIELDSET}>
                  <RangeSelector
                    name="ivhp"
                    value={ivhp ?? 0}
                    onChange={(newValue: number) => setIvhp(newValue)}
                  />
                  <RangeSelector
                    name="evhp"
                    value={evhp ?? 0}
                    onChange={(newValue: number) => setEvhp(newValue)}
                  />
                </fieldset>
                ATK:
                <fieldset className={FIELDSET}>
                  <RangeSelector
                    name="ivatk"
                    value={ivatk ?? 0}
                    onChange={(newValue: number) => setIvatk(newValue)}
                  />
                  <RangeSelector
                    name="evatk"
                    value={evatk ?? 0}
                    onChange={(newValue: number) => setEvatk(newValue)}
                  />
                </fieldset>
                DEF:
                <fieldset className={FIELDSET}>
                  <RangeSelector
                    name="ivdef"
                    value={ivdef ?? 0}
                    onChange={(newValue: number) => setIvdef(newValue)}
                  />
                  <RangeSelector
                    name="evdef"
                    value={evdef ?? 0}
                    onChange={(newValue: number) => setEvdef(newValue)}
                  />
                </fieldset>
                SPATK:
                <fieldset className={FIELDSET}>
                  <RangeSelector
                    name="ivspatk"
                    value={ivspatk ?? 0}
                    onChange={(newValue: number) => setIvspatk(newValue)}
                  />
                  <RangeSelector
                    name="evspatk"
                    value={evspatk ?? 0}
                    onChange={(newValue: number) => setEvspatk(newValue)}
                  />
                </fieldset>
                SPDEF:
                <fieldset className={FIELDSET}>
                  <RangeSelector
                    name="ivspdef"
                    value={ivspdef ?? 0}
                    onChange={(newValue: number) => setIvspdef(newValue)}
                  />
                  <RangeSelector
                    name="evspdef"
                    value={evspdef ?? 0}
                    onChange={(newValue: number) => setEvspdef(newValue)}
                  />
                </fieldset>
                SPEED:
                <fieldset className={FIELDSET}>
                  <RangeSelector
                    name="ivspeed"
                    value={ivspeed ?? 0}
                    onChange={(newValue: number) => setIvspeed(newValue)}
                  />
                  <RangeSelector
                    name="evspeed"
                    value={evspeed ?? 0}
                    onChange={(newValue: number) => setEvspeed(newValue)}
                  />
                </fieldset>
              </div>
            </details>
            {encounter?.status?.value === 2 && (
              <label>
                <div>{t('cause_of_fainting')}:</div>
                <textarea
                  className="w-full resize-none"
                  data-testid="cause of fainting"
                  maxLength={250}
                  onChange={(e) => setFaint(e.target.value)}
                  rows={5}
                  value={faint}
                />
              </label>
            )}
          </DialogBody>
          <DialogFooter>
            <Button onClick={handleClose} variant="secondary">
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button onClick={handleExport} variant="secondary">
              {t('export_to_builder')}
            </Button>
            <Select
              aria-label={t('export_to_game')}
              className="ml-[0.75em] inline-block max-[768px]:mb-[1rem]"
              contained
              data-testid="export-to-game"
              look="button"
              onChange={handleGameExport}
              options={gamesList.map((game) => ({ text: game.text, value: game.value }))}
              text={t('export_to_game')}
              // Its own width (`contained` would stretch it over its margin), and Semantic's 12px
              // before the caret
              triggerClassName="w-auto [&>svg]:ml-[12px]"
              value={selectedGame?.value}
            />
            <Button onClick={handleSave} variant="primary">
              {t('save', { ns: 'common' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Detail;
