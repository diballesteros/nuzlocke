import { useCallback, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { MainField } from 'components/Calculator/elements';
import { GENERATION_SELECT } from 'constants/constant';
import { TCalculatorForm } from 'constants/types';
import useCalculate from 'hooks/useCalculate';
import useStore from 'store';
import styles from './CalculatorHeader.module.scss';

interface CalculatorHeaderProps {
  form: UseFormReturn<TCalculatorForm, object>;
}

function CalculatorHeader({ form }: CalculatorHeaderProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const [primary, setPrimary] = useState<[position: 'attacker' | 'defender', index: number]>([
    'attacker',
    0,
  ]);
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const { attackerResults, defenderResults } = useCalculate(form.control);

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
        <MainField form={form} />
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
        <output className={styles.mainResult}>
          {primary[0] === 'attacker'
            ? attackerResults[primary[1]]?.fullDesc()
            : defenderResults[primary[1]]?.fullDesc()}
        </output>
        <Icon
          name="angle right"
          onClick={() => setExpanded((prevState) => !prevState)}
          style={{ transform: expanded ? 'rotate(90deg)' : undefined }}
        />
      </div>
      <div className={`${styles.moreResults} ${expanded ? styles.open : ''}`}>
        <div className={styles.grouped}>
          <b>Attacker:</b>
          {attackerResults.map((result, i) => {
            return (
              <div
                className={primary[0] === 'attacker' && primary[1] === i ? styles.active : ''}
                key={`attacker-result-${i + 1}`}
                onClick={() => setPrimary(['attacker', i])}
                role="presentation"
              >
                <Icon name="pin" />
                {result?.fullDesc() || 'No move selected'}
              </div>
            );
          })}
        </div>
        <div className={styles.grouped}>
          <b>Defender:</b>
          {defenderResults.map((result, i) => {
            return (
              <div
                className={primary[0] === 'defender' && primary[1] === i ? styles.active : ''}
                key={`defender-result-${i + 1}`}
                onClick={() => setPrimary(['defender', i])}
                role="presentation"
              >
                <Icon name="pin" />
                {result?.fullDesc() || 'No move selected'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CalculatorHeader;
