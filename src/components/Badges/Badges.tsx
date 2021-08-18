import React, { ReactText, useCallback, useState } from 'react';
import useStore from 'store';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import DETAILS from 'constants/details';
import POKEMON from 'constants/pokemon';
import MOVES from 'constants/moves';
import { CATEGORY_COLOR, TYPE_COLOR } from 'constants/colors';
import { PHYS_SPEC_SPLIT } from 'constants/constant';
import { Type } from 'components';
import styles from './Badges.module.scss';

const Badges: React.FC = () => {
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const games = useStore(useCallback((state) => state.games, []));
  const badges = useStore(useCallback((state) => state.badges, []));
  const selectBadge = useStore(useCallback((state) => state.selectBadge, []));
  const handleClick = (badgeIndex: number) => {
    selectBadge(badgeIndex);
  };
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(0);
  const [tab, setTab] = useState(0);

  const handleOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
    setDetail(index);
  };
  const selectedDetail =
    !!selectedGame && typeof detail === 'number' && DETAILS[selectedGame?.value]
      ? DETAILS[selectedGame?.value][detail]
      : null;

  const handleTabChange = (newIndex: ReactText) => {
    setTab(Number(newIndex));
  };

  const handleClose = () => {
    setOpen(false);
    setDetail(0);
    setTab(0);
  };

  const panes = !!selectedDetail
    ? selectedDetail.map((game) => {
        return {
          menuItem: game.game,
          render: () => (
            <Tab.Pane>
              <div className={styles.title}>{selectedDetail[tab]?.name}</div>
              <div className={styles.gymPokemon}>
                {selectedDetail[tab]?.content?.map((pokemon, ind) => {
                  const poke = POKEMON.find((item) => item.value === pokemon.id);
                  return (
                    <div
                      className={styles.pokemon}
                      key={`pokemon-${pokemon.id}-${ind + 1}`}
                      style={{ border: `2px solid ${TYPE_COLOR[poke?.type]}` }}
                    >
                      <div className={styles.pokemonHeader}>
                        <div className={styles.pokemonName}>
                          {selectedDetail[tab]?.type === 'TRIAL' && ind === 0 && (
                            <span className={styles.totem}>TOTEM</span>
                          )}
                          {selectedDetail[tab]?.type === 'DYNAMAX' &&
                            ind === selectedDetail[tab]?.content?.length - 1 && (
                              <span className={styles.totem}>DYNAMAX</span>
                            )}
                          <img src={poke?.image} alt={poke?.text} />
                          <span>
                            {poke?.text} Lv.{pokemon?.level}
                          </span>
                        </div>
                        <div className={styles.pokemonDetails}>
                          <Type pokemon={poke} />
                          {!!pokemon?.ability && (
                            <div className={styles.pokemonLabel}>
                              <span>Ability:</span>
                              <span className={styles.value}>{pokemon?.ability}</span>
                            </div>
                          )}
                          {!!pokemon?.item && (
                            <div className={styles.pokemonLabel}>
                              <span>Item:</span>
                              <span className={styles.value}>{pokemon?.item}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={styles.moves}>
                        {pokemon?.moves?.map((move, i) => {
                          const moveDetail = MOVES.find((item) => item.id === move);
                          return (
                            <div className={styles.move} key={`${pokemon.id}-${move}-${i + 1}`}>
                              <span>{moveDetail.name}</span>
                              <div className={styles.moveCategorization}>
                                <span
                                  className={styles.moveType}
                                  style={{ backgroundColor: TYPE_COLOR[moveDetail.type] }}
                                >
                                  {moveDetail.type}
                                </span>
                                {PHYS_SPEC_SPLIT.includes(selectedGame?.value) && (
                                  <span
                                    className={styles.moveCategory}
                                    style={{ backgroundColor: CATEGORY_COLOR[moveDetail.category] }}
                                  >
                                    {moveDetail.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Tab.Pane>
          ),
        };
      })
    : null;

  return (
    <div className={styles.badges}>
      {!!selectedGame &&
        badges[selectedGame?.value]?.map((badge, index) => {
          return (
            <button
              className={`${styles.badge} ${
                index <= games[selectedGame?.value]?.badge ? styles.active : ''
              }`}
              key={`${badge.name}-${badge.id}`}
              onClick={() => handleClick(index)}
              title={badge.name}
              type="button"
            >
              <img src={badge.src} alt={badge.name} />
              <span className={styles.levelCap}>{badge.levelCap}</span>
              <div
                className={styles.question}
                data-testid={`badge-detail-${index}`}
                onClick={(e) => handleOpen(e, index)}
                role="presentation"
              >
                <Icon name="question" />
              </div>
            </button>
          );
        })}
      <Modal closeOnDimmerClick onClose={handleClose} open={open}>
        <Modal.Header>Details</Modal.Header>
        <Modal.Content
          style={{
            display: 'flex',
            flexFlow: 'column nowrap',
            maxHeight: '70vh',
            gap: '5px',
            overflow: 'auto',
          }}
        >
          <Tab
            activeIndex={tab}
            className={styles.tabs}
            menu={{ attached: false, tabular: false }}
            onTabChange={(e, data) => handleTabChange(data.activeIndex)}
            panes={panes}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Badges;
