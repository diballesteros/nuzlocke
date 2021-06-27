import { TBadgeDictionary } from 'constants/types';
import boulder from 'assets/img/badges/boulder.png';
import cascade from 'assets/img/badges/cascade.png';
import thunder from 'assets/img/badges/thunder.png';
import rainbow from 'assets/img/badges/rainbow.png';
import soul from 'assets/img/badges/soul.png';
import marsh from 'assets/img/badges/marsh.png';
import volcano from 'assets/img/badges/volcano.png';
import earth from 'assets/img/badges/earth.png';
import champion from 'assets/img/badges/champion.png';

const BADGES: TBadgeDictionary = {
  '1': [
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
      id: 8,
      levelCap: 63,
      name: 'Elite 4',
      src: champion,
    },
  ],
  '2': [
    {
      id: 1,
      levelCap: 14,
      name: 'Zephyr Badge',
      src: boulder,
    },
    {
      id: 2,
      levelCap: 21,
      name: 'Hive Badge',
      src: cascade,
    },
    {
      id: 3,
      levelCap: 24,
      name: 'Plain Badge',
      src: thunder,
    },
    {
      id: 4,
      levelCap: 29,
      name: 'Fog Badge',
      src: rainbow,
    },
    {
      id: 5,
      levelCap: 43,
      name: 'Storm Badge',
      src: soul,
    },
    {
      id: 6,
      levelCap: 43,
      name: 'Mineral Badge',
      src: marsh,
    },
    {
      id: 7,
      levelCap: 47,
      name: 'Glacier Badge',
      src: volcano,
    },
    {
      id: 8,
      levelCap: 50,
      name: 'Rising Badge',
      src: earth,
    },
    {
      id: 8,
      levelCap: 63,
      name: 'Elite 4',
      src: champion,
    },
  ],
};

export default BADGES;
