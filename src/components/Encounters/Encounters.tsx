import React, { useCallback, useMemo, useState } from 'react';
import shallow from 'zustand/shallow';
import { FixedSizeList, ListChildComponentProps as RowProps } from 'react-window';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import useStore from 'store';
import POKEMON from 'constants/pokemon';
import { TYPE_COLOR } from 'constants/colors';
import { Detail, Nickname, Pokemon, Status } from 'components';
import { ReactComponent as PokeballSVG } from 'assets/svg/pokeball.svg';
import styles from './Encounters.module.scss';

const Encounters: React.FC = React.memo(() => {
  const games = useStore(useCallback((state) => state.games, []));
  const text = useStore(useCallback((state) => state.text, []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const missing = useStore(useCallback((state) => state.missing, []));

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
    const foundPokemon = POKEMON.find((poke) => poke.value === encounter.pokemon);
    return (
      <div style={style}>
        <div
          className={`${styles.row} ${!!encounter?.pokemon ? styles.type : ''}`}
          data-testid={`encounter-${encounter.id}`}
          style={{
            borderImage: !!encounter?.pokemon
              ? `linear-gradient(to left, ${
                  TYPE_COLOR[foundPokemon?.dualtype || foundPokemon?.type]
                } , ${TYPE_COLOR[foundPokemon.type]}) 1`
              : undefined,
          }}
        >
          <div className={styles.header}>
            <span className={styles.location}>{encounter.location}</span>
            <div className={styles.buttons}>
              {!!encounter.pokemon && <Detail encounter={encounter} />}
              <Button
                aria-label="reset encounter"
                basic
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
          {nicknames && <Nickname encounterId={encounter.id} nickname={encounter.nickname} />}
          <Pokemon encounter={encounter} />
          <Status encounterId={encounter.id} status={encounter.status} />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.table}>
      {selectedGame ? (
        <div className={styles.list} data-testid="encounters-list">
          <FixedSizeList
            height={655}
            itemCount={filteredEncounters?.length}
            itemSize={nicknames ? 190 : 152}
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
