import { useTranslation } from 'react-i18next';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import type { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import { getSmogonItemName, MY_ITEMS } from 'constants/constant';
import styles from 'assets/styles/Dropdown.module.scss';

interface ItemSelectorProps {
  dataTestId?: string;
  item: string;
  onChange: (item: string) => void;
}

const OPTIONS = MY_ITEMS.map((item) => {
  return {
    key: item,
    text: item,
    value: item,
    image: {
      avatar: true,
      children: (
        <div className="pkitem-wrapper">
          <div className={`pkitem pkitem-${getSmogonItemName(item)}`} />
        </div>
      ),
    },
  };
});

function ItemSelector({ dataTestId, item, onChange }: ItemSelectorProps): React.JSX.Element {
  const { t } = useTranslation('calculator');

  return (
    <Dropdown
      aria-label="item"
      className={styles.dropdown}
      data-testid={dataTestId || 'item'}
      clearable
      inline
      lazyLoad
      onChange={(e, data) => onChange(data.value as string)}
      options={OPTIONS as unknown as DropdownItemProps[]}
      placeholder={t('select_item')}
      selection
      search
      value={item ?? ''}
    />
  );
}

export default ItemSelector;
