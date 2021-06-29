import React, { useCallback, useMemo } from 'react';
import shallow from 'zustand/shallow';
import { FixedSizeList, ListChildComponentProps as RowProps } from 'react-window';
import IconButton from '@material-ui/core/IconButton';
import ClearAll from '@material-ui/icons/ClearAll';
import useStore from 'store';
import { Pokemon, Status } from 'components';
import useDimensions from 'hooks/useDimensions';
import styles from './Encounters.module.scss';

const Encounters: React.FC = React.memo(() => {
  const games = useStore(useCallback((state) => state.games, []));
  const text = useStore(useCallback((state) => state.text, []));
  const selectedGame = useStore(
    useCallback((state) => state.selectedGame, []),
    shallow
  );
  const clearEncounter = useStore(
    useCallback((state) => state.clearEncounter, []),
    shallow
  );
  const [containerRef, containerSize] = useDimensions(true);

  const filteredGames = useMemo(() => {
    return games[selectedGame?.id]?.encounters?.filter((enc) => {
      const upperCase = text?.toUpperCase();
      return (
        enc.location.toUpperCase()?.includes(upperCase) ||
        enc.status?.name.toUpperCase()?.includes(upperCase) ||
        enc.pokemon?.name?.toUpperCase()?.includes(upperCase)
      );
    });
  }, [games, selectedGame, text]);

  const handleClear = (encounterId: number) => {
    clearEncounter(encounterId);
  };

  const renderRow: React.FC<RowProps> = ({ index, style }) => {
    const encounter = filteredGames[index];
    return (
      <div style={style} className={index % 2 === 0 ? styles.coloredRow : ''}>
        <div className={styles.row}>
          <div>{encounter.location}</div>
          <Pokemon encounterId={encounter.id} pokemon={encounter.pokemon} />
          <Status encounterId={encounter.id} status={encounter.status} />
          <IconButton
            aria-label="delete"
            onClick={() => handleClear(encounter.id)}
            className={styles.delete}
          >
            <ClearAll />
          </IconButton>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.table}>
      <div className={`${styles.row} ${styles.tableHeader}`}>
        <div>LOCATION</div>
        <div>ENCOUNTER</div>
        <div>STATUS</div>
        <div style={{ width: 48 }} />
      </div>
      <div className={styles.list} ref={containerRef}>
        <FixedSizeList
          height={!!containerSize?.height ? containerSize.height : 100}
          itemCount={filteredGames?.length}
          itemSize={68}
          width="100%"
        >
          {renderRow}
        </FixedSizeList>
      </div>
    </div>
  );
});

export default Encounters;
