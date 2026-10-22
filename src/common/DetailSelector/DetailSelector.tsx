import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { List, RowComponentProps as RowProps } from 'react-window';
import SelectorRow from 'common/SelectorRow/SelectorRow';
import { Filter } from 'components';
import { POKEMAP } from 'constants/pokemon';
import type { PokemonDetail } from 'constants/types';
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

interface DetailSelectorProps {
  children: React.ReactNode;
  details: PokemonDetail[];
  handleDetail: (encounter: PokemonDetail) => void;
  limitGen?: number;
}

function DetailSelector({
  children,
  details,
  handleDetail,
  limitGen,
}: DetailSelectorProps): React.JSX.Element {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const itemSize = useRemtoPx();
  const values = useFilter();
  const filteredEncounters = details?.filter((p) => {
    const foundPokemon = POKEMAP.get(p.id);
    return (
      foundPokemon?.text.toUpperCase().includes(values.search) &&
      (limitGen ? foundPokemon.generation <= limitGen : true) &&
      (values.gens.length > 0 ? values.gens.includes(foundPokemon.generation) : true) &&
      (values.types.length > 0
        ? values.types.includes(foundPokemon.type) || values.types.includes(foundPokemon?.dualtype)
        : true)
    );
  });

  const handleClick = (detail: PokemonDetail) => {
    handleDetail(detail);
    values.reset();
    setOpen(false);
  };

  const handleClose = () => {
    values.reset();
    setOpen(false);
  };

  const renderRow = ({ index, style }: RowProps) => {
    const detail = filteredEncounters[index];
    const foundPokemon = POKEMAP.get(detail.id);
    return (
      <SelectorRow
        name={foundPokemon.text}
        onClick={() => handleClick(detail)}
        pokemon={foundPokemon}
        shiny={detail?.shiny}
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
              rowCount={filteredEncounters?.length ?? 0}
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

export default DetailSelector;
