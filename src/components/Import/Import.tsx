import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Radio from 'semantic-ui-react/dist/commonjs/addons/Radio';
import { CSVReader } from 'react-papaparse';
import useStore from 'store';
import { AppState } from 'constants/types';
import { Page } from 'common';
import styles from './Import.module.scss';

const Import: React.FC = () => {
  const [option, setOption] = useState<'all' | 'game'>('all');
  const [file, setFile] = useState<File>(undefined);
  const importState = useStore((state) => state.importState);

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
    if (option === 'all') {
      handleImport();
    } else {
      handleCSV();
    }
  };

  return (
    <Page header="Import">
      <article className={styles.container}>
        <div className={styles.subheading}>
          <Radio checked={option === 'all'} onChange={() => setOption('all')} value="all" />
          <h3>Complete Import</h3>
        </div>
        <p>
          This will import and replace the encounters for{' '}
          <u>
            <b>all</b>
          </u>{' '}
          games! This uses the file generated from <b>export</b> in the sidebar
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
        <div className={styles.subheading}>
          <Radio checked={option === 'game'} onChange={() => setOption('game')} value="game" />
          <h3>Game Import</h3>
        </div>
        <p>Use PKHeX&apos;s CSV to import encounters for the selected game</p>
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
      </article>
    </Page>
  );
};

export default Import;
