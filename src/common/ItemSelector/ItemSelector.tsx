import { useTranslation } from 'react-i18next';
import { getSmogonItemName, MY_ITEMS } from 'constants/constant';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';

interface ItemSelectorProps {
  dataTestId?: string;
  item: string;
  onChange: (item: string) => void;
}

const OPTIONS: ComboboxOption[] = MY_ITEMS.map((item) => ({
  value: item,
  text: item,
  image: (
    <span className="pkitem-wrapper">
      <span className={`pkitem pkitem-${getSmogonItemName(item)}`} />
    </span>
  ),
}));

function ItemSelector({ dataTestId, item, onChange }: ItemSelectorProps): React.JSX.Element {
  const { t } = useTranslation('calculator');

  return (
    <Combobox
      aria-label="item"
      clearable
      data-testid={dataTestId || 'item'}
      onChange={onChange}
      options={OPTIONS}
      placeholder={t('select_item')}
      value={item ?? ''}
    />
  );
}

export default ItemSelector;
