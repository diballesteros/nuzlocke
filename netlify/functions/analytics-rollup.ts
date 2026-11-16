import { getStore } from '@netlify/blobs';
import type { Config } from '@netlify/functions';
import { runRollup } from '../lib/rollup';

export default async (): Promise<void> => {
  await runRollup(getStore({ name: 'analytics', consistency: 'strong' }), Date.now());
};

export const config: Config = {
  schedule: '@hourly',
};
