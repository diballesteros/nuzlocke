import { ABILITIES, ITEMS } from '@smogon/calc';
import { Controller, UseFormReturn, useWatch } from 'react-hook-form';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { PokeController } from 'components/Calculator/elements';
import { STATUS_EFFECTS } from 'constants/calculator';
import { GENDERS } from 'constants/constant';
import NATURES from 'constants/natures';
import { TCalculatorForm, TEncounter } from 'constants/types';
import styles from './General.module.scss';

interface GeneralProps {
  encounters?: TEncounter[];
  form: UseFormReturn<TCalculatorForm, object>;
  pokemon: '1' | '2';
}

function General({ encounters, form, pokemon }: GeneralProps): JSX.Element {
  const calcGen = useWatch({ control: form.control, name: 'calculatorGen' });
  const increment = () => {
    const currentLevel = form.getValues(`level${pokemon}`);
    if (currentLevel < 100) {
      form.setValue(`level${pokemon}`, currentLevel + 1);
    }
  };

  const decrement = () => {
    const currentLevel = form.getValues(`level${pokemon}`);
    if (currentLevel > 0) {
      form.setValue(`level${pokemon}`, currentLevel - 1);
    }
  };

  return (
    <div className={styles.general}>
      <PokeController
        control={form.control}
        encounters={encounters}
        name={`pokemon${pokemon}`}
        reset={form.reset}
      />
      <div className={styles.levelContainer}>
        <Button
          data-testid={`minus-level${pokemon}`}
          icon="minus"
          onClick={decrement}
          type="button"
        />
        <input
          className={styles.level}
          data-testid={`level-input${pokemon}`}
          id={`level${pokemon}`}
          type="number"
          {...form.register(`level${pokemon}`, { valueAsNumber: true })}
        />
        <Button
          data-testid={`plus-level${pokemon}`}
          icon="plus"
          onClick={increment}
          type="button"
        />
      </div>
      <Controller
        control={form.control}
        name={`gender${pokemon}`}
        render={({ field: { onChange, value } }) => (
          <Dropdown
            aria-label="gender-selector"
            className={`${styles.dropdown} ${styles.gender}`}
            data-testid={`gender${pokemon}`}
            inline
            onChange={(e, data) => onChange(data.value)}
            options={GENDERS}
            placeholder="Gender..."
            selection
            value={value ?? ''}
          />
        )}
      />
      {calcGen > 2 && (
        <>
          <Controller
            control={form.control}
            name={`nature${pokemon}`}
            render={({ field: { onChange, value } }) => (
              <Dropdown
                aria-label="nature-selector"
                basic
                className={`${styles.dropdown} ${styles.fullColumn}`}
                clearable
                data-testid={`nature${pokemon}`}
                inline
                lazyLoad
                onChange={(e, data) => onChange(data.value as unknown as string)}
                options={NATURES}
                placeholder="Select a nature..."
                search
                selection
                value={value ?? ''}
              />
            )}
          />
          <Controller
            control={form.control}
            name={`ability${pokemon}`}
            render={({ field: { onChange, value } }) => (
              <Dropdown
                aria-label="ability"
                basic
                className={`${styles.dropdown} ${styles.fullColumn}`}
                clearable
                data-testid={`ability${pokemon}`}
                inline
                lazyLoad
                onChange={(e, data) => onChange(data.value as unknown as string)}
                options={[...new Set(ABILITIES[8])].map((smogonAbility) => {
                  return { text: smogonAbility, value: smogonAbility };
                })}
                placeholder="Select an ability..."
                search
                selection
                value={value ?? ''}
              />
            )}
          />
        </>
      )}
      {calcGen > 1 && (
        <Controller
          control={form.control}
          name={`item${pokemon}`}
          render={({ field: { onChange, value } }) => (
            <Dropdown
              aria-label="item"
              basic
              className={`${styles.dropdown} ${styles.fullColumn}`}
              clearable
              data-testid={`item${pokemon}`}
              inline
              lazyLoad
              onChange={(e, data) => onChange(data.value as unknown as string)}
              options={[...new Set(ITEMS[8])].map((smogonItem) => {
                return { text: smogonItem, value: smogonItem };
              })}
              placeholder="Select a item..."
              search
              selection
              value={value ?? ''}
            />
          )}
        />
      )}
      <Controller
        control={form.control}
        name={`status${pokemon}`}
        render={({ field: { onChange, value } }) => (
          <Dropdown
            aria-label="status"
            basic
            className={`${styles.dropdown} ${styles.fullColumn}`}
            clearable
            data-testid={`status${pokemon}`}
            inline
            lazyLoad
            onChange={(e, data) => onChange(data.value as unknown as string)}
            options={STATUS_EFFECTS}
            placeholder="Select a status..."
            search
            selection
            value={value ?? ''}
          />
        )}
      />
    </div>
  );
}

export default General;
