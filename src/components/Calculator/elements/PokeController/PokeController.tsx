import { useCallback, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DetailSelector, EncounterSelector, PokemonSelector } from 'common';
import { Help, PokemonSlot } from 'components/Calculator/elements';
import { DEFAULT_POKEMON_1, DEFAULT_POKEMON_2 } from 'constants/calculator';
import DETAILS from 'constants/details';
import { POKEMAP } from 'constants/pokemon';
import type { PokemonDetail, TCalculatorForm, TEncounter } from 'constants/types';
import useStore from 'store';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface PokeControllerProps {
  encounters?: TEncounter[];
  name: 'pokemon1' | 'pokemon2';
}

function PokeController({ encounters, name }: PokeControllerProps): React.JSX.Element {
  const { t } = useTranslation('calculator');
  const [showAll, setShowAll] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState<number>(undefined);
  const showLabel = useId();
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

  return (
    <div
      className="col-span-full flex flex-col flex-nowrap items-center gap-(--spacing-2) text-foreground [&>div:first-child]:w-full [&>div:first-child]:flex-1"
      data-testid={`pokecontroller-${name}`}
    >
      {derivedShow ? (
        <PokemonSelector handlePokemon={handlePokemon} limitGen={form.calculatorGen}>
          <PokemonSlot pokemon={foundPokemon} />
        </PokemonSelector>
      ) : name === 'pokemon1' ? (
        <EncounterSelector
          encounters={encounters}
          handleEncounter={handleEncounter}
          limitGen={form.calculatorGen}
        >
          <PokemonSlot pokemon={foundPokemon} />
        </EncounterSelector>
      ) : (
        <DetailSelector
          details={details[selectedDetail]?.content}
          handleDetail={handleDetail}
          limitGen={form.calculatorGen}
        >
          <PokemonSlot pokemon={foundPokemon} />
        </DetailSelector>
      )}
      {(showGymDetails || name === 'pokemon1') && (
        <div className="flex w-full items-center gap-(--spacing-2) self-end text-foreground">
          {showGymDetails && (
            <Select
              aria-label="gym-filter"
              caret="font"
              className="mr-auto max-w-[70%] [&_[data-slot=select]]:text-black [&_[data-slot=select][data-placeholder]>span]:text-field-placeholder"
              clearable
              contained
              data-testid="gym-filter"
              disabled={derivedShow}
              look="inline"
              onChange={(value) => setSelectedDetail(value === '' ? undefined : Number(value))}
              options={detailsToOptions}
              placeholder={t('select_gym')}
              value={selectedDetail === undefined ? '' : String(selectedDetail)}
            />
          )}
          <Switch
            aria-labelledby={showLabel}
            checked={showAll}
            className="ml-auto!"
            data-testid={`show-all-${name}`}
            onCheckedChange={setShowAll}
          />
          <span id={showLabel}>{name === 'pokemon1' ? t('show_my') : t('show_all')}</span>
          {name === 'pokemon1' && <Help content={t('show_help')} />}
        </div>
      )}
    </div>
  );
}

export default PokeController;
