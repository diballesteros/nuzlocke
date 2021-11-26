import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Radio from 'semantic-ui-react/dist/commonjs/addons/Radio';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import { Page } from 'common';
import MOVES from 'constants/moves';
import POKEMON from 'constants/pokemon';
import { AppState, Gender, TEncounter } from 'constants/types';
import useStore from 'store';
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

function Import(): JSX.Element {
  const { t } = useTranslation('import');
  const importState = useStore(useCallback((state) => state.importState, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const massImport = useStore(useCallback((state) => state.massImport, []));
  const encounterList = useStore(
    useCallback((state) => state.games[state.selectedGame?.value], [])
  );
  const [option, setOption] = useState<'all' | 'table'>('all');
  const [file, setFile] = useState<File>(undefined);
  const [text, setText] = useState('');

  const handleAllImport = () => {
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = (event) => {
      try {
        const partialState: Partial<AppState> = JSON.parse(event.target.result as string);
        if (!!partialState?.games && !!partialState?.selectedGame && !!partialState?.gamesList) {
          importState(partialState);
          toast.success(t('file_success'));
        } else {
          throw Error(t('invalid'));
        }
      } catch (error) {
        toast.error(t('invalid_file'));
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
      toast.success(t('game_success'));
    } catch (e) {
      toast.error(t('invalid_text'));
    }
  };

  const handleApply = () => {
    if (option === 'all') handleAllImport();
    if (option === 'table') handleTable();
  };

  return (
    <Page header={t('import')}>
      <div className={styles.container}>
        <Radio
          checked={option === 'all'}
          data-testid="all-import-option"
          label={t('complete_import')}
          onChange={() => setOption('all')}
          value="all"
        />
        <p>
          {t('import_helper_1')}
          <u>
            <strong>{t('all')}</strong>
          </u>
          {t('import_helper_2')}
          <strong>{t('export')}</strong>
          {t('import_helper_3')}
        </p>
        <div className={styles.customFile}>
          <div className={styles.fileText}>
            <span>{file?.name || `${t('select_file')}...`}</span>
          </div>
          <Button color="grey" data-testid="attach-file" type="button">
            {t('select_file')}
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
        <b style={{ color: 'red' }}>{t('important_helper')}</b>
        <b style={{ color: 'red' }}>{t('status_not')}</b>
        <p>
          {t('pkhex_helper')} <strong>{t('selected')}</strong> {t('game')}:{' '}
          <em>{selectedGame?.text || t('no_game')}</em>
        </p>
        <Radio
          checked={option === 'table'}
          data-testid="table-import-option"
          disabled={!selectedGame?.value}
          label={t('import_game_by')}
          onChange={() => setOption('table')}
          value="table"
        />
        <a
          href="https://github.com/diballesteros/nuzlocke/wiki/How-to-generate-table-with-PkHeX"
          rel="noopener noreferrer"
          target="_blank"
        >
          {t('how_to')} <Icon name="linkify" />
        </a>
        <textarea
          className={styles.textarea}
          data-testid="table-import-textarea"
          onChange={(e) => setText(e.target.value)}
          placeholder={t('copy_table')}
          rows={5}
          value={text}
        />
        <Button
          className={styles.apply}
          data-testid="apply-import"
          disabled={(option === 'all' && !file) || (option === 'table' && !text)}
          onClick={handleApply}
          primary
          type="button"
        >
          {t('apply')}
        </Button>
      </div>
    </Page>
  );
}

export default Import;
