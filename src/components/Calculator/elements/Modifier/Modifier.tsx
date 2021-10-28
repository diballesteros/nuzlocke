import { Control, useController } from 'react-hook-form';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { TCalculatorForm } from 'constants/types';
import styles from './Modifier.module.scss';

interface ModifierProps {
  control: Control<TCalculatorForm>;
  name:
    | 'modatk1'
    | 'modatk2'
    | 'moddef1'
    | 'moddef2'
    | 'modspatk1'
    | 'modspatk2'
    | 'modspdef1'
    | 'modspdef2'
    | 'modspeed1'
    | 'modspeed2';
}

function Modifier({ control, name }: ModifierProps): JSX.Element {
  const { field } = useController({ control, name });

  const decrement = () => {
    if (field.value > -6) {
      field.onChange(Number(field.value) - 1);
    }
  };

  const increment = () => {
    if (field.value < 6) {
      field.onChange(Number(field.value) + 1);
    }
  };

  return (
    <div className={styles.modifier}>
      <span>Modifier:</span>
      <Button data-testid={`minus-${name}`} icon="minus" onClick={decrement} type="button" />
      <output data-testid={name}>{field.value}</output>
      <Button data-testid={`plus-${name}`} icon="plus" onClick={increment} type="button" />
    </div>
  );
}

export default Modifier;
