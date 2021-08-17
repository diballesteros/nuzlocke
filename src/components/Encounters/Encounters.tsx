import React, { useCallback, useMemo, useState } from 'react';
import shallow from 'zustand/shallow';
import { FixedSizeList, ListChildComponentProps as RowProps } from 'react-window';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import useStore from 'store';
import POKEMON from 'constants/pokemon';
import { Nickname, Pokemon, Status } from 'components';
import { ReactComponent as PokeballSVG } from 'assets/svg/pokeball.svg';
import styles from './Encounters.module.scss';

const Encounters: React.FC = React.memo(() => {
  const games = useStore(useCallback((state) => state.games, []));
  const text = useStore(useCallback((state) => state.text, []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const missing = useStore(useCallback((state) => state.missing, []));
  const duplicates = useStore(useCallback((state) => state.duplicates, []));
  const nicknames = useStore(useCallback((state) => state.nicknames, []));
  const selectedGame = useStore(
    useCallback((state) => state.selectedGame, []),
    shallow
  );
  const clearEncounter = useStore(
    useCallback((state) => state.clearEncounter, []),
    shallow
  );
  const deleteEncounter = useStore(
    useCallback((state) => state.deleteEncounter, []),
    shallow
  );
  const [encounterToDelete, setEncounterToDelete] = useState<number>(null);
  const [confirm, setConfirm] = useState(false);

  const alreadyEncountered = useCallback(
    (pokemonId, encounterId, statusId) => {
      return games[selectedGame?.value].encounters?.some((enc) => {
        return (
          enc?.pokemon === pokemonId &&
          enc.id !== encounterId &&
          enc?.status?.value !== 5 &&
          statusId !== 5
        );
      });
    },
    [games, selectedGame]
  );

  const filteredEncounters = useMemo(() => {
    return games[selectedGame?.value]?.encounters?.filter((enc) => {
      const upperCase = text?.toUpperCase();
      const foundPokemon = POKEMON.find((poke) => poke.value === enc.pokemon);
      return (
        (enc.location.toUpperCase()?.includes(upperCase) ||
          enc.status?.text.toUpperCase()?.includes(upperCase) ||
          foundPokemon?.text?.toUpperCase()?.includes(upperCase)) &&
        (!missing || (missing && (!enc.pokemon || !enc.status)))
      );
    });
  }, [games, missing, selectedGame, text]);

  const handleClear = (encounterId: number) => {
    clearEncounter(encounterId);
  };

  const handleConfirm = (encounterId: number) => {
    setEncounterToDelete(encounterId);
    setConfirm(true);
  };

  const handleDelete = () => {
    deleteEncounter(encounterToDelete);
    setConfirm(false);
    setEncounterToDelete(null);
  };

  const renderRow: React.FC<RowProps> = ({ index, style }) => {
    const encounter = filteredEncounters[index];
    return (
      <div style={style} className={index % 2 === 0 ? styles.coloredRow : ''}>
        <div className={styles.row} data-testid={`encounter-${encounter.id}`}>
          <span className={styles.location}>{encounter.location}</span>
          {nicknames && <Nickname encounterId={encounter.id} nickname={encounter.nickname} />}
          <Pokemon
            alreadyEncountered={
              !!encounter?.pokemon && duplicates
                ? alreadyEncountered(encounter?.pokemon, encounter?.id, encounter?.status?.value)
                : false
            }
            encounter={encounter}
          />
          <Status encounterId={encounter.id} status={encounter.status} />
          <Button
            aria-label="reset encounter"
            basic
            className={styles.reset}
            compact
            icon
            inverted={darkMode}
            onClick={() => handleClear(encounter.id)}
            type="button"
          >
            <Icon name="repeat" />
          </Button>
          <Button
            aria-label="delete encounter"
            basic
            className={styles.delete}
            compact
            icon
            inverted={darkMode}
            onClick={() => handleConfirm(encounter.id)}
            type="button"
          >
            <Icon name="trash" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.table}>
      {selectedGame ? (
        <div className={styles.list} data-testid="encounters-list">
          <FixedSizeList
            height={1000}
            itemCount={filteredEncounters?.length}
            itemSize={nicknames ? 182 : 144}
            width="100%"
          >
            {renderRow}
          </FixedSizeList>
        </div>
      ) : (
        <div className={styles.noGame}>
          <PokeballSVG />
          <span>Choose a game</span>
        </div>
      )}
      <Confirm
        closeOnDimmerClick
        content="This will delete the encounter. Are you sure?"
        open={confirm}
        onCancel={() => setConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
});

export default Encounters;
