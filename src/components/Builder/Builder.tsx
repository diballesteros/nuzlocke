import React, { useCallback } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import useStore from 'store';
import { Member } from 'components';
import { PokemonSelector } from 'common';
import { ReactComponent as PokeballSVG } from 'assets/svg/pokeball.svg';
import styles from './Builder.module.scss';

const Builder: React.FC = () => {
  const team = useStore(
    useCallback(
      (state) => (state?.selectedGame?.value ? state.team[state?.selectedGame?.value] : null),
      []
    )
  );
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const addTeamMember = useStore(useCallback((state) => state.addTeamMember, []));
  const handlePokemon = (id: number) => {
    addTeamMember(id);
  };
  return (
    <div className={styles.builder}>
      {team?.length > 0 ? (
        <div className={styles.team}>
          {team?.map((poke, i) => {
            return <Member index={i} key={`team-${poke.id}`} pokemonDetail={poke} />;
          })}
        </div>
      ) : (
        <div className={styles.placeholder}>
          <PokeballSVG />
          {selectedGame ? (
            <span>Press + to begin building a team</span>
          ) : (
            <span>Select a game to begin</span>
          )}
        </div>
      )}
      {selectedGame && (
        <PokemonSelector handlePokemon={handlePokemon}>
          <Button
            circular
            className={styles.button}
            data-testid="builder-add"
            disabled={team?.length === 6}
            icon="plus"
            type="button"
          />
        </PokemonSelector>
      )}
    </div>
  );
};

export default Builder;
