import bulbasaur from 'assets/img/pokemon/bulbasaur.png';
import ivysaur from 'assets/img/pokemon/ivysaur.png';
import venusaur from 'assets/img/pokemon/venusaur.png';
import SINNOH from 'constants/locations/sinnoh';
import { AppState, TGame, TPokemon } from './types';

export const INITIAL_STATE: AppState = {
  selectedGame: null,
  games: {
    '1': { badge: null, encounters: [] },
    '2': { badge: null, encounters: [] },
    '3': { badge: null, encounters: [] },
    '4': { badge: null, encounters: [] },
    '5': { badge: null, encounters: SINNOH },
    '6': { badge: null, encounters: [] },
    '7': { badge: null, encounters: [] },
    '8': { badge: null, encounters: [] },
    '9': { badge: null, encounters: [] },
    '10': { badge: null, encounters: [] },
    '11': { badge: null, encounters: [] },
    '12': { badge: null, encounters: [] },
    '13': { badge: null, encounters: [] },
    '14': { badge: null, encounters: [] },
  },
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
