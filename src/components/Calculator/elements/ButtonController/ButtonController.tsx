import { Control, useController } from 'react-hook-form';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { TCalculatorForm } from 'constants/types';

interface ButtonControllerProps {
  control: Control<TCalculatorForm>;
  label: string;
  name: keyof TCalculatorForm;
}

function ButtonController({ control, label, name }: ButtonControllerProps): JSX.Element {
  const { field } = useController({ control, name });

  const toggle = () => {
    field.onChange(!field.value);
  };

  return (
    <Button active={!!field.value} data-testid={name} onClick={toggle} toggle type="button">
      {label}
    </Button>
  );
}

export default ButtonController;
