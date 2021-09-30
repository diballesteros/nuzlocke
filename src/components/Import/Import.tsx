import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Radio from 'semantic-ui-react/dist/commonjs/addons/Radio';
import { CSVReader } from 'react-papaparse';
import useStore from 'store';
import { AppState } from 'constants/types';
import { Page } from 'common';
import styles from './Import.module.scss';

const Import: React.FC = () => {
  const importState = useStore(useCallback((state) => state.importState, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const [option, setOption] = useState<'all' | 'game'>('all');
  const [file, setFile] = useState<File>(undefined);

  const handleImport = () => {
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

  const handleCSV = () => {
    // TODO: PARSING CSV
  };

  const handleApply = () => {
    if (option === 'all') handleImport();
    if (option === 'game') handleCSV();
  };

  return (
    <Page header="Import">
      <section className={styles.container}>
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
        <input
          accept=".json, text/json"
          aria-labelledby="import"
          data-testid="import"
          id="file-input"
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          value={file?.name || ''}
        />
        <Radio
          checked={option === 'game'}
          disabled={!selectedGame?.value}
          label="Game Import"
          onChange={() => setOption('game')}
          value="game"
        />
        <p>
          Use PKHeX&apos;s CSV to import encounters for the <strong>selected</strong> game.
        </p>
        <div className={styles.csv}>
          <CSVReader
            addRemoveButton
            onDrop={() => handleCSV()}
            onError={() => {}}
            onFileLoad={() => handleCSV()}
            onRemoveFile={() => {}}
            removeButtonColor="#659cef"
          >
            <span>Drop CSV file here or click to upload.</span>
          </CSVReader>
        </div>
        <div className={styles.download}>
          <p>Or download a CSV to edit for mass importing:</p>
          <Button secondary type="button">
            Download
          </Button>
        </div>
        <Button onClick={handleApply} primary type="button">
          Apply
        </Button>
      </section>
    </Page>
  );
};

export default Import;
