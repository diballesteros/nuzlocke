import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import NATURES from 'constants/natures';
import type { TEncounter } from 'constants/types';
import useStore from 'store';
import styles from './Nature.module.scss';

interface NatureProps {
  encounter: TEncounter;
}

function Nature({ encounter }: NatureProps): JSX.Element {
  const { t } = useTranslation('common');
  const changeNature = useStore(useCallback((state) => state.changeNature, []));

  const handleChange = (data: DropdownProps) => {
    changeNature(encounter.id, data.value as unknown as string);
  };

  return (
    <Dropdown
      button
      className={styles.dropdownButton}
      data-testid={`nature-${encounter.id}`}
      direction="left"
      lazyLoad
      icon="leaf"
      onChange={(e, data) => handleChange(data)}
      options={NATURES}
      scrolling
      text={encounter?.details?.nature ?? t('nature')}
      title={t('nature')}
      value={encounter?.details?.nature}
    />
  );
}

export default Nature;
