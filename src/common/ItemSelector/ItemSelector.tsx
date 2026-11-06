import { useTranslation } from 'react-i18next';
import { getSmogonItemName, MY_ITEMS } from 'constants/constant';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';

interface ItemSelectorProps {
  // The field's name when a visible caption labels it (defaults to "item")
  'aria-label'?: string;
  dataTestId?: string;
  item: string;
  look?: 'row';
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

function ItemSelector({
  'aria-label': ariaLabel = 'item',
  dataTestId,
  item,
  look,
  onChange,
}: ItemSelectorProps): React.JSX.Element {
  const { t } = useTranslation('calculator');

  return (
    <Combobox
      aria-label={ariaLabel}
      clearable
      data-testid={dataTestId || 'item'}
      look={look}
      onChange={onChange}
      options={OPTIONS}
      placeholder={t('select_item')}
      value={item ?? ''}
    />
  );
}

export default ItemSelector;
