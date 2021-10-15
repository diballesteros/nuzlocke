import { useCallback } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { GENERATION_SELECT } from 'constants/constant';
import { TCalculatorForm } from 'constants/types';
import useCalculate from 'hooks/useCalculate';
import useStore from 'store';
import styles from './CalculatorHeader.module.scss';

interface CalculatorHeaderProps {
  form: UseFormReturn<TCalculatorForm, object>;
}

function CalculatorHeader({ form }: CalculatorHeaderProps): JSX.Element {
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const { attackerResults } = useCalculate(form.control);

  return (
    <div className={styles.header}>
      <div className={styles.options}>
        <Controller
          control={form.control}
          name="calculatorGen"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              text="Generation"
              aria-label="generation-selector"
              className={styles.genSelector}
              data-testid="gen-selector"
              labeled
              inline
              onChange={onChange}
              options={GENERATION_SELECT}
              placeholder="Select..."
              selection
              value={value}
            />
          )}
        />
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
      <div className={styles.primary}>
        <output className={styles.mainResult}>{attackerResults[0].fullDesc()}</output>
        <Icon name="angle right" />
      </div>
    </div>
  );
}

export default CalculatorHeader;
