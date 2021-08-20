import React, { useCallback, useMemo } from 'react';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import useStore from 'store';
import shallow from 'zustand/shallow';
import POKEMON from 'constants/pokemon';
import { ReactComponent as FaintedSVG } from 'assets/svg/fainted.svg';
import { ReactComponent as FailedSVG } from 'assets/svg/failed.svg';
import { ReactComponent as CaughtSVG } from 'assets/svg/caught.svg';
import { Moves, PokeInfo } from 'components';
import styles from './Summary.module.scss';

const Summary: React.FC = () => {
  const games = useStore(useCallback((state) => state.games, []));
  const badges = useStore(useCallback((state) => state.badges, []));
  const selectedGame = useStore(
    useCallback((state) => state.selectedGame, []),
    shallow
  );

  const teamPokemon = useMemo(() => {
    return games[selectedGame?.value]?.encounters?.filter((enc) => {
      return enc?.status?.value === 7;
    });
  }, [games, selectedGame]);

  const caughtPokemon = useMemo(() => {
    return games[selectedGame?.value]?.encounters?.filter((enc) => {
      return (
        enc?.status?.value === 1 ||
        enc?.status?.value === 3 ||
        enc?.status?.value === 4 ||
        enc?.status?.value === 6 ||
        enc?.status?.value === 7
      );
    });
  }, [games, selectedGame]);

  const faintedPokemon = useMemo(() => {
    return games[selectedGame?.value]?.encounters?.filter((enc) => {
      return enc?.status?.value === 2;
    });
  }, [games, selectedGame]);

  const failedPokemon = useMemo(() => {
    return games[selectedGame?.value]?.encounters?.filter((enc) => {
      return enc?.status?.value === 5;
    });
  }, [games, selectedGame]);

  return (
    <div className={styles.container}>
      <div className={styles.summary}>
        <div className={styles.header}>
          <span>Nuzlocke Run</span> <b style={{ color: 'green' }}>COMPLETE</b>
          <div className={styles.badges}>
            {!!selectedGame &&
              badges[selectedGame?.value]?.map((badge, index) => {
                return (
                  <img
                    alt={badge.name}
                    className={`${styles.badge} ${
                      index <= games[selectedGame?.value]?.badge ? styles.active : ''
                    }`}
                    key={`${badge.name}-${badge.id}`}
                    src={badge.src}
                  />
                );
              })}
          </div>
        </div>
        <div className={styles.card}>
          <span className={styles.title}>TEAM</span>
          <div className={styles.team}>
            {teamPokemon.map((enc) => {
              const foundPokemon = POKEMON.find((poke) => poke.value === enc.pokemon);
              return (
                <div className={styles.pokemon} key={`team-${enc.id}`}>
                  <img src={foundPokemon?.image} alt={foundPokemon?.text} />
                  <PokeInfo encounter={enc} pokemon={foundPokemon} />
                  <Moves moves={enc?.details?.moves} />
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.row}>
          <div className={`${styles.card} ${styles.large}`}>
            <span className={styles.title}>ENCOUNTERS</span>
          </div>
          <div className={`${styles.card} ${styles.small}`}>
            <span className={styles.title}>STATS</span>
            <div className={styles.stat}>
              <CaughtSVG className={styles.team} />
              <b>Caught</b>
              <Label>{caughtPokemon?.length || 0}</Label>
            </div>
            <div className={styles.stat}>
              <FailedSVG className={styles.team} />
              <b>Failed</b>
              <Label>{failedPokemon?.length || 0}</Label>
            </div>
            <div className={styles.stat}>
              <FaintedSVG className={styles.team} />
              <b>Fainted</b>
              <Label>{faintedPokemon?.length || 0}</Label>
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={`${styles.card} ${styles.medium}`}>
            <span className={styles.title}>RULES</span>
          </div>
          <div className={`${styles.card} ${styles.medium}`}>
            <span className={styles.title}>DESCRIPTION</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
