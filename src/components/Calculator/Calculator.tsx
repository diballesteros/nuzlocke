import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PkmImage } from 'common';
import {
  CalculatorHeader,
  General,
  MoveController,
  Result,
  SideField,
  Stats,
} from 'components/Calculator/elements';
import type { Primary } from 'components/Calculator/elements/Result/Result';
import { POKEMAP } from 'constants/pokemon';
import { useShallow } from 'zustand/shallow';
import useWindowSize from 'hooks/useWindowSize';
import { selectCaught } from 'selectors';
import useStore from 'store';
import PokeballSVG from 'assets/svg/pokeball.svg?react';
import { cn } from '@/lib/utils';

// A side's card (5s): titled by its legend, its parts stacked 12px apart
const FIELDSET =
  'm-0 flex min-w-0 flex-col flex-nowrap gap-(--spacing-4) rounded-lg border border-solid border-contrast-border bg-card p-(--spacing-4) max-sm:p-(--spacing-3)';
const LEGEND =
  'float-left mb-(--spacing-1) w-full p-0 text-(length:--font-size-1) font-bold tracking-[0.06em] text-row-muted uppercase [&+*]:clear-both';

// A side's switch on narrow screens: the sprite and the name, the current side underlined and
// tinted, not shown by colour alone
const TAB =
  'flex h-[2.857rem] min-w-0 flex-1 cursor-pointer items-center justify-center gap-(--spacing-2) bg-transparent px-(--spacing-2) font-bold text-row-muted outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-row-ring aria-pressed:bg-primary/12 aria-pressed:text-foreground aria-pressed:shadow-[inset_0_-3px_0_var(--color-primary)]';

// Below this width one side shows at a time
const TWO_SIDES = 750;

function Calculator(): React.JSX.Element {
  const { t } = useTranslation('common');
  const [selected, setSelected] = useState<0 | 1>(0);
  const [primary, setPrimary] = useState<Primary>(['attacker', 0]);
  const [stuck, setStuck] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [stickyHeight, setStickyHeight] = useState(0);
  const calc = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value], []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const setDefaultCalculator = useStore(useCallback((state) => state.setDefaultCalculator, []));
  const caught = useStore(useShallow(selectCaught));
  const size = useWindowSize();
  const narrow = !(size?.width >= TWO_SIDES);
  const ready = !!(selectedGame && calc?.form);

  useEffect(() => {
    if (selectedGame?.value && !calc?.form) {
      setDefaultCalculator();
    }
  }, [calc, selectedGame, setDefaultCalculator]);

  // On narrow screens the result and the side switch stick to the top; once they do, the result
  // keeps only its numbers. The sentinel sits just above them, so it leaves the view as they stick
  useEffect(() => {
    const node = sentinel.current;
    if (!narrow || !node || typeof IntersectionObserver === 'undefined') {
      setStuck(false);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, [narrow, ready]);

  // A field reached with Tab scrolls clear of the stuck block: the scroller's padding follows its
  // measured height (it grows while the results list is open)
  useEffect(() => {
    const node = stickyRef.current;
    if (!narrow || !node || typeof ResizeObserver === 'undefined') {
      setStickyHeight(0);
      return undefined;
    }
    const observer = new ResizeObserver(() => setStickyHeight(node.offsetHeight));
    observer.observe(node);
    return () => observer.disconnect();
  }, [narrow, ready]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: 0 | 1) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelected(index);
    }
  };

  const tab = (index: 0 | 1) => {
    const pokemon = POKEMAP.get(calc?.form?.[`pokemon${index + 1}` as 'pokemon1' | 'pokemon2']);
    return (
      <div
        aria-pressed={selected === index}
        className={TAB}
        data-testid={`pokemon${index + 1}-tab`}
        onClick={() => setSelected(index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        role="button"
        tabIndex={0}
      >
        <span
          aria-hidden
          className="flex size-[1.857rem] shrink-0 items-center justify-center overflow-hidden [&_img]:max-h-[2.4rem]"
        >
          <PkmImage name={pokemon?.text} />
        </span>
        <span className="truncate">Pokémon {index + 1}</span>
      </div>
    );
  };

  const side = (index: 0 | 1) => {
    const n = index === 0 ? '1' : '2';
    return (
      <fieldset
        className={FIELDSET}
        style={{ display: selected === index || !narrow ? 'flex' : 'none' }}
      >
        <legend className={LEGEND}>Pokémon {n}</legend>
        <General encounters={index === 0 ? caught : undefined} pokemon={n} />
        <MoveController
          pokemon={n}
          primary={primary}
          selectPrimary={(i) => setPrimary([index === 0 ? 'attacker' : 'defender', i])}
        />
        <Stats pokemon={n} />
        <SideField pokemon={n} />
      </fieldset>
    );
  };

  return (
    <form
      className={cn(
        'relative flex h-full min-h-0 flex-col gap-(--spacing-3) overflow-auto p-(--spacing-3) max-sm:p-(--spacing-2)'
      )}
      id="calculator"
      style={narrow && stickyHeight ? { scrollPaddingTop: stickyHeight } : undefined}
    >
      {ready ? (
        <>
          <CalculatorHeader />
          <div aria-hidden className="-mb-(--spacing-3) h-px shrink-0" ref={sentinel} />
          {narrow ? (
            <div
              className="sticky -top-(--spacing-2) z-5 -mx-(--spacing-2) -mt-(--spacing-2) flex shrink-0 flex-col gap-(--spacing-2) bg-background px-(--spacing-2) py-(--spacing-2) shadow-[0_6px_8px_-6px_rgb(0_0_0/0.25)]"
              ref={stickyRef}
            >
              <Result compact={stuck} primary={primary} setPrimary={setPrimary} />
              <div
                aria-label={t('pokemon', { ns: 'calculator' })}
                className="flex shrink-0 overflow-hidden rounded-lg border border-solid border-contrast-border bg-card"
                role="group"
              >
                {tab(0)}
                {tab(1)}
              </div>
            </div>
          ) : (
            <Result primary={primary} setPrimary={setPrimary} />
          )}
          <div
            className={cn(
              'grid shrink-0 items-start gap-(--spacing-3)',
              narrow ? 'grid-cols-1' : 'grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'
            )}
          >
            {side(0)}
            {side(1)}
          </div>
        </>
      ) : (
        <div className="flex h-full flex-1 flex-col flex-nowrap items-center justify-center gap-(--spacing-5) text-(length:--font-size-4) text-foreground [&>svg]:w-1/2 [&>svg]:max-w-[20rem] [&>svg_path]:fill-foreground">
          <PokeballSVG />
          <span>{t('please_select')}</span>
        </div>
      )}
    </form>
  );
}

export default Calculator;
