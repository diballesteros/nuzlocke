import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { selectCaught } from 'selectors';
import {
  CalculatorHeader,
  General,
  MoveController,
  SideField,
  Stats,
} from 'components/Calculator/elements';
import { DEFAULT_VALUES } from 'constants/calculator';
import { TCalculatorForm } from 'constants/types';
import useStore from 'store';
import { ReactComponent as PokeballSVG } from 'assets/svg/pokeball.svg';
import styles from './Calculator.module.scss';

function Calculator(): JSX.Element {
  const calc = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value], []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const caught = useStore(selectCaught);
  const form = useForm<TCalculatorForm>({
    defaultValues: selectedGame ? { ...calc.form } : { ...DEFAULT_VALUES },
  });
  const { reset } = form;

  useEffect(() => {
    if (selectedGame) {
      reset({ ...calc.form });
    }
  }, [calc, reset, selectedGame]);

  return (
    <form className={styles.container} id="calculator">
      {selectedGame ? (
        <>
          <CalculatorHeader form={form} />
          <fieldset className={styles.fieldset}>
            <General encounters={caught} form={form} pokemon="1" />
            <MoveController control={form.control} name="move1_1" />
            <MoveController control={form.control} name="move2_1" />
            <MoveController control={form.control} name="move3_1" />
            <MoveController control={form.control} name="move4_1" />
            <Stats form={form} pokemon="1" />
            <SideField form={form} pokemon="1" />
          </fieldset>
          <fieldset className={styles.fieldset}>
            <General form={form} pokemon="2" />
            <MoveController control={form.control} name="move1_2" />
            <MoveController control={form.control} name="move2_2" />
            <MoveController control={form.control} name="move3_2" />
            <MoveController control={form.control} name="move4_2" />
            <Stats form={form} pokemon="2" />
            <SideField form={form} pokemon="2" />
          </fieldset>
        </>
      ) : (
        <div className={styles.placeholder}>
          <PokeballSVG />
          <span>Please select a game</span>
        </div>
      )}
    </form>
  );
}

export default Calculator;
