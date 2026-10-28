import { useTranslation } from 'react-i18next';
import { selectExport } from 'selectors';
import useStore from 'store';
import { DownloadIcon } from '@/components/ui/icons';
import { SHEET_ICON, SheetItem } from '@/components/ui/sheet';

function Export(): React.JSX.Element {
  const { t } = useTranslation('common');
  const exportString = useStore(selectExport);

  const handleExport = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(exportString)}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'PokemonList.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <SheetItem data-testid="export" onClick={handleExport}>
      <DownloadIcon className={SHEET_ICON} />
      {t('export')}
    </SheetItem>
  );
}

export default Export;
