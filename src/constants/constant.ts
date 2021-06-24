import bulbasaur from 'assets/img/pokemon/bulbasaur.png';
import ivysaur from 'assets/img/pokemon/ivysaur.png';
import venusaur from 'assets/img/pokemon/venusaur.png';
import D_P_PLAT from 'constants/locations/D_P_PLAT';
import FR_LG from 'constants/locations/FR_LG';
import R_B_Y from 'constants/locations/R_B_Y';
import G_S_C from 'constants/locations/G_S_C';
import R_S_E from 'constants/locations/R_S_E';
import OR_AS from 'constants/locations/OR_AS';
import { TGame, TPokemon, TrackerState } from 'constants/types';

export const INITIAL_STATE: TrackerState = {
  selectedGame: null,
  games: {
    '1': { badge: null, encounters: R_B_Y },
    '2': { badge: null, encounters: G_S_C },
    '3': { badge: null, encounters: R_S_E },
    '4': { badge: null, encounters: FR_LG },
    '5': { badge: null, encounters: D_P_PLAT },
    '6': { badge: null, encounters: [...G_S_C] },
    '7': { badge: null, encounters: [] },
    '8': { badge: null, encounters: [] },
    '9': { badge: null, encounters: [] },
    '10': { badge: null, encounters: OR_AS },
    '11': { badge: null, encounters: [] },
    '12': { badge: null, encounters: [] },
    '13': { badge: null, encounters: [] },
    '14': { badge: null, encounters: [] },
  },
  text: null,
};

export const GAMES: TGame[] = [
  {
    id: '1',
    name: 'Red, Blue and Yellow',
  },
  {
    id: '2',
    name: 'Gold, Silver and Crystal',
  },
  {
    id: '3',
    name: 'Ruby, Sapphire and Emerald',
  },
  {
    id: '4',
    name: 'FireRed and LeafGreen',
  },
  {
    id: '5',
    name: 'Diamond, Pearl and Platinum',
  },
  {
    id: '6',
    name: 'HeartGold and SoulSilver',
  },
  {
    id: '7',
    name: 'Black and White',
  },
  {
    id: '8',
    name: 'Black 2 and White 2',
  },
  {
    id: '9',
    name: 'X and Y',
  },
  {
    id: '10',
    name: 'Omega Ruby and Alpha Sapphire',
  },
  {
    id: '11',
    name: 'Sun and Moon',
  },
  {
    id: '12',
    name: 'Ultra Sun and Ultra Moon',
  },
  {
    id: '14',
    name: 'Sword and Shield',
  },
];

export const POKEMON: TPokemon[] = [
  {
    id: 1,
    name: 'Bulbasaur',
    src: bulbasaur,
  },

  {
    id: 2,
    name: 'Ivysaur',
    src: ivysaur,
  },

  {
    id: 3,
    name: 'Venusaur',
    src: venusaur,
  },
];
