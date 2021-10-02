import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
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
  const [option, setOption] = useState<'all' | 'game'>('all');
  const [file, setFile] = useState<File>(undefined);
  const [importEncounters, setImportEncounters] = useState<TEncounter[]>(null);

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

  const handleCSV = (result: unknown) => {
    const parsedResult = result as ParseResult<string>[];
    try {
      const arrPositions = new Map<string, number>();
      parsedResult[0].data.forEach((v, i) => {
        arrPositions.set(v, i);
      });
      parsedResult.shift();
      const newEncounters = parsedResult.reduce((parsedArr: TEncounter[], { data, errors }) => {
        const pokemonName = data[arrPositions.get('Species')];
        if (errors?.length > 0 || data?.length < 5 || !pokemonName) {
          throw Error('Invalid File');
        }

        const foundEnc = encounterList.encounters.find((enc) => {
          return enc.location.includes(data[arrPositions.get('MetLoc')]);
        });

        if (foundEnc) {
          const foundPoke = POKEMON.find((poke) => poke.text === pokemonName);
          parsedArr.push({
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
          });
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
          This will import and replace the encounters for{' '}
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
        <Radio
          checked={option === 'game'}
          data-testid="game-import-option"
          disabled={!selectedGame?.value}
          label="Game Import"
          onChange={() => setOption('game')}
          value="game"
        />
        <p>
          <strong>[BETA]</strong> Use PKHeX&apos;s (version 21.10.1) CSV to import encounters for
          the <strong>selected</strong> game: <em>{selectedGame?.text || 'No game selected'}</em>
        </p>
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
          data-testid="apply-import"
          disabled={(option === 'all' && !file) || (option === 'game' && !importEncounters)}
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
