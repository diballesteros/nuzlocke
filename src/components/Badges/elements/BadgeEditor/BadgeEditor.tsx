import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import { LEVEL_CAPS } from 'constants/badges';
import { MAX_GAME } from 'constants/constant';
import useStore from 'store';
import { Button as UIButton } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { FAB_ICON, FabButton } from '@/components/ui/fab-button';
import { PencilIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const MULTIPLE_CAPS = ['1', '3', '5', '8'];

// The header's pencil. It stays a Semantic button until the app shell moves, so only the rules that won over Semantic's are kept, as important utilities: no
// background, the page's text colour, and hidden on small screens
export const HEADER_BUTTON =
  'bg-transparent! text-foreground! hover:bg-transparent! hover:text-foreground! max-sm:[display:none]!';

interface BadgeEditorProps {
  icon?: boolean;
}

function BadgeEditor({ icon }: BadgeEditorProps): React.JSX.Element {
  const { t } = useTranslation('badges');
  const [open, setOpen] = useState(false);
  const badges = useStore(useCallback((state) => state.badges, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const resetBadges = useStore(useCallback((state) => state.resetBadges, []));
  const editBadge = useStore(useCallback((state) => state.editBadge, []));

  const handleChange = (newBadge: string, index: number) => {
    editBadge(newBadge, index);
  };

  return selectedGame?.value && Number(selectedGame.value) <= MAX_GAME ? (
    <>
      {icon ? (
        <FabButton
          aria-label={t('edit_badges', { ns: 'tracker' })}
          colour="yellow"
          data-testid="edit-badges"
          disabled={!selectedGame}
          onClick={() => setOpen(true)}
        >
          <PencilIcon className={FAB_ICON} />
        </FabButton>
      ) : (
        <Button
          aria-label="editgame"
          className={HEADER_BUTTON}
          data-testid="edit-badges"
          icon
          onClick={() => setOpen(true)}
        >
          <Icon name="pencil" />
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle className="sr-only">{t('edit_level_caps')}</DialogTitle>
          <DialogBody className="flex flex-col flex-nowrap gap-(--spacing-1)" scrolling>
            {selectedGame &&
              badges[selectedGame?.value]?.map((val, i) => {
                return (
                  <Input
                    aria-label="badge-level-cap"
                    key={`badge-editor-${Number(i) + 1}`}
                    label={val.name}
                    maxLength={3}
                    onChange={(e) => handleChange(e.target.value, i)}
                    value={val.levelCap}
                  />
                );
              })}
          </DialogBody>
          <DialogFooter>
            <UIButton onClick={() => setOpen(false)} variant="secondary">
              {t('cancel', { ns: 'common' })}
            </UIButton>
            {MULTIPLE_CAPS.includes(selectedGame?.value) ? (
              <Select
                className="ml-[0.75em] inline-block max-[768px]:mb-[1rem]"
                contained
                data-testid="badge-multiple-default"
                look="button"
                onChange={(value) => resetBadges(value)}
                options={LEVEL_CAPS[selectedGame?.value].map(({ text, value }) => ({
                  text,
                  value,
                }))}
                placeholder={t('set_default')}
                value=""
              />
            ) : (
              <UIButton onClick={() => resetBadges()} variant="primary">
                {t('set_default')}
              </UIButton>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  ) : null;
}

export default BadgeEditor;
