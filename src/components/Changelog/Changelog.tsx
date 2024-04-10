import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import { Page } from 'common';
import CHANGELOG from 'constants/changelog';
import type { TReleaseGroup } from 'constants/types';
import useStore from 'store';
import styles from './Changelog.module.scss';

function Changelog(): React.JSX.Element {
  const { t, i18n } = useTranslation('common');
  const [logs, setLogs] = useState(3);
  const removeNew = useStore((state) => state.removeNew);
  const darkMode = useStore((state) => state.darkMode);

  useEffect(() => {
    removeNew();
  });

  const getClass = (type: TReleaseGroup) => {
    switch (type) {
      case 'FEATURE':
        return styles.feature;
      case 'FIX':
        return styles.fix;
      default:
        return styles.update;
    }
  };

  const onSeeMore = () => {
    setLogs(CHANGELOG.length);
  };

  return (
    <Page header="Changelog">
      <div className={styles.changelog} data-testid="changelog-list">
        {CHANGELOG.slice(0, logs).map((release, i) => {
          return (
            <React.Fragment key={`release-${i + 1}`}>
              <h4>
                {release.name}{' '}
                <time>
                  {new Date(release.date).toLocaleDateString(i18n.language, {
                    weekday: 'short',
                    month: 'short',
                    year: 'numeric',
                    day: 'numeric',
                  })}
                </time>
              </h4>
              <ul>
                {release.notes.map((note) => {
                  return (
                    <li key={note.description}>
                      <span className={`${styles.type} ${getClass(note.type)}`}>{note.type}</span>
                      {note.description}
                    </li>
                  );
                })}
              </ul>
            </React.Fragment>
          );
        })}
        {logs < CHANGELOG.length && (
          <Button
            className={styles.seeMore}
            data-testid="see-more"
            inverted={darkMode}
            onClick={onSeeMore}
            type="button"
          >
            <Icon name="plus" />
            {t('see_more')}
          </Button>
        )}
      </div>
    </Page>
  );
}

export default Changelog;
