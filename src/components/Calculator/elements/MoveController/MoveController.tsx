import { Control, useController, useWatch } from 'react-hook-form';
import { MoveSelector } from 'components';
import { ButtonController } from 'components/Calculator/elements';
import { TCalculatorForm } from 'constants/types';
import styles from './MoveController.module.scss';

interface MoveControllerProps {
  control: Control<TCalculatorForm>;
  move: '1' | '2' | '3' | '4';
  pokemon: '1' | '2';
}

function MoveController({ control, move, pokemon }: MoveControllerProps): JSX.Element {
  const calcGen = useWatch({ control, name: 'calculatorGen' });
  const { field } = useController({ control, name: `move${move}_${pokemon}` });

  const handleMove = (moveId: number) => {
    field.onChange(moveId);
  };

  return (
    <div className={styles.move} data-testid={`move${move}_${pokemon}`}>
      <MoveSelector currentMoveId={field.value} handleMove={handleMove} limitGen={calcGen} />
      {field.value && (
        <>
          <ButtonController control={control} label="Crit" name={`move${move}_crit${pokemon}`} />
          {calcGen > 6 && (
            <ButtonController control={control} label="Z" name={`move${move}_z${pokemon}`} />
          )}
        </>
      )}
    </div>
  );
}

export default MoveController;
