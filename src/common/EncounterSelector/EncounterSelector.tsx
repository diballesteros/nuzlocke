import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { List, RowComponentProps as RowProps } from 'react-window';
import SelectorRow from 'common/SelectorRow/SelectorRow';
import { Filter } from 'components';
import { POKEMAP } from 'constants/pokemon';
import type { TEncounter } from 'constants/types';
import useFilter from 'hooks/useFilter';
import useRemtoPx from 'hooks/useRemToPx';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

interface EncounterSelectorProps {
  children: React.ReactNode;
  encounters: TEncounter[];
  handleEncounter: (encounter: TEncounter) => void;
  limitGen?: number;
}

function EncounterSelector({
  children,
  encounters,
  handleEncounter,
  limitGen,
}: EncounterSelectorProps): React.JSX.Element {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const itemSize = useRemtoPx();
  const values = useFilter();
  const filteredEncounters = encounters.filter((p) => {
    const foundPokemon = POKEMAP.get(p.pokemon);
    return (
      foundPokemon?.text.toUpperCase().includes(values.search) &&
      (limitGen ? foundPokemon.generation <= limitGen : true) &&
      (values.gens.length > 0 ? values.gens.includes(foundPokemon.generation) : true) &&
      (values.types.length > 0
        ? values.types.includes(foundPokemon.type) || values.types.includes(foundPokemon?.dualtype)
        : true)
    );
  });

  const handleClick = (encounter: TEncounter) => {
    handleEncounter(encounter);
    values.reset();
    setOpen(false);
  };

  const handleClose = () => {
    values.reset();
    setOpen(false);
  };

  const renderRow = ({ ariaAttributes, index, style }: RowProps) => {
    const encounter = filteredEncounters[index];
    const foundPokemon = POKEMAP.get(encounter.pokemon);
    return (
      <SelectorRow
        ariaAttributes={ariaAttributes}
        name={encounter.nickname || foundPokemon.text}
        onClick={() => handleClick(encounter)}
        pokemon={foundPokemon}
        style={style}
      />
    );
  };

  return (
    <>
      <div onClick={() => setOpen(true)} role="presentation">
        {children}
      </div>
      <Dialog open={open}>
        <DialogContent dismissible={false}>
          <DialogTitle className="sr-only">{t('select_pokemon')}</DialogTitle>
          <DialogBody className="[&>div:first-child]:mb-(--spacing-3)" scrolling>
            <Filter hideGen={!!limitGen} values={values} />
            <List
              rowComponent={renderRow}
              rowCount={filteredEncounters.length}
              rowHeight={itemSize}
              rowProps={{}}
              style={{ height: 400, width: '100%' }}
            />
          </DialogBody>
          <DialogFooter>
            <Button onClick={handleClose} variant="secondary">
              {t('cancel', { ns: 'common' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EncounterSelector;
