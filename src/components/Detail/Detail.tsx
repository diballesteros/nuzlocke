import React, { useCallback, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import useStore from 'store';
import { Gender, TEncounter } from 'constants/types';
import { GENDERS } from 'constants/constant';
import MOVES from 'constants/moves';
import POKEMON from 'constants/pokemon';
import NATURES from 'constants/natures';
import { Type } from 'components';
import styles from './Detail.module.scss';

interface DetailProps {
  encounter?: TEncounter;
}

const Detail: React.FC<DetailProps> = ({ encounter }) => {
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const changeDetails = useStore(useCallback((state) => state.changeDetails, []));
  const foundPokemon = POKEMON.find((poke) => poke.value === encounter.pokemon);
  const [show, setShow] = useState(false);
  const [level, setLevel] = useState(encounter?.details?.level);
  const [metLevel, setMetLevel] = useState(encounter?.details?.metLevel);
  const [gender, setGender] = useState(encounter?.details?.gender);
  const [ability, setAbility] = useState(encounter?.details?.ability);
  const [nature, setNature] = useState(encounter?.details?.nature);
  const [item, setItem] = useState(encounter?.details?.item);
  const [faint, setFaint] = useState(encounter?.details?.faint);
  const [moveOne, setMoveOne] = useState(encounter?.details?.moves[0]);
  const [moveTwo, setMoveTwo] = useState(encounter?.details?.moves[1]);
  const [moveThree, setMoveThree] = useState(encounter?.details?.moves[2]);
  const [moveFour, setMoveFour] = useState(encounter?.details?.moves[3]);

  const MOVES_ARR = MOVES.map((val) => {
    return { key: val.id, text: val.name, value: val.id };
  });

  const handleClose = () => {
    setShow(false);
    setLevel(encounter?.details?.level);
    setMetLevel(encounter?.details?.metLevel);
    setGender(encounter?.details?.gender);
    setAbility(encounter?.details?.ability);
    setNature(encounter?.details?.nature);
    setItem(encounter?.details?.item);
    setFaint(encounter?.details?.faint);
    setMoveOne(encounter?.details?.moves[0]);
    setMoveTwo(encounter?.details?.moves[1]);
    setMoveThree(encounter?.details?.moves[2]);
    setMoveFour(encounter?.details?.moves[3]);
  };

  const handleSave = () => {
    changeDetails(
      encounter.id,
      level,
      metLevel,
      gender,
      ability,
      nature,
      item,
      faint,
      moveOne,
      moveTwo,
      moveThree,
      moveFour
    );
    setShow(false);
  };

  return (
    <Modal
      closeOnDimmerClick
      onClose={handleClose}
      open={show}
      trigger={
        <Button
          aria-label="edit encounter"
          basic
          compact
          icon
          inverted={darkMode}
          onClick={() => setShow(true)}
          type="button"
        >
          <Icon name="pencil" />
        </Button>
      }
    >
      <Modal.Header>Details</Modal.Header>
      <Modal.Content className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <img src={foundPokemon?.image} alt={foundPokemon?.text} />
            <span className={styles.name}>{foundPokemon.text}</span>
          </div>
          <Type pokemon={foundPokemon} />
        </div>
        <Input
          label="Level"
          onChange={(e) => setLevel(Number(e.target.value))}
          type="number"
          value={level}
        />
        <Input
          label="Met Level"
          onChange={(e) => setMetLevel(Number(e.target.value))}
          type="number"
          value={metLevel}
        />
        <label>
          <div>Gender:</div>
          <Dropdown
            aria-label="gender-selector"
            basic
            className={styles.dropdown}
            data-testid={`gender-${encounter?.id}`}
            fluid
            inline
            labeled
            lazyLoad
            onChange={(e, data) => setGender(data.value as unknown as Gender)}
            options={GENDERS}
            placeholder="Select..."
            selection
            value={gender ?? ''}
          />
        </label>
        <Input
          label="Ability"
          onChange={(e) => setAbility(e.target.value)}
          type="text"
          value={ability}
        />
        <div>
          <div>Nature:</div>
          <Dropdown
            aria-label="nature-selector"
            basic
            className={styles.dropdown}
            data-testid={`nature-${encounter?.id}`}
            fluid
            inline
            lazyLoad
            onChange={(e, data) => setNature(data.value as unknown as string)}
            options={NATURES}
            placeholder="Select..."
            search
            selection
            value={nature ?? ''}
          />
        </div>
        <Input label="Item" onChange={(e) => setItem(e.target.value)} type="text" value={item} />
        <div>
          <div>Move 1:</div>
          <Dropdown
            aria-label="move-1-selector"
            basic
            className={styles.dropdown}
            data-testid={`move-1-${encounter?.id}`}
            fluid
            inline
            lazyLoad
            onChange={(e, data) => setMoveOne(data.value as unknown as number)}
            options={MOVES_ARR}
            placeholder="Select..."
            search
            selection
            value={moveOne}
          />
        </div>
        <div>
          <div>Move 2:</div>
          <Dropdown
            aria-label="move-2-selector"
            basic
            className={styles.dropdown}
            data-testid={`move-2-${encounter?.id}`}
            fluid
            inline
            lazyLoad
            onChange={(e, data) => setMoveTwo(data.value as unknown as number)}
            options={MOVES_ARR}
            placeholder="Select..."
            search
            selection
            value={moveTwo}
          />
        </div>
        <div>
          <div>Move 3:</div>
          <Dropdown
            aria-label="move-3-selector"
            basic
            className={styles.dropdown}
            data-testid={`move-3-${encounter?.id}`}
            fluid
            inline
            lazyLoad
            onChange={(e, data) => setMoveThree(data.value as unknown as number)}
            options={MOVES_ARR}
            placeholder="Select..."
            search
            selection
            value={moveThree}
          />
        </div>
        <div>
          <div>Move 4:</div>
          <Dropdown
            aria-label="move-4-selector"
            basic
            className={styles.dropdown}
            data-testid={`move-4-${encounter?.id}`}
            fluid
            inline
            lazyLoad
            onChange={(e, data) => setMoveFour(data.value as unknown as number)}
            options={MOVES_ARR}
            placeholder="Select..."
            search
            selection
            value={moveFour}
          />
        </div>
        {encounter?.status?.value === 2 && (
          <label>
            <div>Cause of Fainting:</div>
            <textarea
              className={styles.textarea}
              onChange={(e) => setFaint(e.target.value)}
              rows={5}
              value={faint}
            />
          </label>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleSave}>Save</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Detail;
