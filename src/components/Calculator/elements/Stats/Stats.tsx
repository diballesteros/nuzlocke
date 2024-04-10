import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modifier, Range } from 'components/Calculator/elements';
import useCalculate from 'hooks/useCalculate';
import useStore from 'store';
import styles from './Stats.module.scss';

interface StatsProps {
  pokemon: '1' | '2';
}

const EV = {
  label: 'EV',
  max: 255,
};

const IV = {
  label: 'IV',
  max: 31,
};

const DV = {
  label: 'DV',
  max: 15,
};

function Stats({ pokemon }: StatsProps): React.JSX.Element {
  const { t } = useTranslation('calculator');
  const { pokemon1, pokemon2 } = useCalculate();
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));
  const currentPokemon = pokemon === '1' ? pokemon1 : pokemon2;
  const pokemonOneValue = form.pokemon1;
  const pokemonTwoValue = form.pokemon2;
  const totalHp = currentPokemon?.stats?.hp;

  useEffect(() => {
    update({ [`currenthp${pokemon}`]: totalHp });
  }, [pokemon, pokemonOneValue, pokemonTwoValue, update, totalHp]);

  return (
    <section className={styles.container}>
      <div className={styles.currenthpContainer}>
        <label className={styles.label} htmlFor={`currenthp${pokemon}`}>
          {t('current_hp')}:
        </label>
        <input
          className={styles.currenthp}
          data-testid={`currenthp${pokemon}`}
          id={`currenthp${pokemon}`}
          maxLength={3}
          pattern="\d*"
          onChange={(e) => {
            update({ [`currenthp${pokemon}`]: Number(e.target.value) });
          }}
          value={form[`currenthp${pokemon}`] || 0}
        />
        <output>/{totalHp}</output>
      </div>
      <details open={false}>
        <summary data-testid={`hp${pokemon}-detail`}>
          HP <output>{totalHp}</output>
        </summary>
        {form.calculatorGen > 2 && (
          <fieldset className={styles.fieldset}>
            <Range name={`ivhp${pokemon}`} {...IV} />
            <Range name={`evhp${pokemon}`} {...EV} />
          </fieldset>
        )}
      </details>
      <details open={false}>
        <summary data-testid={`atk${pokemon}-detail`}>
          ATK <output>{currentPokemon?.stats?.atk ?? 0}</output>
        </summary>
        <fieldset className={styles.fieldset}>
          {form.calculatorGen > 2 ? (
            <>
              <Range name={`ivatk${pokemon}`} {...IV} />
              <Range name={`evatk${pokemon}`} {...EV} />
            </>
          ) : (
            <Range name={`dvatk${pokemon}`} {...DV} />
          )}
          <Modifier name={`modatk${pokemon}`} />
        </fieldset>
      </details>
      <details open={false}>
        <summary data-testid={`def${pokemon}-detail`}>
          DEF <output>{currentPokemon?.stats?.def ?? 0}</output>
        </summary>
        <fieldset className={styles.fieldset}>
          {form.calculatorGen > 2 ? (
            <>
              <Range name={`ivdef${pokemon}`} {...IV} />
              <Range name={`evdef${pokemon}`} {...EV} />
            </>
          ) : (
            <Range name={`dvdef${pokemon}`} {...DV} />
          )}
          <Modifier name={`moddef${pokemon}`} />
        </fieldset>
      </details>
      <details open={false}>
        <summary data-testid={`spatk${pokemon}-detail`}>
          {form.calculatorGen > 2 ? 'SP. ATK' : 'SPECIAL'}{' '}
          <output>{currentPokemon?.stats?.spa ?? 0}</output>
        </summary>
        <fieldset className={styles.fieldset}>
          {form.calculatorGen > 2 ? (
            <>
              <Range name={`ivspatk${pokemon}`} {...IV} />
              <Range name={`evspatk${pokemon}`} {...EV} />
            </>
          ) : (
            <Range name={`dvspc${pokemon}`} {...DV} />
          )}
          <Modifier name={`modspatk${pokemon}`} />
        </fieldset>
      </details>
      {form.calculatorGen > 2 && (
        <details open={false}>
          <summary data-testid={`spdef${pokemon}-detail`}>
            SP. DEF <output>{currentPokemon?.stats?.spd ?? 0}</output>
          </summary>
          <fieldset className={styles.fieldset}>
            <Range name={`ivspdef${pokemon}`} {...IV} />
            <Range name={`evspdef${pokemon}`} {...EV} />
            <Modifier name={`modspdef${pokemon}`} />
          </fieldset>
        </details>
      )}
      <details open={false}>
        <summary data-testid={`speed${pokemon}-detail`}>
          SPEED <output>{currentPokemon?.stats?.spe ?? 0}</output>
        </summary>
        <fieldset className={styles.fieldset}>
          {form.calculatorGen > 2 ? (
            <>
              <Range name={`ivspeed${pokemon}`} {...IV} />
              <Range name={`evspeed${pokemon}`} {...EV} />
            </>
          ) : (
            <Range name={`dvspeed${pokemon}`} {...DV} />
          )}
          <Modifier name={`modspeed${pokemon}`} />
        </fieldset>
      </details>
    </section>
  );
}

export default Stats;
