import React, { useCallback } from 'react';
import { selectCaught, selectFailed, selectFainted, selectTeam } from 'selectors';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import { PokeInfo } from 'components';
import { Summary, Tip } from 'components/Pokestats/elements';
import POKEMON from 'constants/pokemon';
import useStore from 'store';
import { ReactComponent as CaughtSVG } from 'assets/svg/caught.svg';
import { ReactComponent as FailedSVG } from 'assets/svg/failed.svg';
import { ReactComponent as FaintedSVG } from 'assets/svg/fainted.svg';
import { ReactComponent as SummarySVG } from 'assets/svg/summary.svg';
import { ReactComponent as TeamSVG } from 'assets/svg/team.svg';
import styles from './Pokestats.module.scss';

const Pokestats: React.FC = () => {
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const teamPokemon = useStore(selectTeam);
  const faintedPokemon = useStore(selectFainted);
  const caughtPokemon = useStore(selectCaught);
  const failedPokemon = useStore(selectFailed);

  const panes = [
    {
      menuItem: (
        <Menu.Item key="overview">
          <SummarySVG className={styles.team} />
          Summary
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane>
          <Summary />
        </Tab.Pane>
      ),
    },
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
          {teamPokemon?.length > 0 ? (
            teamPokemon?.map((enc, i) => {
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
                      <div className={styles.pokeball} data-testid={`team-${enc.id}`}>
                        <img
                          alt={foundPokemon?.text}
                          className={styles.pokemon}
                          src={foundPokemon?.image}
                        />
                        <div className={styles.center} />
                      </div>
                    }
                  >
                    <PokeInfo encounter={enc} pokemon={foundPokemon} />
                  </Popup>
                  <div className={styles.memberText}>
                    <span>{enc.nickname || foundPokemon?.text}</span>
                    {!!enc?.details?.level && <span>Lv. {enc.details.level}</span>}
                  </div>
                  <div className={styles.lineOne} />
                  <div className={styles.lineTwo} />
                </div>
              );
            })
          ) : (
            <Tip missing="Team" />
          )}
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
          {caughtPokemon?.length > 0 ? (
            caughtPokemon?.map((enc, i) => {
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
                  <PokeInfo encounter={enc} pokemon={foundPokemon} />
                </Popup>
              );
            })
          ) : (
            <Tip missing="Captured,  Gifted, Traded, Shiny or Team" />
          )}
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
          {failedPokemon?.length > 0 ? (
            failedPokemon?.map((enc, i) => {
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
                  <PokeInfo encounter={enc} pokemon={foundPokemon} />
                </Popup>
              );
            })
          ) : (
            <Tip missing="Failed" />
          )}
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
          {faintedPokemon?.length > 0 ? (
            faintedPokemon?.map((enc, i) => {
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
                  <PokeInfo encounter={enc} pokemon={foundPokemon} />
                </Popup>
              );
            })
          ) : (
            <Tip missing="Fainted" />
          )}
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
