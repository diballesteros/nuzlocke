import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { selectCaught } from 'selectors';
import {
  CalculatorHeader,
  General,
  MoveController,
  SideField,
  Stats,
} from 'components/Calculator/elements';

import { TCalculatorForm } from 'constants/types';
import useStore from 'store';
import styles from './Calculator.module.scss';

function Calculator(): JSX.Element {
  const calc = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value], []));
  const caught = useStore(selectCaught);
  const form = useForm<TCalculatorForm>({
    defaultValues: { ...calc.form },
  });

  return (
    <form className={styles.container} id="calculator">
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
    </form>
  );
}

export default Calculator;
