import React, { useContext } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import STATUSES from 'constants/status';
import { TStatus } from 'constants/types';
import AppContext from 'context/AppContext';
import styles from './Status.module.scss';

interface StatusProps {
  encounterId: number;
  status: TStatus;
}

const Status: React.FC<StatusProps> = React.memo(({ encounterId, status }) => {
  const { dispatch } = useContext(AppContext);
  const handleChange = (
    event: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>
  ) => {
    const foundStatus = STATUSES.find((stat) => stat.id === event.target.value);
    dispatch({ type: 'CHANGE_STATUS', payload: { encounterId, status: foundStatus } });
  };

  return (
    <Select
      className={styles.statusSelect}
      id={`status-select-${encounterId}`}
      onChange={handleChange}
      value={status?.id ?? ''}
    >
      {STATUSES.map((stat) => {
        return (
          <MenuItem key={stat.name} value={stat.id}>
            {stat.name}
          </MenuItem>
        );
      })}
    </Select>
  );
});

export default Status;
