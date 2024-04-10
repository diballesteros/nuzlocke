import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import useStore from 'store';
import styles from './Modifier.module.scss';

interface ModifierProps {
  name:
    | 'modatk1'
    | 'modatk2'
    | 'moddef1'
    | 'moddef2'
    | 'modspatk1'
    | 'modspatk2'
    | 'modspdef1'
    | 'modspdef2'
    | 'modspeed1'
    | 'modspeed2';
}

function Modifier({ name }: ModifierProps): React.JSX.Element {
  const { t } = useTranslation('calculator');
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));

  const decrement = () => {
    if (form[name] > -6) {
      update({ [name]: Number(form[name]) - 1 });
    }
  };

  const increment = () => {
    if (form[name] < 6) {
      update({ [name]: Number(form[name]) + 1 });
    }
  };

  return (
    <div className={styles.modifier}>
      <span>{t('modifier')}:</span>
      <Button data-testid={`minus-${name}`} icon="minus" onClick={decrement} type="button" />
      <output data-testid={name}>{form[name]}</output>
      <Button data-testid={`plus-${name}`} icon="plus" onClick={increment} type="button" />
    </div>
  );
}

export default Modifier;
