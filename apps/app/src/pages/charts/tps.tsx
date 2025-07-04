import Layout from '@/components/Layouts';
import { appUrl } from '@/utils/config';
import { ReactElement } from 'react';
import Notice from '@/components/common/Notice';
import Head from 'next/head';
import { env } from 'next-runtime-env';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import fetcher from '@/utils/fetcher';
import TpsCharts from '@/components/Charts/TpsChart';
import { fetchData } from '@/utils/fetchData';

export const getServerSideProps: GetServerSideProps<{
  data: any;
  error: boolean;
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
    const [dataResult] = await Promise.allSettled([fetcher('charts/tps')]);

    const data = dataResult.status === 'fulfilled' ? dataResult.value : null;
    const error = dataResult.status === 'rejected';
    const {
      statsDetails,
      latestBlocks,
      searchResultDetails,
      searchRedirectDetails,
    } = await fetchData(q, key, filter);

    return {
      props: {
        data,
        error,
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
        data: null,
        error: true,
        statsDetails: null,
        latestBlocks: null,
        searchResultDetails: null,
        searchRedirectDetails: null,
      },
    };
  }
};

const ogUrl = env('NEXT_PUBLIC_OG_URL');

const Tps = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const thumbnail = `${ogUrl}/thumbnail/basic?title=${encodeURI(
    'Nbc Transactions per Second Chart',
  )}&brand=near`;

  return (
    <>
      <Head>
        <title>Nbc Transactions per Second Chart</title>
        <meta name="title" content="Nbc Transactions per Second Chart" />
        <meta
          name="description"
          content="Nbc Transactions per Second Chart shows the transactions occuring per second on Nbc blockchain."
        />
        <meta property="og:title" content="Nbc Transactions per Second Chart" />
        <meta
          property="og:description"
          content="Nbc Transactions per Second Chart shows the transactions occuring per second on Nbc blockchain."
        />
        <meta
          property="twitter:title"
          content="Nbc Transactions per Second Chart"
        />
        <meta
          property="twitter:description"
          content="Nbc Transactions per Second Chart shows the transactions occuring per second on Nbc blockchain."
        />
        <meta
          property="twitter:description"
          content="Nbc Transactions per Second Chart shows the transactions occuring per second on Nbc blockchain."
        />

        <meta property="og:image" content={thumbnail} />
        <meta property="og:image:secure_url" content={thumbnail} />
        <meta name="twitter:image:src" content={thumbnail} />
        <link rel="canonical" href={`${appUrl}/charts/tps`} />
      </Head>
      <section>
        <div className="bg-hero-pattern dark:bg-hero-pattern-dark h-72">
          <div className="container mx-auto px-3">
            <h1 className="mb-4 pt-8 sm:!text-2xl text-xl text-white">
              Nbc Transactions per Second Chart
            </h1>
          </div>
        </div>
        <div className="container mx-auto px-3 -mt-48">
          <div className="container mx-auto px-3 -mt-36">
            <div className="relative">
              <TpsCharts
                poweredBy={false}
                chartTypes={'near-tps'}
                data={data}
              />
            </div>
          </div>
        </div>
        <div className="py-8"></div>
      </section>
    </>
  );
};

Tps.getLayout = (page: ReactElement) => (
  <Layout
    notice={<Notice />}
    statsDetails={page?.props?.statsDetails}
    latestBlocks={page?.props?.latestBlocks}
    searchResultDetails={page?.props?.searchResultDetails}
    searchRedirectDetails={page?.props?.searchRedirectDetails}
  >
    {page}
  </Layout>
);
export default Tps;
