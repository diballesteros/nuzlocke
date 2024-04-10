import { useTranslation } from 'react-i18next';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import { selectExport } from 'selectors';
import useStore from 'store';

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
    <Menu.Item as="div" onClick={handleExport}>
      <Icon name="download" />
      {t('export')}
    </Menu.Item>
  );
}

export default Export;
