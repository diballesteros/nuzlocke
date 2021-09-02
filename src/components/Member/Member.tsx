import React, { useCallback, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import useStore from 'store';
import { PokemonDetail } from 'constants/types';
import { TYPE_COLOR } from 'constants/colors';
import NATURES from 'constants/natures';
import POKEMON from 'constants/pokemon';
import { MoveSelector, Natures, PokemonType } from 'components';
import styles from './Member.module.scss';

interface MemberProps {
  index: number;
  pokemonDetail: PokemonDetail;
}

const Member: React.FC<MemberProps> = ({ index, pokemonDetail }) => {
  const pokemon = POKEMON.find((p) => p.value === pokemonDetail.id);
  const changeTeamMember = useStore(useCallback((state) => state.changeTeamMember, []));
  const deleteTeamMember = useStore(useCallback((state) => state.deleteTeamMember, []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div
        className={styles.member}
        data-testid={`team-poke-${pokemon.text}`}
        style={{ backgroundColor: `${TYPE_COLOR[pokemon.type]}50` }}
      >
        <div className={styles.info}>
          <img alt={pokemon.text} src={pokemon.image} />
          <b>{pokemon.text}</b>
        </div>
        <div className={styles.other}>
          <PokemonType pokemon={pokemon} />
          <Icon
            className={styles.arrow}
            style={{ transform: expanded ? 'rotate(90deg)' : undefined }}
            name="angle right"
            onClick={() => setExpanded((prevState) => !prevState)}
          />
        </div>
      </div>
      <div className={`${styles.details} ${expanded ? styles.open : ''}`}>
        <div>
          <Dropdown
            aria-label="nature-selector"
            basic
            className={styles.dropdown}
            data-testid={`team-nature-${pokemon?.text}`}
            inline
            lazyLoad
            onChange={(e, data) =>
              changeTeamMember(index, { ...pokemonDetail, nature: data.value as unknown as string })
            }
            options={NATURES}
            placeholder="Select a nature..."
            search
            selection
            value={pokemonDetail.nature ?? ''}
          />
          <Natures />
        </div>
        <Input
          data-testid="ability"
          label="Ability"
          onChange={(e) => changeTeamMember(index, { ...pokemonDetail, ability: e.target.value })}
          type="text"
          value={pokemonDetail.ability ?? ''}
        />
        <Input
          data-testid="item"
          label="Item"
          onChange={(e) => changeTeamMember(index, { ...pokemonDetail, item: e.target.value })}
          type="text"
          value={pokemonDetail.item ?? ''}
        />
        <MoveSelector
          currentMoveId={pokemonDetail?.moves?.length > 0 ? pokemonDetail.moves[0] : null}
          handleMove={(moveId: number) =>
            changeTeamMember(index, {
              ...pokemonDetail,
              moves: [
                moveId,
                pokemonDetail.moves[1],
                pokemonDetail.moves[2],
                pokemonDetail.moves[3],
              ],
            })
          }
        />
        <MoveSelector
          currentMoveId={pokemonDetail?.moves?.length > 1 ? pokemonDetail.moves[1] : null}
          handleMove={(moveId: number) =>
            changeTeamMember(index, {
              ...pokemonDetail,
              moves: [
                pokemonDetail.moves[0],
                moveId,
                pokemonDetail.moves[2],
                pokemonDetail.moves[3],
              ],
            })
          }
        />
        <MoveSelector
          currentMoveId={pokemonDetail?.moves?.length > 2 ? pokemonDetail.moves[2] : null}
          handleMove={(moveId: number) =>
            changeTeamMember(index, {
              ...pokemonDetail,
              moves: [
                pokemonDetail.moves[0],
                pokemonDetail.moves[1],
                moveId,
                pokemonDetail.moves[3],
              ],
            })
          }
        />
        <MoveSelector
          currentMoveId={pokemonDetail?.moves?.length > 3 ? pokemonDetail.moves[3] : null}
          handleMove={(moveId: number) =>
            changeTeamMember(index, {
              ...pokemonDetail,
              moves: [
                pokemonDetail.moves[0],
                pokemonDetail.moves[1],
                pokemonDetail.moves[2],
                moveId,
              ],
            })
          }
        />
        <Button
          className={styles.delete}
          color="red"
          data-testid={`delete-team-${index}`}
          inverted={darkMode}
          onClick={() => deleteTeamMember(index)}
        >
          DELETE
          <Icon className="icon close" />
        </Button>
      </div>
    </>
  );
};

export default Member;
