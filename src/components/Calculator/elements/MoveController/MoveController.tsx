import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MoveSelector } from 'components';
import { ButtonController } from 'components/Calculator/elements';
import type { Primary } from 'components/Calculator/elements/Result/Result';
import { CAPTION, FIELD } from 'components/Calculator/elements/General/General';
import { MOVEMAP } from 'constants/moves';
import useStore from 'store';

interface MoveControllerProps {
  pokemon: '1' | '2';
  primary: Primary;
  // Shows this side's move `index` as the result at the top
  selectPrimary: (index: number) => void;
}

const MOVES = ['1', '2', '3', '4'] as const;

// A side's four moves (5s), one row each: a radio that puts the move's result at the top, the
// move's tile (which opens the list, as in the encounter editor), then Crit and Z. The radios are
// one group per side; the checked row's tile is outlined in the primary blue
function MoveController({
  pokemon,
  primary,
  selectPrimary,
}: MoveControllerProps): React.JSX.Element {
  const { t } = useTranslation('calculator');
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));
  const position = pokemon === '1' ? 'attacker' : 'defender';

  return (
    <div className={FIELD}>
      <span aria-hidden className={CAPTION}>
        {t('moves', { ns: 'tracker' })}
      </span>
      <div
        aria-label={t('pokemon_moves', { n: pokemon })}
        className="flex flex-col gap-(--spacing-2)"
        role="radiogroup"
      >
        {MOVES.map((move, i) => {
          const moveId = form[`move${move}_${pokemon}`];
          const name = MOVEMAP.get(moveId)?.name;
          const slot = t('move_slot', { ns: 'tracker', n: move });
          return (
            <div
              className="flex min-w-0 items-center gap-(--spacing-2) has-[input:checked]:[&>div]:border-primary has-[input:checked]:[&>div]:bg-primary/8 has-[input:checked]:[&>div]:shadow-[inset_3px_0_0_var(--color-primary)] [&>div]:min-w-0 [&>div]:flex-1"
              data-testid={`move${move}_${pokemon}`}
              key={move}
            >
              <label className="flex size-[2.286rem] shrink-0 max-sm:size-[2.571rem] cursor-pointer items-center justify-center rounded-md has-[:disabled]:cursor-default has-[:disabled]:opacity-40 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-row-ring">
                <input
                  aria-label={t('show_result', { move: name ?? slot })}
                  checked={primary[0] === position && primary[1] === i}
                  className="m-0 size-[1.143rem] cursor-pointer accent-primary outline-none disabled:cursor-default"
                  disabled={!moveId}
                  name={`primary-move${pokemon}`}
                  onChange={() => selectPrimary(i)}
                  type="radio"
                />
              </label>
              <MoveSelector
                currentMoveId={moveId}
                handleMove={(id: number) => update({ [`move${move}_${pokemon}`]: id })}
                limitGen={form.calculatorGen}
                look="tile"
                slot={slot}
              />
              {moveId && (
                <>
                  <ButtonController
                    aria-label={`Crit, ${name}`}
                    label="Crit"
                    name={`move${move}_crit${pokemon}`}
                  />
                  {form.calculatorGen > 6 && (
                    <ButtonController
                      aria-label={`Z, ${name}`}
                      label="Z"
                      name={`move${move}_z${pokemon}`}
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MoveController;
