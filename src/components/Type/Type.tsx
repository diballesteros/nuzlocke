import React, { useCallback } from 'react';
import { TYPE_COLOR } from 'constants/colors';
import TYPE_ICON from 'constants/icons';
import type { Type as TType } from 'constants/types';
import useStore from 'store';

interface TypeProps {
  hideName?: boolean;
  type: TType;
}

function Type({ hideName = false, type }: TypeProps): React.JSX.Element {
  const showTypeModal = useStore(useCallback((state) => state.showTypeModal, []));

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    showTypeModal(type);
  };

  return (
    <button
      aria-label="pokemon type"
      className="flex h-[2.143rem] min-h-[2.143rem] cursor-pointer items-center rounded-[4px] border-0 p-0 font-bold box-content! [font-family:inherit]! text-[length:inherit]! leading-[inherit]! [&>svg]:box-content [&>svg]:w-[1.714rem] [&>svg]:px-(--spacing-0)"
      onClick={handleClick}
      style={{ backgroundColor: TYPE_COLOR[type] }}
      type="button"
    >
      {TYPE_ICON[type]}
      {!hideName && (
        <div className="grid h-full flex-1 place-items-center rounded-r-[3px] bg-type-name px-(--spacing-1) text-white">
          {type}
        </div>
      )}
    </button>
  );
}

export default Type;
