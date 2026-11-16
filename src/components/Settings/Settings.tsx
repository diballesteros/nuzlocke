import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from 'common';
import CustomStatuses from 'components/Settings/elements/CustomStatuses';
import { HINT, ROW, TEXT, TITLE } from 'components/Settings/elements/rows';
import { LANGUAGES } from 'constants/constant';
import type { TLanguage } from 'constants/types';
import useStore from 'store';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

// Settings (5w): three cards of rows. Each row has its title, a one-line hint and its control; a
// switch's row is a <label> for it, so the whole 48px row toggles it. The switch is named by the
// title and described by the hint
// Coverage's card (5t), with less padding above and below: each row brings 8px of its own
const CARD =
  'flex flex-col gap-(--spacing-1) rounded-lg border border-solid border-contrast-border bg-card px-(--spacing-4) pt-(--spacing-3) pb-(--spacing-1) text-foreground';
const HEADING = 'm-0! font-[inherit]! text-(length:--font-size-4)! leading-[1.3]! font-bold';
interface SwitchRowProps {
  checked: boolean;
  hint?: string;
  id: string;
  onChange: () => void;
  title: string;
}

function SwitchRow({ checked, hint, id, onChange, title }: SwitchRowProps): React.JSX.Element {
  const uid = useId();
  return (
    <label className={cn(ROW, 'cursor-pointer select-none')} htmlFor={`${uid}-switch`}>
      <span className={TEXT}>
        <span className={TITLE} id={`${uid}-title`}>
          {title}
        </span>
        {hint && (
          <span className={HINT} id={`${uid}-hint`}>
            {hint}
          </span>
        )}
      </span>
      <Switch
        aria-describedby={hint ? `${uid}-hint` : undefined}
        aria-labelledby={`${uid}-title`}
        checked={checked}
        data-testid={id}
        id={`${uid}-switch`}
        look="row"
        onCheckedChange={() => onChange()}
      />
    </label>
  );
}

function Card({ children, title }: { children: React.ReactNode; title: string }) {
  const uid = useId();
  return (
    <section aria-labelledby={uid} className={CARD}>
      <h3 className={HEADING} id={uid}>
        {title}
      </h3>
      <div className="flex flex-col">{children}</div>
    </section>
  );
}

function Settings(): React.JSX.Element {
  const { t, i18n } = useTranslation('settings');
  const appState = useStore((state) => state);
  const languageId = useId();

  const handleLanguageChange = (value: string) => {
    appState.setLanguage(value as TLanguage);
    i18n.changeLanguage(value);
  };

  return (
    <Page header={t('settings')}>
      {/* The page scrolls its cards, as Rules and Builder scroll their lists: on phones they run past
          the tab bar */}
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex w-full max-w-[57.143rem] flex-col gap-(--spacing-3) pb-(--spacing-4)">
          <Card title={t('appearance')}>
            <SwitchRow
              checked={appState.darkMode}
              id="settings-darkmode"
              onChange={appState.toggleMode}
              title={t('darkmode')}
            />
            <div className={cn(ROW, 'flex-wrap')}>
              {/* A label click only focuses the field: Radix's trigger opens on a synthetic click only
                until it has seen a mouse press, so passing the click on would open it sometimes */}
              <label
                className={cn(TITLE, 'flex-1')}
                htmlFor={languageId}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(languageId)?.focus();
                }}
              >
                {t('language')}
              </label>
              <Select
                aria-label={t('language')}
                className="w-[14.286rem] max-w-full"
                data-testid="settings-language"
                id={languageId}
                look="row"
                onChange={handleLanguageChange}
                options={LANGUAGES}
                value={i18n.language}
              />
            </div>
          </Card>
          <Card title={t('tracker')}>
            <SwitchRow
              checked={appState.nicknames}
              hint={t('show_nicknames_hint')}
              id="settings-nickname"
              onChange={appState.toggleNickname}
              title={t('show_nicknames')}
            />
            <SwitchRow
              checked={appState.compact}
              hint={t('compact_mode_hint')}
              id="settings-compact"
              onChange={appState.toggleCompact}
              title={t('compact_mode')}
            />
            <SwitchRow
              checked={appState.missing}
              hint={t('show_missing_hint')}
              id="settings-missing"
              onChange={appState.toggleMissing}
              title={t('show_missing')}
            />
            <SwitchRow
              checked={appState.showAll}
              hint={t('show_all_hint')}
              id="settings-showall"
              onChange={appState.toggleShowAll}
              title={t('show_all')}
            />
            <SwitchRow
              checked={appState.suggestions}
              hint={t('show_suggestions_hint')}
              id="settings-suggestions"
              onChange={appState.toggleSuggestions}
              title={t('show_suggestions')}
            />
            <CustomStatuses />
          </Card>
          <Card title={t('rules_and_details')}>
            <SwitchRow
              checked={appState.duplicates}
              hint={t('duplicate_clause_hint')}
              id="settings-dupes"
              onChange={appState.changeDupe}
              title={t('duplicate_clause')}
            />
            <SwitchRow
              checked={appState.soulink}
              hint={t('show_soulink_hint')}
              id="settings-soulink"
              onChange={appState.toggleSoulink}
              title={t('show_soulink')}
            />
          </Card>
        </div>
      </div>
    </Page>
  );
}

export default Settings;
