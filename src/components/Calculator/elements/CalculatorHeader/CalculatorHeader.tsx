import { GenerationNum, Result } from '@smogon/calc';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { MainField } from 'components/Calculator/elements';
import { DEFAULT_VALUES } from 'constants/calculator';
import { GENERATION_SELECT, MAX_GAME } from 'constants/constant';
import useCalculate from 'hooks/useCalculate';
import useStore from 'store';
import styles from './CalculatorHeader.module.scss';

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

function CalculatorHeader(): JSX.Element {
  const { t } = useTranslation('calculator');
  const [expanded, setExpanded] = useState(false);
  const [primary, setPrimary] = useState<[position: 'attacker' | 'defender', index: number]>([
    'attacker',
    0,
  ]);
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));
  const { attackerResults, defenderResults } = useCalculate();

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLDivElement>,
    change: [position: 'attacker' | 'defender', index: number]
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setPrimary(change);
    }
  };

  const handleMainKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setExpanded((prevState) => !prevState);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.options}>
        {selectedGame?.value && Number(selectedGame.value) > MAX_GAME && (
          <Dropdown
            aria-label="generation-selector"
            className={styles.genSelector}
            data-testid="gen-selector"
            labeled
            inline
            onChange={(e, data) => update({ calculatorGen: data.value as GenerationNum })}
            options={GENERATION_SELECT}
            placeholder={t('select')}
            selection
            text={t('generation')}
            value={form?.calculatorGen ?? ''}
          />
        )}
        <MainField />
        <Button
          className={styles.button}
          data-testid="reset-calculator"
          inverted={darkMode}
          onClick={() => {
            update({ ...DEFAULT_VALUES });
          }}
          type="button"
        >
          {t('reset')}
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
          onKeyPress={handleMainKeyPress}
          role="button"
          style={{ transform: expanded ? 'rotate(90deg)' : undefined }}
          tabIndex={0}
        />
      </div>
      <div className={`${styles.moreResults} ${expanded ? styles.open : ''}`}>
        <div className={styles.grouped}>
          <b>{t('attacker')}:</b>
          {attackerResults.map((result, i) => {
            return (
              <div
                className={primary[0] === 'attacker' && primary[1] === i ? styles.active : ''}
                data-testid={`attacker-result-${i + 1}`}
                key={`attacker-result-${i + 1}`}
                onClick={() => setPrimary(['attacker', i])}
                onKeyPress={(e) => handleKeyPress(e, ['attacker', i])}
                role="button"
                tabIndex={0}
              >
                <Icon name="pin" />
                {getDesc(result)}
              </div>
            );
          })}
        </div>
        <div className={styles.grouped}>
          <b>{t('defender')}:</b>
          {defenderResults.map((result, i) => {
            return (
              <div
                className={primary[0] === 'defender' && primary[1] === i ? styles.active : ''}
                data-testid={`defender-result-${i + 1}`}
                key={`defender-result-${i + 1}`}
                onClick={() => setPrimary(['defender', i])}
                onKeyPress={(e) => handleKeyPress(e, ['defender', i])}
                role="button"
                tabIndex={0}
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
