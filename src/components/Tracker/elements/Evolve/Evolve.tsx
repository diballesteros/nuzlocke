import { Dna } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PkmImage } from 'common';
import { POKEMAP } from 'constants/pokemon';
import type { TEncounter } from 'constants/types';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupOption } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { returnFocusTo, ROW_ICON_CONTROL } from '../buttons';

interface EvolveProps {
  className?: string;
  encounter: TEncounter;
  evolveIds: number[];
  // Opened from the row's menu in compact mode: no button of its own
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  returnFocus?: React.RefObject<HTMLElement | null>;
  trigger?: boolean;
}

function Evolve({
  className,
  encounter,
  evolveIds,
  onOpenChange,
  open: openProp,
  returnFocus,
  trigger = true,
}: EvolveProps): React.JSX.Element {
  const { t } = useTranslation('tracker');
  const changePokemon = useStore(useCallback((state) => state.changePokemon, []));
  const [selected, setSelected] = useState(encounter.pokemon);
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  // Each opening starts from the Pokémon the encounter has now
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setSelected(encounter.pokemon);
  }
  const setOpen = (next: boolean) => {
    setOpenState(next);
    onOpenChange?.(next);
  };

  const handleClose = () => {
    setSelected(encounter?.pokemon);
    setOpen(false);
  };

  const handleEvolve = () => {
    changePokemon(encounter.id, selected);
    setOpen(false);
  };

  return (
    <>
      {trigger && (
        // The test id's stray brace is what the specs click
        <button
          aria-label={t('evolve')}
          className={cn(ROW_ICON_CONTROL, className)}
          data-testid={`evolve-${encounter.id}}`}
          onClick={() => setOpen(true)}
          title={t('evolve')}
          type="button"
        >
          <Dna aria-hidden className="-rotate-45" strokeWidth={2.5} />
        </button>
      )}
      <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
        <DialogContent {...returnFocusTo(returnFocus)}>
          <DialogHeader>{t('evolution_chain')}</DialogHeader>
          <DialogBody>
            <RadioGroup
              onValueChange={(value) => setSelected(Number(value))}
              value={String(selected)}
            >
              {evolveIds.map((id) => {
                const foundPokemon = POKEMAP.get(id);
                return (
                  <div className="mt-(--spacing-2) flex items-center" key={`evolve-${id}`}>
                    <div className="h-[3.5rem] w-[4.8rem]">
                      <PkmImage name={foundPokemon?.text} shiny={encounter?.details?.shiny} />{' '}
                    </div>
                    <RadioGroupOption label={foundPokemon?.text} value={String(id)} />
                  </div>
                );
              })}
            </RadioGroup>
          </DialogBody>
          <DialogFooter>
            <Button onClick={handleClose} variant="secondary">
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button onClick={handleEvolve} variant="primary">
              {t('save', { ns: 'common' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Evolve;
