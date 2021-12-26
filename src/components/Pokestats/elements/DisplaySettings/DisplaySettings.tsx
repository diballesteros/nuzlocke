import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Checkbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import useStore from 'store';
import styles from './DisplaySettings.module.scss';

function DisplaySettings(): JSX.Element {
  const { t } = useTranslation('stats');
  const summary = useStore(
    useCallback(
      (state) => (state?.selectedGame?.value ? state.summary[state?.selectedGame?.value] : null),
      []
    )
  );
  const changeSummaryTitle = useStore(useCallback((state) => state.changeSummaryTitle, []));
  const changeSummaryStatus = useStore(useCallback((state) => state.changeSummaryStatus, []));
  const toggleSummarySetting = useStore(useCallback((state) => state.toggleSummarySetting, []));
  const changeSummaryDesc = useStore(useCallback((state) => state.changeSummaryDescription, []));
  const [show, setShow] = useState(false);

  const SUM_STATUS = [
    {
      key: 'ongoing',
      text: t('ongoing'),
      value: 0,
    },
    {
      key: 'complete',
      text: t('complete'),
      value: 1,
    },
    {
      key: 'FAILED',
      text: t('Failed'),
      value: 2,
    },
  ];

  return (
    <div className={styles.container}>
      <Button
        active={show}
        color="grey"
        data-testid="display-settings"
        onClick={() => setShow((prevState) => !prevState)}
        toggle
      >
        {t('settings')} <Icon name="settings" />
      </Button>
      {show && (
        <div className={styles.popup}>
          <details>
            <summary>{t('header')}</summary>
            <div>
              <Input
                data-testid="summary-title"
                fluid
                label={t('title')}
                maxLength={50}
                onChange={(e, data) => changeSummaryTitle(data.value)}
                style={{ marginBottom: 'var(--spacing-2)' }}
                value={summary?.title}
              />
              <span>{t('status')}:</span>
              <Dropdown
                className={styles.dropdown}
                data-testid="summary-status"
                inline
                onChange={(e, data) => changeSummaryStatus(data.value as number)}
                options={SUM_STATUS}
                value={summary?.status}
              />
            </div>
          </details>
          <details>
            <summary>{t('encounters')}</summary>
            <div>
              <Checkbox
                checked={summary?.encounters}
                data-testid="summary-encounters"
                label={t('show_encounters')}
                onChange={() => toggleSummarySetting('encounters')}
              />
            </div>
          </details>
          <details>
            <summary>{t('stats')}</summary>
            <div>
              <Checkbox
                checked={summary?.stats}
                data-testid="summary-stats"
                label={t('show_stats')}
                onChange={() => toggleSummarySetting('stats')}
              />
              <Checkbox
                checked={summary?.boxed}
                data-testid="summary-boxed"
                label={t('show_boxed')}
                onChange={() => toggleSummarySetting('boxed')}
              />
              <Checkbox
                checked={summary?.fainted}
                data-testid="summary-fainted"
                label={t('show_fainted')}
                onChange={() => toggleSummarySetting('fainted')}
              />
            </div>
          </details>
          <details>
            <summary>{t('rules')}</summary>
            <div>
              <Checkbox
                checked={summary?.rules}
                data-testid="summary-rules"
                label={t('show_rules')}
                onChange={() => toggleSummarySetting('rules')}
              />
            </div>
          </details>
          <details>
            <summary>{t('description')}</summary>
            <div>
              <Checkbox
                checked={summary?.showDescription}
                data-testid="summary-show-description"
                label={t('show_description')}
                onChange={() => toggleSummarySetting('showDescription')}
              />
              <textarea
                className={styles.textarea}
                data-testid="summary-description"
                maxLength={1000}
                onChange={(e) => changeSummaryDesc(e.target.value)}
                rows={5}
                value={summary?.description}
              />
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

export default DisplaySettings;
