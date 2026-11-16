import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DetailSelector, EncounterSelector, PokemonSelector } from 'common';
import { PokemonType } from 'components';
import { Help, PokemonSlot } from 'components/Calculator/elements';
import { TYPE_COLOR } from 'constants/colors';
import { DEFAULT_POKEMON_1, DEFAULT_POKEMON_2 } from 'constants/calculator';
import DETAILS from 'constants/details';
import { POKEMAP } from 'constants/pokemon';
import type { PokemonDetail, TCalculatorForm, TEncounter } from 'constants/types';
import useStore from 'store';
import { ChevronDownIcon } from '@/components/ui/icons';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// The Pokémon card's trigger: the sprite tile and name, filling the row up to the types
const PICK =
  'm-0 flex min-w-[min(100%,12.5rem)] flex-1 cursor-pointer items-center gap-(--spacing-3) rounded-lg border border-solid border-transparent bg-transparent p-[0.143rem] pr-(--spacing-2) text-left text-foreground outline-none hover:border-contrast-border hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-row-ring';

interface PokeControllerProps {
  encounters?: TEncounter[];
  name: 'pokemon1' | 'pokemon2';
}

function PokeController({ encounters, name }: PokeControllerProps): React.JSX.Element {
  const { t } = useTranslation('calculator');
  const [showAll, setShowAll] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState<number>(undefined);
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));
  const foundPokemon = POKEMAP.get(form[name]);

  const handleEncounter = (enc: TEncounter) => {
    const partialCalc: Partial<TCalculatorForm> = {
      ...(enc.details?.ability && { ability1: enc.details?.ability }),
      ...(enc.details?.gender && { gender1: enc.details?.gender }),
      ...(enc.details?.item && { item1: enc.details?.item }),
      ...(enc.details?.level && { level1: enc.details?.level }),
      ...(enc.details?.nature && { nature1: enc.details?.nature }),
      ...(enc.details?.moves && { move1_1: enc.details?.moves[0] }),
      ...(enc.details?.moves && { move2_1: enc.details?.moves[1] }),
      ...(enc.details?.moves && { move3_1: enc.details?.moves[2] }),
      ...(enc.details?.moves && { move4_1: enc.details?.moves[3] }),
      evhp1: enc.details?.evhp ?? 0,
      evatk1: enc.details?.evatk ?? 0,
      evdef1: enc.details?.evdef ?? 0,
      evspatk1: enc.details?.evspatk ?? 0,
      evspdef1: enc.details?.evspdef ?? 0,
      evspeed1: enc.details?.evspeed ?? 0,
      ivhp1: enc.details?.ivhp ?? 0,
      ivatk1: enc.details?.ivatk ?? 0,
      ivdef1: enc.details?.ivdef ?? 0,
      ivspatk1: enc.details?.ivspatk ?? 0,
      ivspdef1: enc.details?.ivspdef ?? 0,
      ivspeed1: enc.details?.ivspeed ?? 0,
      pokemon1: enc.pokemon,
    };
    update({ ...DEFAULT_POKEMON_1, ...partialCalc });
  };

  const handlePokemon = (pokemonId: number) => {
    const partialCalc: Partial<TCalculatorForm> = {
      [name]: pokemonId,
    };
    const DEFAULT = name === 'pokemon1' ? DEFAULT_POKEMON_1 : DEFAULT_POKEMON_2;
    update({ ...DEFAULT, ...partialCalc });
  };

  const handleDetail = (detail: PokemonDetail) => {
    const partialCalc: Partial<TCalculatorForm> = {
      ...(detail?.ability && { ability2: detail?.ability }),
      ...(detail?.gender && { gender2: detail?.gender }),
      ...(detail?.item && { item2: detail?.item }),
      ...(detail?.level && { level2: detail?.level }),
      ...(detail?.nature && { nature2: detail?.nature }),
      ...(detail?.moves && { move1_2: detail?.moves[0] }),
      ...(detail?.moves && { move2_2: detail?.moves[1] }),
      ...(detail?.moves && { move3_2: detail?.moves[2] }),
      ...(detail?.moves && { move4_2: detail?.moves[3] }),
      ...(detail?.evhp && { evhp2: detail?.evhp }),
      ...(detail?.evatk && { evatk2: detail?.evatk }),
      ...(detail?.evdef && { evdef2: detail?.evdef }),
      ...(detail?.evspatk && { evspatk2: detail?.evspatk }),
      ...(detail?.evspdef && { evspdef2: detail?.evspdef }),
      ...(detail?.evspeed && { evspeed2: detail?.evspeed }),
      ...(detail?.ivhp && { ivhp2: detail?.ivhp }),
      ...(detail?.ivatk && { ivatk2: detail?.ivatk }),
      ...(detail?.ivdef && { ivdef2: detail?.ivdef }),
      ...(detail?.ivspatk && { ivspatk2: detail?.ivspatk }),
      ...(detail?.ivspdef && { ivspdef2: detail?.ivspdef }),
      ...(detail?.ivspeed && { ivspeed2: detail?.ivspeed }),
      pokemon2: detail.id,
    };
    update({ ...DEFAULT_POKEMON_2, ...partialCalc });
  };

  const detailsToOptions = useMemo(() => {
    if (selectedGame && DETAILS[selectedGame?.value]) {
      return DETAILS[selectedGame.value]?.flat().map((gym, i) => {
        return {
          value: String(i),
          text: `${gym.name}${gym.name !== gym.game ? ` - ${gym.game}` : ''}`,
        };
      });
    }
    return [];
  }, [selectedGame]);

  const details = useMemo(() => {
    if (selectedGame && DETAILS[selectedGame?.value]) {
      return DETAILS[selectedGame.value]?.flat();
    }
    return [];
  }, [selectedGame]);
  const derivedShow = name === 'pokemon1' ? !showAll : showAll;
  const showGymDetails = name === 'pokemon2' && detailsToOptions?.length > 0;

  const trigger = {
    'aria-label': `${foundPokemon?.text ?? ''}, ${t('change_pokemon', { ns: 'tracker' })}`,
    className: PICK,
  };

  return (
    <div
      className="col-span-full flex flex-col flex-nowrap gap-(--spacing-3) text-foreground"
      data-testid={`pokecontroller-${name}`}
    >
      <div
        className="flex min-w-0 flex-wrap items-center gap-(--spacing-2)"
        style={{
          ['--t1' as string]: foundPokemon ? TYPE_COLOR[foundPokemon.type] : undefined,
        }}
      >
        {derivedShow ? (
          <PokemonSelector
            button={trigger}
            handlePokemon={handlePokemon}
            limitGen={form.calculatorGen}
          >
            <PokemonSlot pokemon={foundPokemon} />
          </PokemonSelector>
        ) : name === 'pokemon1' ? (
          <EncounterSelector
            button={trigger}
            encounters={encounters}
            handleEncounter={handleEncounter}
            limitGen={form.calculatorGen}
          >
            <PokemonSlot pokemon={foundPokemon} />
          </EncounterSelector>
        ) : (
          <DetailSelector
            button={trigger}
            details={details[selectedDetail]?.content}
            handleDetail={handleDetail}
            limitGen={form.calculatorGen}
          >
            <PokemonSlot pokemon={foundPokemon} />
          </DetailSelector>
        )}
        {foundPokemon && (
          <span className="ml-auto shrink-0 [&>div]:cursor-default">
            <PokemonType pokemon={foundPokemon} />
          </span>
        )}
      </div>
      {(showGymDetails || name === 'pokemon1') && (
        <div className="flex min-h-[2.286rem] w-full items-center gap-(--spacing-2) text-foreground">
          {showGymDetails && (
            <Select
              aria-label={t('select_gym')}
              className="min-w-0 flex-1"
              clearable
              contained
              data-testid="gym-filter"
              disabled={derivedShow}
              icon={<ChevronDownIcon aria-hidden className="size-[1rem] shrink-0" />}
              look="row"
              onChange={(value) => setSelectedDetail(value === '' ? undefined : Number(value))}
              options={detailsToOptions}
              placeholder={t('select_gym')}
              value={selectedDetail === undefined ? '' : String(selectedDetail)}
            />
          )}
          <label className="flex shrink-0 cursor-pointer items-center gap-(--spacing-2) text-(length:--font-size-2) font-bold">
            <Switch
              checked={showAll}
              className="bg-foreground/20 hover:bg-foreground/30 focus-visible:bg-foreground/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-row-ring"

              data-testid={`show-all-${name}`}
              onCheckedChange={setShowAll}
            />
            {name === 'pokemon1' ? t('show_my') : t('show_all')}
          </label>
          {name === 'pokemon1' && <Help content={t('show_help')} />}
        </div>
      )}
    </div>
  );
}

export default PokeController;
