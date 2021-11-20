import { Result } from '@smogon/calc';
import { useCallback, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { MainField } from 'components/Calculator/elements';
import { GENERATION_SELECT, MAX_GAME } from 'constants/constant';
import { TCalculatorForm } from 'constants/types';
import useCalculate from 'hooks/useCalculate';
import useStore from 'store';
import styles from './CalculatorHeader.module.scss';

interface CalculatorHeaderProps {
  form: UseFormReturn<TCalculatorForm, object>;
}

export function getDesc(result: Result): string {
  try {
    return result?.fullDesc() || 'No move selected';
  } catch (e) {
    if ((e as Error).message === 'damage[damage.length - 1] === 0.') {
      return `${result.attacker.name} ${result.move.name} vs ${result.defender.name}: 0 - 0%`;
    }
    return 'Invalid calculation';
  }
}

function CalculatorHeader({ form }: CalculatorHeaderProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const [primary, setPrimary] = useState<[position: 'attacker' | 'defender', index: number]>([
    'attacker',
    0,
  ]);
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const { attackerResults, defenderResults } = useCalculate(form.control);

  return (
    <div className={styles.header}>
      <div className={styles.options}>
        {selectedGame?.value && Number(selectedGame.value) > MAX_GAME && (
          <Controller
            control={form.control}
            name="calculatorGen"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                aria-label="generation-selector"
                className={styles.genSelector}
                data-testid="gen-selector"
                labeled
                inline
                onChange={(e, data) => onChange(data.value)}
                options={GENERATION_SELECT}
                placeholder="Select..."
                selection
                text="Generation"
                value={value}
              />
            )}
          />
        )}
        <MainField form={form} />
        <Button
          className={styles.button}
          data-testid="reset-calculator"
          inverted={darkMode}
          onClick={() => form.reset()}
          type="button"
        >
          Reset
          <Icon className="icon refresh" />
        </Button>
      </div>
      <div className={styles.primary}>
        <output className={styles.mainResult} data-testid="primary-damage">
          {primary[0] === 'attacker'
            ? getDesc(attackerResults[primary[1]])
            : getDesc(defenderResults[primary[1]])}
        </output>
        <Icon
          data-testid="expand-moves"
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
                data-testid={`attacker-result-${i + 1}`}
                key={`attacker-result-${i + 1}`}
                onClick={() => setPrimary(['attacker', i])}
                role="presentation"
              >
                <Icon name="pin" />
                {getDesc(result)}
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
                data-testid={`defender-result-${i + 1}`}
                key={`defender-result-${i + 1}`}
                onClick={() => setPrimary(['defender', i])}
                role="presentation"
              >
                <Icon name="pin" />
                {getDesc(result)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CalculatorHeader;
