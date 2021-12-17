import { Move } from 'components';
import { MOVEMAP } from 'constants/moves';
import styles from './Moves.module.scss';

interface MovesProps {
  moves?: number[];
  showStatus?: boolean;
}

function Moves({ moves = [], showStatus = false }: MovesProps): JSX.Element {
  return (
    <div className={styles.moves}>
      {moves?.map((move, i) => {
        const moveDetail = MOVEMAP.get(move);
        return (
          !!moveDetail && (
            <Move key={`move-${move}-${i + 1}`} moveDetail={moveDetail} showStatus={showStatus} />
          )
        );
      })}
    </div>
  );
}

export default Moves;
