import React, { useEffect } from 'react';
import useStore from 'store';
import CHANGELOG from 'constants/changelog';
import { TReleaseGroup } from 'constants/types';
import { Page } from 'common';
import styles from './Changelog.module.scss';

const Changelog: React.FC = () => {
  const appState = useStore((state) => state);

  useEffect(() => {
    appState.removeNew();
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

  return (
    <Page header="Changelog">
      <div className={styles.changelog}>
        {CHANGELOG.map((release, i) => {
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
      </div>
    </Page>
  );
};

export default Changelog;
