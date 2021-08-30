import React, { useCallback } from 'react';
import useStore from 'store';
import { TYPE_COLOR } from 'constants/colors';
import TYPE_ICON from 'constants/icons';
import { Type as TType } from 'constants/types';
import styles from './Type.module.scss';

interface TypeProps {
  hideName?: boolean;
  type: TType;
}

const Type: React.FC<TypeProps> = ({ hideName = false, type }) => {
  const showTypeModal = useStore(useCallback((state) => state.showTypeModal, []));

  return (
    <button
      className={styles.type}
      onClick={() => showTypeModal(type)}
      style={{ backgroundColor: TYPE_COLOR[type] }}
      type="button"
    >
      {TYPE_ICON[type]}
      {hideName ? null : type}
    </button>
  );
};

export default Type;
