import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { AddGame, Effectiveness, Export } from 'components';
import { BadgeEditor, CustomBadgeEditor } from 'components/Badges/elements';
import { HEADER_BUTTON } from 'components/Badges/elements/BadgeEditor/BadgeEditor';
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
  BUTTON_ICON,
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
import { Select, SELECTION_MENU } from '@/components/ui/select';
import {
  Sheet,
  SHEET_ICON,
  SheetContent,
  SheetItem,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// The red dot that flags a new version, in the corner of the menu button and the Changelog item
const EXCLAMATION =
  'absolute right-(--spacing-1) bottom-(--spacing-1) order-1 grid size-(--spacing-4) place-items-center rounded-[50%] bg-[red] text-(length:--font-size-1) font-bold text-white';

// Semantic's inline selection menu, in the header's Lato and rounded on top too
const GAME_MENU = cn(SELECTION_MENU, 'font-control rounded-t-[0.28571429rem]');

// The nav's icons, with a quarter rem after them
const NAV_ICON = cn(ICON_SLOT, 'mr-[0.25rem] shrink-0');

// index.css colours every link, so the nav's colours are important
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex flex-row flex-nowrap gap-(--spacing-2) text-(length:--font-size-7) font-bold text-foreground! hover:text-badge!',
    isActive && 'text-badge!'
  );

function App(): React.JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const newVersion = useStore(useCallback((state) => state.newVersion, []));
  const gamesList = useStore(useCallback((state) => state.gamesList, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const selectGame = useStore(useCallback((state) => state.selectGame, []));
  const deleteGame = useStore(useCallback((state) => state.deleteGame, []));
  const [confirm, setConfirm] = useState(false);
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
    <div className="h-fit overflow-auto bg-background [transition:all_500ms]" data-testid="app">
      <Sheet open={visible} onOpenChange={setVisible}>
        <header>
          {/* Semantic's top attached menu: bordered in light mode, inverted in dark mode */}
          <div className="mx-[-1px] my-0 flex min-h-[2.85714286em] w-full rounded-t-md border border-solid border-attached-border bg-header font-control text-[1rem] leading-[1.4285em] text-[rgba(0,0,0,0.87)] dark:border-0">
            <SheetTrigger
              aria-label="sidebar-button"
              className="relative block cursor-pointer border-none bg-header px-(--spacing-4) py-px font-[sans-serif] leading-[1.15] text-foreground"
              data-testid="options"
              type="button"
            >
              <MenuIcon
                className={cn(
                  ICON_SLOT,
                  'inline-block mr-[0.25rem] translate-y-[0.12em] align-baseline'
                )}
              />
              {isNewVersion && <span className={EXCLAMATION}>!</span>}
            </SheetTrigger>
            {/* In dark mode the bar has no border, so the field stretches 2px taller; a button centres its
                text where Semantic's div kept it at the top, hence the extra bottom padding */}
            <Select
              aria-label="games"
              caret="font"
              caretShift={0.49}
              className="w-full max-w-(--screen-xxs) bg-transparent text-foreground data-[state=open]:font-normal data-[state=open]:shadow-none dark:pb-[calc(0.78571429em+2px)] [&>span]:text-foreground!"
              data-testid="game-select"
              look="inline"
              menuClassName={GAME_MENU}
              menuOffset={2}
              menuShift="content"
              onChange={handleChange}
              options={gamesList}
              placeholder={t('choose_a_game')}
              value={selectedGame?.value ?? ''}
            />
            <div className="flex">
              <AddGame />
              {selectedGame?.value && Number(selectedGame.value) > MAX_GAME ? (
                <Button
                  aria-label="deletegame"
                  className={cn(HEADER_BUTTON, 'mr-0! max-sm:p-(--spacing-1)')}
                  onClick={() => setConfirm(true)}
                  size="icon"
                  variant="secondary"
                >
                  <TrashIcon className={BUTTON_ICON} />
                </Button>
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
            </div>
            <div className="mx-auto flex text-foreground max-[85.714rem]:mr-[unset] max-[85.714rem]:ml-(--spacing-7) max-[53.125rem]:ml-(--spacing-4) max-[53.751rem]:[&>h1]:sr-only">
              <h1>Nuzlocke Tracker</h1>
            </div>
          </div>
        </header>
        {/* Semantic's Sidebar.Pushable and Pusher: the page scrolls in here, and dims while the
            sidebar is open */}
        <div className="h-full overflow-x-hidden p-0 [transform:translate3d(0,0,0)]">
          {/* Semantic's game dropdown kept its clicks from the sidebar, which stayed open */}
          <SheetContent
            aria-label="sidebar-options"
            onInteractOutside={(e) => {
              if ((e.target as Element).closest?.('[data-testid^="game-select"]'))
                e.preventDefault();
            }}
          >
            <SheetTitle className="sr-only">{t('menu')}</SheetTitle>
            <SheetItem data-testid="tracker" onClick={() => handleRoute('/')}>
              Tracker
              <MapIcon className={SHEET_ICON} />
            </SheetItem>
            <SheetItem data-testid="rules" onClick={() => handleRoute('/rules')}>
              <BookIcon className={SHEET_ICON} />
              {t('rules', { ns: 'stats' })}
            </SheetItem>
            <SheetItem data-testid="stats" onClick={() => handleRoute('/stats')}>
              <ChartPieIcon className={SHEET_ICON} />
              {t('stats', { ns: 'stats' })}
            </SheetItem>
            <SheetItem data-testid="builder" onClick={() => handleRoute('/builder')}>
              <GavelIcon className={SHEET_ICON} />
              Builder
            </SheetItem>
            <SheetItem data-testid="calculator" onClick={() => handleRoute('/calculator')}>
              <CalculatorIcon className={SHEET_ICON} />
              {t('damage_calculator')}
            </SheetItem>
            <SheetItem data-testid="settings" onClick={() => handleRoute('/settings')}>
              {t('settings', { ns: 'settings' })}
              <WrenchIcon className={SHEET_ICON} />
            </SheetItem>
            <Export />
            <SheetItem data-testid="import" onClick={() => handleRoute('/import')}>
              <UploadIcon className={SHEET_ICON} />
              {t('import', { ns: 'import' })}
            </SheetItem>
            <SheetItem data-testid="report" onClick={() => handleRoute('/report')}>
              {t('report')}
              <BugIcon className={SHEET_ICON} />
            </SheetItem>
            <SheetItem data-testid="changelog" onClick={() => handleRoute('/changelog')}>
              Changelog
              {isNewVersion && <span className={EXCLAMATION}>!</span>}
              <ClipboardIcon className={SHEET_ICON} />
            </SheetItem>
            <SheetItem data-testid="about" onClick={() => handleRoute('/about')}>
              {t('about', { ns: 'about' })}
              <QuestionIcon className={SHEET_ICON} />
            </SheetItem>
          </SheetContent>
          <div
            className={cn(
              'relative z-2 min-h-full overflow-hidden bg-inherit transition-transform duration-500 ease-[ease] [backface-visibility:hidden]',
              "after:absolute after:top-0 after:right-0 after:z-1000 after:overflow-hidden after:bg-[rgba(0,0,0,0.4)] after:opacity-0 after:transition-opacity after:duration-500 after:will-change-[opacity] after:content-['']",
              visible && 'after:size-full! after:opacity-100!'
            )}
          >
            <main className="mx-auto grid! max-w-(--screen-lg) gap-x-(--spacing-8) min-[71.786rem]:grid-cols-[auto_minmax(auto,var(--screen-lg))]">
              <nav className="flex! flex-col flex-nowrap gap-(--spacing-9) px-(--spacing-3) pt-(--spacing-10) max-[35.643rem]:[display:none]! min-[35.714rem]:max-[71.714rem]:[display:none]!">
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
              <div className="h-[calc(100vh-40px)] min-w-0 bg-secondary py-(--spacing-3)">
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
      <ToastContainer
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
