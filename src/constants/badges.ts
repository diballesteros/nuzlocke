import type {
  TBadgeDictionary,
  TBadgeImages,
  TLevelCapDictionary,
  TLevelCaps,
} from 'constants/types';
import akala from 'assets/img/badges/akala.png';
import balance from 'assets/img/badges/balance.png';
import basic from 'assets/img/badges/basic.png';
import beacon from 'assets/img/badges/beacon.png';
import bolt from 'assets/img/badges/bolt.png';
import boulder from 'assets/img/badges/boulder.png';
import bug from 'assets/img/badges/bug.png';
import cascade from 'assets/img/badges/cascade.png';
import champion from 'assets/img/badges/champion.png';
import cliff from 'assets/img/badges/cliff.png';
import coal from 'assets/img/badges/coal.png';
import cobble from 'assets/img/badges/cobble.png';
import dark from 'assets/img/badges/dark.png';
import dragon from 'assets/img/badges/dragon.png';
import dynamo from 'assets/img/badges/dynamo.png';
import earth from 'assets/img/badges/earth.png';
import fairy from 'assets/img/badges/fairy.png';
import fairy2 from 'assets/img/badges/fairy2.png';
import feather from 'assets/img/badges/feather.png';
import fen from 'assets/img/badges/fen.png';
import fighting from 'assets/img/badges/fighting.png';
import fire from 'assets/img/badges/fire.png';
import fog from 'assets/img/badges/fog.png';
import forest from 'assets/img/badges/forest.png';
import freeze from 'assets/img/badges/freeze.png';
import glacier from 'assets/img/badges/glacier.png';
import grass from 'assets/img/badges/grass.png';
import heat from 'assets/img/badges/heat.png';
import hive from 'assets/img/badges/hive.png';
import iceberg from 'assets/img/badges/iceberg.png';
import icicle from 'assets/img/badges/icicle.png';
import insect from 'assets/img/badges/insect.png';
import jet from 'assets/img/badges/jet.png';
import knuckle from 'assets/img/badges/knuckle.png';
import legend from 'assets/img/badges/legend.png';
import marsh from 'assets/img/badges/marsh.png';
import melemele from 'assets/img/badges/melemele.png';
import mind from 'assets/img/badges/mind.png';
import mine from 'assets/img/badges/mine.png';
import mineral from 'assets/img/badges/mineral.png';
import plain from 'assets/img/badges/plain.png';
import plant from 'assets/img/badges/plant.png';
import poni from 'assets/img/badges/poni.png';
import psychic from 'assets/img/badges/psychic.png';
import quake from 'assets/img/badges/quake.png';
import rain from 'assets/img/badges/rain.png';
import rainbow from 'assets/img/badges/rainbow.png';
import red_gsc from 'assets/img/badges/red_gsc.png';
import relic from 'assets/img/badges/relic.png';
import rising from 'assets/img/badges/rising.png';
import rock from 'assets/img/badges/rock.png';
import rumble from 'assets/img/badges/rumble.png';
import soul from 'assets/img/badges/soul.png';
import stone from 'assets/img/badges/stone.png';
import storm from 'assets/img/badges/storm.png';
import thunder from 'assets/img/badges/thunder.png';
import totem1 from 'assets/img/badges/totem1.png';
import totem2 from 'assets/img/badges/totem2.png';
import totem3 from 'assets/img/badges/totem3.png';
import totem4 from 'assets/img/badges/totem4.png';
import totem5 from 'assets/img/badges/totem5.png';
import totem6 from 'assets/img/badges/totem6.png';
import totem7 from 'assets/img/badges/totem7.png';
import totem8 from 'assets/img/badges/totem8.png';
import toxic from 'assets/img/badges/toxic.png';
import trio from 'assets/img/badges/trio.png';
import ulaula from 'assets/img/badges/ulaula.png';
import usumtotem2 from 'assets/img/badges/usumtotem2.png';
import usumtotem3 from 'assets/img/badges/usumtotem3.png';
import usumtotem5 from 'assets/img/badges/usumtotem5.png';
import volcano from 'assets/img/badges/volcano.png';
import voltage from 'assets/img/badges/voltage.png';
import water from 'assets/img/badges/water.png';
import wave from 'assets/img/badges/wave.png';
import zephyr from 'assets/img/badges/zephyr.png';

const BADGES: TBadgeDictionary = {
  '1': [
    {
      id: 1,
      levelCap: '14',
      name: 'Boulder Badge',
    },
    {
      id: 2,
      levelCap: 21,
      name: 'Cascade Badge',
    },
    {
      id: 3,
      levelCap: '24',
      name: 'Thunder Badge',
    },
    {
      id: 4,
      levelCap: '29',
      name: 'Rainbow Badge',
    },
    {
      id: 5,
      levelCap: '43',
      name: 'Marsh Badge',
    },
    {
      id: 6,
      levelCap: '43',
      name: 'Soul Badge',
    },
    {
      id: 7,
      levelCap: '47',
      name: 'Volcano Badge',
    },
    {
      id: 8,
      levelCap: '50',
      name: 'Earth Badge',
    },
    {
      id: 9,
      levelCap: 65,
      name: 'Elite 4',
    },
  ],
  '2': [
    {
      id: 1,
      levelCap: 9,
      name: 'Zephyr Badge',
    },
    {
      id: 2,
      levelCap: 16,
      name: 'Hive Badge',
    },
    {
      id: 3,
      levelCap: 20,
      name: 'Plain Badge',
    },
    {
      id: 4,
      levelCap: 25,
      name: 'Fog Badge',
    },
    {
      id: 5,
      levelCap: 30,
      name: 'Storm Badge',
    },
    {
      id: 6,
      levelCap: 31,
      name: 'Glacier Badge',
    },
    {
      id: 7,
      levelCap: 35,
      name: 'Mineral Badge',
    },
    {
      id: 8,
      levelCap: 40,
      name: 'Rising Badge',
    },
    {
      id: 9,
      levelCap: 50,
      name: 'Elite 4',
    },
    {
      id: 10,
      levelCap: 58,
      name: 'Kanto Badges',
    },
    {
      id: 11,
      levelCap: 81,
      name: 'Red',
    },
  ],
  '3': [
    {
      id: 1,
      levelCap: 15,
      name: 'Stone Badge',
    },
    {
      id: 2,
      levelCap: 18,
      name: 'Knuckle Badge',
    },
    {
      id: 3,
      levelCap: 23,
      name: 'Dynamo Badge',
    },
    {
      id: 4,
      levelCap: 28,
      name: 'Heat Badge',
    },
    {
      id: 5,
      levelCap: 31,
      name: 'Balance Badge',
    },
    {
      id: 6,
      levelCap: 33,
      name: 'Feather Badge',
    },
    {
      id: 7,
      levelCap: 42,
      name: 'Mind Badge',
    },
    {
      id: 8,
      levelCap: 43,
      name: 'Rain Badge',
    },
    {
      id: 9,
      levelCap: 58,
      name: 'Elite 4',
    },
  ],
  '4': [
    {
      id: 1,
      levelCap: 14,
      name: 'Boulder Badge',
    },
    {
      id: 2,
      levelCap: 21,
      name: 'Cascade Badge',
    },
    {
      id: 3,
      levelCap: 24,
      name: 'Thunder Badge',
    },
    {
      id: 4,
      levelCap: 29,
      name: 'Rainbow Badge',
    },
    {
      id: 5,
      levelCap: 43,
      name: 'Marsh Badge',
    },
    {
      id: 6,
      levelCap: 43,
      name: 'Soul Badge',
    },
    {
      id: 7,
      levelCap: 47,
      name: 'Volcano Badge',
    },
    {
      id: 8,
      levelCap: 50,
      name: 'Earth Badge',
    },
    {
      id: 9,
      levelCap: 63,
      name: 'Elite 4',
    },
  ],
  '5': [
    {
      id: 1,
      levelCap: 14,
      name: 'Coal Badge',
    },
    {
      id: 2,
      levelCap: 22,
      name: 'Forest Badge',
    },
    {
      id: 3,
      levelCap: 26,
      name: 'Relic Badge',
    },
    {
      id: 4,
      levelCap: 32,
      name: 'Cobble Badge',
    },
    {
      id: 5,
      levelCap: 37,
      name: 'Fen Badge',
    },
    {
      id: 6,
      levelCap: 41,
      name: 'Mine Badge',
    },
    {
      id: 7,
      levelCap: 44,
      name: 'Icicle Badge',
    },
    {
      id: 8,
      levelCap: 50,
      name: 'Beacon Badge',
    },
    {
      id: 9,
      levelCap: 62,
      name: 'Elite 4',
    },
  ],
  '6': [
    {
      id: 1,
      levelCap: 13,
      name: 'Zephyr Badge',
    },
    {
      id: 2,
      levelCap: 17,
      name: 'Hive Badge',
    },
    {
      id: 3,
      levelCap: 19,
      name: 'Plain Badge',
    },
    {
      id: 4,
      levelCap: 25,
      name: 'Fog Badge',
    },
    {
      id: 5,
      levelCap: 31,
      name: 'Storm Badge',
    },
    {
      id: 6,
      levelCap: 34,
      name: 'Glacier Badge',
    },
    {
      id: 7,
      levelCap: 35,
      name: 'Mineral Badge',
    },
    {
      id: 8,
      levelCap: 41,
      name: 'Rising Badge',
    },
    {
      id: 9,
      levelCap: 50,
      name: 'Elite 4',
    },
    {
      id: 10,
      levelCap: 53,
      name: 'Thunder Badge',
    },
    {
      id: 11,
      levelCap: 55,
      name: 'Marsh Badge',
    },
    {
      id: 12,
      levelCap: 55,
      name: 'Cascade Badge',
    },
    {
      id: 13,
      levelCap: 56,
      name: 'Rainbow Badge',
    },
    {
      id: 14,
      levelCap: 56,
      name: 'Soul Badge',
    },
    {
      id: 15,
      levelCap: 56,
      name: 'Boulder Badge',
    },
    {
      id: 16,
      levelCap: 59,
      name: 'Volcano Badge',
    },
    {
      id: 17,
      levelCap: 60,
      name: 'Earth Badge',
    },
    {
      id: 18,
      levelCap: 88,
      name: 'Red',
    },
  ],
  '7': [
    {
      id: 1,
      levelCap: 14,
      name: 'Trio Badge',
    },
    {
      id: 2,
      levelCap: 20,
      name: 'Basic Badge',
    },
    {
      id: 3,
      levelCap: 23,
      name: 'Insect Badge',
    },
    {
      id: 4,
      levelCap: 27,
      name: 'Bolt Badge',
    },
    {
      id: 5,
      levelCap: 31,
      name: 'Quake Badge',
    },
    {
      id: 6,
      levelCap: 35,
      name: 'Jet Badge',
    },
    {
      id: 7,
      levelCap: 39,
      name: 'Freeze Badge',
    },
    {
      id: 8,
      levelCap: 43,
      name: 'Legend Badge',
    },
    {
      id: 8,
      levelCap: 54,
      name: 'Elite 4',
    },
  ],
  '8': [
    {
      id: 1,
      levelCap: '13',
      name: 'Basic Badge',
    },
    {
      id: 2,
      levelCap: '18',
      name: 'Toxic Badge',
    },
    {
      id: 3,
      levelCap: '24',
      name: 'Insect Badge',
    },
    {
      id: 4,
      levelCap: '30',
      name: 'Bolt Badge',
    },
    {
      id: 5,
      levelCap: '33',
      name: 'Quake Badge',
    },
    {
      id: 6,
      levelCap: '39',
      name: 'Jet Badge',
    },
    {
      id: 7,
      levelCap: '48',
      name: 'Legend Badge',
    },
    {
      id: 8,
      levelCap: '51',
      name: 'Wave Badge',
    },
    {
      id: 9,
      levelCap: '59',
      name: 'Elite 4',
    },
  ],
  '9': [
    {
      id: 1,
      levelCap: 12,
      name: 'Bug Badge',
    },
    {
      id: 2,
      levelCap: 25,
      name: 'Cliff Badge',
    },
    {
      id: 3,
      levelCap: 32,
      name: 'Rumble Badge',
    },
    {
      id: 4,
      levelCap: 34,
      name: 'Plant Badge',
    },
    {
      id: 5,
      levelCap: 37,
      name: 'Voltage Badge',
    },
    {
      id: 6,
      levelCap: 42,
      name: 'Fairy Badge',
    },
    {
      id: 7,
      levelCap: 48,
      name: 'Psychic Badge',
    },
    {
      id: 8,
      levelCap: 59,
      name: 'Iceberg Badge',
    },
    {
      id: 9,
      levelCap: 68,
      name: 'Elite 4',
    },
  ],
  '10': [
    {
      id: 1,
      levelCap: 14,
      name: 'Stone Badge',
    },
    {
      id: 2,
      levelCap: 16,
      name: 'Knuckle Badge',
    },
    {
      id: 3,
      levelCap: 21,
      name: 'Dynamo Badge',
    },
    {
      id: 4,
      levelCap: 28,
      name: 'Heat Badge',
    },
    {
      id: 5,
      levelCap: 30,
      name: 'Balance Badge',
    },
    {
      id: 6,
      levelCap: 35,
      name: 'Feather Badge',
    },
    {
      id: 7,
      levelCap: 45,
      name: 'Mind Badge',
    },
    {
      id: 8,
      levelCap: 46,
      name: 'Rain Badge',
    },
    {
      id: 8,
      levelCap: 59,
      name: 'Elite 4',
    },
  ],
  '11': [
    {
      id: 1,
      levelCap: 12,
      name: 'Totem #1',
    },
    {
      id: 2,
      levelCap: 15,
      name: 'Kahuna #1',
    },
    {
      id: 3,
      levelCap: 20,
      name: 'Totem #2',
    },
    {
      id: 4,
      levelCap: 22,
      name: 'Totem #3',
    },
    {
      id: 5,
      levelCap: 24,
      name: 'Totem #4',
    },
    {
      id: 6,
      levelCap: 26,
      name: 'Kahuna #2',
    },
    {
      id: 7,
      levelCap: 29,
      name: 'Totem #5',
    },
    {
      id: 8,
      levelCap: 33,
      name: 'Totem #6',
    },
    {
      id: 9,
      levelCap: 39,
      name: 'Kahuna #3',
    },
    {
      id: 10,
      levelCap: 48,
      name: 'Kahuna #4',
    },
    {
      id: 11,
      levelCap: 58,
      name: 'Elite 4',
    },
  ],
  '12': [
    {
      id: 1,
      levelCap: 12,
      name: 'Totem #1',
    },
    {
      id: 2,
      levelCap: 16,
      name: 'Kahuna #1',
    },
    {
      id: 3,
      levelCap: 20,
      name: 'Totem #2',
    },
    {
      id: 4,
      levelCap: 22,
      name: 'Totem #3',
    },
    {
      id: 5,
      levelCap: 24,
      name: 'Totem #4',
    },
    {
      id: 6,
      levelCap: 28,
      name: 'Kahuna #2',
    },
    {
      id: 7,
      levelCap: 33,
      name: 'Totem #5',
    },
    {
      id: 8,
      levelCap: 35,
      name: 'Totem #6',
    },
    {
      id: 9,
      levelCap: 44,
      name: 'Kahuna #3',
    },
    {
      id: 10,
      levelCap: 49,
      name: 'Totem #7',
    },
    {
      id: 10,
      levelCap: 55,
      name: 'Totem #8',
    },
    {
      id: 11,
      levelCap: 55,
      name: 'Kahuna #4',
    },
    {
      id: 12,
      levelCap: 60,
      name: 'Elite 4',
    },
  ],
  '13': [
    {
      id: 1,
      levelCap: 20,
      name: 'Grass Badge',
    },
    {
      id: 2,
      levelCap: 24,
      name: 'Water Badge',
    },
    {
      id: 3,
      levelCap: 27,
      name: 'Fire Badge',
    },
    {
      id: 4,
      levelCap: 36,
      name: 'Fighting/Ghost Badge',
    },
    {
      id: 5,
      levelCap: 38,
      name: 'Fairy Badge',
    },
    {
      id: 6,
      levelCap: 42,
      name: 'Rock/Ice Badge',
    },
    {
      id: 7,
      levelCap: 46,
      name: 'Dark Badge',
    },
    {
      id: 8,
      levelCap: 48,
      name: 'Dragon Badge',
    },
    {
      id: 9,
      levelCap: 65,
      name: 'Champion Cup',
    },
  ],
  '13.1': [
    {
      id: 1,
      levelCap: 14,
      name: 'Coal Badge',
    },
    {
      id: 2,
      levelCap: 22,
      name: 'Forest Badge',
    },
    {
      id: 3,
      levelCap: 30,
      name: 'Cobble Badge',
    },
    {
      id: 4,
      levelCap: 30,
      name: 'Fen Badge',
    },
    {
      id: 5,
      levelCap: 36,
      name: 'Relic Badge',
    },
    {
      id: 6,
      levelCap: 39,
      name: 'Mine Badge',
    },
    {
      id: 7,
      levelCap: 42,
      name: 'Icicle Badge',
    },
    {
      id: 8,
      levelCap: 49,
      name: 'Beacon Badge',
    },
    {
      id: 9,
      levelCap: 66,
      name: 'Elite 4',
    },
  ],
};

export const GAME_CAP_DICTIONARY: TLevelCapDictionary = {
  'REDANDBLUE': ['14', '21', '24', '29', '43', '43', '47', '50', '65'],
  'GOLDSILVERCRYSTAL': ['9', '16', '20', '30', '31', '35', '40', '50', '58', '81'],
  'YELLOW': ['12', '21', '28', '32', '50', '50', '54', '55', '65'],
  'RUBYANDSAPPHIRE': ['15', '18', '23', '28', '31', '33', '42', '43', '58'],
  'EMERALD': ['15', '19', '24', '29', '31', '33', '42', '46', '58'],
  'FRLG': ['14', '21', '24', '29', '43', '43', '47', '50', '63'],
  'PLATINUM': ['14', '22', '26', '32', '37', '41', '44', '50', '62'],
  'DIAMONDANDPEARL': ['14', '22', '32', '32', '36', '41', '42', '49', '66'],
  'HGSS': [
    '13',
    '17',
    '19',
    '25',
    '31',
    '34',
    '35',
    '41',
    '50',
    '53',
    '55',
    '55',
    '56',
    '56',
    '56',
    '59',
    '60',
    '88',
  ],
  'BW': ['14', '20', '23', '27', '31', '35', '39', '43', '54'],
  'BW2NORMALMODE': ['13', '18', '24', '30', '33', '39', '48', '51', '59'],
  'BW2EASYMODE': ['12', '17', '22', '28', '30', '36', '44', '47', '55'],
  'BW2CHALLENGEMODE': ['14', '19', '26', '32', '36', '42', '52', '55', '63'],
  'XY': ['12', '25', '32', '34', '37', '42', '48', '59', '65'],
  'ORAS': ['14', '16', '21', '28', '30', '35', '45', '46', '59'],
  'SM': ['12', '15', '20', '22', '24', '26', '29', '33', '39', '48', '58'],
  'USUM': ['12', '16', '20', '22', '24', '28', '33', '35', '44', '49', '55', '55', '60'],
  'SWSH': ['20', '24', '27', '36', '38', '42', '46', '48', '65'],
  'BDSP': ['14', '22', '30', '30', '36', '39', '42', '49', '66'],
};

export const LEVEL_CAPS: TLevelCaps = {
  '1': [
    {
      key: 'Red and Blue',
      text: 'Red and Blue',
      value: 'REDANDBLUE',
    },
    {
      key: 'Yellow',
      text: 'Yellow',
      value: 'YELLOW',
    },
  ],
  '2': [
    {
      key: 'Gold, Silver, Crystal',
      text: 'Gold, Silver, Crystal',
      value: 'GOLDSILVERCRYSTAL',
    },
  ],
  '3': [
    {
      key: 'Ruby and Sapphire',
      text: 'Ruby and Sapphire',
      value: 'RUBYANDSAPPHIRE',
    },
    {
      key: 'Emerald',
      text: 'Emerald',
      value: 'EMERALD',
    },
  ],
  '4': [
    {
      key: 'FireRed and LeafGreen',
      text: 'FireRed and LeafGreen',
      value: 'FRLG',
    },
  ],
  '5': [
    {
      key: 'Platinum',
      text: 'Platinum',
      value: 'PLATINUM',
    },
    {
      key: 'Diamond and Pearl',
      text: 'Diamond and Pearl',
      value: 'DIAMONDANDPEARL',
    },
  ],
  '6': [
    {
      key: 'HeartGold and SoulSilver',
      text: 'HeartGold and SoulSilver',
      value: 'HGSS',
    },
  ],
  '7': [
    {
      key: 'Black and White',
      text: 'Black and White',
      value: 'BW',
    },
  ],
  '8': [
    {
      key: 'Normal mode',
      text: 'Normal mode',
      value: 'BW2NORMALMODE',
    },
    {
      key: 'Easy mode',
      text: 'Easy mode',
      value: 'BW2EASYMODE',
    },
    {
      key: 'Challenge mode',
      text: 'Challenge mode',
      value: 'BW2CHALLENGEMODE',
    },
  ],
  '9': [
    {
      key: 'X and Y',
      text: 'X and Y',
      value: 'XY',
    },
  ],
  '10': [
    {
      key: 'Omega Ruby and Alpha Sapphire',
      text: 'Omega Ruby and Alpha Sapphire',
      value: 'ORAS',
    },
  ],
  '11': [
    {
      key: 'Sun and Moon',
      text: 'Sun and Moon',
      value: 'SM',
    },
  ],
  '12': [
    {
      key: 'Ultra Sun and Ultra Moon',
      text: 'Ultra Sun and Ultra Moon',
      value: 'USUM',
    },
  ],
  '13': [
    {
      key: 'Sword and Shield',
      text: 'Sword and Shield',
      value: 'SWSH',
    },
  ],
  '13.1': [
    {
      key: 'Brilliant Diamond and Shining Pearl',
      text: 'Brilliant Diamond and Shining Pearl',
      value: 'BDSP',
    },
  ],
};

export const BADGE_IMAGES: TBadgeImages = {
  '1': [
    {
      src: boulder,
    },
    {
      src: cascade,
    },
    {
      src: thunder,
    },
    {
      src: rainbow,
    },
    {
      src: marsh,
    },
    {
      src: soul,
    },
    {
      src: volcano,
    },
    {
      src: earth,
    },
    {
      src: champion,
    },
  ],
  '2': [
    {
      src: zephyr,
    },
    {
      src: hive,
    },
    {
      src: plain,
    },
    {
      src: fog,
    },
    {
      src: storm,
    },
    {
      src: glacier,
    },
    {
      src: mineral,
    },
    {
      src: rising,
    },
    {
      src: champion,
    },
    {
      src: earth,
    },
    {
      src: red_gsc,
    },
  ],
  '3': [
    {
      src: stone,
    },
    {
      src: knuckle,
    },
    {
      src: dynamo,
    },
    {
      src: heat,
    },
    {
      src: balance,
    },
    {
      src: feather,
    },
    {
      src: mind,
    },
    {
      src: rain,
    },
    {
      src: champion,
    },
  ],
  '4': [
    {
      src: boulder,
    },
    {
      src: cascade,
    },
    {
      src: thunder,
    },
    {
      src: rainbow,
    },
    {
      src: marsh,
    },
    {
      src: soul,
    },
    {
      src: volcano,
    },
    {
      src: earth,
    },
    {
      src: champion,
    },
  ],
  '5': [
    {
      src: coal,
    },
    {
      src: forest,
    },
    {
      src: relic,
    },
    {
      src: cobble,
    },
    {
      src: fen,
    },
    {
      src: mine,
    },
    {
      src: icicle,
    },
    {
      src: beacon,
    },
    {
      src: champion,
    },
  ],
  '6': [
    {
      src: zephyr,
    },
    {
      src: hive,
    },
    {
      src: plain,
    },
    {
      src: fog,
    },
    {
      src: storm,
    },
    {
      src: glacier,
    },
    {
      src: mineral,
    },
    {
      src: rising,
    },
    {
      src: champion,
    },
    {
      src: thunder,
    },
    {
      src: marsh,
    },
    {
      src: cascade,
    },
    {
      src: rainbow,
    },
    {
      src: soul,
    },
    {
      src: boulder,
    },
    {
      src: volcano,
    },
    {
      src: earth,
    },
    {
      src: red_gsc,
    },
  ],
  '7': [
    {
      src: trio,
    },
    {
      src: basic,
    },
    {
      src: insect,
    },
    {
      src: bolt,
    },
    {
      src: quake,
    },
    {
      src: jet,
    },
    {
      src: freeze,
    },
    {
      src: legend,
    },
    {
      src: champion,
    },
  ],
  '8': [
    {
      src: basic,
    },
    {
      src: toxic,
    },
    {
      src: insect,
    },
    {
      src: bolt,
    },
    {
      src: quake,
    },
    {
      src: jet,
    },
    {
      src: legend,
    },
    {
      src: wave,
    },
    {
      src: champion,
    },
  ],
  '9': [
    {
      src: bug,
    },
    {
      src: cliff,
    },
    {
      src: rumble,
    },
    {
      src: plant,
    },
    {
      src: voltage,
    },
    {
      src: fairy,
    },
    {
      src: psychic,
    },
    {
      src: iceberg,
    },
    {
      src: champion,
    },
  ],
  '10': [
    {
      src: stone,
    },
    {
      src: knuckle,
    },
    {
      src: dynamo,
    },
    {
      src: heat,
    },
    {
      src: balance,
    },
    {
      src: feather,
    },
    {
      src: mind,
    },
    {
      src: rain,
    },
    {
      src: champion,
    },
  ],
  '11': [
    {
      src: totem1,
    },
    {
      src: melemele,
    },
    {
      src: totem2,
    },
    {
      src: totem3,
    },
    {
      src: totem4,
    },
    {
      src: akala,
    },
    {
      src: totem5,
    },
    {
      src: totem6,
    },
    {
      src: ulaula,
    },
    {
      src: poni,
    },
    {
      src: champion,
    },
  ],
  '12': [
    {
      src: totem1,
    },
    {
      src: melemele,
    },
    {
      src: usumtotem2,
    },
    {
      src: usumtotem3,
    },
    {
      src: totem4,
    },
    {
      src: akala,
    },
    {
      src: usumtotem5,
    },
    {
      src: totem6,
    },
    {
      src: ulaula,
    },
    {
      src: totem7,
    },
    {
      src: totem8,
    },
    {
      src: poni,
    },
    {
      src: champion,
    },
  ],
  '13': [
    {
      src: grass,
    },
    {
      src: water,
    },
    {
      src: fire,
    },
    {
      src: fighting,
    },
    {
      src: fairy2,
    },
    {
      src: rock,
    },
    {
      src: dark,
    },
    {
      src: dragon,
    },
    {
      src: champion,
    },
  ],
  '13.1': [
    {
      src: coal,
    },
    {
      src: forest,
    },
    {
      src: cobble,
    },
    {
      src: fen,
    },
    {
      src: relic,
    },
    {
      src: mine,
    },
    {
      src: icicle,
    },
    {
      src: beacon,
    },
    {
      src: champion,
    },
  ],
};

export default BADGES;
