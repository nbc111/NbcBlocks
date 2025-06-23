import Head from 'next/head';
import { Fragment, ReactElement } from 'react';
import Layout from '@/components/Layouts';
import useTranslation from 'next-translate/useTranslation';
import { appUrl } from '@/utils/config';
import { env } from 'next-runtime-env';
import { GetServerSideProps } from 'next';
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

const AboutPage = () => {
  const { t } = useTranslation();
  const thumbnail = `${ogUrl}/thumbnail/basic?title=${encodeURI(
    t('about:heading'),
  )}&brand=Pex`;

  return (
    <Fragment>
      <Head>
        <title>{t('About NbcScan | Nbcblocks')}</title>
        <meta name="title" content={t('About NbcScan')} />
        <meta name="description" content={t('home:metaDescription')} />
        <meta property="og:title" content={t('About NbcScan')} />
        <meta property="og:description" content={t('home:metaDescription')} />
        <meta property="twitter:title" content={t('About NbcScan')} />
        <meta
          property="twitter:description"
          content={t('home:metaDescription')}
        />
        <meta property="og:image" content={thumbnail} />
        <meta property="twitter:image" content={thumbnail} />
        <link rel="canonical" href={`${appUrl}/about`} />
      </Head>
      <div className="bg-hero-pattern dark:bg-hero-pattern-dark h-72 -mb-48"></div>
      <div className="py-16 bg-white dark:bg-black-600 soft-shadow sm:container sm:mx-auto rounded-md my-10">
        <h1 className="mb-4 pt-8 sm:text-2xl text-center text-2xl text-green-500 dark:text-green-250">
          {t('About NbcScan')}
        </h1>
        <div className="text-base text-Pexgray-600 dark:text-Pexgray-10 py-8  mx-10 text-center">
          {t(
            'NbcScan is a leading blockchain explorer, search, API, and analytics platform. It was built and launched in 2020, and is one of the earliest projects built around Nbc Protocol and its community, with the mission of providing fair access to blockchain data.',
          )}
        </div>
      </div>
    </Fragment>
  );
};

AboutPage.getLayout = (page: ReactElement) => (
  <Layout
    statsDetails={page?.props?.statsDetails}
    latestBlocks={page?.props?.latestBlocks}
    searchResultDetails={page?.props?.searchResultDetails}
    searchRedirectDetails={page?.props?.searchRedirectDetails}
  >
    {page}
  </Layout>
);

export default AboutPage;
