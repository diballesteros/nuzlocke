import { useTranslation } from 'react-i18next';
import Checkbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { Page } from 'common';
import CustomStasuses from 'components/Settings/elements/CustomStatuses';
import { LANGUAGES } from 'constants/constant';
import type { TLanguage } from 'constants/types';
import useStore from 'store';
import styles from './Settings.module.scss';

function Settings(): React.JSX.Element {
  const { t, i18n } = useTranslation('settings');
  const appState = useStore((state) => state);

  const handleLanguageChange = (e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    appState.setLanguage(data.value as TLanguage);
    i18n.changeLanguage(data.value as string);
  };

  return (
    <Page header={t('settings')}>
      <div className={styles.settings}>
        <Checkbox
          checked={appState.darkMode}
          data-testid="settings-darkmode"
          label={t('darkmode')}
          onChange={() => appState.toggleMode()}
        />
        <Checkbox
          checked={appState.duplicates}
          data-testid="settings-dupes"
          label={t('duplicate_clause')}
          onChange={() => appState.changeDupe()}
        />
        <Checkbox
          checked={appState.nicknames}
          data-testid="settings-nickname"
          label={t('show_nicknames')}
          onChange={() => appState.toggleNickname()}
        />
        <Checkbox
          checked={appState.missing}
          data-testid="settings-missing"
          label={t('show_missing')}
          onChange={() => appState.toggleMissing()}
        />
        <Checkbox
          checked={appState.showAll}
          data-testid="settings-showall"
          label={t('show_all')}
          onChange={() => appState.toggleShowAll()}
        />
        <Checkbox
          checked={appState.suggestions}
          data-testid="settings-suggestions"
          label={t('show_suggestions')}
          onChange={() => appState.toggleSuggestions()}
        />
        <Checkbox
          checked={appState.soulink}
          data-testid="settings-soulink"
          label={t('show_soulink')}
          onChange={() => appState.toggleSoulink()}
        />
        <span className={styles.label}>{t('language')}:</span>
        <Dropdown
          className={styles.dropdown}
          data-testid="settings-language"
          onChange={handleLanguageChange}
          options={LANGUAGES}
          selection
          value={i18n.language}
        />
        <CustomStasuses />
      </div>
    </Page>
  );
}

export default Settings;
