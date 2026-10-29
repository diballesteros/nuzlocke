import { Move } from 'components';
import { MOVEMAP } from 'constants/moves';

interface MovesProps {
  moves?: number[];
  showStatus?: boolean;
}

function Moves({ moves = [], showStatus = false }: MovesProps): React.JSX.Element {
  return (
    <div className="flex flex-col flex-nowrap gap-(--spacing-1)">
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
