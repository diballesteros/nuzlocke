import { ABILITIES } from '@smogon/calc';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { ItemSelector } from 'common';
import { PokeController } from 'components/Calculator/elements';
import { STATUS_EFFECTS } from 'constants/calculator';
import { GENDERS } from 'constants/constant';
import NATURES from 'constants/natures';
import type { TEncounter } from 'constants/types';
import useStore from 'store';
import dropdownStyles from 'assets/styles/Dropdown.module.scss';
import styles from './General.module.scss';

interface GeneralProps {
  encounters?: TEncounter[];
  pokemon: '1' | '2';
}

function General({ encounters, pokemon }: GeneralProps): JSX.Element {
  const { t } = useTranslation('calculator');
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));
  const increment = () => {
    const currentLevel = form[`level${pokemon}`];
    if (currentLevel < 100) {
      update({ [`level${pokemon}`]: Number(currentLevel) + 1 });
    }
  };

  const decrement = () => {
    const currentLevel = form[`level${pokemon}`];
    if (currentLevel > 0) {
      update({ [`level${pokemon}`]: currentLevel - 1 });
    }
  };

  return (
    <div className={styles.general}>
      <PokeController encounters={encounters} name={`pokemon${pokemon}`} />
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
          onChange={(e) => {
            update({ [`level${pokemon}`]: Number(e.target.value) });
          }}
          value={form[`level${pokemon}`]}
        />
        <Button
          data-testid={`plus-level${pokemon}`}
          icon="plus"
          onClick={increment}
          type="button"
        />
      </div>
      <Dropdown
        aria-label="gender-selector"
        className={`${dropdownStyles.dropdown} ${styles.gender}`}
        data-testid={`gender${pokemon}`}
        inline
        onChange={(e, data) => update({ [`gender${pokemon}`]: data.value })}
        options={GENDERS}
        placeholder={t('gender')}
        selection
        value={form[`gender${pokemon}`] ?? ''}
      />

      {form.calculatorGen > 2 && (
        <>
          <Dropdown
            aria-label="nature-selector"
            basic
            className={`${dropdownStyles.dropdown} ${styles.fullColumn}`}
            clearable
            data-testid={`nature${pokemon}`}
            inline
            lazyLoad
            onChange={(e, data) => update({ [`nature${pokemon}`]: data.value })}
            options={NATURES}
            placeholder={t('select_nature')}
            search
            selection
            value={form[`nature${pokemon}`] ?? ''}
          />
          <Dropdown
            aria-label="ability"
            basic
            className={`${dropdownStyles.dropdown} ${styles.fullColumn}`}
            clearable
            data-testid={`ability${pokemon}`}
            inline
            lazyLoad
            onChange={(e, data) => update({ [`ability${pokemon}`]: data.value })}
            options={[...new Set(ABILITIES[8])].map((smogonAbility) => {
              return { text: smogonAbility, value: smogonAbility };
            })}
            placeholder={t('select_ability')}
            search
            selection
            value={form[`ability${pokemon}`] ?? ''}
          />
        </>
      )}
      {form.calculatorGen > 1 && (
        <ItemSelector
          dataTestId={`item${pokemon}`}
          item={form[`item${pokemon}`] ?? ''}
          onChange={(newItem) => update({ [`item${pokemon}`]: newItem })}
        />
      )}
      <Dropdown
        aria-label="status"
        basic
        className={`${dropdownStyles.dropdown} ${styles.fullColumn}`}
        clearable
        data-testid={`status${pokemon}`}
        inline
        lazyLoad
        onChange={(e, data) => update({ [`status${pokemon}`]: data.value })}
        options={STATUS_EFFECTS}
        placeholder={t('select_status')}
        search
        selection
        value={form[`status${pokemon}`] ?? ''}
      />
    </div>
  );
}

export default General;
