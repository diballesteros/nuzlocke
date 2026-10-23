import React from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from 'common';

export default function Delete(): React.JSX.Element {
  const { t } = useTranslation('common');
  return (
    <Page header={t('account_deletion')}>
      <div className="flex flex-1 flex-col flex-nowrap pr-(--spacing-2) text-foreground">
        <h3>{t('accounts_discontinued')}</h3>
        <p>{t('accounts_discontinued_details')}</p>
      </div>
    </Page>
  );
}
