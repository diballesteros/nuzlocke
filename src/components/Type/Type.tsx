import React, { useCallback } from 'react';
import { TYPE_COLOR } from 'constants/colors';
import TYPE_ICON from 'constants/icons';
import type { Type as TType } from 'constants/types';
import useStore from 'store';
import styles from './Type.module.scss';

interface TypeProps {
  hideName?: boolean;
  type: TType;
}

function Type({ hideName = false, type }: TypeProps): JSX.Element {
  const showTypeModal = useStore(useCallback((state) => state.showTypeModal, []));

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    showTypeModal(type);
  };

  return (
    <button
      aria-label="pokemon type"
      className={styles.type}
      onClick={handleClick}
      style={{ backgroundColor: TYPE_COLOR[type] }}
      type="button"
    >
      {TYPE_ICON[type]}
      {!hideName && <div className={styles.text}>{type}</div>}
    </button>
  );
}

export default Type;
