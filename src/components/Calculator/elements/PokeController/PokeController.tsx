import { useCallback, useMemo, useState } from 'react';
import { Control, useController, UseFormReset, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Checkbox, Dropdown } from 'semantic-ui-react';
import { DetailSelector, EncounterSelector, PokemonSelector } from 'common';
import { PokemonSlot } from 'components/Calculator/elements';
import { DEFAULT_POKEMON_1, DEFAULT_POKEMON_2 } from 'constants/calculator';
import DETAILS from 'constants/details';
import { POKEMAP } from 'constants/pokemon';
import { PokemonDetail, TCalculatorForm, TEncounter } from 'constants/types';
import useStore from 'store';
import styles from './PokeController.module.scss';

interface PokeControllerProps {
  control: Control<TCalculatorForm>;
  encounters?: TEncounter[];
  name: 'pokemon1' | 'pokemon2';
  reset: UseFormReset<TCalculatorForm>;
}

function PokeController({ control, encounters, name, reset }: PokeControllerProps): JSX.Element {
  const { t } = useTranslation('calculator');
  const [showAll, setShowAll] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState(undefined);
  const updateDefaultValues = useStore(useCallback((state) => state.updateDefaultValues, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const calc = useStore(useCallback((state) => state.calcs[state.selectedGame?.value], []));
  const calcGen = useWatch({ control, name: 'calculatorGen' });
  const { field } = useController({ control, name });
  const foundPokemon = POKEMAP.get(field.value);

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
      pokemon1: enc.pokemon,
    };
    field.onChange(enc.pokemon);
    updateDefaultValues({ ...DEFAULT_POKEMON_1, ...partialCalc });
    reset({ ...calc.form, ...DEFAULT_POKEMON_1, ...partialCalc });
  };

  const handlePokemon = (pokemonId: number) => {
    const partialCalc: Partial<TCalculatorForm> = {
      [name]: pokemonId,
    };
    field.onChange(pokemonId);
    const DEFAULT = name === 'pokemon1' ? DEFAULT_POKEMON_1 : DEFAULT_POKEMON_2;
    updateDefaultValues({ ...DEFAULT, ...partialCalc });
    reset({ ...calc.form, ...DEFAULT, ...partialCalc });
  };

  const handleDetail = (detail: PokemonDetail) => {
    const partialCalc: Partial<TCalculatorForm> = {
      ...(detail?.ability && { ability2: detail?.ability }),
      ...(detail?.gender && { gender2: detail?.gender }),
      ...(detail?.item && { item2: detail?.item }),
      ...(detail?.level && { level2: detail?.level }),
      ...(detail?.nature && { nature1: detail?.nature }),
      ...(detail?.moves && { move1_2: detail?.moves[0] }),
      ...(detail?.moves && { move2_2: detail?.moves[1] }),
      ...(detail?.moves && { move3_2: detail?.moves[2] }),
      ...(detail?.moves && { move4_2: detail?.moves[3] }),
      pokemon2: detail.id,
    };
    field.onChange(detail.id);
    updateDefaultValues({ ...DEFAULT_POKEMON_2, ...partialCalc });
    reset({ ...calc.form, ...DEFAULT_POKEMON_2, ...partialCalc });
  };

  const detailsToOptions = useMemo(() => {
    if (selectedGame && DETAILS[selectedGame?.value]) {
      return DETAILS[selectedGame.value].flat().map((gym, i) => {
        return {
          value: i,
          text: `${gym.name}${gym.name !== gym.game ? ` - ${gym.game}` : ''}`,
        };
      });
    }
    return [];
  }, [selectedGame]);

  const details = useMemo(() => {
    if (selectedGame && DETAILS[selectedGame?.value]) {
      return DETAILS[selectedGame.value].flat();
    }
    return [];
  }, [selectedGame]);

  const showGymDetails = name === 'pokemon2' && detailsToOptions?.length > 0;

  return (
    <div className={styles.wrapper} data-testid={`pokecontroller-${name}`}>
      {showAll ? (
        <PokemonSelector handlePokemon={handlePokemon} limitGen={calcGen}>
          <PokemonSlot pokemon={foundPokemon} />
        </PokemonSelector>
      ) : name === 'pokemon1' ? (
        <EncounterSelector
          encounters={encounters}
          handleEncounter={handleEncounter}
          limitGen={calcGen}
        >
          <PokemonSlot pokemon={foundPokemon} />
        </EncounterSelector>
      ) : (
        <DetailSelector
          details={details[selectedDetail]?.content}
          handleDetail={handleDetail}
          limitGen={calcGen}
        >
          <PokemonSlot pokemon={foundPokemon} />
        </DetailSelector>
      )}
      {(encounters?.length > 0 || showGymDetails) && (
        <div className={styles.showAll}>
          {showGymDetails && (
            <Dropdown
              aria-label="gym-filter"
              className={styles.dropdown}
              clearable
              data-testid="gym-filter"
              disabled={showAll}
              inline
              labeled
              onChange={(e, data) => setSelectedDetail(data.value)}
              options={detailsToOptions}
              placeholder={t('select_gym')}
              selection
              value={selectedDetail ?? ''}
            />
          )}
          <Checkbox
            checked={showAll}
            className={styles.checkbox}
            data-testid={`show-all-${name}`}
            onChange={(e, data) => setShowAll(data.checked)}
            toggle
          />
          <span>{t('show_all')}</span>
        </div>
      )}
    </div>
  );
}

export default PokeController;
