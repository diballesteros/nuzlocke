import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonController } from 'components/Calculator/elements';
import { TERRAIN, WEATHER, WEATHER_EXCLUSIONS } from 'constants/calculator';
import type { TCalculatorMain } from 'constants/types';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupOption } from '@/components/ui/radio-group';

// A row of radios, centred in the popup; each radio sits inline after the row's label
const ROW = 'block text-center';
const ROW_LABEL = 'mr-(--spacing-2) self-start text-(length:--font-size-4) text-foreground';
const RADIO = 'inline-block align-baseline';
const RADIO_LABEL = 'mr-(--spacing-2) text-foreground';

function MainField(): React.JSX.Element {
  const { t } = useTranslation('calculator');
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Button
        aria-pressed={false}
        // Semantic paints a focused grey button in its focus shade, after a click too
        className="focus:bg-grey-focus"
        data-testid="field-settings"
        disabled={form.calculatorGen <= 2}
        onClick={() => setShow((prevState) => !prevState)}
        type="button"
        variant="grey"
      >
        {t('field')}
      </Button>
      {show && (
        <div className="absolute top-[2.857rem] right-0 z-3 flex h-fit w-[25rem] min-w-[25rem] flex-row flex-wrap gap-(--spacing-2) rounded-[8px] bg-card p-(--spacing-5) text-center text-foreground shadow-[1px_0px_14px_1px_var(--color-panel-glow)] max-sm:right-[-8.929rem]">
          {form.calculatorGen > 2 && (
            <RadioGroup
              aria-label={t('game_type')}
              className={ROW}
              name="gameType"
              onValueChange={(value) => update({ gameType: value as TCalculatorMain['gameType'] })}
              value={form.gameType}
            >
              <label className={ROW_LABEL} htmlFor="gameType">
                {t('game_type')}:
              </label>
              <RadioGroupOption
                className={RADIO}
                data-testid="gameType-singles"
                label={t('singles')}
                labelClassName={RADIO_LABEL}
                value="Singles"
              />
              <RadioGroupOption
                className={RADIO}
                data-testid="gameType-doubles"
                label={t('doubles')}
                labelClassName={RADIO_LABEL}
                value="Doubles"
              />
            </RadioGroup>
          )}
          {form.calculatorGen > 5 && (
            <RadioGroup
              aria-label={t('terrain')}
              className={ROW}
              name="terrain"
              onValueChange={(value) => update({ terrain: value as TCalculatorMain['terrain'] })}
              value={form.terrain}
            >
              <label className={ROW_LABEL} htmlFor="terrain">
                {t('terrain')}:
              </label>
              {TERRAIN.map((tera) => {
                return (
                  <RadioGroupOption
                    className={RADIO}
                    data-testid={`terrain-${tera}`}
                    key={`terrain-${tera}`}
                    label={tera}
                    labelClassName={RADIO_LABEL}
                    value={tera}
                  />
                );
              })}
            </RadioGroup>
          )}
          {form.calculatorGen > 1 && (
            <RadioGroup
              aria-label={t('weather')}
              className={ROW}
              name="weather"
              onValueChange={(value) => update({ weather: value as TCalculatorMain['weather'] })}
              value={form.weather}
            >
              <label className={ROW_LABEL} htmlFor="weather">
                {t('weather')}:
              </label>
              {WEATHER.reduce((weathers, type) => {
                if (!WEATHER_EXCLUSIONS[String(form.calculatorGen)].includes(type)) {
                  weathers.push(
                    <RadioGroupOption
                      className={RADIO}
                      data-testid={`weather-${type}`}
                      key={`weather-${type}`}
                      label={type}
                      labelClassName={RADIO_LABEL}
                      value={type}
                    />
                  );
                }
                return weathers;
              }, [])}
            </RadioGroup>
          )}
          {form.calculatorGen > 3 && <ButtonController label="Gravity" name="isGravity" />}
        </div>
      )}
    </div>
  );
}

export default MainField;
