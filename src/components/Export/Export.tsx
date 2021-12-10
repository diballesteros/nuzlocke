import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import useStore from 'store';

function Export(): JSX.Element {
  const { t } = useTranslation('common');
  const team = useStore(useCallback((state) => state.team, []));
  const rules = useStore(useCallback((state) => state.rules, []));
  const gamesList = useStore(useCallback((state) => state.gamesList, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const badges = useStore(useCallback((state) => state.badges, []));
  const games = useStore(useCallback((state) => state.games, []));
  const customBadges = useStore(useCallback((state) => state.customBadges, []));
  const customStatuses = useStore(useCallback((state) => state.customStatuses, []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const duplicates = useStore(useCallback((state) => state.duplicates, []));
  const missing = useStore(useCallback((state) => state.missing, []));
  const nicknames = useStore(useCallback((state) => state.nicknames, []));
  const showAll = useStore(useCallback((state) => state.showAll, []));
  const suggestions = useStore(useCallback((state) => state.suggestions, []));

  const handleExport = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({
        badges,
        customBadges,
        customStatuses,
        darkMode,
        duplicates,
        games,
        gamesList,
        missing,
        nicknames,
        rules,
        selectedGame,
        showAll,
        suggestions,
        team,
      })
    )}`;
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
