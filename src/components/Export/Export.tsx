import React, { useCallback } from 'react';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import useStore from 'store';

function Export(): JSX.Element {
  const team = useStore(useCallback((state) => state.team, []));
  const rules = useStore(useCallback((state) => state.rules, []));
  const gamesList = useStore(useCallback((state) => state.gamesList, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const badges = useStore(useCallback((state) => state.badges, []));
  const games = useStore(useCallback((state) => state.games, []));

  const handleExport = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({
        badges,
        games,
        gamesList,
        rules,
        selectedGame,
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
    <Menu.Item onClick={handleExport}>
      <Icon name="download" />
      Export
    </Menu.Item>
  );
}

export default Export;
