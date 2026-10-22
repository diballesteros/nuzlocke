import React from 'react';
import { useTranslation } from 'react-i18next';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import { Type } from 'components';
import EFFECTIVENESS from 'constants/effectiveness';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import styles from './Effectiveness.module.scss';

const Effectiveness = React.memo(function Effectiveness() {
  const { t } = useTranslation('common');
  const typeModal = useStore((state) => state.typeModal);
  const closeTypeModal = useStore((state) => state.closeTypeModal);

  const panes = Object.entries(EFFECTIVENESS)?.reduce((newPanes, effectEntry) => {
    if (!!typeModal && !!effectEntry[1][typeModal]) {
      newPanes.push({
        menuItem: effectEntry[0],
        render: () => (
          <Tab.Pane>
            <div className={styles.container}>
              {!!typeModal &&
                Object.entries(effectEntry[1][typeModal])?.reduce((effects, entry) => {
                  if (entry[1]?.length > 0) {
                    effects.push(
                      <div key={`${effectEntry[0]}-${entry[0]}`}>
                        <h4>{t(entry[0])}:</h4>
                        <div className={styles.list}>
                          {entry[1]?.map((value) => {
                            return (
                              <Type key={`${effectEntry[0]}-${entry[0]}-${value}`} type={value} />
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  return effects;
                }, [])}
            </div>
          </Tab.Pane>
        ),
      });
    }
    return newPanes;
  }, []);

  return (
    <Dialog open={!!typeModal}>
      <DialogContent dismissible={false}>
        <DialogBody className={styles.content}>
          <DialogTitle asChild>
            <h3>
              <Type type={typeModal} />
            </h3>
          </DialogTitle>
          <Tab panes={panes} />
        </DialogBody>
        <DialogFooter>
          <Button data-testid="effect-close" onClick={closeTypeModal} variant="secondary">
            {t('cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default Effectiveness;
