import { Control, useController } from 'react-hook-form';
import { MoveSelector } from 'components';
import { TCalculatorForm } from 'constants/types';

interface MoveControllerProps {
  control: Control<TCalculatorForm>;
  name: keyof Pick<
    TCalculatorForm,
    `move1_${1 | 2}` | `move2_${1 | 2}` | `move3_${1 | 2}` | `move4_${1 | 2}`
  >;
}

function MoveController({ control, name }: MoveControllerProps): JSX.Element {
  const { field } = useController({ control, name });

  const handleMove = (moveId: number) => {
    field.onChange(moveId);
  };

  return <MoveSelector currentMoveId={field.value} handleMove={handleMove} />;
}

export default MoveController;
