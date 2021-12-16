import { useCallback } from 'react';
import Radio from 'semantic-ui-react/dist/commonjs/addons/Radio';
import { ButtonController } from 'components/Calculator/elements';
import { FIELD_EXCLUSIONS, SIDE_FIELD } from 'constants/calculator';
import type { TCalculatorFields } from 'constants/types';
import useStore from 'store';
import styles from './SideField.module.scss';

interface SideFieldProps {
  pokemon: '1' | '2';
}

const SPIKES = [0, 1, 2, 3];

function SideField({ pokemon }: SideFieldProps): JSX.Element {
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));

  return (
    <>
      <div className={styles.toggles}>
        {Object.entries(SIDE_FIELD).reduce((sideFields, entry) => {
          const typeSafe = entry as [keyof Omit<TCalculatorFields, 'spikes'>, string];
          if (!FIELD_EXCLUSIONS[String(form.calculatorGen)]?.includes(entry[0])) {
            sideFields.push(
              <ButtonController
                key={typeSafe[0]}
                label={typeSafe[1]}
                name={`${typeSafe[0]}${pokemon}`}
              />
            );
          }
          return sideFields;
        }, [])}
      </div>
      {form.calculatorGen > 1 && (
        <div className={styles.spikesContainer}>
          <label htmlFor={`spikes${pokemon}`}> Spikes:</label>
          <div className={styles.spikes}>
            {SPIKES.reduce((allSpikes, amt) => {
              if (form.calculatorGen < 3 && amt > 1) {
                return allSpikes;
              }
              allSpikes.push(
                <Radio
                  className={styles.radio}
                  checked={amt === form[`spikes${pokemon}`]}
                  data-testid={`spike-${amt}-${pokemon}`}
                  key={`spike-${amt}-${pokemon}`}
                  label={amt}
                  name={`spikes${pokemon}`}
                  onChange={(e, data) => update({ [`spikes${pokemon}`]: data.value })}
                  value={amt}
                />
              );
              return allSpikes;
            }, [])}
          </div>
        </div>
      )}
    </>
  );
}

export default SideField;
