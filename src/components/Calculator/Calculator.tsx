import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CalculatorHeader,
  General,
  MoveController,
  SideField,
  Stats,
} from 'components/Calculator/elements';
import { useShallow } from 'zustand/shallow';
import useWindowSize from 'hooks/useWindowSize';
import { selectCaught } from 'selectors';
import useStore from 'store';
import PokeballSVG from 'assets/svg/pokeball.svg?react';
import { cn } from '@/lib/utils';

// A side's panel. Fieldsets keep the browser's own padding and margin, as they did
const FIELDSET =
  'flex flex-col flex-nowrap gap-(--spacing-5) overflow-auto rounded-[4px] border-none bg-card max-md:col-span-full';

// A side's tab at the bottom of the screen on mobile
const TAB =
  'flex-1 cursor-pointer border-0 border-t border-solid border-tab-border bg-secondary p-(--spacing-2) text-center text-(length:--font-size-4) font-bold text-foreground first:border-r';

function Calculator(): React.JSX.Element {
  const { t } = useTranslation('common');
  const [selected, setSelected] = useState<0 | 1>(0);
  const calc = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value], []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const setDefaultCalculator = useStore(useCallback((state) => state.setDefaultCalculator, []));
  const caught = useStore(useShallow(selectCaught));
  const size = useWindowSize();

  useEffect(() => {
    if (selectedGame?.value && !calc?.form) {
      setDefaultCalculator();
    }
  }, [calc, selectedGame, setDefaultCalculator]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: 0 | 1) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setSelected(index);
    }
  };

  return (
    <form
      className="relative grid h-full min-h-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-(--spacing-2) overflow-auto p-(--spacing-2) max-md:pb-(--spacing-7)"
      id="calculator"
    >
      {selectedGame && calc?.form ? (
        <>
          <CalculatorHeader />
          <fieldset
            className={FIELDSET}
            style={{ display: selected === 0 || size?.width >= 750 ? 'flex' : 'none' }}
          >
            <General encounters={caught} pokemon="1" />
            <MoveController move="1" pokemon="1" />
            <MoveController move="2" pokemon="1" />
            <MoveController move="3" pokemon="1" />
            <MoveController move="4" pokemon="1" />
            <Stats pokemon="1" />
            <SideField pokemon="1" />
          </fieldset>
          <fieldset
            className={FIELDSET}
            style={{ display: selected === 1 || size?.width >= 750 ? 'flex' : 'none' }}
          >
            <General pokemon="2" />
            <MoveController move="1" pokemon="2" />
            <MoveController move="2" pokemon="2" />
            <MoveController move="3" pokemon="2" />
            <MoveController move="4" pokemon="2" />
            <Stats pokemon="2" />
            <SideField pokemon="2" />
          </fieldset>
          <div className="absolute bottom-0 flex w-full flex-row flex-nowrap bg-[grey] md:[display:none]">
            <div
              className={cn(TAB, selected === 0 && 'text-badge')}
              data-testid="pokemon1-tab"
              onClick={() => setSelected(0)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, 0)}
            >
              Pokémon 1
            </div>
            <div
              className={cn(TAB, selected === 1 && 'text-badge')}
              data-testid="pokemon2-tab"
              onClick={() => setSelected(1)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, 1)}
            >
              Pokémon 2
            </div>
          </div>
        </>
      ) : (
        <div className="col-span-full flex h-full flex-1 flex-col flex-nowrap items-center justify-center gap-(--spacing-5) text-(length:--font-size-4) text-foreground [&>svg]:w-1/2 [&>svg]:max-w-[20rem] [&>svg_path]:fill-foreground">
          <PokeballSVG />
          <span>{t('please_select')}</span>
        </div>
      )}
    </form>
  );
}

export default Calculator;
