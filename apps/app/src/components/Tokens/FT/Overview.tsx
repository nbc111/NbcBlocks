import { SpamToken, StatusInfo, Token } from '@/utils/types';
import { useState } from 'react';
import {
  dollarFormat,
  dollarNonCentFormat,
  getTimeAgoString,
  localFormat,
  nanoToMilli,
} from '@/utils/libs';
import Big from 'big.js';
import Link from 'next/link';
import { useFetch } from '@/hooks/useFetch';
import { Tooltip } from '@reach/tooltip';
import Skeleton from '@/components/skeleton/common/Skeleton';
import TokenImage from '@/components/common/TokenImage';
import WarningIcon from '@/components/Icons/WarningIcon';
import Question from '@/components/Icons/Question';
import Links from '@/components/common/Links';
import { useRouter } from 'next/router';

interface Props {
  stats: StatusInfo;
  token: Token;
  status: {
    height: 0;
    sync: true;
    timestamp: '';
  };
  transfers: string;
  holders: string;
}

export default function Overview({
  stats,
  token,
  status,
  transfers,
  holders,
}: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const [showMarketCap, setShowMarketCap] = useState(false);
  const { data: spamList } = useFetch(
    'https://raw.githubusercontent.com/Pexblocks/spam-token-list/main/tokens.json',
  );
  const spamTokens: SpamToken = spamList;

  function isTokenSpam(tokenName: string) {
    if (spamTokens)
      for (const spamToken of spamTokens.blacklist) {
        const cleanedToken = spamToken.replace(/^\*/, '');
        if (tokenName.endsWith(cleanedToken)) {
          return true;
        }
      }
    return false;
  }
  const handleClose = () => {
    setIsVisible(false);
  };

  const onToggle = () => setShowMarketCap((o) => !o);

  return (
    <>
      <div className="flex items-center justify-between flex-wrap pt-4">
        {!token ? (
          <div className="w-80 max-w-xs px-3 py-5">
            <Skeleton className="h-7" />
          </div>
        ) : (
          <h1 className="break-all text-xl text-gray-700 dark:text-neargray-10 leading-8 py-4 px-2">
            <span className="inline-flex align-middle h-7 w-7">
              <TokenImage
                src={token?.icon}
                alt={token?.name}
                className="w-7 h-7"
              />
            </span>
            <span className="inline-flex align-middle mx-2">Token:</span>
            <span className="inline-flex align-middle font-semibold">
              {token?.name}
            </span>
          </h1>
        )}
      </div>
      <div>
        {isTokenSpam((token?.contract || id) as string) && isVisible && (
          <>
            <div className="w-full flex justify-between text-left border dark:bg-nearred-500  dark:border-nearred-400 dark:text-nearred-300 bg-red-50 border-red-100 text-red-500 text-sm rounded-lg p-4">
              <p className="items-center">
                <WarningIcon className="w-5 h-5 fill-current mx-1 inline-flex" />
                This token is reported to have been spammed to many users.
                Please exercise caution when interacting with it. Click
                <a
                  href="https://github.com/Nbcblocks/spam-token-list"
                  className="underline mx-0.5"
                  target="_blank"
                >
                  here
                </a>
                for more info.
              </p>
              <span
                className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-400 cursor-pointer"
                onClick={handleClose}
              >
                X
              </span>
            </div>
            <div className="py-2"></div>
          </>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2 md:mb-2">
          <div className="w-full">
            <div className="h-full bg-white dark:bg-black-600 soft-shadow rounded-xl overflow-hidden">
              <h2 className="border-b dark:border-black-200 p-3 text-nearblue-600 dark:text-neargray-10 text-sm font-semibold">
                Overview
              </h2>

              <div className="px-3 divide-y dark:divide-black-200 text-sm text-nearblue-600 dark:text-neargray-10">
                <div className="flex divide-x dark:divide-black-200  my-2">
                  <div className="flex-col flex-1 flex-wrap py-1">
                    <div className="w-full text-nearblue-700 text-xs uppercase mb-1  text-[80%]">
                      Price
                    </div>
                    {!token ? (
                      <div className="w-20">
                        <Skeleton className="h-4" />
                      </div>
                    ) : token?.price !== null && token?.price !== undefined ? (
                      <div className="w-full break-words flex flex-wrap text-sm">
                        ${localFormat(token?.price)}
                        {stats?.near_price && (
                          <div className="text-nearblue-700 mx-1 text-sm flex flex-row items-center">
                            @{' '}
                            {localFormat(
                              Big(token?.price)
                                .div(Big(stats?.near_price))
                                .toNumber()
                                .toString(),
                            )}{' '}
                            Ⓟ
                          </div>
                        )}
                        {token?.change_24 !== null &&
                        token?.change_24 !== undefined ? (
                          Number(token?.change_24) > 0 ? (
                            <div className="text-neargreen text-sm flex flex-row items-center">
                              {' '}
                              (+{dollarFormat(token?.change_24)}%)
                            </div>
                          ) : (
                            <div className="text-red-500 text-sm flex flex-row items-center">
                              {' '}
                              ({dollarFormat(token?.change_24)}%)
                            </div>
                          )
                        ) : null}
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </div>
                  <div className="flex-col flex-1 flex-wrap py-1 px-3">
                    <div className="w-full text-nearblue-700 text-xs  mb-1 flex  text-[80%]">
                      <span className="uppercase">
                        {showMarketCap
                          ? 'CIRCULATING SUPPLY MARKET CAP'
                          : 'FULLY DILUTED MARKET CAP'}
                      </span>
                      <span>
                        <Tooltip
                          label="Calculated by multiplying the tokens Total Supply on Nbc with the current market price per token."
                          className="absolute h-auto max-w-xs bg-black  bg-opacity-90 z-10 text-xs text-white px-3 py-2 break-words"
                        >
                          <span>
                            <Question className="w-4 h-4 fill-current ml-1" />
                          </span>
                        </Tooltip>
                      </span>
                    </div>
                    {!token ? (
                      <div className="w-20">
                        <Skeleton className="h-4" />
                      </div>
                    ) : Number(token?.fully_diluted_market_cap) > 0 ||
                      Number(token?.market_cap) > 0 ? (
                      <div className="w-full break-words flex flex-wrap text-sm">
                        {Number(token?.fully_diluted_market_cap) > 0 &&
                        Number(token?.market_cap) > 0 ? (
                          <Tooltip
                            label={
                              showMarketCap
                                ? 'Click to switch back'
                                : 'Click to switch'
                            }
                            className="absolute h-auto max-w-xs bg-black bg-opacity-90 z-10 text-xs text-white px-3 py-2 break-words"
                          >
                            <p
                              className="px-1 py-1 text-xs cursor-pointer rounded bg-gray-100 dark:bg-black-200"
                              onClick={onToggle}
                            >
                              {showMarketCap
                                ? '$' + dollarNonCentFormat(token?.market_cap)
                                : '$' +
                                  dollarNonCentFormat(
                                    token?.fully_diluted_market_cap,
                                  )}
                            </p>
                          </Tooltip>
                        ) : (
                          <p className="px-1 py-1 text-xs cursor-pointer rounded bg-gray-100 dark:bg-black-200">
                            {'$' +
                              dollarNonCentFormat(
                                Number(token?.market_cap)
                                  ? token?.market_cap
                                  : token?.fully_diluted_market_cap,
                              )}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="w-full break-words flex flex-wrap text-sm">
                        {token?.onchain_market_cap ? (
                          <p className="px-1 py-1 text-xs cursor-pointer rounded bg-gray-100 dark:bg-black-200">
                            ${dollarNonCentFormat(token?.onchain_market_cap)}
                          </p>
                        ) : (
                          'N/A'
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap py-4">
                  <div className="w-full md:w-1/4 mb-2 md:mb-0 ">
                    Max Total Supply:
                  </div>
                  {!token ? (
                    <div className="w-32">
                      <Skeleton className="h-4" />
                    </div>
                  ) : (
                    <div className="w-full md:w-3/4 break-words">
                      {token?.total_supply
                        ? dollarNonCentFormat(token?.total_supply)
                        : token?.total_supply ?? ''}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap py-4">
                  <div className="w-full md:w-1/4 mb-2 md:mb-0 ">
                    Transfers:
                  </div>
                  {!transfers ? (
                    <div className="w-32">
                      <Skeleton className="h-4" />
                    </div>
                  ) : (
                    <div className="w-full md:w-3/4 break-words">
                      {transfers ? localFormat(transfers) : transfers ?? ''}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap py-4">
                  <div className="w-full md:w-1/4 mb-2 md:mb-0 ">Holders:</div>
                  {!holders ? (
                    <div className="w-32">
                      <Skeleton className="h-4" />
                    </div>
                  ) : (
                    <div className="w-full md:w-3/4 break-words">
                      <div className="flex items-center">
                        {holders ? localFormat(holders) : holders ?? ''}
                        {!status?.sync && (
                          <Tooltip
                            className="absolute h-auto max-w-xs bg-black bg-opacity-90 z-10 text-xs text-white px-3 py-2 break-words"
                            label={
                              <span>
                                Holders count is out of sync. Last synced block
                                is
                                <span className="font-bold mx-0.5">
                                  {status?.height && localFormat(status.height)}
                                </span>
                                {status?.timestamp &&
                                  `(${getTimeAgoString(
                                    nanoToMilli(status?.timestamp),
                                  )}).`}
                                Holders data will be delayed.
                              </span>
                            }
                          >
                            <span>
                              <WarningIcon className="w-4 h-4 fill-current ml-1" />
                            </span>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="h-full bg-white dark:bg-black-600 soft-shadow rounded-xl overflow-hidden">
              <h2 className="border-b dark:border-black-200 p-3 text-nearblue-600 dark:text-neargray-10 text-sm font-semibold">
                Profile Summary
              </h2>
              <div className="px-3 divide-y dark:divide-black-200 text-sm text-nearblue-600 dark:text-neargray-10">
                <div className="flex flex-wrap items-center justify-between py-4">
                  <div className="w-full md:w-1/4 mb-2 md:mb-0 ">Contract:</div>
                  {!token ? (
                    <div className="w-full md:w-3/4 break-words">
                      <div className="w-32">
                        <Skeleton className="h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full text-green-500 dark:text-green-250 md:w-3/4 break-words">
                      <Link
                        href={`/address/${token?.contract}`}
                        className="text-green-500 dark:text-green-250"
                      >
                        {token?.contract}
                      </Link>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between py-4">
                  <div className="w-full md:w-1/4 mb-2 md:mb-0 ">Decimals:</div>
                  <div className="w-full md:w-3/4 break-words">
                    {!token ? (
                      <div className="w-32">
                        <Skeleton className="h-4" />
                      </div>
                    ) : (
                      token?.decimals
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between py-4">
                  <div className="w-full md:w-1/4 mb-2 md:mb-0 ">
                    Official Site:
                  </div>
                  <div className="w-full md:w-3/4 text-green-500 dark:text-green-250 break-words">
                    {!token ? (
                      <div className="w-32">
                        <Skeleton className="h-4" />
                      </div>
                    ) : (
                      <a
                        href={`${token?.website}`}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                      >
                        {token?.website}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between py-4">
                  <div className="w-full md:w-1/4 mb-2 md:mb-0 ">
                    Social Profiles:
                  </div>
                  <div className="w-full md:w-3/4 break-words">
                    {!token ? (
                      <div className="w-32">
                        <Skeleton className="h-4" />
                      </div>
                    ) : (
                      <Links meta={token} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
