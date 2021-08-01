import { TStatus } from 'constants/types';

const STATUSES: TStatus[] = [
  {
    icon: 'box',
    key: 'captured',
    value: 1,
    text: 'Captured',
  },
  {
    icon: 'ambulance',
    key: 'Fainted',
    value: 2,
    text: 'Fainted',
  },
  {
    icon: 'gift',
    key: 'Gifted',
    value: 3,
    text: 'Gifted',
  },
  {
    icon: 'exchange',
    key: 'Traded',
    value: 4,
    text: 'Traded',
  },
  {
    icon: 'ban',
    key: 'Failed',
    value: 5,
    text: 'Failed',
  },
  {
    icon: 'diamond',
    key: 'Shiny',
    value: 6,
    text: 'Shiny',
  },
  {
    icon: 'chess king',
    key: 'Team',
    value: 7,
    text: 'Team',
  },
];

export default STATUSES;
