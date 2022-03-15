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
  const [open, setOpen] = useState('SCROLL_LIST');

  const lastEncounter = useMemo(() => {
    return encounters?.findIndex((enc) => !enc.pokemon) || encounters?.length - 1;
  }, [encounters]);

  const getStatusSVG = (enc: TEncounter) => {
    switch (enc?.status?.value) {
      case 1:
      case 3:
      case 4:
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
    setOpen(null);
  };

  const toggleScrollList = () => {
    setOpen(open === 'SCROLL_LIST' ? null : 'SCROLL_LIST');
  };

  // const toggleNotes = () => {
  //   setOpen(open === 'NOTES' ? null : 'NOTES');
  // };

  return (
    <>
      {open === 'SCROLL_LIST' && (
        <nav className={styles.container}>
          <div className={styles.header}>
            <div className={styles.options}>
              <p>{t('click_on_any_location')}</p>
              <Button
                aria-label="close-scroll-list"
                basic
                data-testid="close-scroll-list"
                icon="close"
                inverted={darkMode}
                onClick={() => setOpen(null)}
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
      {/* {open === 'NOTES' && (
        <div className={styles.container}>
          <p>Notes for the game</p>
          <textarea
            className={styles.textarea}
            data-testid="game-notes"
            // onChange={(e) => setText(e.target.value)}
            placeholder={t('copy_table')}
            // rows={5}
            // value={text}
          />
        </div>
      )} */}
      {lastEncounter > -1 ? (
        <div className={styles.scrollList}>
          {/* <Button
            aria-label="open-notes"
            data-testid="open-notes"
            inverted={darkMode}
            type="button"
            toggle
            active={open === 'NOTES'}
            onClick={toggleNotes}
            icon="pencil"
            size="mini"
            title="Open notes"
            compact
          /> */}
          <Button
            aria-label="open-scroll-list"
            data-testid="open-scroll-list"
            inverted={darkMode}
            type="button"
            toggle
            active={open === 'SCROLL_LIST'}
            onClick={toggleScrollList}
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
