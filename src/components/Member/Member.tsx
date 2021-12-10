import { ABILITIES, ITEMS } from '@smogon/calc';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { MoveSelector, Natures, PokemonType } from 'components';
import { TYPE_COLOR } from 'constants/colors';
import NATURES from 'constants/natures';
import { POKEMAP } from 'constants/pokemon';
import type { PokemonDetail } from 'constants/types';
import useStore from 'store';
import styles from './Member.module.scss';

interface MemberProps {
  index: number;
  pokemonDetail: PokemonDetail;
}

function Member({ index, pokemonDetail }: MemberProps): JSX.Element {
  const { t } = useTranslation('builder');
  const pokemon = POKEMAP.get(pokemonDetail.id);
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
            className={`${styles.dropdown} ${styles.nature}`}
            data-testid={`team-nature-${pokemon?.text}`}
            inline
            lazyLoad
            onChange={(e, data) =>
              changeTeamMember(index, { ...pokemonDetail, nature: data.value as unknown as string })
            }
            options={NATURES}
            placeholder={t('select_nature', { ns: 'calculator' })}
            search
            selection
            value={pokemonDetail.nature ?? ''}
          />
          <Natures />
        </div>
        <Dropdown
          aria-label="ability"
          basic
          className={styles.dropdown}
          data-testid={`team-ability-${pokemon?.text}`}
          inline
          lazyLoad
          onChange={(e, data) =>
            changeTeamMember(index, { ...pokemonDetail, ability: data.value as string })
          }
          options={[...new Set(ABILITIES[8])].map((smogonAbility) => {
            return { text: smogonAbility, value: smogonAbility };
          })}
          placeholder={t('select_ability', { ns: 'calculator' })}
          search
          selection
          value={pokemonDetail.ability ?? ''}
        />
        <Dropdown
          aria-label="item"
          basic
          className={styles.dropdown}
          data-testid={`team-item-${pokemon?.text}`}
          inline
          lazyLoad
          onChange={(e, data) =>
            changeTeamMember(index, { ...pokemonDetail, item: data.value as string })
          }
          options={[...new Set(ITEMS[8])].map((smogonItem) => {
            return { text: smogonItem, value: smogonItem };
          })}
          placeholder={t('select_item', { ns: 'calculator' })}
          search
          selection
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
          {t('delete')}
          <Icon className="icon close" />
        </Button>
      </div>
    </>
  );
}

export default Member;
