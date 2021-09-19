import React from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import useStore from 'store';
import EFFECTIVENESS from 'constants/effectiveness';
import { Type } from 'components';
import styles from './Effectiveness.module.scss';

const Effectiveness: React.FC = React.memo(() => {
  const typeModal = useStore((state) => state.typeModal);
  const closeTypeModal = useStore((state) => state.closeTypeModal);

  const panes = Object.entries(EFFECTIVENESS)?.reduce((newPanes, effectEntry) => {
    if (!!typeModal && !!effectEntry[1][typeModal]) {
      newPanes.push({
        menuItem: effectEntry[0],
        render: () => (
          <Tab.Pane>
            <div className={styles.container}>
              {!!typeModal
                ? Object.entries(effectEntry[1][typeModal])?.reduce((effects, entry) => {
                    if (entry[1]?.length > 0) {
                      effects.push(
                        <div key={`${effectEntry[0]}-${entry[0]}`}>
                          <h4>{entry[0]}:</h4>
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
                  }, [])
                : null}
            </div>
          </Tab.Pane>
        ),
      });
    }
    return newPanes;
  }, []);

  return (
    <Modal open={!!typeModal}>
      <Modal.Content className={styles.content}>
        <h3>
          <Type type={typeModal} />
        </h3>
        <Tab panes={panes} />
      </Modal.Content>
      <Modal.Actions>
        <Button data-testid="effect-close" onClick={closeTypeModal}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
});

export default Effectiveness;
