import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import STATUSES from 'constants/status';
import type { TEncounter } from 'constants/types';
import useStore from 'store';
import styles from 'assets/styles/Dropdown.module.scss';

interface StatusProps {
  encounter: TEncounter;
}

const Status = React.memo(function Status({ encounter }: StatusProps) {
  const { t } = useTranslation('common');
  const changeStatus = useStore(useCallback((state) => state.changeStatus, []));
  const customStatuses = useStore(useCallback((state) => state.customStatuses, []));
  const allStatuses = STATUSES.concat(customStatuses);
  const handleChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const foundStatus = allStatuses.find((stat) => stat.value === data.value);
    changeStatus(encounter.id, foundStatus);
  };

  return (
    <Dropdown
      aria-label="status-selector"
      basic
      className={styles.dropdown}
      disabled={!encounter?.pokemon}
      data-testid={`status-${encounter.id}`}
      fluid
      inline
      labeled
      lazyLoad
      // open
      onChange={handleChange}
      options={allStatuses}
      placeholder={`${t('status')}...`}
      selection
      value={encounter?.status?.value ?? ''}
    />
  );
});

export default Status;
