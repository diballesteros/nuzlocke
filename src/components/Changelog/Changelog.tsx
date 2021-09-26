import React, { useEffect, useState } from 'react';
import useStore from 'store';
import CHANGELOG from 'constants/changelog';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import { TReleaseGroup } from 'constants/types';
import { Page } from 'common';
import styles from './Changelog.module.scss';

const LOG_INCREMENT = 3;

const Changelog: React.FC = () => {
  const [logs, setLogs] = useState(LOG_INCREMENT);
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
    if (CHANGELOG.length - logs > LOG_INCREMENT - 1) {
      setLogs((prevState) => prevState + LOG_INCREMENT);
    } else {
      setLogs(CHANGELOG.length);
    }
  };

  return (
    <Page header="Changelog">
      <div className={styles.changelog}>
        {CHANGELOG.slice(0, logs).map((release, i) => {
          return (
            <React.Fragment key={`release-${i + 1}`}>
              <h4>
                {release.name} <span>{new Date(release.date).toDateString()}</span>
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
          <Button className={styles.seeMore} inverted={darkMode} onClick={onSeeMore} type="button">
            <Icon name="plus" />
            See more
          </Button>
        )}
      </div>
    </Page>
  );
};

export default Changelog;
