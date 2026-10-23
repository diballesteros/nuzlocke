import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { HEADER_BUTTON } from 'components/Badges/elements/BadgeEditor/BadgeEditor';
import { MAX_GAME } from 'constants/constant';
import useStore from 'store';
import buttonStyles from 'assets/styles/Button.module.scss';
import { Button as UIButton } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { BUTTON_ICON, MinusIcon, PlusIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';

interface CustomBadgeEditorProps {
  icon?: boolean;
}

function CustomBadgeEditor({ icon }: CustomBadgeEditorProps): React.JSX.Element {
  const { t } = useTranslation('badges');
  const [open, setOpen] = useState(false);
  const badges = useStore(useCallback((state) => state.customBadges, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const addCustomBadge = useStore(useCallback((state) => state.addCustomBadge, []));
  const deleteCustomBadge = useStore(useCallback((state) => state.deleteCustomBadge, []));
  const editCustomBadge = useStore(useCallback((state) => state.editCustomBadge, []));

  const handleChange = (newBadge: string, index: number) => {
    editCustomBadge(newBadge, index);
  };

  return selectedGame?.value && Number(selectedGame.value) > MAX_GAME ? (
    <>
      {icon ? (
        <Button
          icon="pencil"
          circular
          className={buttonStyles.iconButton}
          color="yellow"
          data-testid="custom-edit-badges"
          disabled={!selectedGame}
          onClick={() => setOpen(true)}
        />
      ) : (
        <Button
          aria-label="editgame"
          className={HEADER_BUTTON}
          data-testid="custom-edit-badges"
          icon="pencil"
          onClick={() => setOpen(true)}
        />
      )}
      {/* No onClose before, so only its own button closes it */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dismissible={false}>
          <DialogTitle className="sr-only">{t('edit_level_caps')}</DialogTitle>
          <DialogBody className="flex flex-col flex-nowrap gap-(--spacing-1)" scrolling>
            {badges[selectedGame.value] &&
              badges[selectedGame.value]?.map((val, i) => {
                return (
                  <div
                    className="mb-(--spacing-2) flex gap-(--spacing-2)"
                    key={`custombadge-${Number(i) + 1}`}
                  >
                    <Input
                      aria-label="custom-badge-level-cap"
                      data-testid={`custom-badge-input-${i}`}
                      label={Number(i) + 1}
                      maxLength={3}
                      onChange={(e) => handleChange(e.target.value, i)}
                      value={val}
                    />
                    <UIButton
                      aria-label={t('remove', { ns: 'common' })}
                      data-testid={`remove-custom-badge-${i}`}
                      onClick={() => deleteCustomBadge(i)}
                      size="icon"
                      variant="secondary"
                    >
                      <MinusIcon className={BUTTON_ICON} />
                    </UIButton>
                  </div>
                );
              })}
            <UIButton data-testid="add-cap" onClick={addCustomBadge} variant="secondary">
              {t('add_level_cap')}{' '}
              <PlusIcon className="-my-[0.08em] mr-[0.395em] ml-[-0.165em] size-[1.16em] -translate-y-[0.05em] align-[-0.15em] opacity-80" />
            </UIButton>
          </DialogBody>
          <DialogFooter>
            <UIButton onClick={() => setOpen(false)} variant="secondary">
              {t('cancel', { ns: 'common' })}
            </UIButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  ) : null;
}

export default CustomBadgeEditor;
