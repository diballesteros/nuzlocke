import { useCallback, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonController } from 'components/Calculator/elements';
import { TERRAIN, WEATHER, WEATHER_EXCLUSIONS } from 'constants/calculator';
import type { TCalculatorMain } from 'constants/types';
import useStore from 'store';
import { TOOLBAR_BUTTON } from 'components/Tracker/elements/buttons';
import { ChevronDownIcon } from '@/components/ui/icons';
import { RadioGroup, RadioGroupOption } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Sun } from 'lucide-react';

// A radio group drawn as a segmented control (5s): each option's ring hides behind its label,
// which takes the click; the checked one is tinted and underlined, not shown by colour alone
export const SEGMENTS =
  'flex flex-wrap gap-px overflow-hidden rounded-md border border-solid border-contrast-border bg-contrast-border/60';
export const SEGMENT =
  'relative min-h-0 flex-[1_0_auto] bg-card text-(length:--font-size-1) leading-[1.2] has-[button:focus-visible]:outline-2 has-[button:focus-visible]:-outline-offset-2 has-[button:focus-visible]:outline-row-ring has-[[data-state=checked]]:bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--color-card))] has-[[data-state=checked]]:text-row-link has-[[data-state=checked]]:shadow-[inset_0_-2px_0_var(--color-primary)] [&>button]:inset-0 [&>button]:top-0 [&>button]:size-full [&>button]:rounded-none [&>button]:opacity-0';
export const SEGMENT_LABEL =
  'relative z-1 px-(--spacing-2) py-(--spacing-2) text-center font-bold text-row-muted hover:text-foreground';
const ROW_LABEL = 'text-(length:--font-size-1) font-bold text-row-muted';

// The Field panel (5s): one labelled segmented row per setting, under the toolbar's Field button
function MainField(): React.JSX.Element {
  const { t } = useTranslation('calculator');
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));
  const [show, setShow] = useState(false);
  const panelId = useId();
  const ids = { gameType: useId(), terrain: useId(), weather: useId() };

  return (
    // Below 750px (one side at a time, the result stuck to the top) the panel opens in the page
    // flow on its own row under the toolbar, so it never covers the result
    <div className="relative max-[749px]:contents">
      <button
        aria-controls={show ? panelId : undefined}
        aria-expanded={show}
        className={cn(TOOLBAR_BUTTON, show && 'bg-foreground/8')}
        data-testid="field-settings"
        disabled={form.calculatorGen <= 2}
        onClick={() => setShow((prevState) => !prevState)}
        type="button"
      >
        <Sun aria-hidden />
        {t('field')}
        <ChevronDownIcon
          aria-hidden
          className={cn('size-[1rem]! transition-transform duration-150', show && 'rotate-180')}
        />
      </button>
      {show && (
        <div
          aria-label={t('field')}
          className="absolute top-[calc(100%+var(--spacing-2))] left-0 z-6 grid w-[30rem] max-w-[calc(100vw-2*var(--spacing-3))] max-[749px]:static max-[749px]:order-last max-[749px]:w-auto max-[749px]:max-w-none max-[749px]:basis-full max-[749px]:shadow-none grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-x-(--spacing-4) gap-y-(--spacing-3) rounded-lg border border-solid border-contrast-border bg-card p-(--spacing-4) text-foreground shadow-[0_10px_30px_rgb(0_0_0/0.25)] max-sm:grid-cols-1 max-sm:gap-y-(--spacing-1)"
          id={panelId}
          role="group"
        >
          {form.calculatorGen > 2 && (
            <>
              <span className={ROW_LABEL} id={ids.gameType}>
                {t('game_type')}
              </span>
              <RadioGroup
                aria-labelledby={ids.gameType}
                className={cn(SEGMENTS, 'max-sm:mb-(--spacing-2)')}
                name="gameType"
                onValueChange={(value) =>
                  update({ gameType: value as TCalculatorMain['gameType'] })
                }
                value={form.gameType}
              >
                <RadioGroupOption
                  className={SEGMENT}
                  data-testid="gameType-singles"
                  label={t('singles')}
                  labelClassName={SEGMENT_LABEL}
                  value="Singles"
                />
                <RadioGroupOption
                  className={SEGMENT}
                  data-testid="gameType-doubles"
                  label={t('doubles')}
                  labelClassName={SEGMENT_LABEL}
                  value="Doubles"
                />
              </RadioGroup>
            </>
          )}
          {form.calculatorGen > 5 && (
            <>
              <span className={ROW_LABEL} id={ids.terrain}>
                {t('terrain')}
              </span>
              <RadioGroup
                aria-labelledby={ids.terrain}
                className={cn(SEGMENTS, 'max-sm:mb-(--spacing-2)')}
                name="terrain"
                onValueChange={(value) => update({ terrain: value as TCalculatorMain['terrain'] })}
                value={form.terrain}
              >
                {TERRAIN.map((tera) => (
                  <RadioGroupOption
                    className={SEGMENT}
                    data-testid={`terrain-${tera}`}
                    key={`terrain-${tera}`}
                    label={tera}
                    labelClassName={SEGMENT_LABEL}
                    value={tera}
                  />
                ))}
              </RadioGroup>
            </>
          )}
          {form.calculatorGen > 1 && (
            <>
              <span className={ROW_LABEL} id={ids.weather}>
                {t('weather')}
              </span>
              <RadioGroup
                aria-labelledby={ids.weather}
                className={cn(SEGMENTS, 'max-sm:mb-(--spacing-2)')}
                name="weather"
                onValueChange={(value) => update({ weather: value as TCalculatorMain['weather'] })}
                value={form.weather}
              >
                {WEATHER.filter(
                  (type) => !WEATHER_EXCLUSIONS[String(form.calculatorGen)].includes(type)
                ).map((type) => (
                  <RadioGroupOption
                    className={SEGMENT}
                    data-testid={`weather-${type}`}
                    key={`weather-${type}`}
                    label={type}
                    labelClassName={SEGMENT_LABEL}
                    value={type}
                  />
                ))}
              </RadioGroup>
            </>
          )}
          {form.calculatorGen > 3 && (
            <div className="col-start-2 max-sm:col-start-1">
              <ButtonController label="Gravity" name="isGravity" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MainField;
