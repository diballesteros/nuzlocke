import { useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import { TYPE_COLOR } from 'constants/colors';
import { GENERATIONS, TYPES } from 'constants/constant';
import { TFilter } from 'hooks/useFilter';
import styles from './Filter.module.scss';

interface FilterProps {
  values: TFilter;
  darkMode?: boolean;
}

function Filter({ darkMode = false, values }: FilterProps): JSX.Element {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.filter}>
      <Input
        aria-label="search"
        className={styles.search}
        data-testid="filter"
        fluid
        icon
        onChange={(e, data) => values.setSearch(data.value)}
        placeholder="Search..."
        type="search"
        value={values.search}
      >
        <input />
        <Icon name="search" />
      </Input>
      <Button
        active={show}
        aria-label="search-filter"
        color={values.gens?.length > 0 || values?.types?.length > 0 ? 'blue' : undefined}
        data-testid="filter-button"
        icon="filter"
        inverted={darkMode}
        onClick={() => setShow((prevState) => !prevState)}
        toggle
        type="button"
      />
      {show && (
        <div className={styles.popup}>
          <b>Generations:</b>
          <div className={styles.buttonRow}>
            {GENERATIONS.map((gen) => {
              return (
                <Button
                  active={values.gens.includes(gen)}
                  data-testid={`filter-gen-${gen}`}
                  key={`filter-gen-${gen}`}
                  onClick={() => values.setGens(gen)}
                  toggle
                >
                  {gen}
                </Button>
              );
            })}
          </div>
          <b>Types:</b>
          <div className={styles.buttonRow}>
            {TYPES.map((type) => {
              return (
                <Button
                  data-testid={`filter-type-${type}`}
                  key={`filter-type-${type}`}
                  onClick={() => values.setTypes(type)}
                  style={{
                    backgroundColor: values.types.includes(type) ? TYPE_COLOR[type] : undefined,
                  }}
                >
                  {type}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Filter;
