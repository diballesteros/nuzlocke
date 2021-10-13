import { useCallback, useState } from 'react';
import { Control, useController, UseFormReset } from 'react-hook-form';
import { Checkbox } from 'semantic-ui-react';
import { EncounterSelector, PokemonSelector } from 'common';
import { PokemonType } from 'components';
import { TYPE_COLOR } from 'constants/colors';
import { POKEMAP } from 'constants/pokemon';
import { TCalculatorForm, TEncounter, TPokemon } from 'constants/types';
import useStore from 'store';
import styles from './PokeController.module.scss';

interface PokeControllerProps {
  control: Control<TCalculatorForm>;
  encounters?: TEncounter[];
  name: 'pokemon1' | 'pokemon2';
  reset: UseFormReset<TCalculatorForm>;
}

function PokemonSlot({ pokemon }: { pokemon: TPokemon }) {
  return (
    <div className={styles.selector} style={{ backgroundColor: `${TYPE_COLOR[pokemon.type]}50` }}>
      <div className={styles.info}>
        <img alt={pokemon?.text} src={pokemon?.image} />
        <span>{pokemon.text}</span>
      </div>
      <PokemonType pokemon={pokemon} />
    </div>
  );
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
      ...(enc.details?.moves && { poke1move1: enc.details?.moves[0] }),
      ...(enc.details?.moves && { poke1move2: enc.details?.moves[1] }),
      ...(enc.details?.moves && { poke1move3: enc.details?.moves[2] }),
      ...(enc.details?.moves && { poke1move4: enc.details?.moves[2] }),
      pokemon1: enc.pokemon,
    };
    field.onChange(enc.pokemon);
    updateDefaultValues(partialCalc);
    reset({ ...calc.form, ...partialCalc });
  };

  return (
    <div className={styles.wrapper}>
      {showAll ? (
        <PokemonSelector handlePokemon={field.onChange}>
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
        />
      )}
    </div>
  );
}

export default PokeController;
