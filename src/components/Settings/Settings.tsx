import { useTranslation } from 'react-i18next';
import { Page } from 'common';
import CustomStasuses from 'components/Settings/elements/CustomStatuses';
import { LANGUAGES } from 'constants/constant';
import type { TLanguage } from 'constants/types';
import useStore from 'store';
import { CheckboxOption } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';

function Settings(): React.JSX.Element {
  const { t, i18n } = useTranslation('settings');
  const appState = useStore((state) => state);

  const handleLanguageChange = (value: string) => {
    appState.setLanguage(value as TLanguage);
    i18n.changeLanguage(value);
  };

  const options = [
    {
      id: 'settings-darkmode',
      label: t('darkmode'),
      checked: appState.darkMode,
      onChange: appState.toggleMode,
    },
    {
      id: 'settings-dupes',
      label: t('duplicate_clause'),
      checked: appState.duplicates,
      onChange: appState.changeDupe,
    },
    {
      id: 'settings-nickname',
      label: t('show_nicknames'),
      checked: appState.nicknames,
      onChange: appState.toggleNickname,
    },
    {
      id: 'settings-missing',
      label: t('show_missing'),
      checked: appState.missing,
      onChange: appState.toggleMissing,
    },
    {
      id: 'settings-showall',
      label: t('show_all'),
      checked: appState.showAll,
      onChange: appState.toggleShowAll,
    },
    {
      id: 'settings-suggestions',
      label: t('show_suggestions'),
      checked: appState.suggestions,
      onChange: appState.toggleSuggestions,
    },
    {
      id: 'settings-soulink',
      label: t('show_soulink'),
      checked: appState.soulink,
      onChange: appState.toggleSoulink,
    },
  ];

  return (
    <Page header={t('settings')}>
      <div className="flex flex-col flex-nowrap gap-(--spacing-3)">
        {options.map(({ id, label, checked, onChange }) => (
          <CheckboxOption
            checked={checked}
            data-testid={id}
            key={id}
            label={label}
            labelClassName="text-foreground"
            onCheckedChange={() => onChange()}
          />
        ))}
        <span className="text-foreground">{t('language')}:</span>
        <Select
          aria-label={t('language')}
          className="max-w-[14.286rem]"
          data-testid="settings-language"
          onChange={handleLanguageChange}
          options={LANGUAGES}
          value={i18n.language}
        />
        <CustomStasuses />
      </div>
    </Page>
  );
}

export default Settings;
