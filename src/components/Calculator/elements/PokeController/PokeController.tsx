import { useCallback, useState } from 'react';
import { Control, useController, UseFormReset } from 'react-hook-form';
import { Checkbox } from 'semantic-ui-react';
import { EncounterSelector, PokemonSelector } from 'common';
import { PokemonSlot } from 'components/Calculator/elements';
import { DEFAULT_VALUES } from 'constants/calculator';
import { POKEMAP } from 'constants/pokemon';
import { TCalculatorForm, TEncounter } from 'constants/types';
import useStore from 'store';
import styles from './PokeController.module.scss';

interface PokeControllerProps {
  control: Control<TCalculatorForm>;
  encounters?: TEncounter[];
  name: 'pokemon1' | 'pokemon2';
  reset: UseFormReset<TCalculatorForm>;
}

function PokeController({ control, encounters, name, reset }: PokeControllerProps): JSX.Element {
  const [showAll, setShowAll] = useState(true);
  const updateDefaultValues = useStore(useCallback((state) => state.updateDefaultValues, []));
  const calc = useStore(useCallback((state) => state.calcs[state.selectedGame?.value], []));
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
    updateDefaultValues(partialCalc);
    reset({ ...calc.form, ...partialCalc });
  };

  const handlePokemon = (pokemonId: number) => {
    const partialCalc: Partial<TCalculatorForm> = {
      [name]: pokemonId,
    };
    field.onChange(pokemonId);
    updateDefaultValues({ ...DEFAULT_VALUES, ...partialCalc });
    reset({ ...DEFAULT_VALUES, ...partialCalc });
  };

  return (
    <div className={styles.wrapper}>
      {showAll ? (
        <PokemonSelector handlePokemon={handlePokemon}>
          <PokemonSlot pokemon={foundPokemon} />
        </PokemonSelector>
      ) : name === 'pokemon1' ? (
        <EncounterSelector handleEncounter={handleEncounter} encounters={encounters}>
          <PokemonSlot pokemon={foundPokemon} />
        </EncounterSelector>
      ) : (
        <div>test</div>
      )}
      {encounters?.length > 0 && (
        <Checkbox
          checked={showAll}
          className={styles.checkbox}
          onChange={(e, data) => setShowAll(data.checked)}
          label="Show all"
          toggle
        />
      )}
    </div>
  );
}

export default PokeController;
