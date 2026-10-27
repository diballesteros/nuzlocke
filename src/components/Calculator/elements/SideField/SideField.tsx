import { useCallback } from 'react';
import { ButtonController } from 'components/Calculator/elements';
import { FIELD_EXCLUSIONS, SIDE_FIELD } from 'constants/calculator';
import type { TCalculatorFields } from 'constants/types';
import useStore from 'store';
import { RadioGroup, RadioGroupOption } from '@/components/ui/radio-group';

interface SideFieldProps {
  pokemon: '1' | '2';
}

const SPIKES = [0, 1, 2, 3];

function SideField({ pokemon }: SideFieldProps): React.JSX.Element {
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));

  return (
    <>
      <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-(--spacing-2)">
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
        <div className="flex flex-col flex-nowrap gap-(--spacing-2) text-foreground">
          <label htmlFor={`spikes${pokemon}`}> Spikes:</label>
          <RadioGroup
            aria-label="Spikes"
            className="flex gap-(--spacing-2)"
            name={`spikes${pokemon}`}
            onValueChange={(value) => update({ [`spikes${pokemon}`]: Number(value) })}
            value={String(form[`spikes${pokemon}`])}
          >
            {SPIKES.reduce((allSpikes, amt) => {
              if (form.calculatorGen < 3 && amt > 1) {
                return allSpikes;
              }
              allSpikes.push(
                <RadioGroupOption
                  data-testid={`spike-${amt}-${pokemon}`}
                  key={`spike-${amt}-${pokemon}`}
                  label={amt}
                  labelClassName="text-(length:--font-size-4)"
                  value={String(amt)}
                />
              );
              return allSpikes;
            }, [])}
          </RadioGroup>
        </div>
      )}
    </>
  );
}

export default SideField;
