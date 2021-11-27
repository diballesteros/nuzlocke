import React from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import STATUSES from 'constants/status';
import { TStatus } from 'constants/types';
import useStore from 'store';
import styles from './Status.module.scss';

interface StatusProps {
  encounterId: number;
  status: TStatus;
}

const Status = React.memo(function Status({ encounterId, status }: StatusProps) {
  const { t } = useTranslation('common');
  const changeStatus = useStore((state) => state.changeStatus);
  const handleChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const foundStatus = STATUSES.find((stat) => stat.value === data.value);
    changeStatus(encounterId, foundStatus);
  };

  return (
    <div className={styles.label}>
      <div className={styles.innerLabel}>{t('status')}:</div>
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
        placeholder={`${t('select')}...`}
        selection
        value={status?.value ?? ''}
      />
    </div>
  );
});

export default Status;
