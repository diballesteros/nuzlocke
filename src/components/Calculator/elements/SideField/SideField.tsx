import { Controller, UseFormReturn } from 'react-hook-form';
import Radio from 'semantic-ui-react/dist/commonjs/addons/Radio';
import { ButtonController } from 'components/Calculator/elements';
import { SIDE_FIELD } from 'constants/calculator';
import { TCalculatorFields, TCalculatorForm } from 'constants/types';
import styles from './SideField.module.scss';

interface SideFieldProps {
  form: UseFormReturn<TCalculatorForm, object>;
  pokemon: '1' | '2';
}

const SPIKES = [0, 1, 2, 3];

function SideField({ form, pokemon }: SideFieldProps): JSX.Element {
  const { control } = form;
  return (
    <>
      <div className={styles.toggles}>
        {Object.entries(SIDE_FIELD).map((entry) => {
          const typeSafe = entry as [keyof Omit<TCalculatorFields, 'spikes'>, string];
          return (
            <ButtonController
              control={control}
              key={typeSafe[0]}
              label={typeSafe[1]}
              name={`${typeSafe[0]}${pokemon}`}
            />
          );
        })}
      </div>
      <div className={styles.spikesContainer}>
        <label htmlFor={`spikes${pokemon}`}> Spikes:</label>
        <div className={styles.spikes}>
          <Controller
            control={control}
            name={`spikes${pokemon}`}
            render={({ field: { onChange, value } }) => (
              <>
                {SPIKES.map((amt) => {
                  return (
                    <Radio
                      className={styles.radio}
                      checked={amt === value}
                      key={`spike-${amt}-${pokemon}`}
                      label={amt}
                      name={`spikes${pokemon}`}
                      onChange={(e, data) => onChange(data.value)}
                      value={amt}
                    />
                  );
                })}
              </>
            )}
          />
        </div>
      </div>
    </>
  );
}

export default SideField;
