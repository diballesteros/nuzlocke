import React, { useCallback, useMemo } from 'react';
import shallow from 'zustand/shallow';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import useStore from 'store';
import POKEMON from 'constants/pokemon';
import { ReactComponent as FaintedSVG } from 'assets/svg/fainted.svg';
import { ReactComponent as FailedSVG } from 'assets/svg/failed.svg';
import { ReactComponent as CaughtSVG } from 'assets/svg/caught.svg';
import { ReactComponent as TeamSVG } from 'assets/svg/team.svg';
import styles from './Pokestats.module.scss';

const Pokestats: React.FC = () => {
  const games = useStore(useCallback((state) => state.games, []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const selectedGame = useStore(
    useCallback((state) => state.selectedGame, []),
    shallow
  );

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

  const teamPokemon = useMemo(() => {
    return games[selectedGame?.value]?.encounters?.filter((enc) => {
      return enc?.status?.value === 7;
    });
  }, [games, selectedGame]);

  const panes = [
    {
      menuItem: (
        <Menu.Item key="Team">
          <TeamSVG className={styles.team} />
          Team
          <Label>{teamPokemon?.length || 0}</Label>
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane attached={false} className={`${styles.box} ${styles.team}`}>
          {teamPokemon?.map((enc, i) => {
            const foundPokemon = POKEMON.find((poke) => poke.value === enc.pokemon);
            return (
              <div className={styles.member} key={`team-${enc.id}-${i + 1}`}>
                <Popup
                  key={`team-${enc.id}-${i + 1}`}
                  inverted={darkMode}
                  on="click"
                  pinned
                  position="top center"
                  trigger={
                    <div className={styles.pokeball}>
                      <img
                        alt={foundPokemon?.text}
                        className={styles.pokemon}
                        src={foundPokemon?.image}
                      />
                      <div className={styles.center} />
                    </div>
                  }
                >
                  <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
                    <span>Met at: {enc.location}</span>
                  </div>
                </Popup>
                <span className={styles.name}>{enc.nickname || foundPokemon?.text}</span>
                <div className={styles.lineOne} />
                <div className={styles.lineTwo} />
              </div>
            );
          })}
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="Caught">
          <CaughtSVG className={styles.team} />
          Caught
          <Label>{caughtPokemon?.length || 0}</Label>
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane attached={false} className={`${styles.box} ${styles.grass}`}>
          {caughtPokemon?.map((enc, i) => {
            const foundPokemon = POKEMON.find((poke) => poke.value === enc.pokemon);
            return (
              <Popup
                key={`caught-${enc.id}-${i + 1}`}
                inverted={darkMode}
                on="click"
                pinned
                position="top center"
                trigger={
                  <img
                    alt={foundPokemon?.text}
                    className={styles.pokemon}
                    src={foundPokemon?.image}
                  />
                }
              >
                <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
                  <span>{foundPokemon?.text}</span>
                  <span>Met at: {enc.location}</span>
                  {enc.nickname && <span>Nickname: {enc.nickname}</span>}
                </div>
              </Popup>
            );
          })}
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="failed">
          <FailedSVG className={styles.fainted} />
          Failed
          <Label>{failedPokemon?.length || 0}</Label>
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane attached={false} className={`${styles.box} ${styles.sky}`}>
          {failedPokemon?.map((enc, i) => {
            const foundPokemon = POKEMON.find((poke) => poke.value === enc.pokemon);
            return (
              <Popup
                key={`failed-${enc.id}-${i + 1}`}
                inverted={darkMode}
                on="click"
                pinned
                position="top center"
                trigger={
                  <img
                    alt={foundPokemon?.text}
                    className={styles.pokemon}
                    src={foundPokemon?.image}
                  />
                }
              >
                <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
                  <span>{foundPokemon?.text}</span>
                  <span>Met at: {enc.location}</span>
                  {enc.nickname && <span>Nickname: {enc.nickname}</span>}
                </div>
              </Popup>
            );
          })}
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="fainted">
          <FaintedSVG className={styles.fainted} />
          Fainted
          <Label>{faintedPokemon?.length || 0}</Label>
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane attached={false} className={`${styles.box} ${styles.crag}`}>
          {faintedPokemon?.map((enc, i) => {
            const foundPokemon = POKEMON.find((poke) => poke.value === enc.pokemon);
            return (
              <Popup
                key={`fainted-${enc.id}-${i + 1}`}
                inverted={darkMode}
                on="click"
                pinned
                position="top center"
                trigger={
                  <img
                    alt={foundPokemon?.text}
                    className={styles.pokemon}
                    src={foundPokemon?.image}
                  />
                }
              >
                <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
                  <span>{foundPokemon?.text}</span>
                  <span>Met at: {enc.location}</span>
                  {enc.nickname && <span>Nickname: {enc.nickname}</span>}
                </div>
              </Popup>
            );
          })}
        </Tab.Pane>
      ),
    },
  ];

  return (
    <div className={styles.pokestats}>
      <Tab className={styles.tabs} menu={{ secondary: true }} panes={panes} />
    </div>
  );
};

export default Pokestats;
