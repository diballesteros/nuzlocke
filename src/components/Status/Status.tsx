import React from 'react';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
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
    <div className={styles.label}>
      <div className={styles.innerLabel}>Status:</div>
      <Dropdown
        aria-label="status-selector"
        basic
        className={styles.statusSelect}
        data-testid={`status-${encounterId}`}
        fluid
        inline
        labeled
        lazyLoad
        onChange={handleChange}
        options={STATUSES}
        placeholder="Select..."
        selection
        value={status?.value ?? ''}
      />
    </div>
  );
});

export default Status;
