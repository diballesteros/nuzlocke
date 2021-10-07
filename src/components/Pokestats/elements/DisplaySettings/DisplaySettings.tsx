import React, { useCallback, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Checkbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { SUM_STATUS } from 'constants/constant';
import useStore from 'store';
import styles from './DisplaySettings.module.scss';

const DisplaySettings: React.FC = () => {
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

  return (
    <div className={styles.container}>
      <Button
        active={show}
        color="grey"
        data-testid="display-settings"
        onClick={() => setShow((prevState) => !prevState)}
        toggle
      >
        SETTINGS <Icon name="settings" />
      </Button>
      {show && (
        <div className={styles.popup}>
          <details>
            <summary>Header</summary>
            <div>
              <Input
                data-testid="summary-title"
                fluid
                label="Title"
                onChange={(e, data) => changeSummaryTitle(data.value)}
                style={{ marginBottom: '10px' }}
                value={summary?.title}
              />
              <span>Status:</span>
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
            <summary>Encounters</summary>
            <div>
              <Checkbox
                checked={summary?.encounters}
                data-testid="summary-encounters"
                label="Show encounters"
                onChange={() => toggleSummarySetting('encounters')}
              />
            </div>
          </details>
          <details>
            <summary>Stats</summary>
            <div>
              <Checkbox
                checked={summary?.stats}
                data-testid="summary-stats"
                label="Show stats"
                onChange={() => toggleSummarySetting('stats')}
              />
              <Checkbox
                checked={summary?.boxed}
                data-testid="summary-boxed"
                label="Show boxed pokémon"
                onChange={() => toggleSummarySetting('boxed')}
              />
              <Checkbox
                checked={summary?.fainted}
                data-testid="summary-fainted"
                label="Show fainted pokémon"
                onChange={() => toggleSummarySetting('fainted')}
              />
            </div>
          </details>
          <details>
            <summary>Rules</summary>
            <div>
              <Checkbox
                checked={summary?.rules}
                data-testid="summary-rules"
                label="Show rules"
                onChange={() => toggleSummarySetting('rules')}
              />
            </div>
          </details>
          <details>
            <summary>Description</summary>
            <div>
              <Checkbox
                checked={summary?.showDescription}
                data-testid="summary-show-description"
                label="Show description"
                onChange={() => toggleSummarySetting('showDescription')}
              />
              <textarea
                className={styles.textarea}
                data-testid="summary-description"
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
};

export default DisplaySettings;
