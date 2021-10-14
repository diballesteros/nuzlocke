import { Control, useController, UseFormReturn } from 'react-hook-form';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { SIDE_FIELD } from 'constants/calculator';
import { CalculatorFields, TCalculatorForm } from 'constants/types';
import styles from './Field.module.scss';

interface ButtonControllerProps {
  control: Control<TCalculatorForm>;
  label: string;
  name: keyof TCalculatorForm;
}

function ButtonController({ control, label, name }: ButtonControllerProps) {
  const { field } = useController({ control, name });

  const toggle = () => {
    field.onChange(!field.value);
  };

  return (
    <Button active={!!field.value} onClick={toggle} toggle type="button">
      {label}
    </Button>
  );
}

interface FieldProps {
  form: UseFormReturn<TCalculatorForm, object>;
  pokemon: '1' | '2';
}

function Field({ form, pokemon }: FieldProps): JSX.Element {
  const { control } = form;
  return (
    <div className={styles.toggles}>
      {Object.entries(SIDE_FIELD).map((entry) => {
        const typeSafe = entry as [keyof Omit<CalculatorFields, 'spikes'>, string];
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
  );
}

export default Field;
