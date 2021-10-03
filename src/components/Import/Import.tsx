import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Radio from 'semantic-ui-react/dist/commonjs/addons/Radio';
import { CSVDownloader, CSVReader } from 'react-papaparse';
import useStore from 'store';
import { AppState, Gender, ParseResult, TEncounter } from 'constants/types';
import POKEMON from 'constants/pokemon';
import MOVES from 'constants/moves';
import { Page } from 'common';
import styles from './Import.module.scss';

const GENDER_DICTIONARY: Record<string, Gender> = {
  'F': 'FEMALE',
  'M': 'MALE',
};

const getMoveByName = (name: string) => {
  return MOVES?.find((move) => move.name === name)?.id || null;
};

const removeNone = (value: string) => {
  return value === '(None)' ? null : value;
};

const Import: React.FC = () => {
  const importState = useStore(useCallback((state) => state.importState, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const massImport = useStore(useCallback((state) => state.massImport, []));
  const encounterList = useStore(
    useCallback((state) => state.games[state.selectedGame?.value], [])
  );
  const [option, setOption] = useState<'all' | 'game' | 'table'>('all');
  const [file, setFile] = useState<File>(undefined);
  const [importEncounters, setImportEncounters] = useState<TEncounter[]>(null);
  const [text, setText] = useState('');

  const handleAllImport = () => {
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = (event) => {
      try {
        const partialState: Partial<AppState> = JSON.parse(event.target.result as string);
        if (!!partialState?.games && !!partialState?.selectedGame && !!partialState?.gamesList) {
          importState(partialState);
          toast.success('File successfully imported');
        } else {
          throw Error('Invalid');
        }
      } catch (error) {
        toast.error('Invalid file');
      }
    };
  };

  const getEncounter = (
    data: string[],
    arrPositions: Map<string, number>,
    pokemonName: string
  ): TEncounter => {
    const foundEnc = encounterList.encounters.find((enc) => {
      return enc.location.includes(data[arrPositions.get('MetLoc')]);
    });

    if (foundEnc) {
      const foundPoke = POKEMON.find((poke) => poke.text === pokemonName);
      return {
        details: {
          ability: data[arrPositions.get('Ability')],
          gender: GENDER_DICTIONARY[data[arrPositions.get('Gender')]],
          id: foundPoke?.value,
          item: removeNone(data[arrPositions.get('HeldItem')]),
          level: Number(data[arrPositions.get('Level')]),
          metLevel: Number(data[arrPositions.get('MetLevel')]),
          moves: [
            getMoveByName(data[arrPositions.get('Move1')]),
            getMoveByName(data[arrPositions.get('Move2')]),
            getMoveByName(data[arrPositions.get('Move3')]),
            getMoveByName(data[arrPositions.get('Move4')]),
          ],
          nature: removeNone(data[arrPositions.get('Nature')]),
        },
        id: foundEnc.id,
        location: foundEnc.location,
        nickname: removeNone(data[arrPositions.get('Nickname')]),
        pokemon: foundPoke?.value,
        status: null,
      };
    }
    return null;
  };

  const getPositionsMap = (arr: string[]) => {
    const arrPositions = new Map<string, number>();
    arr.forEach((v, i) => {
      arrPositions.set(v, i);
    });
    return arrPositions;
  };

  const handleTable = () => {
    try {
      const formatted = text.split('\n');
      if (formatted?.length <= 1 || !text.includes('|')) {
        throw Error('Invalid text');
      }
      const arrPositions = getPositionsMap(formatted[0].split('|'));
      formatted.shift();
      formatted.shift();

      const newEncounters = formatted.reduce((parsedArr: TEncounter[], line) => {
        const lineArr = line.split('|');
        const pokemonName = lineArr[arrPositions.get('Species')];

        if (lineArr?.length < 5 || !pokemonName) {
          return parsedArr;
        }

        const newEncounter = getEncounter(lineArr, arrPositions, pokemonName);
        if (newEncounter) {
          parsedArr.push(newEncounter);
        }

        return parsedArr;
      }, []);
      massImport(newEncounters);
      toast.success('Successfully imported game encounters');
    } catch (e) {
      toast.error('Invalid text');
    }
  };

  const handleCSV = (result: unknown, csvFile: File) => {
    const parsedResult = result as ParseResult<string>[];
    try {
      if (!(csvFile.type.includes('csv') || csvFile.name.includes('csv'))) {
        throw Error('Invalid file');
      }
      const arrPositions = getPositionsMap(parsedResult[0].data);
      parsedResult.shift();
      const newEncounters = parsedResult.reduce((parsedArr: TEncounter[], { data, errors }) => {
        const pokemonName = data[arrPositions.get('Species')];
        if (errors?.length > 0 || data?.length < 5 || !pokemonName) {
          return parsedArr;
        }

        const newEncounter = getEncounter(data, arrPositions, pokemonName);
        if (newEncounter) {
          parsedArr.push(newEncounter);
        }
        return parsedArr;
      }, []);
      setImportEncounters(newEncounters);
    } catch (e) {
      toast.error('Invalid file');
    }
  };

  const handleApply = () => {
    if (option === 'all') handleAllImport();
    if (option === 'table') handleTable();
    if (option === 'game') {
      massImport(importEncounters);
      toast.success('Successfully imported game encounters');
    }
  };

  return (
    <Page header="Import">
      <div className={styles.container}>
        <Radio
          checked={option === 'all'}
          label="Complete Import"
          onChange={() => setOption('all')}
          value="all"
        />
        <p>
          This will import and replace the encounters, rules and builder teams for{' '}
          <u>
            <strong>all</strong>
          </u>{' '}
          games! This uses the file generated from <strong>export</strong> in the sidebar.
        </p>
        <div className={styles.customFile}>
          <div className={styles.fileText}>
            <span>{file?.name || 'Select a file...'}</span>
          </div>
          <Button color="grey" data-testid="attach-file" type="button">
            Select a file
            <input
              accept=".json, text/json"
              aria-labelledby="import"
              className={styles.hiddenFile}
              data-testid="import-file-input"
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
            />
          </Button>
        </div>
        <b style={{ color: 'red' }}>
          IMPORTANT: The following two options may not import ALL encounters but should work on the
          majority and will rewrite encounters if it already exists
        </b>
        <b style={{ color: 'red' }}>The status is not imported</b>
        <p>
          Use PKHeX&apos;s (version 21.10.1) Box Data Report to generate to import encounters for
          the <strong>selected</strong> game: <em>{selectedGame?.text || 'No game selected'}</em>
        </p>
        <Radio
          checked={option === 'table'}
          data-testid="table-import-option"
          disabled={!selectedGame?.value}
          label="Import Game by Table [BETA]"
          onChange={() => setOption('table')}
          value="table"
        />
        <b>Is more stable than CSV for the time-being</b>
        <a
          href="https://github.com/diballesteros/nuzlocke/wiki/How-to-generate-table-with-PkHeX"
          rel="noopener noreferrer"
          target="_blank"
        >
          How To Generate table with PokeHeX <Icon name="linkify" />
        </a>
        <textarea
          className={styles.textarea}
          data-testid="table-import-textarea"
          onChange={(e) => setText(e.target.value)}
          placeholder="Copy and paste the table data..."
          rows={5}
          value={text}
        />
        <Radio
          checked={option === 'game'}
          data-testid="game-import-option"
          disabled={!selectedGame?.value}
          label="Import Game by CSV [BETA]"
          onChange={() => setOption('game')}
          value="game"
        />
        <a
          href="https://github.com/diballesteros/nuzlocke/wiki/How-to-generate-CSV-from-PkHeX"
          rel="noopener noreferrer"
          target="_blank"
        >
          How To Generate CSV with PokeHeX <Icon name="linkify" />
        </a>
        <div className={styles.csv} data-testid="csv-input">
          <CSVReader
            addRemoveButton
            onFileLoad={handleCSV}
            onRemoveFile={() => setImportEncounters(null)}
            removeButtonColor="#659cef"
          >
            <span>Drop CSV file here or click to upload.</span>
          </CSVReader>
        </div>
        <div className={styles.download} data-testid="csv-downloader">
          <p>Or download a CSV to edit for mass importing:</p>
          <CSVDownloader
            bom
            data={[
              {
                'Nickname': '',
                'Species': '',
                'Nature': '',
                'Gender': '',
                'Ability': '',
                'Move1': '',
                'Move2': '',
                'Move3': '',
                'Move4': '',
                'HeldItem': '',
                'MetLoc': '',
                'Level': '',
                'MetLevel': '',
              },
            ]}
            filename="nuzlocke"
            type="button"
          >
            Download
          </CSVDownloader>
        </div>
        <Button
          className={styles.apply}
          data-testid="apply-import"
          disabled={
            (option === 'all' && !file) ||
            (option === 'game' && !importEncounters) ||
            (option === 'table' && !text)
          }
          onClick={handleApply}
          primary
          type="button"
        >
          Apply
        </Button>
      </div>
    </Page>
  );
};

export default Import;
