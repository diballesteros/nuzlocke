import React, { useCallback, useMemo } from 'react';
import shallow from 'zustand/shallow';
import { Label, Menu, Popup, Tab } from 'semantic-ui-react';
import useStore from 'store';
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
        <Menu.Item key="Caught">
          <CaughtSVG className={styles.team} />
          Caught
          <Label>{caughtPokemon?.length}</Label>
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane attached={false} className={`${styles.box} ${styles.grass}`}>
          {caughtPokemon?.map((enc, i) => {
            return (
              <Popup
                key={`caught-${enc.id}-${i + 1}`}
                inverted={darkMode}
                on="click"
                pinned
                position="top center"
                trigger={
                  <img alt={enc.pokemon.text} className={styles.pokemon} src={enc.pokemon.image} />
                }
              >
                <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
                  <span>{enc.pokemon.text}</span>
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
        <Menu.Item key="Team">
          <TeamSVG className={styles.team} />
          Team
          <Label>{teamPokemon?.length}</Label>
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane attached={false} className={`${styles.box} ${styles.city}`}>
          {teamPokemon?.map((enc, i) => {
            return (
              <Popup
                key={`team-${enc.id}-${i + 1}`}
                inverted={darkMode}
                on="click"
                pinned
                position="top center"
                trigger={
                  <img alt={enc.pokemon.text} className={styles.pokemon} src={enc.pokemon.image} />
                }
              >
                <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
                  <span>{enc.pokemon.text}</span>
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
          <Label>{failedPokemon?.length}</Label>
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane attached={false} className={`${styles.box} ${styles.sky}`}>
          {failedPokemon?.map((enc, i) => {
            return (
              <Popup
                key={`failed-${enc.id}-${i + 1}`}
                inverted={darkMode}
                on="click"
                pinned
                position="top center"
                trigger={
                  <img alt={enc.pokemon.text} className={styles.pokemon} src={enc.pokemon.image} />
                }
              >
                <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
                  <span>{enc.pokemon.text}</span>
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
          <Label>{faintedPokemon?.length}</Label>
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane attached={false} className={`${styles.box} ${styles.crag}`}>
          {faintedPokemon?.map((enc, i) => {
            return (
              <Popup
                key={`fainted-${enc.id}-${i + 1}`}
                inverted={darkMode}
                on="click"
                pinned
                position="top center"
                trigger={
                  <img alt={enc.pokemon.text} className={styles.pokemon} src={enc.pokemon.image} />
                }
              >
                <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
                  <span>{enc.pokemon.text}</span>
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
