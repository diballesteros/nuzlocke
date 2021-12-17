import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import type { TEncounter } from 'constants/types';
import { selectCaught, selectFailed, selectFainted } from 'selectors';
import useStore from 'store';
import { ReactComponent as CaughtSVG } from 'assets/svg/caught.svg';
import { ReactComponent as FailedSVG } from 'assets/svg/failed.svg';
import { ReactComponent as FaintedSVG } from 'assets/svg/fainted.svg';
import { ReactComponent as TeamSVG } from 'assets/svg/team.svg';
import styles from './ScrollList.module.scss';

interface ScrollListProps {
  encounters: TEncounter[];
  scrollTo: (index: number) => void;
}

function ScrollList({ encounters, scrollTo }: ScrollListProps): JSX.Element {
  const { t } = useTranslation('tracker');
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const fainted = useStore(selectFainted);
  const failed = useStore(selectFailed);
  const caught = useStore(selectCaught);
  const [open, setOpen] = useState(false);

  const lastEncounter = useMemo(() => {
    return encounters?.findIndex((enc) => !enc.pokemon);
  }, [encounters]);

  const getStatusSVG = (enc: TEncounter) => {
    switch (enc?.status?.value) {
      case 1:
      case 3:
      case 4:
      case 6:
        return <CaughtSVG />;
      case 2:
        return <FaintedSVG />;
      case 5:
        return <FailedSVG />;
      case 7:
        return (
          <>
            <CaughtSVG />
            <TeamSVG style={{ marginLeft: 'var(--spacing-1)' }} />
          </>
        );
      default:
        return null;
    }
  };

  const handleClick = (index: number) => {
    scrollTo(index);
    setOpen(false);
  };

  return (
    <>
      {open && (
        <nav className={styles.container} role="menu">
          <div className={styles.header}>
            <div className={styles.options}>
              <p>{t('click_on_any_location')}</p>
              <Button
                aria-label="close-scroll-list"
                basic
                data-testid="close-scroll-list"
                icon="close"
                inverted={darkMode}
                onClick={() => setOpen(false)}
                size="mini"
              />
            </div>
            <div className={styles.stats}>
              <CaughtSVG />
              {caught?.length || 0}
              <FaintedSVG />
              {fainted?.length || 0}
              <FailedSVG />
              {failed?.length || 0}
            </div>
          </div>
          <ol>
            {encounters.map((encounter, index) => (
              <li
                aria-label={`scroll-to-encounter-${index}`}
                data-testid={`scroll-to-encounter-${index}`}
                key={encounter.id}
                onClick={() => handleClick(index)}
                role="menuitem"
                tabIndex={0}
              >
                <span>{encounter.location}</span>
                {getStatusSVG(encounter)}
              </li>
            ))}
          </ol>
        </nav>
      )}
      {lastEncounter > -1 ? (
        <div className={styles.scrollList}>
          <Button
            aria-label="open-scroll-list"
            data-testid="open-scroll-list"
            inverted={darkMode}
            type="button"
            toggle
            active={open}
            onClick={() => setOpen(!open)}
            icon="list alternate outline"
            size="mini"
            compact
          />
          <button
            aria-label="scroll-to-last-encounter"
            className={styles.scrollerButton}
            data-testid={`scroll-to-last-encounter-${lastEncounter}`}
            onClick={() => scrollTo(lastEncounter)}
            type="button"
          >
            {t('go_to')} {encounters[lastEncounter].location} <Icon name="arrow right" />
          </button>
        </div>
      ) : null}
    </>
  );
}

export default ScrollList;
