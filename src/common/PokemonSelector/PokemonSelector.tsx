import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FixedSizeList, ListChildComponentProps as RowProps } from 'react-window';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { Filter, PokemonType } from 'components';
import { TYPE_COLOR } from 'constants/colors';
import POKEMON from 'constants/pokemon';
import { Type } from 'constants/types';
import useFilter from 'hooks/useFilter';
import styles from 'assets/styles/Selector.module.scss';

interface PokemonSelectorProps {
  children: React.ReactNode;
  filter?: number[] | false;
  handlePokemon: (pokemonId: number) => void;
  limitGen?: number;
  suggestions?: Type[] | false;
}

function PokemonSelector({
  children,
  filter = false,
  handlePokemon,
  limitGen,
  suggestions,
}: PokemonSelectorProps): JSX.Element {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const values = useFilter();

  const filteredPokemon = useMemo(() => {
    let filtered = POKEMON.filter(
      (p) =>
        (typeof filter === 'boolean' ? true : filter.includes(p.value)) &&
        p.text.toUpperCase().includes(values.search) &&
        (limitGen ? p.generation <= limitGen : true) &&
        (values.gens.length > 0 ? values.gens.includes(p.generation) : true) &&
        (values.types.length > 0
          ? values.types.includes(p.type) || values.types.includes(p?.dualtype)
          : true)
    );
    if (suggestions) {
      filtered = filtered.sort(
        (a, b) =>
          Number(suggestions.includes(b.type) || suggestions.includes(b.dualtype)) -
          Number(suggestions.includes(a.type) || suggestions.includes(a.dualtype))
      );
    }
    return filtered;
  }, [filter, suggestions, limitGen, values]);

  const handleClick = (pokemonId: number) => {
    handlePokemon(pokemonId);
    values.reset();
    setOpen(false);
  };

  const handleClose = () => {
    values.reset();
    setOpen(false);
  };

  const renderRow: React.FC<RowProps> = ({ index, style }) => {
    const pokemon = filteredPokemon[index];
    return (
      <div className={styles.rowContainer} style={style}>
        <div
          className={styles.row}
          data-testid={`poke-${pokemon.text}`}
          onClick={() => handleClick(pokemon.value)}
          role="presentation"
          style={{ backgroundColor: `${TYPE_COLOR[pokemon.type]}50` }}
        >
          {suggestions &&
            (suggestions.includes(pokemon.type) || suggestions.includes(pokemon.dualtype)) && (
              <div className={styles.suggestion}>
                <Icon name="star" />
                <span>{t('suggested')}</span>
              </div>
            )}
          <div className={styles.details}>
            <img alt={pokemon.text} src={pokemon.image} />
            <b>{pokemon.text}</b>
          </div>
          <PokemonType pokemon={pokemon} />
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
      <Modal.Content className={styles.content}>
        <Filter hideGen={!!limitGen} values={values} />
        <FixedSizeList height={400} itemCount={filteredPokemon.length} itemSize={100} width="100%">
          {renderRow}
        </FixedSizeList>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>{t('cancel')}</Button>
      </Modal.Actions>
    </Modal>
  );
}

export default PokemonSelector;
