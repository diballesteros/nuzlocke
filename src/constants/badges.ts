import type { TBadgeDictionary, TLevelCapDictionary, TLevelCaps } from 'constants/types';
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
      src: boulder,
    },
    {
      id: 2,
      levelCap: 21,
      name: 'Cascade Badge',
      src: cascade,
    },
    {
      id: 3,
      levelCap: '24',
      name: 'Thunder Badge',
      src: thunder,
    },
    {
      id: 4,
      levelCap: '29',
      name: 'Rainbow Badge',
      src: rainbow,
    },
    {
      id: 5,
      levelCap: '43',
      name: 'Soul Badge',
      src: soul,
    },
    {
      id: 6,
      levelCap: '43',
      name: 'Marsh Badge',
      src: marsh,
    },
    {
      id: 7,
      levelCap: '47',
      name: 'Volcano Badge',
      src: volcano,
    },
    {
      id: 8,
      levelCap: '50',
      name: 'Earth Badge',
      src: earth,
    },
    {
      id: 9,
      levelCap: 65,
      name: 'Elite 4',
      src: champion,
    },
  ],
  '2': [
    {
      id: 1,
      levelCap: 9,
      name: 'Zephyr Badge',
      src: zephyr,
    },
    {
      id: 2,
      levelCap: 16,
      name: 'Hive Badge',
      src: hive,
    },
    {
      id: 3,
      levelCap: 20,
      name: 'Plain Badge',
      src: plain,
    },
    {
      id: 4,
      levelCap: 25,
      name: 'Fog Badge',
      src: fog,
    },
    {
      id: 5,
      levelCap: 30,
      name: 'Storm Badge',
      src: storm,
    },
    {
      id: 6,
      levelCap: 31,
      name: 'Glacier Badge',
      src: glacier,
    },
    {
      id: 7,
      levelCap: 35,
      name: 'Mineral Badge',
      src: mineral,
    },
    {
      id: 8,
      levelCap: 40,
      name: 'Rising Badge',
      src: rising,
    },
    {
      id: 9,
      levelCap: 50,
      name: 'Elite 4',
      src: champion,
    },
    {
      id: 10,
      levelCap: 58,
      name: 'Kanto Badges',
      src: earth,
    },
    {
      id: 11,
      levelCap: 81,
      name: 'Red',
      src: red_gsc,
    },
  ],
  '3': [
    {
      id: 1,
      levelCap: 15,
      name: 'Stone Badge',
      src: stone,
    },
    {
      id: 2,
      levelCap: 18,
      name: 'Knuckle Badge',
      src: knuckle,
    },
    {
      id: 3,
      levelCap: 23,
      name: 'Dynamo Badge',
      src: dynamo,
    },
    {
      id: 4,
      levelCap: 28,
      name: 'Heat Badge',
      src: heat,
    },
    {
      id: 5,
      levelCap: 31,
      name: 'Balance Badge',
      src: balance,
    },
    {
      id: 6,
      levelCap: 33,
      name: 'Feather Badge',
      src: feather,
    },
    {
      id: 7,
      levelCap: 42,
      name: 'Mind Badge',
      src: mind,
    },
    {
      id: 8,
      levelCap: 43,
      name: 'Rain Badge',
      src: rain,
    },
    {
      id: 9,
      levelCap: 58,
      name: 'Elite 4',
      src: champion,
    },
  ],
  '4': [
    {
      id: 1,
      levelCap: 14,
      name: 'Boulder Badge',
      src: boulder,
    },
    {
      id: 2,
      levelCap: 21,
      name: 'Cascade Badge',
      src: cascade,
    },
    {
      id: 3,
      levelCap: 24,
      name: 'Thunder Badge',
      src: thunder,
    },
    {
      id: 4,
      levelCap: 29,
      name: 'Rainbow Badge',
      src: rainbow,
    },
    {
      id: 5,
      levelCap: 43,
      name: 'Soul Badge',
      src: soul,
    },
    {
      id: 6,
      levelCap: 43,
      name: 'Marsh Badge',
      src: marsh,
    },
    {
      id: 7,
      levelCap: 47,
      name: 'Volcano Badge',
      src: volcano,
    },
    {
      id: 8,
      levelCap: 50,
      name: 'Earth Badge',
      src: earth,
    },
    {
      id: 9,
      levelCap: 63,
      name: 'Elite 4',
      src: champion,
    },
  ],
  '5': [
    {
      id: 1,
      levelCap: 14,
      name: 'Coal Badge',
      src: coal,
    },
    {
      id: 2,
      levelCap: 22,
      name: 'Forest Badge',
      src: forest,
    },
    {
      id: 3,
      levelCap: 26,
      name: 'Relic Badge',
      src: relic,
    },
    {
      id: 4,
      levelCap: 32,
      name: 'Cobble Badge',
      src: cobble,
    },
    {
      id: 5,
      levelCap: 37,
      name: 'Fen Badge',
      src: fen,
    },
    {
      id: 6,
      levelCap: 41,
      name: 'Mine Badge',
      src: mine,
    },
    {
      id: 7,
      levelCap: 44,
      name: 'Icicle Badge',
      src: icicle,
    },
    {
      id: 8,
      levelCap: 50,
      name: 'Beacon Badge',
      src: beacon,
    },
    {
      id: 9,
      levelCap: 62,
      name: 'Elite 4',
      src: champion,
    },
  ],
  '6': [
    {
      id: 1,
      levelCap: 13,
      name: 'Zephyr Badge',
      src: zephyr,
    },
    {
      id: 2,
      levelCap: 17,
      name: 'Hive Badge',
      src: hive,
    },
    {
      id: 3,
      levelCap: 19,
      name: 'Plain Badge',
      src: plain,
    },
    {
      id: 4,
      levelCap: 25,
      name: 'Fog Badge',
      src: fog,
    },
    {
      id: 5,
      levelCap: 31,
      name: 'Storm Badge',
      src: storm,
    },
    {
      id: 6,
      levelCap: 34,
      name: 'Glacier Badge',
      src: glacier,
    },
    {
      id: 7,
      levelCap: 35,
      name: 'Mineral Badge',
      src: mineral,
    },
    {
      id: 8,
      levelCap: 41,
      name: 'Rising Badge',
      src: rising,
    },
    {
      id: 9,
      levelCap: 50,
      name: 'Elite 4',
      src: champion,
    },
    {
      id: 10,
      levelCap: 53,
      name: 'Thunder Badge',
      src: thunder,
    },
    {
      id: 11,
      levelCap: 55,
      name: 'Marsh Badge',
      src: marsh,
    },
    {
      id: 12,
      levelCap: 55,
      name: 'Cascade Badge',
      src: cascade,
    },
    {
      id: 13,
      levelCap: 56,
      name: 'Rainbow Badge',
      src: rainbow,
    },
    {
      id: 14,
      levelCap: 56,
      name: 'Soul Badge',
      src: soul,
    },
    {
      id: 15,
      levelCap: 56,
      name: 'Boulder Badge',
      src: boulder,
    },
    {
      id: 16,
      levelCap: 59,
      name: 'Volcano Badge',
      src: volcano,
    },
    {
      id: 17,
      levelCap: 60,
      name: 'Earth Badge',
      src: earth,
    },
    {
      id: 18,
      levelCap: 88,
      name: 'Red',
      src: red_gsc,
    },
  ],
  '7': [
    {
      id: 1,
      levelCap: 14,
      name: 'Trio Badge',
      src: trio,
    },
    {
      id: 2,
      levelCap: 20,
      name: 'Basic Badge',
      src: basic,
    },
    {
      id: 3,
      levelCap: 23,
      name: 'Insect Badge',
      src: insect,
    },
    {
      id: 4,
      levelCap: 27,
      name: 'Bolt Badge',
      src: bolt,
    },
    {
      id: 5,
      levelCap: 31,
      name: 'Quake Badge',
      src: quake,
    },
    {
      id: 6,
      levelCap: 35,
      name: 'Jet Badge',
      src: jet,
    },
    {
      id: 7,
      levelCap: 39,
      name: 'Freeze Badge',
      src: freeze,
    },
    {
      id: 8,
      levelCap: 43,
      name: 'Legend Badge',
      src: legend,
    },
    {
      id: 8,
      levelCap: 54,
      name: 'Elite 4',
      src: champion,
    },
  ],
  '8': [
    {
      id: 1,
      levelCap: '13',
      name: 'Basic Badge',
      src: basic,
    },
    {
      id: 2,
      levelCap: '18',
      name: 'Toxic Badge',
      src: toxic,
    },
    {
      id: 3,
      levelCap: '24',
      name: 'Insect Badge',
      src: insect,
    },
    {
      id: 4,
      levelCap: '30',
      name: 'Bolt Badge',
      src: bolt,
    },
    {
      id: 5,
      levelCap: '33',
      name: 'Quake Badge',
      src: quake,
    },
    {
      id: 6,
      levelCap: '39',
      name: 'Jet Badge',
      src: jet,
    },
    {
      id: 7,
      levelCap: '48',
      name: 'Legend Badge',
      src: legend,
    },
    {
      id: 8,
      levelCap: '51',
      name: 'Wave Badge',
      src: wave,
    },
    {
      id: 9,
      levelCap: '59',
      name: 'Elite 4',
      src: champion,
    },
  ],
  '9': [
    {
      id: 1,
      levelCap: 12,
      name: 'Bug Badge',
      src: bug,
    },
    {
      id: 2,
      levelCap: 25,
      name: 'Cliff Badge',
      src: cliff,
    },
    {
      id: 3,
      levelCap: 32,
      name: 'Rumble Badge',
      src: rumble,
    },
    {
      id: 4,
      levelCap: 34,
      name: 'Plant Badge',
      src: plant,
    },
    {
      id: 5,
      levelCap: 37,
      name: 'Voltage Badge',
      src: voltage,
    },
    {
      id: 6,
      levelCap: 42,
      name: 'Fairy Badge',
      src: fairy,
    },
    {
      id: 7,
      levelCap: 48,
      name: 'Psychic Badge',
      src: psychic,
    },
    {
      id: 8,
      levelCap: 59,
      name: 'Iceberg Badge',
      src: iceberg,
    },
    {
      id: 9,
      levelCap: 68,
      name: 'Elite 4',
      src: champion,
    },
  ],
  '10': [
    {
      id: 1,
      levelCap: 14,
      name: 'Stone Badge',
      src: stone,
    },
    {
      id: 2,
      levelCap: 16,
      name: 'Knuckle Badge',
      src: knuckle,
    },
    {
      id: 3,
      levelCap: 21,
      name: 'Dynamo Badge',
      src: dynamo,
    },
    {
      id: 4,
      levelCap: 28,
      name: 'Heat Badge',
      src: heat,
    },
    {
      id: 5,
      levelCap: 30,
      name: 'Balance Badge',
      src: balance,
    },
    {
      id: 6,
      levelCap: 35,
      name: 'Feather Badge',
      src: feather,
    },
    {
      id: 7,
      levelCap: 45,
      name: 'Mind Badge',
      src: mind,
    },
    {
      id: 8,
      levelCap: 46,
      name: 'Rain Badge',
      src: rain,
    },
    {
      id: 8,
      levelCap: 59,
      name: 'Elite 4',
      src: champion,
    },
  ],
  '11': [
    {
      id: 1,
      levelCap: 12,
      name: 'Totem #1',
      src: totem1,
    },
    {
      id: 2,
      levelCap: 15,
      name: 'Kahuna #1',
      src: melemele,
    },
    {
      id: 3,
      levelCap: 20,
      name: 'Totem #2',
      src: totem2,
    },
    {
      id: 4,
      levelCap: 22,
      name: 'Totem #3',
      src: totem3,
    },
    {
      id: 5,
      levelCap: 24,
      name: 'Totem #4',
      src: totem4,
    },
    {
      id: 6,
      levelCap: 26,
      name: 'Kahuna #2',
      src: akala,
    },
    {
      id: 7,
      levelCap: 29,
      name: 'Totem #5',
      src: totem5,
    },
    {
      id: 8,
      levelCap: 33,
      name: 'Totem #6',
      src: totem6,
    },
    {
      id: 9,
      levelCap: 39,
      name: 'Kahuna #3',
      src: ulaula,
    },
    {
      id: 10,
      levelCap: 48,
      name: 'Kahuna #4',
      src: poni,
    },
    {
      id: 11,
      levelCap: 58,
      name: 'Elite 4',
      src: champion,
    },
  ],
  '12': [
    {
      id: 1,
      levelCap: 12,
      name: 'Totem #1',
      src: totem1,
    },
    {
      id: 2,
      levelCap: 16,
      name: 'Kahuna #1',
      src: melemele,
    },
    {
      id: 3,
      levelCap: 20,
      name: 'Totem #2',
      src: usumtotem2,
    },
    {
      id: 4,
      levelCap: 22,
      name: 'Totem #3',
      src: usumtotem3,
    },
    {
      id: 5,
      levelCap: 24,
      name: 'Totem #4',
      src: totem4,
    },
    {
      id: 6,
      levelCap: 28,
      name: 'Kahuna #2',
      src: akala,
    },
    {
      id: 7,
      levelCap: 33,
      name: 'Totem #5',
      src: usumtotem5,
    },
    {
      id: 8,
      levelCap: 35,
      name: 'Totem #6',
      src: totem6,
    },
    {
      id: 9,
      levelCap: 44,
      name: 'Kahuna #3',
      src: ulaula,
    },
    {
      id: 10,
      levelCap: 49,
      name: 'Totem #7',
      src: totem7,
    },
    {
      id: 10,
      levelCap: 55,
      name: 'Totem #8',
      src: totem8,
    },
    {
      id: 11,
      levelCap: 55,
      name: 'Kahuna #4',
      src: poni,
    },
    {
      id: 12,
      levelCap: 60,
      name: 'Elite 4',
      src: champion,
    },
  ],
  '13': [
    {
      id: 1,
      levelCap: 20,
      name: 'Grass Badge',
      src: grass,
    },
    {
      id: 2,
      levelCap: 24,
      name: 'Water Badge',
      src: water,
    },
    {
      id: 3,
      levelCap: 27,
      name: 'Fire Badge',
      src: fire,
    },
    {
      id: 4,
      levelCap: 36,
      name: 'Fighting/Ghost Badge',
      src: fighting,
    },
    {
      id: 5,
      levelCap: 38,
      name: 'Fairy Badge',
      src: fairy2,
    },
    {
      id: 6,
      levelCap: 42,
      name: 'Rock/Ice Badge',
      src: rock,
    },
    {
      id: 7,
      levelCap: 46,
      name: 'Dark Badge',
      src: dark,
    },
    {
      id: 8,
      levelCap: 48,
      name: 'Dragon Badge',
      src: dragon,
    },
    {
      id: 9,
      levelCap: 65,
      name: 'Champion Cup',
      src: champion,
    },
  ],
  '13.1': [
    {
      id: 1,
      levelCap: 14,
      name: 'Coal Badge',
      src: coal,
    },
    {
      id: 2,
      levelCap: 22,
      name: 'Forest Badge',
      src: forest,
    },
    {
      id: 3,
      levelCap: 30,
      name: 'Cobble Badge',
      src: cobble,
    },
    {
      id: 4,
      levelCap: 30,
      name: 'Fen Badge',
      src: fen,
    },
    {
      id: 5,
      levelCap: 36,
      name: 'Relic Badge',
      src: relic,
    },
    {
      id: 6,
      levelCap: 39,
      name: 'Mine Badge',
      src: mine,
    },
    {
      id: 7,
      levelCap: 42,
      name: 'Icicle Badge',
      src: icicle,
    },
    {
      id: 8,
      levelCap: 49,
      name: 'Beacon Badge',
      src: beacon,
    },
    {
      id: 9,
      levelCap: 66,
      name: 'Elite 4',
      src: champion,
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

export default BADGES;
