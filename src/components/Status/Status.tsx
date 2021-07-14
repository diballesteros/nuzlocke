import React from 'react';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import useStore from 'store';
import STATUSES from 'constants/status';
import { TStatus } from 'constants/types';
import styles from './Status.module.scss';

interface StatusProps {
  encounterId: number;
  status: TStatus;
}

const Status: React.FC<StatusProps> = React.memo(({ encounterId, status }) => {
  const changeStatus = useStore((state) => state.changeStatus);
  const handleChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const foundStatus = STATUSES.find((stat) => stat.value === data.value);
    changeStatus(encounterId, foundStatus);
  };

  return (
    <label className={styles.label}>
      Status:{' '}
      <Dropdown
        aria-label="status-selector"
        className={styles.statusSelect}
        fluid
        id={`status-select-${encounterId}`}
        inline
        lazyLoad
        onChange={handleChange}
        placeholder="Select..."
        selection
        options={STATUSES}
        value={status?.value ?? ''}
      />
    </label>
  );
});

export default Status;
