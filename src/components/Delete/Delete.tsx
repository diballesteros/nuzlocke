import React from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from 'common';
import styles from './Delete.module.scss';

export default function Delete(): React.JSX.Element {
  const { t } = useTranslation('common');
  return (
    <Page header={t('account_deletion')}>
      <div className={styles.delete}>
        <h3>{t('accounts_discontinued')}</h3>
        <p>{t('accounts_discontinued_details')}</p>
      </div>
    </Page>
  );
}
