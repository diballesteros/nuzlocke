import React from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from 'common';
import styles from './Delete.module.scss';

export default function Delete(): React.JSX.Element {
  const { t } = useTranslation('common');
  return (
    <Page header={t('account_deletion')}>
      <div className={styles.delete}>
        <h3>{t('delete_steps_header')}</h3>
        <ol>
          <li>{t('delete_steps_1')}</li>
          <li>{t('delete_steps_2')}</li>
          <li>{t('delete_steps_3')}</li>
        </ol>
        <p>{t('delete_steps_warning')}</p>
      </div>
    </Page>
  );
}
