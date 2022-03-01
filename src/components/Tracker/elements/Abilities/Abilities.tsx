import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import ABILITIES from 'constants/abilities';
import styles from '../../../../components/Natures/Natures.module.scss';

interface AbilitiesProps {
  text: string;
}

export default function Abilities({ text }: AbilitiesProps) {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState(text);
  return (
    <Modal
      closeOnDimmerClick
      onClose={() => setOpen(false)}
      open={open}
      trigger={
        <Button
          aria-label="ability table"
          data-testid="ability-info"
          icon="question"
          onClick={() => setOpen(true)}
        />
      }
    >
      <Modal.Content className={styles.container}>
        <Input
          data-testid="ability-search"
          fluid
          label={t('search')}
          onChange={(e, data) => setSearchText(data.value)}
          style={{ marginBottom: '1rem' }}
          value={searchText}
        />
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>{t('name')}</th>
                <th>{t('description')}</th>
              </tr>
            </thead>
            <tbody>
              {ABILITIES.reduce((abilityArr, ability) => {
                if (ability.description.includes(searchText) || ability.name.includes(searchText)) {
                  abilityArr.push(
                    <tr key={`${ability.id}-${ability}`}>
                      <td className={styles.nature}>{ability.name}</td>
                      <td className={styles.increased}>{ability.description}</td>
                    </tr>
                  );
                }
                return abilityArr;
              }, [])}
            </tbody>
          </table>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button data-testid="ability-close" onClick={() => setOpen(false)}>
          {t('cancel')}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
