import React, { useCallback, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import useStore from 'store';
import { Gender, TEncounter } from 'constants/types';
import { GENDERS } from 'constants/constant';
import POKEMON from 'constants/pokemon';
import NATURES from 'constants/natures';
import { MoveSelector, Natures, PokemonType } from 'components';
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
      open={show}
      trigger={
        <Button
          aria-label="edit encounter"
          basic
          compact
          data-testid={`edit-encounter-${encounter.id}`}
          icon
          inverted={darkMode}
          onClick={() => setShow(true)}
          type="button"
        >
          <Icon name="pencil" />
        </Button>
      }
    >
      <Modal.Content className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <img src={foundPokemon?.image} alt={foundPokemon?.text} />
            <span className={styles.name}>{foundPokemon.text}</span>
          </div>
          <PokemonType pokemon={foundPokemon} />
        </div>
        <details open>
          <summary data-testid="detail-summary">Details</summary>
          <div className={styles.expandable}>
            <Input
              data-testid="level"
              label="Level"
              onChange={(e, data) => setLevel(Number(data.value))}
              type="number"
              value={level}
            />
            <Input
              data-testid="metlevel"
              label="Met Level"
              onChange={(e, data) => setMetLevel(Number(data.value))}
              type="number"
              value={metLevel}
            />
            <Dropdown
              aria-label="gender-selector"
              basic
              className={styles.dropdown}
              data-testid={`gender-${encounter?.id}`}
              inline
              labeled
              lazyLoad
              onChange={(e, data) => setGender(data.value as unknown as Gender)}
              options={GENDERS}
              placeholder="Select a gender..."
              selection
              value={gender ?? ''}
            />
            <div className={styles.natureContainer}>
              <Dropdown
                aria-label="nature-selector"
                basic
                className={styles.dropdown}
                data-testid={`nature-${encounter?.id}`}
                inline
                lazyLoad
                onChange={(e, data) => setNature(data.value as unknown as string)}
                options={NATURES}
                placeholder="Select a nature..."
                search
                selection
                value={nature ?? ''}
              />
              <Natures />
            </div>
            <Input
              data-testid="ability"
              label="Ability"
              onChange={(e) => setAbility(e.target.value)}
              type="text"
              value={ability ?? ''}
            />
            <Input
              data-testid="item"
              label="Item"
              onChange={(e) => setItem(e.target.value)}
              type="text"
              value={item ?? ''}
            />
          </div>
        </details>
        <details className={styles.expandable}>
          <summary data-testid="move-summary">Moves</summary>
          <div className={styles.expandable}>
            <div data-testid="move-1">
              <span>Move 1:</span>
              <MoveSelector
                currentMoveId={moveOne}
                handleMove={(moveId: number) => setMoveOne(moveId)}
              />
            </div>
            <div data-testid="move-2">
              <span>Move 2:</span>
              <MoveSelector
                currentMoveId={moveTwo}
                handleMove={(moveId: number) => setMoveTwo(moveId)}
              />
            </div>
            <div data-testid="move-3">
              <span>Move 3:</span>
              <MoveSelector
                currentMoveId={moveThree}
                handleMove={(moveId: number) => setMoveThree(moveId)}
              />
            </div>
            <div data-testid="move-4">
              <span>Move 4:</span>
              <MoveSelector
                currentMoveId={moveFour}
                handleMove={(moveId: number) => setMoveFour(moveId)}
              />
            </div>
          </div>
        </details>
        {encounter?.status?.value === 2 && (
          <label>
            <div>Cause of Fainting:</div>
            <textarea
              className={styles.textarea}
              data-testid="cause of fainting"
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
