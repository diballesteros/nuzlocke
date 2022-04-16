import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Radio from 'semantic-ui-react/dist/commonjs/addons/Radio';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import type { CheckboxProps } from 'semantic-ui-react/dist/commonjs/modules/Checkbox';
import { ButtonController } from 'components/Calculator/elements';
import { TERRAIN, WEATHER, WEATHER_EXCLUSIONS } from 'constants/calculator';
import type { TCalculatorMain } from 'constants/types';
import useStore from 'store';
import styles from './MainField.module.scss';

function MainField(): JSX.Element {
  const { t } = useTranslation('calculator');
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));
  const [show, setShow] = useState(false);
  return (
    <div className={styles.container}>
      <Button
        color="grey"
        data-testid="field-settings"
        disabled={form.calculatorGen <= 2}
        onClick={() => setShow((prevState) => !prevState)}
        toggle
        type="button"
      >
        {t('field')}
      </Button>
      {show && (
        <div className={styles.popup}>
          {form.calculatorGen > 2 && (
            <div>
              <label htmlFor="gameType">{t('game_type')}:</label>
              <Radio
                className={styles.radio}
                checked={form.gameType === 'Singles'}
                data-testid="gameType-singles"
                label={t('singles')}
                name="gameType"
                onChange={(e: React.FormEvent<HTMLInputElement>, data: CheckboxProps) =>
                  update({ gameType: data.value as 'Singles' })
                }
                value="Singles"
              />
              <Radio
                className={styles.radio}
                checked={form.gameType === 'Doubles'}
                data-testid="gameType-doubles"
                label={t('doubles')}
                name="gameType"
                onChange={(e: React.FormEvent<HTMLInputElement>, data: CheckboxProps) =>
                  update({ gameType: data.value as 'Doubles' })
                }
                value="Doubles"
              />
            </div>
          )}
          {form.calculatorGen > 5 && (
            <div>
              <label htmlFor="terrain">{t('terrain')}:</label>
              {TERRAIN.map((tera) => {
                return (
                  <Radio
                    className={styles.radio}
                    checked={tera === form.terrain}
                    data-testid={`terrain-${tera}`}
                    key={`terrain-${tera}`}
                    label={tera}
                    name="terrain"
                    onChange={(e: React.FormEvent<HTMLInputElement>, data: CheckboxProps) =>
                      update({ terrain: data.value as TCalculatorMain['terrain'] })
                    }
                    value={tera}
                  />
                );
              })}
            </div>
          )}
          {form.calculatorGen > 1 && (
            <div>
              <label htmlFor="weather">{t('weather')}:</label>
              {WEATHER.reduce((weathers, type) => {
                if (!WEATHER_EXCLUSIONS[String(form.calculatorGen)].includes(type)) {
                  weathers.push(
                    <Radio
                      className={styles.radio}
                      checked={type === form.weather}
                      data-testid={`weather-${type}`}
                      key={`weather-${type}`}
                      label={type}
                      name="weather"
                      onChange={(e: React.FormEvent<HTMLInputElement>, data: CheckboxProps) =>
                        update({ weather: data.value as TCalculatorMain['weather'] })
                      }
                      value={type}
                    />
                  );
                }
                return weathers;
              }, [])}
            </div>
          )}
          {form.calculatorGen > 3 && <ButtonController label="Gravity" name="isGravity" />}
        </div>
      )}
    </div>
  );
}

export default MainField;
