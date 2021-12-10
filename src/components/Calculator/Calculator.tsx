import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  CalculatorHeader,
  General,
  MoveController,
  SideField,
  Stats,
} from 'components/Calculator/elements';
import { DEFAULT_VALUES } from 'constants/calculator';
import type { TCalculatorForm } from 'constants/types';
import useWindowSize from 'hooks/useWindowSize';
import { selectCaught } from 'selectors';
import useStore from 'store';
import { ReactComponent as PokeballSVG } from 'assets/svg/pokeball.svg';
import styles from './Calculator.module.scss';

function Calculator(): JSX.Element {
  const { t } = useTranslation('common');
  const [selected, setSelected] = useState<0 | 1>(0);
  const calc = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value], []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const setDefaultCalculator = useStore(useCallback((state) => state.setDefaultCalculator, []));
  const caught = useStore(selectCaught);
  const size = useWindowSize();
  const form = useForm<TCalculatorForm>({
    defaultValues: selectedGame && !!calc?.form ? { ...calc.form } : { ...DEFAULT_VALUES },
  });
  const { reset } = form;

  useEffect(() => {
    if (selectedGame?.value && !calc?.form) {
      setDefaultCalculator();
    }
  }, [calc, selectedGame, setDefaultCalculator]);

  useEffect(() => {
    if (selectedGame && !!calc?.form) {
      reset({ ...calc.form });
    }
  }, [calc, reset, selectedGame]);

  return (
    <form className={styles.container} id="calculator">
      {selectedGame ? (
        <>
          <CalculatorHeader form={form} />
          <fieldset
            className={styles.fieldset}
            style={{ display: selected === 0 || size?.width >= 750 ? 'flex' : 'none' }}
          >
            <General encounters={caught} form={form} pokemon="1" />
            <MoveController control={form.control} move="1" pokemon="1" />
            <MoveController control={form.control} move="2" pokemon="1" />
            <MoveController control={form.control} move="3" pokemon="1" />
            <MoveController control={form.control} move="4" pokemon="1" />
            <Stats form={form} pokemon="1" />
            <SideField form={form} pokemon="1" />
          </fieldset>
          <fieldset
            className={styles.fieldset}
            style={{ display: selected === 1 || size?.width >= 750 ? 'flex' : 'none' }}
          >
            <General form={form} pokemon="2" />
            <MoveController control={form.control} move="1" pokemon="2" />
            <MoveController control={form.control} move="2" pokemon="2" />
            <MoveController control={form.control} move="3" pokemon="2" />
            <MoveController control={form.control} move="4" pokemon="2" />
            <Stats form={form} pokemon="2" />
            <SideField form={form} pokemon="2" />
          </fieldset>
          <ul className={styles.tabs}>
            <li
              className={`${styles.tab} ${selected === 0 ? styles.active : ''}`}
              data-testid="pokemon1-tab"
              onClick={() => setSelected(0)}
              role="presentation"
            >
              Pokémon 1
            </li>
            <li
              className={`${styles.tab} ${selected === 1 ? styles.active : ''}`}
              data-testid="pokemon2-tab"
              onClick={() => setSelected(1)}
              role="presentation"
            >
              Pokémon 2
            </li>
          </ul>
        </>
      ) : (
        <div className={styles.placeholder}>
          <PokeballSVG />
          <span>{t('please_select')}</span>
        </div>
      )}
    </form>
  );
}

export default Calculator;
