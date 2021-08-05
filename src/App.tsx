import React, { useEffect, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';
import Container from 'semantic-ui-react/dist/commonjs/elements/Container';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import useStore from 'store';
import { AppState } from 'constants/types';
import { About, BadgeEditor, Contact, Pokestats, Rules, Settings, Tracker } from 'components';
import styles from './App.module.scss';

const API_URL = 'https://pokeapi.co/api/v2/location-area/evergrande-city-area';
const App: React.FC = () => {
  const appState = useStore((state) => state);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [gameName, setGameName] = useState('');
  const [response, setResponse] = React.useState(null);

  const panes = [
    {
      menuItem: 'Tracker',
      render: () => (
        <Tab.Pane>
          <Tracker />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Rules',
      render: () => (
        <Tab.Pane>
          <Rules />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'PokéStats',
      render: () => (
        <Tab.Pane>
          <Pokestats />
        </Tab.Pane>
      ),
    },
  ];

  useEffect(() => {
    if (appState.darkMode) {
      document.documentElement.style.setProperty('--card', '#424242');
      document.documentElement.style.setProperty('--badge', '#C395FE');
      document.documentElement.style.setProperty('--badgeflash', '#ffffff');
      document.documentElement.style.setProperty('--bgprimary', '#212121');
      document.documentElement.style.setProperty('--bgsecondary', '#333333');
      document.documentElement.style.setProperty('--contrast', '#FFFFFF');
    } else {
      document.documentElement.style.setProperty('--card', '#ffffff');
      document.documentElement.style.setProperty('--bgprimary', '#FFFFFF');
      document.documentElement.style.setProperty('--badge', '#D46A6A');
      document.documentElement.style.setProperty('--badgeflash', '#ffaaaa');
      document.documentElement.style.setProperty('--bgsecondary', '#E2E1E0');
      document.documentElement.style.setProperty('--contrast', '#333333');
    }
  }, [appState.darkMode]);

  const handleExport = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({
        badges: appState.badges,
        games: appState.games,
        gamesList: appState.gamesList,
        rules: appState.rules,
        rulesets: appState.rulesets,
        selectedGame: appState.selectedGame,
      })
    )}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'PokemonList.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (event) => {
      try {
        const partialState: Partial<AppState> = JSON.parse(event.target.result as string);
        if (!!partialState?.games && !!partialState?.selectedGame && !!partialState?.gamesList) {
          appState.importState(partialState);
        } else {
          throw Error('Invalid');
        }
      } catch (error) {
        console.error(error);
      }
    };
  };

  const handleChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const foundGame = appState.gamesList.find((game) => game.value === data.value);
    appState.selectGame(foundGame);
  };

  const handleAdd = () => {
    appState.addGame(gameName);
    setOpen(false);
    setGameName('');
  };

  const handleClose = () => {
    setOpen(false);
    setGameName('');
  };

  const handleDelete = () => {
    appState.deleteGame();
    setConfirm(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(`filter: ${text},`);
  };

  const fetchData = async () => {
    const cap = (word: string): string => {
      return word[0].toUpperCase() + word.substring(1);
    };
    const res = await fetch(API_URL, {});
    const json = await res.json();
    const test: { [key: string]: string[] } = {
      'rby': [],
      'gsc': [],
      'rse': [],
      'frlg': [],
      'dpp': [],
      'bw': [],
      'bw2': [],
      'xy': [],
      'oras': [],
    };
    json.pokemon_encounters.forEach(
      (enc: { version_details: { version: { name: any } }[]; pokemon: { name: string } }) => {
        enc.version_details.forEach((ver: { version: { name: any } }) => {
          const capitalized = cap(enc.pokemon.name);
          switch (ver.version.name) {
            case 'red':
            case 'blue':
            case 'yellow':
              if (!test.rby.includes(capitalized)) {
                test.rby.push(cap(capitalized));
              }
              break;
            case 'gold':
            case 'silver':
            case 'crystal':
            case 'heartgold':
            case 'soulsilver':
              if (!test.gsc.includes(capitalized)) {
                test.gsc.push(cap(capitalized));
              }
              break;
            case 'ruby':
            case 'sapphire':
            case 'emerald':
              if (!test.rse.includes(capitalized)) {
                test.rse.push(cap(capitalized));
              }
              break;
            case 'firered':
            case 'leafgreen':
              if (!test.frlg.includes(capitalized)) {
                test.frlg.push(cap(capitalized));
              }
              break;
            case 'diamond':
            case 'pearl':
            case 'platinum':
              if (!test.frlg.includes(capitalized)) {
                test.frlg.push(cap(capitalized));
              }
              break;
            case 'black':
            case 'white':
              if (!test.bw.includes(capitalized)) {
                test.bw.push(cap(capitalized));
              }
              break;
            case 'black-2':
            case 'white-2':
              if (!test.bw2.includes(capitalized)) {
                test.bw2.push(cap(capitalized));
              }
              break;
            case 'omega-ruby':
            case 'alpha-sapphire':
              if (!test.oras.includes(capitalized)) {
                test.oras.push(cap(capitalized));
              }
              break;
            case 'x':
            case 'y':
              if (!test.xy.includes(capitalized)) {
                test.xy.push(cap(capitalized));
              }
              break;
            default:
              break;
          }
        });
      }
    );
    setResponse(test);
  };

  return (
    <main className={styles.app}>
      <header>
        <Menu attached="top" inverted={appState.darkMode} style={{ width: '100%' }}>
          <Dropdown aria-label="options" data-testid="options" item icon="wrench" simple>
            <Dropdown.Menu>
              <Settings />
              <Dropdown.Item icon="download" onClick={handleExport} text="Export" />
              <Dropdown.Item id="import">
                <Icon name="upload" />
                <input
                  aria-labelledby="import"
                  className={styles.input}
                  id="file-input"
                  onChange={handleImport}
                  type="file"
                />
                Import
              </Dropdown.Item>
              <Contact />
              <About />
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown
            aria-label="games"
            className={styles.gameSelect}
            data-testid="game-select"
            inline
            lazyLoad
            onChange={handleChange}
            options={appState.gamesList}
            placeholder="Choose a game"
            selection
            value={appState.selectedGame?.value ?? ''}
          />
          <Menu.Menu position="left">
            <Modal
              closeOnDimmerClick
              onClose={handleClose}
              open={open}
              trigger={
                <Button
                  aria-label="addgame"
                  className={styles.button}
                  data-testid="add-game"
                  icon
                  onClick={() => setOpen(true)}
                  style={{ boxShadow: 'none' }}
                >
                  <Icon name="plus" />
                </Button>
              }
            >
              <Modal.Header>Add Game</Modal.Header>
              <Modal.Content style={{ display: 'flex', flexFlow: 'column nowrap', gap: '5px' }}>
                Please enter the game name
                <Input
                  data-testid="add-game-input"
                  onChange={(e, data) => setGameName(data.value)}
                  value={gameName}
                />
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button disabled={gameName?.length === 0} onClick={handleAdd}>
                  Save
                </Button>
              </Modal.Actions>
            </Modal>
            {appState.selectedGame?.value && Number(appState.selectedGame.value) > 13 ? (
              <Button
                aria-label="deletegame"
                className={styles.button}
                icon
                onClick={() => setConfirm(true)}
                style={{ boxShadow: 'none', padding: '2px', margin: 0 }}
              >
                <Icon name="trash" />
              </Button>
            ) : null}
            {appState.selectedGame?.value && Number(appState.selectedGame.value) <= 13 ? (
              <BadgeEditor />
            ) : null}
            <Confirm
              closeOnDimmerClick
              content="This will delete the custom game. Are you sure?"
              open={confirm}
              onCancel={() => setConfirm(false)}
              onConfirm={handleDelete}
            />
          </Menu.Menu>
          <Menu.Menu className={styles.header}>
            <h1>Nuzlocke Tracker</h1>
          </Menu.Menu>
          <Menu.Menu position="right">
            <Button
              aria-label="darkmode"
              className={`${styles.button} ${styles.darkmode}`}
              icon
              onClick={() => appState.toggleMode()}
            >
              <Icon name={appState.darkMode ? 'sun outline' : 'sun'} />
            </Button>
          </Menu.Menu>
        </Menu>
      </header>
      <Container className={styles.container}>
        {/* <Tab className={styles.tabs} panes={panes} /> */}
        <h1>{API_URL}</h1>
        <button onClick={fetchData} type="button" style={{ width: 500, height: 500 }}>
          Fetch
        </button>
        <code>
          {response
            ? Object.entries(response).map((entry) => {
                if ((entry[1] as unknown as string[]).length > 0) {
                  return (
                    <div style={{ display: 'flex', gap: '10px' }} key={entry[0]}>
                      <b>{entry[0]}</b>
                      <button onClick={() => handleCopy(JSON.stringify(entry[1]))} type="button">
                        copy
                      </button>
                    </div>
                  );
                }
              })
            : null}
        </code>
      </Container>
      <footer className={styles.footer}>
        <b className={styles.name}>Nuzlocke Tracker</b>
        <a
          className={styles.github}
          href="https://github.com/diballesteros/nuzlocke/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="github" />
          <span>Source</span>
        </a>
      </footer>
    </main>
  );
};

export default App;
