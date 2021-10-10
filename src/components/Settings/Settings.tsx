import Checkbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox';
import { Page } from 'common';
import useStore from 'store';
import styles from './Settings.module.scss';

function Settings(): JSX.Element {
  const appState = useStore((state) => state);

  return (
    <Page header="Settings">
      <div className={styles.settings}>
        <Checkbox
          checked={appState.duplicates}
          data-testid="settings-dupes"
          label="Duplicate clause (Show alert on duplicate pokémon)"
          onChange={() => appState.changeDupe()}
        />
        <Checkbox
          checked={appState.nicknames}
          data-testid="settings-nickname"
          label="Show nicknames"
          onChange={() => appState.toggleNickname()}
        />
        <Checkbox
          checked={appState.missing}
          data-testid="settings-missing"
          label="Show only missing encounters"
          onChange={() => appState.toggleMissing()}
        />
        <Checkbox
          checked={appState.showAll}
          data-testid="settings-showall"
          label="Show all pokémon in every encounter"
          onChange={() => appState.toggleShowAll()}
        />
      </div>
    </Page>
  );
}

export default Settings;
