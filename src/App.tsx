import React, { useCallback, useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { AddGame, Effectiveness, Export } from 'components';
import { BadgeEditor, CustomBadgeEditor } from 'components/Badges/elements';
import { HEADER_BUTTON } from 'components/Badges/elements/BadgeEditor/BadgeEditor';
import { ROW_GHOST, TOOLBAR_DANGER } from 'components/Tracker/elements/buttons';
import { MAX_GAME } from 'constants/constant';
import AppRouter from 'routes/AppRouter';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  BookIcon,
  BugIcon,
  CalculatorIcon,
  ChartPieIcon,
  ClipboardIcon,
  GavelIcon,
  ICON_SLOT,
  MapIcon,
  MenuIcon,
  QuestionIcon,
  TrashIcon,
  UploadIcon,
  WrenchIcon,
} from '@/components/ui/icons';
import { Select } from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetGroup,
  SheetItem,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// The header bar (5x) is --header-height (48px, set on the app) tall; the page below is sized to
// the rest of the screen

// The new-version mark: a red dot with an "!" (so it doesn't rely on colour alone), ringed in the
// bar's colour in the menu button's corner, and at the end of the Changelog item. Both are hidden
// from screen readers, which hear it in the names instead
const NEW_MARK =
  'grid size-[16px] place-items-center rounded-full bg-destructive text-[10px] leading-none font-bold text-white';
const MENU_MARK = cn(
  NEW_MARK,
  'pointer-events-none absolute -top-px -right-px shadow-[0_0_0_2px_var(--color-header)]'
);
const ITEM_MARK = cn(NEW_MARK, 'ml-auto');

// The page nav, one list at every width: a column beside the page from 1148px, a row above it
// down to 571px, and a tab bar at the bottom of the screen below that. The page's height leaves
// room for the row (--nav-top) or the tab bar (--nav-bottom, set on the app for the toasts too). The tab bar
// comes first in the DOM, so it stacks above pages that overflow (the empty tracker is 1000px tall)
const MAIN =
  'mx-auto grid! max-w-(--screen-lg) gap-x-(--spacing-8) [--nav-bottom:0px] [--nav-top:0px] min-[35.714rem]:max-[71.714rem]:[--nav-top:3.571rem] max-[35.643rem]:[--nav-bottom:var(--tab-bar)] min-[71.786rem]:grid-cols-[auto_minmax(auto,var(--screen-lg))]';
const NAV = cn(
  'flex! flex-col flex-nowrap gap-(--spacing-9) px-(--spacing-3) pt-(--spacing-10)',
  'min-[35.714rem]:max-[71.714rem]:h-(--nav-top) min-[35.714rem]:max-[71.714rem]:flex-row min-[35.714rem]:max-[71.714rem]:items-center min-[35.714rem]:max-[71.714rem]:justify-center min-[35.714rem]:max-[71.714rem]:gap-(--spacing-8) min-[35.714rem]:max-[71.714rem]:py-0',
  'max-[35.643rem]:relative max-[35.643rem]:z-1 max-[35.643rem]:order-last max-[35.643rem]:h-(--nav-bottom) max-[35.643rem]:flex-row max-[35.643rem]:gap-0 max-[35.643rem]:border-t max-[35.643rem]:border-solid max-[35.643rem]:border-attached-border max-[35.643rem]:bg-header max-[35.643rem]:p-0 max-[35.643rem]:pb-[env(safe-area-inset-bottom)]'
);

// The nav's icons, with a quarter rem after them; a tab's sits above its label
const NAV_ICON = cn(
  ICON_SLOT,
  'mr-[0.25rem] shrink-0 max-[35.643rem]:mr-0 max-[35.643rem]:text-(length:--font-size-6)'
);

// index.css colours every link, so the nav's colours are important. A tab's name wraps and
// hyphenates rather than being cut ("Taschenrechner" in German is wider than a fifth of a phone)
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex flex-row flex-nowrap gap-(--spacing-2) text-(length:--font-size-7) font-bold text-foreground! hover:text-badge!',
    'min-[35.714rem]:max-[71.714rem]:items-center min-[35.714rem]:max-[71.714rem]:text-(length:--font-size-4)',
    'max-[35.643rem]:min-w-0 max-[35.643rem]:flex-1 max-[35.643rem]:flex-col max-[35.643rem]:items-center max-[35.643rem]:justify-center max-[35.643rem]:gap-(--spacing-1) max-[35.643rem]:text-(length:--font-size-2) max-[35.643rem]:[&>span]:max-w-full max-[35.643rem]:[&>span]:text-center max-[35.643rem]:[&>span]:leading-[1.2] max-[35.643rem]:[&>span]:[hyphens:auto] max-[35.643rem]:[&>span]:[overflow-wrap:anywhere]',
    isActive && 'text-badge! max-[71.714rem]:text-nav-active!'
  );

function App(): React.JSX.Element {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation('common');
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const newVersion = useStore(useCallback((state) => state.newVersion, []));
  const gamesList = useStore(useCallback((state) => state.gamesList, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const selectGame = useStore(useCallback((state) => state.selectGame, []));
  const deleteGame = useStore(useCallback((state) => state.deleteGame, []));
  const [confirm, setConfirm] = useState(false);
  const deleteLabel = useId();
  const [visible, setVisible] = useState(false);
  const isNewVersion = newVersion !== import.meta.env.REACT_APP_VERSION;

  useEffect(() => {
    if (isNewVersion && window?.matchMedia('(prefers-color-scheme:dark)')?.matches) {
      useStore.setState((state) => {
        state.darkMode = true;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The colours for each theme are tokens in src/styles/globals.css
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleChange = (value: string) => {
    const foundGame = gamesList.find((game) => game.value === value);
    selectGame(foundGame);
  };

  const handleDelete = () => {
    deleteGame();
    setConfirm(false);
    toast.success(t('delete_success'));
  };

  const handleRoute = (route: string) => {
    navigate(route);
    setVisible(false);
  };

  return (
    <div
      className="h-fit overflow-auto bg-background [transition:all_500ms] [--header-height:48px] [--tab-bar:calc(4rem+env(safe-area-inset-bottom))]"
      data-testid="app"
    >
      <Sheet open={visible} onOpenChange={setVisible}>
        <header
          className={cn(
            'h-(--header-height)',
            'relative flex items-center gap-(--spacing-2) border-b border-solid border-contrast-border bg-header px-(--spacing-3) text-foreground'
          )}
        >
          <SheetTrigger
            aria-label={isNewVersion ? t('menu_new_version') : t('menu')}
            className={cn(ROW_GHOST, 'relative size-[2.429rem]')}
            data-testid="options"
            type="button"
          >
            <MenuIcon />
            {isNewVersion && (
              <span aria-hidden className={MENU_MARK}>
                !
              </span>
            )}
          </SheetTrigger>
          {/* The row look (5t–5w), 280px wide; on phones it takes the room the title leaves */}
          <Select
            aria-label={t('game')}
            className="h-[2.429rem] w-[20rem] min-w-0 bg-card max-sm:w-auto max-sm:flex-1"
            data-testid="game-select"
            icon={
              <ChevronDown aria-hidden className="size-[1.143rem] shrink-0" strokeWidth={2.5} />
            }
            look="row"
            onChange={handleChange}
            options={gamesList}
            placeholder={t('choose_a_game')}
            value={selectedGame?.value ?? ''}
          />
          <AddGame />
          {selectedGame?.value && Number(selectedGame.value) > MAX_GAME ? (
            // Named by the hidden span: aria-labelledby wins over the aria-label that
            // CustomGame.spec finds it by
            <button
              aria-label="deletegame"
              aria-labelledby={deleteLabel}
              className={cn(HEADER_BUTTON, TOOLBAR_DANGER)}
              onClick={() => setConfirm(true)}
              title={t('delete_game')}
              type="button"
            >
              <TrashIcon />
              <span hidden id={deleteLabel}>
                {t('delete_game')}
              </span>
            </button>
          ) : null}
          <BadgeEditor />
          <CustomBadgeEditor />
          {/* Semantic's Confirm */}
          <Dialog open={confirm} onOpenChange={setConfirm}>
            <DialogContent size="small">
              <DialogTitle className="sr-only">{t('confirm_delete')}</DialogTitle>
              <DialogBody>{t('delete_custom')}</DialogBody>
              <DialogFooter>
                <Button onClick={() => setConfirm(false)} variant="secondary">
                  {t('cancel')}
                </Button>
                <Button onClick={handleDelete} variant="primary">
                  OK
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* From 1200px the title sits in the middle of the bar; below, after the game controls */}
          <div className="mx-auto flex text-foreground max-[53.751rem]:absolute max-[85.714rem]:mr-[unset] max-[85.714rem]:ml-(--spacing-7) max-[53.125rem]:ml-(--spacing-4) max-[53.751rem]:[&>h1]:sr-only min-[75rem]:absolute min-[75rem]:inset-y-0 min-[75rem]:left-1/2 min-[75rem]:m-0! min-[75rem]:-translate-x-1/2 min-[75rem]:items-center">
            <h1>Nuzlocke Tracker</h1>
          </div>
        </header>
        {/* Semantic's Sidebar.Pushable and Pusher: the page scrolls in here, and dims while the
            sidebar is open */}
        <div className="h-full overflow-x-hidden p-0 [transform:translate3d(0,0,0)]">
          {/* Semantic's game dropdown kept its clicks from the sidebar, which stayed open */}
          <SheetContent
            onInteractOutside={(e) => {
              if ((e.target as Element).closest?.('[data-testid^="game-select"]'))
                e.preventDefault();
            }}
          >
            <SheetTitle className="sr-only">{t('menu')}</SheetTitle>
            <SheetGroup>
              <SheetItem
                current={pathname === '/'}
                data-testid="tracker"
                onClick={() => handleRoute('/')}
              >
                <MapIcon />
                Tracker
              </SheetItem>
              <SheetItem
                current={pathname === '/rules'}
                data-testid="rules"
                onClick={() => handleRoute('/rules')}
              >
                <BookIcon />
                {t('rules', { ns: 'stats' })}
              </SheetItem>
              <SheetItem
                current={pathname === '/stats'}
                data-testid="stats"
                onClick={() => handleRoute('/stats')}
              >
                <ChartPieIcon />
                {t('stats', { ns: 'stats' })}
              </SheetItem>
              <SheetItem
                current={pathname === '/builder'}
                data-testid="builder"
                onClick={() => handleRoute('/builder')}
              >
                <GavelIcon />
                Builder
              </SheetItem>
              <SheetItem
                current={pathname === '/calculator'}
                data-testid="calculator"
                onClick={() => handleRoute('/calculator')}
              >
                <CalculatorIcon />
                {t('damage_calculator')}
              </SheetItem>
            </SheetGroup>
            <SheetGroup>
              <SheetItem
                current={pathname === '/settings'}
                data-testid="settings"
                onClick={() => handleRoute('/settings')}
              >
                <WrenchIcon />
                {t('settings', { ns: 'settings' })}
              </SheetItem>
              <Export />
              <SheetItem
                current={pathname === '/import'}
                data-testid="import"
                onClick={() => handleRoute('/import')}
              >
                <UploadIcon />
                {t('import', { ns: 'import' })}
              </SheetItem>
            </SheetGroup>
            <SheetGroup>
              <SheetItem
                current={pathname === '/report'}
                data-testid="report"
                onClick={() => handleRoute('/report')}
              >
                <BugIcon />
                {t('report')}
              </SheetItem>
              <SheetItem
                aria-label={isNewVersion ? t('changelog_new_version') : undefined}
                current={pathname === '/changelog'}
                data-testid="changelog"
                onClick={() => handleRoute('/changelog')}
              >
                <ClipboardIcon />
                Changelog
                {isNewVersion && (
                  <span aria-hidden className={ITEM_MARK}>
                    !
                  </span>
                )}
              </SheetItem>
              <SheetItem
                current={pathname === '/about'}
                data-testid="about"
                onClick={() => handleRoute('/about')}
              >
                <QuestionIcon />
                {t('about', { ns: 'about' })}
              </SheetItem>
            </SheetGroup>
          </SheetContent>
          <div
            className={cn(
              'relative z-2 min-h-full overflow-hidden bg-inherit transition-transform duration-500 ease-[ease] [backface-visibility:hidden]',
              "after:absolute after:top-0 after:right-0 after:z-1000 after:overflow-hidden after:bg-[rgba(0,0,0,0.4)] after:opacity-0 after:transition-opacity after:duration-500 after:will-change-[opacity] after:content-['']",
              visible && 'after:size-full! after:opacity-100!'
            )}
          >
            <main className={MAIN}>
              <nav className={NAV}>
                <NavLink className={navLinkClass} end to="/">
                  <MapIcon className={NAV_ICON} /> <span>Tracker</span>
                </NavLink>
                <NavLink className={navLinkClass} end to="/rules">
                  <BookIcon className={NAV_ICON} /> <span>{t('rules', { ns: 'stats' })}</span>
                </NavLink>
                <NavLink className={navLinkClass} end to="/stats">
                  <ChartPieIcon className={NAV_ICON} /> <span>{t('stats', { ns: 'stats' })}</span>
                </NavLink>
                <NavLink className={navLinkClass} end to="/builder">
                  <GavelIcon className={NAV_ICON} /> <span>Builder</span>
                </NavLink>
                <NavLink className={navLinkClass} end to="/calculator">
                  <CalculatorIcon className={NAV_ICON} /> <span>{t('calculator')}</span>
                </NavLink>
              </nav>
              <div className="h-[calc(100dvh-var(--header-height)-var(--nav-top)-var(--nav-bottom))] min-w-0 bg-secondary py-(--spacing-3)">
                <AppRouter />
              </div>
            </main>
          </div>
        </div>
      </Sheet>
      <footer
        className={cn(
          'absolute bottom-(--spacing-2) left-(--spacing-2) text-left text-(length:--font-size-1) text-foreground max-[90rem]:[display:none]!',
          visible && '[display:none]!'
        )}
      >
        Pokémon © 2002-2025 Pokémon <br />© 1995-2025 Nintendo/Creatures Inc./GAME FREAK inc. TM,
        <br />® and Pokémon character names are trademarks of Nintendo.
      </footer>
      <Effectiveness />
      {/* Toasts rise above the tab bar; react-toastify's own CSS is unlayered */}
      <ToastContainer
        className="max-[35.643rem]:bottom-(--tab-bar)!"
        stacked
        limit={3}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        position="bottom-center"
        theme={darkMode ? 'dark' : 'light'}
      />
    </div>
  );
}

export default App;
