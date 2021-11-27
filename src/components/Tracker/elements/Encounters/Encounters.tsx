import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FixedSizeList, ListChildComponentProps as RowProps } from 'react-window';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import shallow from 'zustand/shallow';
import { Status } from 'components';
import { Detail, Nickname, Pokemon } from 'components/Tracker/elements';
import { TYPE_COLOR } from 'constants/colors';
import { POKEMAP } from 'constants/pokemon';
import useStore from 'store';
import { ReactComponent as PokeballSVG } from 'assets/svg/pokeball.svg';
import styles from './Encounters.module.scss';

const Encounters = React.memo(function Encounters() {
  const { t } = useTranslation('tracker');
  const games = useStore(useCallback((state) => state.games, []));
  const text = useStore(useCallback((state) => state.text, []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const missing = useStore(useCallback((state) => state.missing, []));
  const gens = useStore(useCallback((state) => state.gens, []));
  const types = useStore(useCallback((state) => state.types, []));
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
      const foundPokemon = POKEMAP.get(enc.pokemon);
      return (
        (enc.location.toUpperCase()?.includes(upperCase) ||
          enc.status?.text.toUpperCase()?.includes(upperCase) ||
          foundPokemon?.text?.toUpperCase()?.includes(upperCase)) &&
        (gens.length > 0 ? gens.includes(foundPokemon?.generation) : true) &&
        (types.length > 0
          ? types.includes(foundPokemon?.type) || types.includes(foundPokemon?.dualtype)
          : true) &&
        (!missing || (missing && (!enc.pokemon || !enc.status)))
      );
    });
  }, [games, gens, missing, selectedGame, text, types]);

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
    toast.success('Successfully deleted encounter');
  };

  const renderRow: React.FC<RowProps> = ({ index, style }) => {
    const encounter = filteredEncounters[index];
    const foundPokemon = POKEMAP.get(encounter.pokemon);
    return (
      <div style={style}>
        <div
          className={`${styles.row} ${encounter?.pokemon ? styles.type : ''}`}
          data-testid={`encounter-${index}`}
          style={{
            borderImage: encounter?.pokemon
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
            height={690}
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
          <span>{t('please_select', { ns: 'common' })}</span>
        </div>
      )}
      <Confirm
        closeOnDimmerClick
        content={t('delete_confirm')}
        open={confirm}
        onCancel={() => setConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
});

export default Encounters;
