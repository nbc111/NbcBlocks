import { networkId } from './config';

export const RpcProviders =
  networkId === 'mainnet'
    ? [
        // {
        //   name: 'Nbc (Archival)',
        //   url: 'https://archival-rpc.mainnet.near.org',
        // },
        {
          name: 'Nbc',
          url: 'https://www.pext.cc',
        },
        // {
        //   name: 'Nbc (Beta)',
        //   url: 'https://www.pext.cc',
        // },
        // {
        //   name: 'FASTPEX Free',
        //   url: 'https://www.pext.cc',
        // },
        // {
        //   name: 'Lava Network',
        //   url: 'https://near.lava.build',
        // },
        // {
        //   name: 'dRPC',
        //   url: 'https://near.drpc.org',
        // },
      ]
    : [
        {
          name: 'Nbc (Archival)',
          url: 'https://archival-rpc.testnet.near.org',
        },
        {
          name: 'Nbc',
          url: 'https://rpc.testnet.near.org',
        },
      ];
