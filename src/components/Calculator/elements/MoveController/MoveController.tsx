import { useCallback } from 'react';
import { MoveSelector } from 'components';
import { ButtonController } from 'components/Calculator/elements';
import useStore from 'store';
import styles from './MoveController.module.scss';

interface MoveControllerProps {
  move: '1' | '2' | '3' | '4';
  pokemon: '1' | '2';
}

function MoveController({ move, pokemon }: MoveControllerProps): JSX.Element {
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));

  const handleMove = (moveId: number) => {
    update({ [`move${move}_${pokemon}`]: moveId });
  };

  return (
    <div className={styles.move} data-testid={`move${move}_${pokemon}`}>
      <MoveSelector
        currentMoveId={form[`move${move}_${pokemon}`]}
        handleMove={handleMove}
        limitGen={form.calculatorGen}
      />
      {form[`move${move}_${pokemon}`] && (
        <>
          <ButtonController label="Crit" name={`move${move}_crit${pokemon}`} />
          {form.calculatorGen > 6 && (
            <ButtonController label="Z" name={`move${move}_z${pokemon}`} />
          )}
        </>
      )}
    </div>
  );
}

export default MoveController;
