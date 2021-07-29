import React, { useCallback, useMemo } from 'react';
import shallow from 'zustand/shallow';
import { Icon, Label, Menu, Tab } from 'semantic-ui-react';
import useStore from 'store';
import { ReactComponent as FaintedSVG } from 'assets/svg/fainted.svg';
import { ReactComponent as CaughtSVG } from 'assets/svg/caught.svg';
import { ReactComponent as TeamSVG } from 'assets/svg/team.svg';
import styles from './Pokestats.module.scss';

const Pokestats: React.FC = () => {
  const games = useStore(useCallback((state) => state.games, []));
  const selectedGame = useStore(
    useCallback((state) => state.selectedGame, []),
    shallow
  );

  const caughtPokemon = useMemo(() => {
    return games[selectedGame?.value]?.encounters?.filter((enc) => {
      return enc?.status?.value === 1;
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
      render: () => <Tab.Pane attached={false}>test</Tab.Pane>,
    },
    {
      menuItem: (
        <Menu.Item key="Team">
          <TeamSVG className={styles.team} />
          Team
          <Label>{teamPokemon?.length}</Label>
        </Menu.Item>
      ),
      render: () => <Tab.Pane attached={false}>test</Tab.Pane>,
    },
    {
      menuItem: (
        <Menu.Item key="failed">
          <Icon name="ban" />
          Failed
          <Label>{failedPokemon?.length}</Label>
        </Menu.Item>
      ),
      render: () => <Tab.Pane attached={false}>test</Tab.Pane>,
    },
    {
      menuItem: (
        <Menu.Item key="fainted">
          <FaintedSVG className={styles.fainted} />
          Fainted
          <Label>{faintedPokemon?.length}</Label>
        </Menu.Item>
      ),
      render: () => <Tab.Pane attached={false}>test</Tab.Pane>,
    },
  ];

  return (
    <div className={styles.pokestats}>
      <Tab menu={{ secondary: true }} panes={panes} />
    </div>
  );
};

export default Pokestats;
