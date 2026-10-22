import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { List, RowComponentProps as RowProps } from 'react-window';
import { Lightbulb, Star, X } from 'lucide-react';
import SelectorRow, { SELECTOR_TAG } from 'common/SelectorRow/SelectorRow';
import { Filter } from 'components';
import POKEMON from 'constants/pokemon';
import type { Type } from 'constants/types';
import useFilter from 'hooks/useFilter';
import useRemtoPx from 'hooks/useRemToPx';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

interface PokemonSelectorProps {
  children: React.ReactNode;
  dupes?: number[];
  filter?: number[] | false;
  handlePokemon: (pokemonId: number) => void;
  limitGen?: number;
  suggestions?: Type[] | false;
  tooltip?: boolean;
}

function PokemonSelector({
  children,
  dupes,
  filter = false,
  handlePokemon,
  limitGen,
  suggestions,
  tooltip = false,
}: PokemonSelectorProps): React.JSX.Element {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const values = useFilter();
  const itemSize = useRemtoPx();
  const toggleShowAllTooltip = useStore(useCallback((state) => state.toggleShowAllTooltip, []));

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

  const onKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') setOpen(true);
  };

  const handleClose = () => {
    values.reset();
    setOpen(false);
  };

  const renderRow = ({ index, style }: RowProps) => {
    const pokemon = filteredPokemon[index];
    const dupe = pokemon?.evolve
      ? pokemon.evolve.some((evoId) => dupes?.includes(evoId))
      : dupes?.includes(pokemon?.value);
    return (
      <SelectorRow
        dupe={dupe}
        name={pokemon.text}
        onClick={() => handleClick(pokemon.value)}
        pokemon={pokemon}
        style={style}
        tag={
          dupe ? (
            <span className={SELECTOR_TAG} title={t('dupe_description')}>
              DUPE
            </span>
          ) : (
            suggestions &&
            (suggestions.includes(pokemon.type) || suggestions.includes(pokemon.dualtype)) && (
              <div className={SELECTOR_TAG}>
                <Star aria-hidden className="size-[1em] fill-[gold] text-[gold]" />
                <span>{t('suggested')}</span>
              </div>
            )
          )
        }
      />
    );
  };

  return (
    <>
      <div
        data-testid="pokemon-selector"
        onClick={() => setOpen(true)}
        onKeyPress={onKeyPress}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
      <Dialog open={open}>
        <DialogContent dismissible={false}>
          <DialogTitle className="sr-only">{t('select_pokemon')}</DialogTitle>
          <DialogBody className="[&>div:first-child]:mb-(--spacing-3)" scrolling>
            <Filter hideGen={!!limitGen} values={values} />
            {tooltip && (
              <aside className="mb-(--spacing-3) flex! flex-row flex-nowrap items-center justify-center gap-(--spacing-3) rounded-[4px] border border-dashed border-current p-(--spacing-3)">
                <Lightbulb aria-hidden className="-mx-[0.125em] size-[1.25em] shrink-0" />
                <p className="m-0!">{t('show_all_tooltip')}</p>
                <Button
                  aria-label={t('close')}
                  data-testid="remove-tooltip"
                  onClick={toggleShowAllTooltip}
                  size="icon"
                  type="button"
                  variant="secondary"
                >
                  <X
                    aria-hidden
                    className="-mx-[0.06em] -my-[0.15em] size-[1.3em] align-top"
                    strokeWidth={3}
                  />
                </Button>
              </aside>
            )}
            <List
              rowComponent={renderRow}
              rowCount={filteredPokemon.length}
              rowHeight={itemSize}
              rowProps={{}}
              style={{ height: 400, width: '100%' }}
            />
          </DialogBody>
          <DialogFooter>
            <Button onClick={handleClose} variant="secondary">
              {t('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PokemonSelector;
