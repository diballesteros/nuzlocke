import React, { useState } from 'react';
import { FixedSizeList, ListChildComponentProps as RowProps } from 'react-window';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import POKEMON from 'constants/pokemon';
import useFilter from 'hooks/useFilter';
import { TYPE_COLOR } from 'constants/colors';
import { Filter, PokemonType } from 'components';
import styles from './PokemonSelector.module.scss';

interface PokemonSelectorProps {
  children: React.ReactNode;
  filter?: number[] | false;
  handlePokemon: (pokemonId: number) => void;
}

const PokemonSelector: React.FC<PokemonSelectorProps> = ({
  children,
  filter = false,
  handlePokemon,
}) => {
  const [open, setOpen] = useState(false);
  const values = useFilter();
  const filteredPokemon = POKEMON.filter(
    (p) =>
      (typeof filter === 'boolean' ? true : filter.includes(p.value)) &&
      p.text.toUpperCase().includes(values.search) &&
      (values.gens.length > 0 ? values.gens.includes(p.generation) : true) &&
      (values.types.length > 0
        ? values.types.includes(p.type) || values.types.includes(p?.dualtype)
        : true)
  );

  const handleClick = (pokemonId: number) => {
    handlePokemon(pokemonId);
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
        <Filter values={values} />
        <FixedSizeList height={400} itemCount={filteredPokemon.length} itemSize={100} width="100%">
          {renderRow}
        </FixedSizeList>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default PokemonSelector;
