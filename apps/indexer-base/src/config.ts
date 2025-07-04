import { cleanEnv, num, str, url } from 'envalid';
import { types } from 'near-lake-framework';

import { Network } from 'nb-types';

import { DataSource } from '#types/enum';
import { Config } from '#types/types';

const env = cleanEnv(process.env, {
  BASE_DATA_SOURCE: str({
    choices: [DataSource.FAST_NEAR, DataSource.NEAR_LAKE],
    default: DataSource.NEAR_LAKE,
  }),
  BASE_START_BLOCK: num({ default: 0 }),
  DATABASE_CA: str({ default: '' }),
  DATABASE_CERT: str({ default: '' }),
  DATABASE_KEY: str({ default: '' }),
  DATABASE_URL: str(),
  NETWORK: str({
    choices: [Network.MAINNET, Network.TESTNET],
  }),
  REDIS_PASSWORD: str({ default: '' }),
  REDIS_SENTINEL_NAME: str({ default: '' }),
  REDIS_SENTINEL_URLS: str({ default: '' }),
  REDIS_URL: url({ default: '' }),
  S3_ENDPOINT: url({ default: '' }),
  S3_BUCKET: str({ default: '' }),
  S3_REGION: str({ default: '' }),
  SENTRY_DSN: str({ default: '' }),
});

const genesisHeight = 0;
const genesisTimestamp =
  env.NETWORK === Network.MAINNET
    ? '1595350551591948000'
    : '1596166782911378000';
const genesisFile = `https://${env.S3_BUCKET}.s3.ap-east-1.amazonaws.com/genesis.json`;
let s3Endpoint: null | types.EndpointConfig = null;
const s3BucketName = env.S3_BUCKET;

if (env.S3_ENDPOINT) {
  const endpoint = new URL(env.S3_ENDPOINT);
  s3Endpoint = {
    hostname: endpoint.hostname,
    path: endpoint.pathname,
    port: +endpoint.port || 80,
    protocol: endpoint.protocol,
  };
  s3Endpoint = null;
}

const config: Config = {
  cacheExpiry: 5 * 60, // cache expiry time in seconds (5 min)
  dataSource: env.BASE_DATA_SOURCE,
  dbCa: env.DATABASE_CA,
  dbCert: env.DATABASE_CERT,
  dbKey: env.DATABASE_KEY,
  dbUrl: env.DATABASE_URL,
  delta: 1_000, // start from blocks earlier on sync interuption
  genesisFile: genesisFile, // url to download genesis data
  genesisHeight,
  genesisTimestamp,
  insertLimit: 1_000, // records to insert into the db at a time
  network: env.NETWORK,
  preloadSize: 100, // blocks to preload in nearlake
  redisPassword: env.REDIS_PASSWORD,
  redisSentinelName: env.REDIS_SENTINEL_NAME,
  redisSentinelUrls: env.REDIS_SENTINEL_URLS,
  redisUrl: env.REDIS_URL,
  s3BucketName,
  s3Endpoint,
  s3RegionName: env.S3_REGION,
  sentryDsn: env.SENTRY_DSN,
  startBlockHeight: env.BASE_START_BLOCK,
};

export default config;
