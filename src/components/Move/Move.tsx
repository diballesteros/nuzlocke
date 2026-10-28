import { Type } from 'components';
import { CATEGORY_COLOR, TYPE_COLOR } from 'constants/colors';
import type { TMove } from 'constants/types';

interface MoveProps {
  moveDetail: TMove;
  showStatus: boolean;
}

function Move({ moveDetail, showStatus }: MoveProps): React.JSX.Element {
  return (
    <div
      className="flex h-[2.143rem] max-h-[2.143rem] flex-1 flex-row flex-nowrap items-center gap-(--spacing-1) rounded-[4px] hover:cursor-pointer hover:[transform:scale(1.01)]"
      style={{ backgroundColor: `${TYPE_COLOR[moveDetail.type]}90` }}
    >
      <Type hideName type={moveDetail.type} />
      <span className="text-(length:--font-size-3) font-bold text-foreground">
        {moveDetail.name}
      </span>
      {showStatus && (
        <img
          alt="move status"
          className="mr-(--spacing-9) ml-auto h-[1.286rem] w-[2.857rem]"
          src={CATEGORY_COLOR[moveDetail.category]}
          title={moveDetail.category}
        />
      )}
    </div>
  );
}

export default Move;
