import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HEADER_BUTTON } from 'components/Badges/elements/BadgeEditor/BadgeEditor';
import { GAMES } from 'constants/constant';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { BUTTON_ICON, PlusIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Select, SELECTION_MENU } from '@/components/ui/select';

const NONE = 'none';

function AddGame(): React.JSX.Element {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const [template, setTemplate] = useState(NONE);
  const [gameName, setGameName] = useState('');
  const addGame = useStore(useCallback((state) => state.addGame, []));

  const handleAdd = () => {
    addGame(gameName, template === NONE ? null : template);
    setOpen(false);
    setTemplate(NONE);
    setGameName('');
  };

  const handleClose = () => {
    setOpen(false);
    setTemplate(NONE);
    setGameName('');
  };

  return (
    <>
      <Button
        aria-label="addgame"
        className={HEADER_BUTTON}
        data-testid="add-game"
        onClick={() => setOpen(true)}
        size="icon"
        variant="secondary"
      >
        <PlusIcon className={BUTTON_ICON} />
      </Button>
      <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
        <DialogContent>
          <DialogTitle className="sr-only">{t('add_game')}</DialogTitle>
          <DialogBody className="flex flex-col flex-nowrap gap-(--spacing-1)">
            {t('please_enter')}
            <Input
              aria-label="custom-game-text"
              data-testid="add-game-input"
              maxLength={50}
              onChange={(e) => setGameName(e.target.value)}
              value={gameName}
            />
            <section className="mt-(--spacing-4) flex! flex-col flex-nowrap gap-(--spacing-2)">
              <span>{t('encounter_template')}:</span>
              {/* In the page's font, as Semantic's was inside its modal. Its menu covered the field's
                  bottom border */}
              <Select
                aria-label="encounter-template"
                caret="font"
                caretShift={-0.52}
                className="[&:is(button)]:[font-family:inherit]! [&>svg]:right-[13.15px]!"
                data-testid="encounter-template"
                menuClassName={SELECTION_MENU}
                menuOffset={-1}
                onChange={setTemplate}
                options={[{ text: t('none'), value: NONE }].concat(GAMES)}
                value={template}
              />
              <em>{t('template_hint')}</em>
            </section>
          </DialogBody>
          <DialogFooter>
            <Button onClick={handleClose} variant="secondary">
              {t('cancel')}
            </Button>
            <Button disabled={gameName?.length === 0} onClick={handleAdd} variant="primary">
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddGame;
