import { ABILITIES } from '@smogon/calc';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemSelector, PkmImage } from 'common';
import { MoveSelector, Natures, PokemonType } from 'components';
import { TYPE_COLOR } from 'constants/colors';
import { POKEMAP } from 'constants/pokemon';
import type { PokemonDetail } from 'constants/types';
import { useNatureOptions } from 'hooks/useNatures';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { ChevronRightIcon, XIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

const ABILITY_OPTIONS = [...new Set(ABILITIES[8])].map((smogonAbility) => {
  return { text: smogonAbility, value: smogonAbility };
});

interface MemberProps {
  index: number;
  pokemonDetail: PokemonDetail;
}

function Member({ index, pokemonDetail }: MemberProps): React.JSX.Element {
  const { t } = useTranslation('builder');
  const natureOptions = useNatureOptions();
  const pokemon = POKEMAP.get(pokemonDetail.id);
  const changeTeamMember = useStore(useCallback((state) => state.changeTeamMember, []));
  const deleteTeamMember = useStore(useCallback((state) => state.deleteTeamMember, []));
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div
        className="flex flex-row flex-nowrap items-center justify-between p-(--spacing-3)"
        data-testid={`team-poke-${pokemon.text}`}
        style={{ backgroundColor: `${TYPE_COLOR[pokemon.type]}50` }}
      >
        <div className="flex flex-col flex-nowrap items-center text-foreground">
          <div className="flex h-[3.5rem] w-[4.8rem] items-center justify-center">
            <PkmImage name={pokemon?.text} />
          </div>
          <b>{pokemon.text}</b>
        </div>
        <div className="flex flex-nowrap items-center gap-(--spacing-1) [&>div:first-child]:flex-col [&>div:first-child]:flex-nowrap">
          <PokemonType pokemon={pokemon} />
          {/* Semantic's icon slot: 1.18em × 1em, 0.25rem from the edge */}
          <ChevronRightIcon
            className="mr-[0.25rem] h-[1em] w-[1.18em] cursor-pointer text-(length:--font-size-5) text-foreground transition-transform duration-150 ease-[ease]"
            data-testid={`expand-${pokemon.text}`}
            style={{ transform: expanded ? 'rotate(90deg)' : undefined }}
            onClick={() => setExpanded((prevState) => !prevState)}
          />
        </div>
      </div>
      <div
        className={cn(
          // The open state's clip-path was never valid CSS, so inset(0) clips both states
          'flex h-0 w-full flex-col flex-nowrap gap-(--spacing-2) p-0 [clip-path:inset(0)] [transition:height_0.6s,padding_0.6s,clip-path_0s_ease-out,height_0.6s_ease-out]',
          expanded && 'h-[25.071rem] p-(--spacing-3)'
        )}
        data-testid={`team-details-${pokemon.text}`}
      >
        <div>
          <Combobox
            aria-label="nature-selector"
            className="inline-block"
            data-testid={`team-nature-${pokemon?.text}`}
            onChange={(nature) => changeTeamMember(index, { ...pokemonDetail, nature })}
            options={natureOptions}
            placeholder={t('select_nature', { ns: 'calculator' })}
            value={pokemonDetail.nature ?? ''}
          />
          <Natures />
        </div>
        <Combobox
          aria-label="ability"
          data-testid={`team-ability-${pokemon?.text}`}
          onChange={(ability) => changeTeamMember(index, { ...pokemonDetail, ability })}
          options={ABILITY_OPTIONS}
          placeholder={t('select_ability', { ns: 'calculator' })}
          value={pokemonDetail.ability ?? ''}
        />
        <ItemSelector
          dataTestId={`team-item-${pokemon?.text}`}
          item={pokemonDetail.item}
          onChange={(newItem) => changeTeamMember(index, { ...pokemonDetail, item: newItem })}
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
          className="mt-(--spacing-3)! h-[2.143rem] p-0"
          data-testid={`delete-team-${index}`}
          onClick={() => deleteTeamMember(index)}
          variant="red"
        >
          {t('delete')}
          <XIcon
            strokeWidth={4.5}
            className="-my-[0.08em] mr-[-0.03em] ml-[0.336em] size-[1.16em] -translate-y-[0.05em] align-[-0.15em] opacity-80"
          />
        </Button>
      </div>
    </>
  );
}

export default Member;
