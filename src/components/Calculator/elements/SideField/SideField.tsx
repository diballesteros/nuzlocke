import { Controller, UseFormReturn, useWatch } from 'react-hook-form';
import Radio from 'semantic-ui-react/dist/commonjs/addons/Radio';
import { ButtonController } from 'components/Calculator/elements';
import { FIELD_EXCLUSIONS, SIDE_FIELD } from 'constants/calculator';
import type { TCalculatorFields, TCalculatorForm } from 'constants/types';
import styles from './SideField.module.scss';

interface SideFieldProps {
  form: UseFormReturn<TCalculatorForm, object>;
  pokemon: '1' | '2';
}

const SPIKES = [0, 1, 2, 3];

function SideField({ form, pokemon }: SideFieldProps): JSX.Element {
  const calcGen = useWatch({ control: form.control, name: 'calculatorGen' });
  const { control } = form;
  return (
    <>
      <div className={styles.toggles}>
        {Object.entries(SIDE_FIELD).reduce((sideFields, entry) => {
          const typeSafe = entry as [keyof Omit<TCalculatorFields, 'spikes'>, string];
          if (!FIELD_EXCLUSIONS[String(calcGen)]?.includes(entry[0])) {
            sideFields.push(
              <ButtonController
                control={control}
                key={typeSafe[0]}
                label={typeSafe[1]}
                name={`${typeSafe[0]}${pokemon}`}
              />
            );
          }
          return sideFields;
        }, [])}
      </div>
      {calcGen > 1 && (
        <div className={styles.spikesContainer}>
          <label htmlFor={`spikes${pokemon}`}> Spikes:</label>
          <div className={styles.spikes}>
            <Controller
              control={control}
              name={`spikes${pokemon}`}
              render={({ field: { onChange, value } }) => (
                <>
                  {SPIKES.reduce((allSpikes, amt) => {
                    if (calcGen < 3 && amt > 1) {
                      return allSpikes;
                    }
                    allSpikes.push(
                      <Radio
                        className={styles.radio}
                        checked={amt === value}
                        data-testid={`spike-${amt}-${pokemon}`}
                        key={`spike-${amt}-${pokemon}`}
                        label={amt}
                        name={`spikes${pokemon}`}
                        onChange={(e, data) => onChange(data.value)}
                        value={amt}
                      />
                    );
                    return allSpikes;
                  }, [])}
                </>
              )}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default SideField;
