import { useCallback, useState } from 'react';
import Radio from 'semantic-ui-react/dist/commonjs/addons/Radio';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import POKEMON from 'constants/pokemon';
import { TEncounter } from 'constants/types';
import useStore from 'store';
import styles from './Evolve.module.scss';

interface EvolveProps {
  encounter: TEncounter;
  evolveIds: number[];
}

function Evolve({ encounter, evolveIds }: EvolveProps): JSX.Element {
  const changePokemon = useStore((state) => state.changePokemon);
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const [selected, setSelected] = useState(encounter.pokemon);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setSelected(encounter?.pokemon);
    setOpen(false);
  };

  const handleChange = (newId: number) => {
    setSelected(newId);
  };

  const handleEvolve = () => {
    changePokemon(encounter.id, selected);
    setOpen(false);
  };

  return (
    <Modal
      closeOnDimmerClick
      onClose={handleClose}
      open={open}
      trigger={
        <Button
          aria-label="evolve"
          className={styles.button}
          data-testid={`evolve-${encounter.id}}`}
          icon="dna"
          inverted={darkMode}
          onClick={() => setOpen(true)}
          title="Evolve"
          type="button"
        />
      }
    >
      <Modal.Header>Evolution Chain</Modal.Header>
      <Modal.Content>
        {evolveIds.map((id) => {
          const foundPokemon = POKEMON.find((poke) => poke.value === id);
          return (
            <div key={`evolve-${id}`}>
              <img src={foundPokemon?.image} alt={foundPokemon?.text} />{' '}
              <Radio
                className={styles.radio}
                checked={id === selected}
                label={foundPokemon?.text}
                onChange={(e, data) => handleChange(data.value as number)}
                value={id}
              />
            </div>
          );
        })}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleEvolve}>Save</Button>
      </Modal.Actions>
    </Modal>
  );
}

export default Evolve;
