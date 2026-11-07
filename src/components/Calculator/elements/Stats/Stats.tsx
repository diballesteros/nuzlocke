import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modifier, Range } from 'components/Calculator/elements';
import type { TCalculatorForm } from 'constants/types';
import useCalculate from 'hooks/useCalculate';
import useStore from 'store';
import { ChevronDownIcon } from '@/components/ui/icons';

interface StatsProps {
  pokemon: '1' | '2';
}

const EV = {
  label: 'EV',
  max: 255,
};

const IV = {
  label: 'IV',
  max: 31,
};

const DV = {
  label: 'DV',
  max: 15,
};

type Stat = {
  // Its form fields' stem: `iv${key}1`, `ev${key}1`, `mod${key}1`
  key: 'hp' | 'atk' | 'def' | 'spatk' | 'spdef' | 'speed';
  // Its Gen 1-2 DV's stem, where it has its own
  dv?: 'atk' | 'def' | 'spc' | 'speed';
  label: string;
  // Its value in @smogon/calc's stats
  stat: 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';
  testid: string;
};

// A stat's row (5s): its name, its IVs and EVs (or DV) and boost in muted text, the value, and a ▾;
// it opens to the sliders and the boost stepper
const SUMMARY =
  'grid cursor-pointer list-none grid-cols-[4.286rem_minmax(0,1fr)_3rem_1.143rem] items-center gap-x-(--spacing-2) rounded-md px-(--spacing-1) py-(--spacing-2) outline-none select-none hover:bg-foreground/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-row-ring [&::-webkit-details-marker]:hidden';
const PANEL =
  'grid grid-cols-[2.286rem_minmax(0,1fr)_2.571rem] items-center gap-x-(--spacing-3) gap-y-(--spacing-3) px-(--spacing-1) pt-(--spacing-1) pb-(--spacing-3)';

function Stats({ pokemon }: StatsProps): React.JSX.Element {
  const { t } = useTranslation('calculator');
  const { pokemon1, pokemon2 } = useCalculate();
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));
  const currentPokemon = pokemon === '1' ? pokemon1 : pokemon2;
  const pokemonOneValue = form.pokemon1;
  const pokemonTwoValue = form.pokemon2;
  const totalHp = currentPokemon?.stats?.hp;
  const modern = form.calculatorGen > 2;

  useEffect(() => {
    update({ [`currenthp${pokemon}`]: totalHp });
  }, [pokemon, pokemonOneValue, pokemonTwoValue, update, totalHp]);

  const stats: Stat[] = [
    { key: 'hp', label: 'HP', stat: 'hp', testid: 'hp' },
    { key: 'atk', dv: 'atk', label: 'Atk', stat: 'atk', testid: 'atk' },
    { key: 'def', dv: 'def', label: 'Def', stat: 'def', testid: 'def' },
    {
      key: 'spatk',
      dv: 'spc',
      label: modern ? 'Sp. Atk' : 'Special',
      stat: 'spa',
      testid: 'spatk',
    },
    ...(modern ? [{ key: 'spdef', label: 'Sp. Def', stat: 'spd', testid: 'spdef' } as Stat] : []),
    { key: 'speed', dv: 'speed', label: 'Speed', stat: 'spe', testid: 'speed' },
  ];

  const field = (name: string) => form[name as keyof TCalculatorForm] as number;

  return (
    <section className="flex flex-col text-foreground">
      <div className="flex items-center gap-(--spacing-2) pb-(--spacing-2)">
        <label className="text-(length:--font-size-2) font-bold" htmlFor={`currenthp${pokemon}`}>
          {t('current_hp')}
        </label>
        <input
          className="m-0 h-[2.143rem] w-[4rem] rounded-md border border-solid border-contrast-border bg-transparent px-(--spacing-2) text-(length:--font-size-2) font-bold text-foreground tabular-nums outline-none hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-row-ring"
          data-testid={`currenthp${pokemon}`}
          id={`currenthp${pokemon}`}
          inputMode="numeric"
          maxLength={3}
          pattern="\d*"
          onChange={(e) => {
            update({ [`currenthp${pokemon}`]: Number(e.target.value) });
          }}
          value={form[`currenthp${pokemon}`] || 0}
        />
        <output
          className="text-(length:--font-size-2) text-row-muted"
          htmlFor={`currenthp${pokemon}`}
        >
          / {totalHp}
        </output>
      </div>
      {stats.map(({ dv, key, label, stat, testid }) => {
        const mod = key === 'hp' ? undefined : field(`mod${key}${pokemon}`);
        const detail = [
          modern
            ? `IV ${field(`iv${key}${pokemon}`)} · EV ${field(`ev${key}${pokemon}`)}`
            : dv && `DV ${field(`dv${dv}${pokemon}`)}`,
          mod ? `${t('modifier')} ${mod > 0 ? `+${mod}` : mod}` : undefined,
        ]
          .filter(Boolean)
          .join(' · ');
        // HP has no boost, and no DV of its own in Gens 1-2
        const empty = key === 'hp' && !modern;
        return (
          <details
            className="group border-0 border-t border-solid border-contrast-border/60 open:[&>div]:animate-sweep motion-reduce:open:[&>div]:animate-none"
            key={key}
          >
            <summary className={SUMMARY} data-testid={`${testid}${pokemon}-detail`}>
              <span className="text-(length:--font-size-2) font-bold">{label}</span>
              <span className="truncate text-(length:--font-size-1) text-row-muted">{detail}</span>
              <output className="text-right text-(length:--font-size-2) font-bold tabular-nums">
                {currentPokemon?.stats?.[stat] ?? 0}
              </output>
              <ChevronDownIcon
                aria-hidden
                className="size-[1rem] text-row-muted transition-transform duration-150 group-open:rotate-180"
              />
            </summary>
            {!empty && (
              <div aria-label={label} className={PANEL} role="group">
                {modern ? (
                  <>
                    <Range name={`iv${key}${pokemon}` as keyof TCalculatorForm} {...IV} />
                    <Range name={`ev${key}${pokemon}` as keyof TCalculatorForm} {...EV} />
                  </>
                ) : (
                  <Range name={`dv${dv}${pokemon}` as keyof TCalculatorForm} {...DV} />
                )}
                {key !== 'hp' && (
                  <Modifier
                    name={`mod${key}${pokemon}` as React.ComponentProps<typeof Modifier>['name']}
                  />
                )}
              </div>
            )}
          </details>
        );
      })}
    </section>
  );
}

export default Stats;
