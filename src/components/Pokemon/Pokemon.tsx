import React, { useCallback, useMemo } from 'react';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import shallow from 'zustand/shallow';
import useStore from 'store';
import POKEMON from 'constants/pokemon';
import { TEncounter } from 'constants/types';
import { Evolve } from 'components';
import styles from './Pokemon.module.scss';

interface PokemonProps {
  encounter: TEncounter;
}

const Pokemon: React.FC<PokemonProps> = React.memo(({ encounter }) => {
  const changePokemon = useStore((state) => state.changePokemon);
  const duplicates = useStore(useCallback((state) => state.duplicates, []));
  const showAll = useStore(useCallback((state) => state.showAll, []));
  const games = useStore(useCallback((state) => state.games, []));
  const selectedGame = useStore(
    useCallback((state) => state.selectedGame, []),
    shallow
  );
  const rules = useStore(useCallback((state) => state.rules, []));
  const selectedRuleset = useStore(useCallback((state) => state.selectedRuleset, []));
  const foundPokemon = POKEMON.find((poke) => poke.value === encounter?.pokemon);
  const onChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    changePokemon(encounter.id, data.value as number);
  };

  const alertText = useMemo(() => {
    let alert = '';
    let teamCounter = 0;
    const genRule = rules[selectedRuleset]?.find((rule) => rule.type === 'GENERATION');
    const levelRule = rules[selectedRuleset]?.find((rule) => rule.type === 'LEVEL');
    const typeRule = rules[selectedRuleset]?.find((rule) => rule.type === 'TYPE');
    if (!foundPokemon) {
      return '';
    }
    games[selectedGame?.value].encounters?.forEach((enc) => {
      if (
        duplicates &&
        !!encounter?.pokemon &&
        enc?.pokemon === encounter.pokemon &&
        enc.id !== encounter?.id &&
        enc?.status?.value !== 5 &&
        encounter?.status?.value !== 5
      ) {
        alert = 'DUPE';
      }
      if (encounter?.status?.value === 7 && enc?.status?.value === 7) {
        teamCounter += 1;
      }
      if (
        (genRule?.content as number[])?.length > 0 &&
        !(genRule?.content as number[])?.includes(foundPokemon?.generation)
      ) {
        alert = 'FORBIDDEN GEN';
      }
      if (levelRule?.content < encounter?.details?.level) {
        alert = 'OVERLEVELED';
      }
      if (
        (typeRule?.content as string[])?.length > 0 &&
        !(typeRule?.content as string[])?.includes(foundPokemon?.type) &&
        !(typeRule?.content as string[])?.includes(foundPokemon?.dualtype)
      ) {
        alert = 'FORBIDDEN TYPE';
      }
    });
    if (teamCounter > 6) {
      return 'TEAM OVER 6';
    }
    return alert;
  }, [duplicates, encounter, foundPokemon, games, rules, selectedGame, selectedRuleset]);

  return (
    <label className={styles.label}>
      <div className={styles.innerLabel}>Pokémon: {!!alertText && <span>{alertText}</span>}</div>
      <div className={styles.dropdownContainer}>
        <Dropdown
          aria-label="Pokémon selector"
          basic
          className={styles.pokemonSelect}
          data-testid={`pokemon-${encounter.id}`}
          fluid
          inline
          labeled
          lazyLoad
          onChange={onChange}
          options={
            encounter?.filter && !showAll
              ? POKEMON.filter(
                  (poke) =>
                    encounter?.filter?.includes(poke.text) || encounter.pokemon === poke.value
                )
              : POKEMON
          }
          placeholder="Select..."
          search
          selection
          value={encounter.pokemon ?? null}
        />
        {!!foundPokemon?.evolve && (
          <Evolve encounter={encounter} evolveIds={foundPokemon?.evolve} />
        )}
      </div>
    </label>
  );
});

export default Pokemon;
