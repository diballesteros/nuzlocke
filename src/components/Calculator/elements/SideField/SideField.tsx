import { useCallback, useId } from 'react';
import { ButtonController } from 'components/Calculator/elements';
import { CAPTION } from 'components/Calculator/elements/General/General';
import {
  SEGMENT,
  SEGMENT_LABEL,
  SEGMENTS,
} from 'components/Calculator/elements/MainField/MainField';
import { FIELD_EXCLUSIONS, SIDE_FIELD } from 'constants/calculator';
import type { TCalculatorFields } from 'constants/types';
import useStore from 'store';
import { RadioGroup, RadioGroupOption } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface SideFieldProps {
  pokemon: '1' | '2';
}

const SPIKES = [0, 1, 2, 3];

function SideField({ pokemon }: SideFieldProps): React.JSX.Element {
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));

  const spikesId = useId();

  return (
    <div className="flex flex-col gap-(--spacing-3)">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(7.143rem,1fr))] gap-(--spacing-2)">
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
        <div className="flex items-center gap-(--spacing-3)">
          <span className={CAPTION} id={spikesId}>
            Spikes
          </span>
          <RadioGroup
            aria-labelledby={spikesId}
            className={cn(SEGMENTS, 'flex-nowrap')}
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
                  className={cn(SEGMENT, 'min-w-[2.571rem]')}
                  data-testid={`spike-${amt}-${pokemon}`}
                  key={`spike-${amt}-${pokemon}`}
                  label={amt}
                  labelClassName={SEGMENT_LABEL}
                  value={String(amt)}
                />
              );
              return allSpikes;
            }, [])}
          </RadioGroup>
        </div>
      )}
    </div>
  );
}

export default SideField;
