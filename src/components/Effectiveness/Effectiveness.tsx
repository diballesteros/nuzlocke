import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Effectiveness = React.memo(function Effectiveness() {
  const { t } = useTranslation('common');
  const typeModal = useStore((state) => state.typeModal);
  const closeTypeModal = useStore((state) => state.closeTypeModal);

  const panes = Object.entries(EFFECTIVENESS)?.reduce((newPanes, effectEntry) => {
    if (!!typeModal && !!effectEntry[1][typeModal]) {
      newPanes.push({
        menuItem: effectEntry[0],
        render: () => (
          <>
            <div className="flex flex-col flex-nowrap gap-(--spacing-3)">
              {!!typeModal &&
                Object.entries(effectEntry[1][typeModal])?.reduce((effects, entry) => {
                  if (entry[1]?.length > 0) {
                    effects.push(
                      <div key={`${effectEntry[0]}-${entry[0]}`}>
                        <h4>{t(entry[0])}:</h4>
                        <div className="flex flex-row flex-wrap gap-(--spacing-2)">
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
          </>
        ),
      });
    }
    return newPanes;
  }, []);

  return (
    <Dialog open={!!typeModal}>
      <DialogContent dismissible={false}>
        <DialogBody className="overflow-auto max-sm:max-h-[76vh] max-sm:min-h-[76vh]">
          <DialogTitle asChild>
            <h3 className="mb-(--spacing-3)! grid! place-items-center">
              <Type type={typeModal} />
            </h3>
          </DialogTitle>
          {/* Uncontrolled inside the dialog's content, so it opens on the first tab each time */}
          <Tabs defaultValue={panes[0]?.menuItem}>
            <TabsList>
              {panes.map((pane) => (
                <TabsTrigger key={pane.menuItem} value={pane.menuItem}>
                  {pane.menuItem}
                </TabsTrigger>
              ))}
            </TabsList>
            {panes.map((pane) => (
              <TabsContent key={pane.menuItem} value={pane.menuItem}>
                {pane.render()}
              </TabsContent>
            ))}
          </Tabs>
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
