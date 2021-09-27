import React from 'react';
import { toast } from 'react-toastify';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import useStore from 'store';
import { AppState } from 'constants/types';
import styles from './Import.module.scss';

const Import: React.FC = () => {
  const importState = useStore((state) => state.importState);
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
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

  return (
    <Menu.Item id="import">
      <Icon name="upload" />
      <input
        aria-labelledby="import"
        className={styles.hiddenFileInput}
        data-testid="import"
        id="file-input"
        onChange={handleImport}
        type="file"
      />
      Import
    </Menu.Item>
  );
};

export default Import;
