import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FixedSizeList, ListChildComponentProps as RowProps } from 'react-window';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { PkmImage } from 'common';
import { Filter, PokemonType } from 'components';
import { TYPE_COLOR } from 'constants/colors';
import { POKEMAP } from 'constants/pokemon';
import type { PokemonDetail } from 'constants/types';
import useFilter from 'hooks/useFilter';
import useRemtoPx from 'hooks/useRemToPx';
import styles from 'assets/styles/Selector.module.scss';

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

  const renderRow: React.FC<RowProps> = ({ index, style }) => {
    const detail = filteredEncounters[index];
    const foundPokemon = POKEMAP.get(detail.id);
    return (
      <div className={styles.rowContainer} style={style}>
        <div
          className={styles.row}
          data-testid={`poke-${foundPokemon.text}`}
          onClick={() => handleClick(detail)}
          role="presentation"
          style={{ backgroundColor: `${TYPE_COLOR[foundPokemon.type]}50` }}
        >
          <div className={styles.details}>
            <div className={styles.image}>
              <PkmImage name={foundPokemon?.text} shiny={detail?.shiny} />
            </div>
            <b>{foundPokemon.text}</b>
          </div>
          <PokemonType pokemon={foundPokemon} />
        </div>
      </div>
    );
  };
  return (
    <Modal
      closeOnDimmerClick
      open={open}
      trigger={
        <div onClick={() => setOpen(true)} role="presentation">
          {children}
        </div>
      }
    >
      <Modal.Content className={styles.content} scrolling>
        <Filter hideGen={!!limitGen} values={values} />
        {/* @ts-ignore */}
        <FixedSizeList
          height={400}
          itemCount={filteredEncounters?.length ?? 0}
          itemSize={itemSize}
          width="100%"
        >
          {renderRow}
        </FixedSizeList>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>{t('cancel', { ns: 'common' })}</Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DetailSelector;
