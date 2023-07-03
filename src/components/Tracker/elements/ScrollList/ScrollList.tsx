import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import { shallow } from 'zustand/shallow';
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
  const notes = useStore(useCallback((state) => state.notes, []));
  const skipped = useStore(useCallback((state) => state.skipped, []));
  const changeNotes = useStore(useCallback((state) => state.changeNotes, []));
  const addSkipped = useStore(useCallback((state) => state.addSkipped, []));
  const deleteSkipped = useStore(useCallback((state) => state.deleteSkipped, []));
  const selectedGame = useStore(
    useCallback((state) => state.selectedGame, []),
    shallow
  );
  const fainted = useStore(selectFainted);
  const failed = useStore(selectFailed);
  const caught = useStore(selectCaught);
  const [open, setOpen] = useState<'SCROLL_LIST' | 'NOTES' | null>(null);

  const lastEncounter = useMemo(() => {
    const index = encounters?.findIndex(
      (enc, i) => !enc.pokemon && !skipped[selectedGame?.value]?.includes(i)
    );
    return index > -1 ? index : encounters.length - 1;
  }, [encounters, selectedGame, skipped]);

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

  const toggleNotes = () => {
    setOpen(open === 'NOTES' ? null : 'NOTES');
  };

  const onSkip = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    addSkipped(index);
  };

  const onDeleteSkip = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    deleteSkipped(index);
  };

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
            {encounters.map((encounter, index) => {
              const isSkipped = skipped[selectedGame?.value]?.includes(index);
              return (
                <li
                  aria-label={`scroll-to-encounter-${index}`}
                  className={index === lastEncounter ? styles.last : ''}
                  data-testid={`scroll-to-encounter-${index}`}
                  key={encounter.id}
                  onClick={() => handleClick(index)}
                  role="menuitem"
                  tabIndex={0}
                >
                  <div className={styles.innerListItem}>
                    <div className={styles.left}>
                      <span>{encounter.location}</span>
                      {getStatusSVG(encounter)}
                    </div>
                    <Button
                      active={isSkipped}
                      aria-label={`skip-encounter-${index}`}
                      basic
                      className={styles.skip}
                      data-testid={`skip-encounter-${index}`}
                      icon
                      onClick={isSkipped ? (e) => onDeleteSkip(e, index) : (e) => onSkip(e, index)}
                      toggle
                    >
                      <Icon name={isSkipped ? 'eye slash' : 'eye'} />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
      {open === 'NOTES' && (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.options}>
              <p>{t('notes')}</p>
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
          </div>
          <textarea
            className={styles.textarea}
            data-testid="game-notes"
            onChange={(e) => changeNotes(e.target.value)}
            value={notes[selectedGame?.value] ?? ''}
          />
        </div>
      )}
      {selectedGame?.value ? (
        <div className={styles.scrollList}>
          <Button
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
          />
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
          {lastEncounter > -1 && (
            <button
              aria-label="scroll-to-last-encounter"
              className={styles.scrollerButton}
              data-testid={`scroll-to-last-encounter-${lastEncounter}`}
              onClick={() => scrollTo(lastEncounter)}
              type="button"
            >
              {t('go_to')} {encounters[lastEncounter]?.location} <Icon name="arrow right" />
            </button>
          )}
        </div>
      ) : null}
    </>
  );
}

export default ScrollList;
