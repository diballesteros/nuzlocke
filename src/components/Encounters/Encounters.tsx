import React from 'react';
import { FixedSizeList, ListChildComponentProps as RowProps } from 'react-window';
import { IconButton } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import useStore from 'store';
import { Pokemon, Status } from 'components';
import useDimensions from 'hooks/useDimensions';
import styles from './Encounters.module.scss';

const Encounters: React.FC = () => {
  const { games, selectedGame } = useStore((state) => state);
  const [containerRef, containerSize] = useDimensions(true);

  const renderRow: React.FC<RowProps> = ({ index, style }) => {
    const encounter = games[selectedGame?.id].encounters[index];
    return (
      <div style={style} className={index % 2 === 0 ? styles.coloredRow : ''}>
        <div className={styles.row}>
          <div>{encounter.location}</div>
          <Pokemon encounterId={encounter.id} pokemon={encounter.pokemon} />
          <Status encounterId={encounter.id} status={encounter.status} />
          <IconButton aria-label="delete">
            <Delete />
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
          className={styles.task__card}
          height={!!containerSize?.height ? containerSize.height : 100}
          itemCount={games[selectedGame?.id]?.encounters?.length}
          itemSize={68}
          width="100%"
        >
          {renderRow}
        </FixedSizeList>
      </div>
    </div>
  );
};

export default Encounters;
