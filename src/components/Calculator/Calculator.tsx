import { GenerationNum } from '@smogon/calc';
import React, { useCallback } from 'react';
import { useForm, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { selectCaught } from 'selectors';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { Fields, General } from 'components/Calculator/elements';
import { GENERATION_SELECT } from 'constants/constant';
import { TCalculatorForm } from 'constants/types';
import useStore from 'store';
import styles from './Calculator.module.scss';

function GenSelector({
  setValue,
  watch,
}: {
  setValue: UseFormSetValue<TCalculatorForm>;
  watch: UseFormWatch<TCalculatorForm>;
}) {
  const selectedGen = watch('calculatorGen');

  const handleChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    setValue('calculatorGen', data.value as GenerationNum);
  };

  return (
    <Dropdown
      aria-label="generation-selector"
      basic
      data-testid="gen-selector"
      labeled
      inline
      onChange={handleChange}
      options={GENERATION_SELECT}
      placeholder="Select..."
      selection
      value={selectedGen}
    />
  );
}

function Calculator(): JSX.Element {
  const calc = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value], []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const caught = useStore(selectCaught);
  const form = useForm<TCalculatorForm>({
    defaultValues: { ...calc.form },
  });

  return (
    <form className={styles.container} id="calculator">
      <div className={styles.header} style={{ gridColumn: '1 / -1' }}>
        <GenSelector watch={form.watch} setValue={form.setValue} />
        <Button
          className={styles.button}
          inverted={darkMode}
          onClick={() => form.reset()}
          type="button"
        >
          Reset
          <Icon className="icon refresh" />
        </Button>
      </div>
      <fieldset className={styles.fieldset}>
        <General encounters={caught} form={form} pokemon="1" />
        <Fields control={form.control} pokemon="1" register={form.register} />
      </fieldset>
      <fieldset className={styles.fieldset}>
        <General form={form} pokemon="2" />
        <Fields control={form.control} pokemon="2" register={form.register} />
      </fieldset>
    </form>
  );
}

export default Calculator;
