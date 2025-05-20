import knex from '#libs/knex';
import { circulatingSupply } from '#libs/supply';

export const syncCirculatingSupply = async () => {
  const latestBlock = await knex('blocks')
    .orderBy('block_timestamp', 'desc')
    .limit(1)
    .first();

  if (latestBlock) {
    const supply = await circulatingSupply(latestBlock);

    await knex('stats').update({ circulating_supply: supply });
  }
};
