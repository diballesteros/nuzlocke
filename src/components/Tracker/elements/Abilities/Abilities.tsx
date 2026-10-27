import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoButton, NAME_CELL, TABLE, TABLE_BODY } from 'components/Natures/Natures';
import ABILITIES from 'constants/abilities';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface AbilitiesProps {
  text: string;
}

export default function Abilities({ text }: AbilitiesProps) {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState(text);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <InfoButton aria-label="ability table" data-testid="ability-info" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only">{t('ability_list')}</DialogTitle>
        <DialogBody className={TABLE_BODY}>
          <Input
            className="mb-[1rem]"
            data-testid="ability-search"
            fluid
            label={t('search')}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <table className={TABLE}>
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
                      <td className={NAME_CELL}>{ability.name}</td>
                      <td className="text-stat-increased">{ability.description}</td>
                    </tr>
                  );
                }
                return abilityArr;
              }, [])}
            </tbody>
          </table>
        </DialogBody>
        <DialogFooter>
          <Button data-testid="ability-close" onClick={() => setOpen(false)} variant="secondary">
            {t('cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
