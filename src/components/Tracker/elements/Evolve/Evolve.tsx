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
import { OUTLINE_BUTTON, ROW_ICON } from '../buttons';

interface EvolveProps {
  encounter: TEncounter;
  evolveIds: number[];
}

function Evolve({ encounter, evolveIds }: EvolveProps): React.JSX.Element {
  const { t } = useTranslation('tracker');
  const changePokemon = useStore(useCallback((state) => state.changePokemon, []));
  const [selected, setSelected] = useState(encounter.pokemon);
  const [open, setOpen] = useState(false);

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
      <Button
        aria-label="evolve"
        className={OUTLINE_BUTTON}
        data-testid={`evolve-${encounter.id}}`}
        onClick={() => setOpen(true)}
        size="icon"
        title="Evolve"
        type="button"
        variant="secondary"
      >
        <Dna className={ROW_ICON} strokeWidth={2.5} />
      </Button>
      <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
        <DialogContent>
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
