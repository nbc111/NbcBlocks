import Head from 'next/head';
import { Fragment, ReactElement, ReactNode, useEffect, useState } from 'react';
import Layout from '@/components/Layouts';
import useTranslation from 'next-translate/useTranslation';
//import FormContact from '@/components/Layouts/FormContact';
import { appUrl } from '@/utils/config';
import { env } from 'next-runtime-env';
import {
  //Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from '@reach/accordion';
import ArrowDown from '@/components/Icons/ArrowDown';
import { GetServerSideProps } from 'next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchData } from '@/utils/fetchData';

const ogUrl = env('NEXT_PUBLIC_OG_URL');

export const getServerSideProps: GetServerSideProps<{
  statsDetails: any;
  latestBlocks: any;
  searchResultDetails: any;
  searchRedirectDetails: any;
}> = async (context) => {
  const {
    query: { keyword = '', query = '', filter = 'all' },
  }: any = context;

  const key = keyword?.replace(/[\s,]/g, '');
  const q = query?.replace(/[\s,]/g, '');

  try {
    const {
      statsDetails,
      latestBlocks,
      searchResultDetails,
      searchRedirectDetails,
    } = await fetchData(q, key, filter);

    return {
      props: {
        statsDetails,
        latestBlocks,
        searchResultDetails,
        searchRedirectDetails,
      },
    };
  } catch (error) {
    console.error('Error fetching charts:', error);
    return {
      props: {
        statsDetails: null,
        latestBlocks: null,
        searchResultDetails: null,
        searchRedirectDetails: null,
      },
    };
  }
};

const Contact = () => {
  const router = useRouter();
  const { subject } = router.query;
  const { t } = useTranslation('contact');
  const thumbnail = `${ogUrl}/thumbnail/basic?title=${encodeURI(
    t('heading'),
  )}&brand=near`;
  const [selectedValue, setSelectedValue] = useState('0');
  const [showFormContact, setShowFormContact] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [indices, setIndices] = useState<number[]>([]);

  useEffect(() => {
    if (subject === 'apis') {
      setSelectedValue('2');
    }
  }, [subject]);

  const toggleItem = (index: number) => {
    setIndices((prevIndices) => {
      const newIndices = prevIndices.includes(index) ? [] : [index];
      return newIndices;
    });
  };
  const handleChange = (event: any) => {
    const value = event.target.value;
    setSelectedValue(value);
    setIndices([]);
    if (value === '4') {
      window.location.href =
        'https://github.com/Nbcblocks/nearblocks/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=';
      return;
    }

    if (value === '5') {
      window.location.href =
        'https://github.com/Nbcblocks/nearblocks/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=';
      return;
    }

    if (value === '6') {
      window.location.href =
        'https://github.com/Nbcblocks/nearblocks/issues/new?assignees=&labels=&projects=&template=token_request.md&title=';
      return;
    }

    if (value !== '1') {
      setShowFormContact(false);
      setIsOpen(true);
    }
  };

  const handleContactClick = () => {
    setShowFormContact(true);
    setIsOpen(false);
  };

  type itemProps = {
    index: number;
    title: string;
    description: ReactNode | string;
    className?: string;
  };
  const Items = ({ index, title, description, className }: itemProps) => {
    return (
      <AccordionItem index={index}>
        <AccordionButton
          onClick={() => toggleItem(index)}
          className={`w-full flex justify-between items-center text-sm text-gray-600 dark:text-neargray-10 focus:outline-none p-3 ${
            indices.includes(index) ? 'bg-gray-50 dark:bg-black-200' : className
          }`}
        >
          <h2 className="text-green-250 text-left">{title}</h2>
          <div className="ml-8">
            <ArrowDown className="contact-icon fill-current" />
          </div>
        </AccordionButton>
        <AccordionPanel
          className={`text-sm text-left  text-neargray-600 dark:text-neargray-10 px-3 slide-down ${className}`}
        >
          <div className="py-3 mr-3">{description}</div>
        </AccordionPanel>
      </AccordionItem>
    );
  };
  const accordionData = {
    Introduction: [
      {
        title: 'What is NbcBlocks?',
        description:
          'NbcBlocks is an easy-to-use blockchain explorer and analytics platform for the Nbc Protocol.',
      },
      {
        title: 'What does NbcBlocks offer?',
        description:
          'NbcBlocks makes it easy to access and understand blockchain data on the Nbc network. With NbcBlocks, you can view transactions, review wallet histories, interact with smart contracts, and more.',
      },
      {
        title: "What NbcBlocks can't do?",
        description:
          "NbcBlocks doesn't process transactions, move assets between wallets, recover lost funds, or access your private keys. We're not a wallet or exchange service, so we can't reverse transactions or retrieve lost assets.",
      },
      {
        title: 'Why am I here?',
        description: (
          <span>
            You were likely sent here by your wallet provider to view the
            details of your transaction. This page, called the
            <Link
              className="text-green-500 dark:text-green-250 cursor-pointer mx-1"
              href={'/txns'}
            >
              Transaction Details
            </Link>
            page, serves as proof of payment or receipt, especially if
            you&apos;re receiving funds.
          </span>
        ),
      },
    ],
    Transactions: [
      {
        title: 'Does NbcBlocks hold my funds?',
        description:
          'No, NbcBlocks does not hold or manage any funds. It is a blockchain explorer that provides detailed information about your transactions and wallet activity.',
      },
      {
        title: 'Why can I see my funds on NbcBlocks?',
        description:
          'NbcBlocks shows publicly available information from the Nbc blockchain, this includes funds in your wallet, transaction history, and contract interactions. This allows you to easily track and verify your blockchain activities.',
      },
      {
        title: 'Can I recover funds sent to the wrong address?',
        description:
          "Once a blockchain transaction is complete, it cannot be undone. If tokens were sent to the wrong address, they cannot be recovered. Only the owner of the receiving address can refund the tokens. If you do not know who owns that address, unfortunately, you won't be able to retrieve the funds.",
      },
      {
        title:
          'Why does my transaction show as successful but my tokens are missing?',
        description:
          "If your transaction is marked as successful but you don't see the tokens in your wallet, it might be because your wallet doesn't support the specific token or network. Reach out to your wallet service provider for help in resolving the issue and confirming the transaction.",
      },
      {
        title: 'Why was I charged gas fee for a failed transaction?',
        description:
          'Even if a transaction fails, gas fees are still charged. This is because validators on the Nbc network have to process and validate the transaction, regardless of its outcome. The fee covers the computational resources used during this process.',
      },
      {
        title: "I've been scammed. Can NbcBlocks help me recover my funds?",
        description:
          "We're sorry to hear you've been scammed. Unfortunately, because blockchain transactions are irreversible, we can't cancel or recover lost funds. Once a transaction is completed, it cannot be undone.",
      },
      {
        title:
          "I sent funds to a network that my wallet doesn't support. Can you help me recover them?",
        description:
          "Unfortunately, we can't help with recovering funds sent to an unsupported network. To avoid losing assets, make sure to check which networks are supported by the recipient's platform before sending. We recommend reaching out to the support team of the recipient's exchange or wallet, as they have the expertise and resources to assist you.",
      },
      {
        title: 'What can I do if I receive spam tokens?',
        description: (
          <span>
            We understand that receiving spam tokens can be frustrating.
            Unfortunately, NbcBlocks cannot remove or block these tokens due to
            the nature of blockchain technology. However, you can report the
            issue to us
            <a
              className="text-green-500 dark:text-green-250 cursor-pointer ml-1"
              href={'https://github.com/Nbcblocks/spam-token-list'}
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            , and we will flag the tokens and addresses involved to help prevent
            further issues.
          </span>
        ),
      },
    ],
    featuresAndServices: [
      {
        title: 'What can I do on NbcBlocks?',
        description: (
          <span>
            NbcBlocks lets you easily look up transactions, check smart
            contracts, explore
            <Link
              className="text-green-500 dark:text-green-250 cursor-pointer ml-1"
              href={'/charts'}
            >
              charts and stats
            </Link>
            , and the latest updates on the Nbc blockchain. Developers can also
            use our
            <Link
              className="text-green-500 dark:text-green-250 cursor-pointer mx-1"
              href={'/apis'}
            >
              API
            </Link>
            services to build apps or gather blockchain data.
          </span>
        ),
      },
      {
        title: 'Do I need an account to use NbcBlocks?',
        description:
          'You can access most features on NbcBlocks without signing in. However, some exclusive features, like commenting, require signing in with your wallet.',
      },
      {
        title: 'How can I report a bug on NbcBlocks?',
        description: (
          <span>
            If you encounter a bug, please report it
            <a
              className="text-green-500 dark:text-green-250 cursor-pointer ml-1"
              href={'https://github.com/Nbcblocks/nearblocks/issues'}
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </span>
        ),
      },
    ],
  };
  
  return (
    <Fragment>
      <Head>
        <title>Contact NbcBlocks | Nbcblocks</title>
        <meta name="title" content={t('heading')} />
        <meta name="description" content={t('metaDescription')} />
        <meta property="og:title" content={t('heading')} />
        <meta property="og:description" content={t('metaDescription')} />
        <meta property="twitter:title" content={t('heading')} />
        <meta property="twitter:description" content={t('metaDescription')} />
        <meta property="og:image" content={thumbnail} />
        <meta property="twitter:image" content={thumbnail} />
        <link rel="canonical" href={`${appUrl}/contact`} />
      </Head>
      <ToastContainer />
      <div className="bg-hero-pattern dark:bg-hero-pattern-dark h-72"></div>
      <div className="container mx-auto px-3 md:px-14 flex flex-col items-start py-16 mt-[-350px]">
        <h1 className="mb-4 pt-8 sm:!text-2xl text-xl text-white">
          {`Contact NbcScan`}
        </h1>
        <div className="text-neargray-600 dark:text-neargray-10 pt-4 pb-8 gap-6 w-full soft-shadow rounded-lg bg-white dark:bg-black-600 lg:mt-8 mt-4">
          <p className="text-lg px-10 text-neargray-600 dark:text-neargray-10 pb-4 font-medium sm:mt-0 mt-8 mb-4 border-b dark:border-slate-800">
            {t(`form.heading`)}
          </p>
          <div className="flex flex-col mx-auto px-10 ">
            <div className="col-span-5 text-green dark:text-neargreen-200 soft-shadow bg-nearblue dark:bg-gray-950 border rounded-lg p-4">
              <p className="text-sm font-bold">{t(`info.heading`)}</p>
              <div className="my-4 flex flex-col gap-4">
                {[
                  {
                    id: Math.random(),
                    title: 'Pending Transaction',
                    description: `We do not process transactions and are therefore unable to expedite, cancel or replace them.`,
                  },
                  {
                    id: Math.random(),
                    title: 'Nbc Protocol Block Explorer',
                    description: `NbcScan is an independent block explorer unrelated to other service providers (unless stated explicitly otherwise) and is therefore unable to provide a precise response for inquiries that are specific to other service providers.`,
                  },
                  {
                    id: Math.random(),
                    title: 'Wallet / Exchange / Project related issues ',
                    description: `Kindly reach out to your wallet service provider, exchanges or project/contract owner for further support as they are in a better position to assist you on the issues related to and from their platforms.`,
                  },
                ].map((item, index) => (
                  <div key={item.id}>
                    <div className="flex ml-5 text-sm ">
                      {index + 1}.
                      <div className="ml-1">
                        <p className="font-bold text-sm">{item.title}</p>
                        <p className="text-sm mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
Contact.getLayout = (page: ReactElement) => (
  <Layout
    statsDetails={page?.props?.statsDetails}
    latestBlocks={page?.props?.latestBlocks}
    searchResultDetails={page?.props?.searchResultDetails}
    searchRedirectDetails={page?.props?.searchRedirectDetails}
  >
    {page}
  </Layout>
);
export default Contact;
