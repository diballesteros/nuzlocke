import type { TBadgeImages } from 'constants/types';
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

// The badge images, apart from constants/badges because the store reads that and the images are
// inlined as data URLs (each is under Vite's 4 KB limit): about 100 KB gzip that only the badge
// strip, its editor and PokéStats' team image draw
const BADGE_IMAGES: TBadgeImages = {
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

export default BADGE_IMAGES;
