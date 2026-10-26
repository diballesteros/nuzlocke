import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import { CheckboxOption } from '@/components/ui/checkbox';
import { SettingsIcon, TRAILING_ICON } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Each group of settings: a native disclosure with a rule under it
const SECTION =
  'border-0 border-b border-solid border-foreground p-(--spacing-1) text-left [&>div]:flex [&>div]:flex-col [&>div]:flex-nowrap [&>div]:gap-(--spacing-1) [&>div]:px-0 [&>div]:py-(--spacing-1)';

function DisplaySettings(): React.JSX.Element {
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
    { text: t('ongoing'), value: '0' },
    { text: t('complete'), value: '1' },
    { text: t('Failed'), value: '2' },
  ];

  const option = (
    setting: 'boxed' | 'encounters' | 'fainted' | 'rules' | 'showDescription' | 'stats',
    testId: string,
    label: string
  ) => (
    <CheckboxOption
      checked={summary?.[setting]}
      className="w-full"
      data-testid={testId}
      label={label}
      labelClassName="text-foreground"
      onCheckedChange={() => toggleSummarySetting(setting)}
    />
  );

  return (
    <div className="relative">
      {/* Semantic's toggle button: grey, green while its panel is open. On a phone it loses its icon
          (its padding rule never won over Semantic's) */}
      <Button
        aria-pressed={show}
        className={cn(
          show &&
            'bg-green hover:bg-green-hover focus-visible:bg-green-hover active:bg-green-active'
        )}
        data-testid="display-settings"
        onClick={() => setShow((prevState) => !prevState)}
        variant="grey"
      >
        {t('settings')} <SettingsIcon className={cn(TRAILING_ICON, 'max-xs:[display:none]!')} />
      </Button>
      {show && (
        <div className="absolute top-(--spacing-9) right-0 z-1 flex h-fit w-[17.857rem] min-w-[17.857rem] flex-col flex-nowrap gap-(--spacing-3) rounded-[4px] bg-card p-(--spacing-4) text-center text-foreground shadow-[1px_0_14px_1px_var(--color-panel-glow)]">
          <details className={SECTION}>
            <summary>{t('header')}</summary>
            <div>
              <Input
                className="mb-(--spacing-2)"
                data-testid="summary-title"
                fluid
                label={t('title')}
                maxLength={50}
                onChange={(e) => changeSummaryTitle(e.target.value)}
                value={summary?.title}
              />
              <span>{t('status')}:</span>
              <Select
                aria-label={t('status')}
                contained
                data-testid="summary-status"
                look="text"
                onChange={(value) => changeSummaryStatus(Number(value))}
                options={SUM_STATUS}
                value={String(summary?.status)}
              />
            </div>
          </details>
          <details className={SECTION}>
            <summary>{t('encounters')}</summary>
            <div>{option('encounters', 'summary-encounters', t('show_encounters'))}</div>
          </details>
          <details className={SECTION}>
            <summary>{t('stats')}</summary>
            <div>
              {option('stats', 'summary-stats', t('show_stats'))}
              {option('boxed', 'summary-boxed', t('show_boxed'))}
              {option('fainted', 'summary-fainted', t('show_fainted'))}
            </div>
          </details>
          <details className={SECTION}>
            <summary>{t('rules')}</summary>
            <div>{option('rules', 'summary-rules', t('show_rules'))}</div>
          </details>
          <details className={SECTION}>
            <summary>{t('description')}</summary>
            <div>
              {option('showDescription', 'summary-show-description', t('show_description'))}
              <textarea
                aria-label={t('description')}
                className="w-full resize-none"
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
