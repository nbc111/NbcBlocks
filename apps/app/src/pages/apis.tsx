import Link from 'next/link';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingCircular from '@/components/common/LoadingCircular';
import FaRegTimesCircle from '@/components/Icons/FaRegTimesCircle';
import FaCheckCircle from '@/components/Icons/FaCheckCircle';
import Arrow from '@/components/Icons/Arrow';
import SwitchButton from '@/components/SwitchButton';
import { dollarFormat, dollarNonCentFormat, localFormat } from '@/utils/libs';
import { docsUrl } from '@/utils/config';
import Layout from '@/components/Layouts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { env } from 'next-runtime-env';
import Skeleton from '@/components/skeleton/common/Skeleton';
import { useTheme } from 'next-themes';
import { GetServerSideProps } from 'next';
import { fetchData } from '@/utils/fetchData';

const userApiURL = env('NEXT_PUBLIC_USER_API_URL');

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
const ApiPlan = () => {
  const router = useRouter();
  const { status } = router.query;
  const { theme } = useTheme();
  const [interval, setInterval] = useState(true);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, _setSubject] = useState('API');
  const [description, setDescription] = useState('');
  const [data, setData] = useState();

  function get(obj: any, path: any, defaultValue = null) {
    const keys = Array.isArray(path) ? path : path.split('.');
    let value = obj;
    for (let key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    return value;
  }

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch(`${userApiURL}plans`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const planData = await response.json();
        if (response.status === 200) {
          setData(planData);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchPlans();
  }, []);

  const plans = get(data, 'data') || null;
  const scrollToPlans = () => {
    const element = document.getElementById('plans');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const submitForm = async (event: any) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      toast.success('Thank you!');
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const onGetStarted = async (plan: any) => {
    if (plan) {
      router.push({
        pathname: `https://dash.nearblocks.io/login`,
        query: {
          id: plan?.id,
          interval: !interval ? 'month' : 'year',
        },
      });
    }
  };

  return (
    <>
      <Head>
        <title>Nbc Protocol API & Documentation | NbcBlocks </title>
        <meta
          name="title"
          content="Nbc Protocol API & Documentation | NbcBlocks "
        />
        <meta
          name="description"
          content="NbcBlocks APIs derives data from NbcBlock's Nbc Protocol (Nbc) Block Explorer to cater for Nbc Protocol applications through API Endpoints."
        />
        <meta property="og:image" content="/thumbnail/thumbnail_apis.png" />
        <meta
          property="twitter:image"
          content="/thumbnail/thumbnail_apis.png"
        />
      </Head>
      <section>
        <ToastContainer />
        <div className="container mx-auto px-3 pt-14">
          <div className="my-5 sm:!text-left text-center lg:!px-32 px-5">
            {status === 'cancelled' && (
              <div className="py-4 flex my-14 px-3 items-center text-sm text-orange-900/70 bg-orange-300/30 rounded-md">
                <FaRegTimesCircle />{' '}
                <span className="ml-2"> Order has been cancelled!</span>
              </div>
            )}

            {status === 'success' && (
              <div className="py-4 flex my-14 px-3 items-center text-sm text-green-500/70 bg-neargreen/20 rounded-md">
                <FaCheckCircle />{' '}
                <span className="ml-2"> Order has been Placed!</span>
              </div>
            )}

            <p className="text-green-400 text-sm dark:text-green-250 ">
              NEARBLOCKS API
            </p>
            <div className="w-full sm:block flex sm:!justify-start justify-center ">
              <h1 className="mb-4 pt-4 text-3xl text-black dark:text-neargray-10 lg:w-1/2 md:w-3/4 sm:w-1/3 w-3/4">
                Build Precise & Reliable Apps with NbcBlocks APIs
              </h1>
            </div>
            <div className="flex items-center sm:!justify-start justify-center my-5">
              <button
                onClick={scrollToPlans}
                className="text-sm text-white font-thin px-4 py-3 dark:bg-green-250 bg-green-500 rounded w-fit"
              >
                API Pricing Plans
              </button>
              <Link
                href="https://dash.nearblocks.io/login"
                rel="noreferrer nofollow noopener"
                className="mx-4 flex text-sm text-white font-thin px-4 py-3 dark:bg-green-250 bg-green-500 rounded w-fit"
                target="_blank"
              >
                User Dashboard
                <span>
                  <Arrow className="-rotate-45 -mt-0 h-4 w-4 dark:text-neargray-10" />
                </span>
              </Link>
              <Link href={docsUrl} legacyBehavior>
                <a
                  className="flex text-sm text-green-400 dark:text-green-250 cursor-pointer mx-4 font-medium"
                  target="_blank"
                  rel="noreferrer nofollow noopener"
                >
                  API Documentation
                  <span>
                    <Arrow className="-rotate-45 -mt-0 h-4 w-4 dark:text-neargray-10" />
                  </span>
                </a>
              </Link>
            </div>
          </div>
          <div className="text-center justify-center items-center pt-10 pb-4">
            <h2 className="text-2xl my-2 text-center px-14 dark:text-neargray-10">
              Choose a plan that&apos;s right for you.
            </h2>
            <p className="text-gray-500 my-2 text-lg font-thin">
              Data from the leading Nbc Protocol Block Explorer catered to your
              project&apos;s needs.
            </p>
            <div className="my-4 flex justify-center items-center font-thin">
              <p
                className={`${
                  !interval
                    ? 'text-black dark:text-neargray-10'
                    : 'text-gray-500'
                } text-sm mx-2`}
              >
                Monthly{' '}
              </p>
              <span className="mx-2">
                <SwitchButton
                  selected={interval}
                  onChange={() => setInterval(!interval)}
                />
              </span>
              <p
                className={`${
                  interval
                    ? 'text-black dark:text-neargray-10'
                    : 'text-gray-400'
                } text-sm`}
              >
                Annually{' '}
                <span className="text-green-400 dark:text-green-250">
                  (Save 15%)
                </span>
              </p>
            </div>
          </div>
          <div
            id="plans"
            className="flex justify-center sm:px-10 2xl:px-20 flex-wrap md:flex-nowrap lg:flex-wrap xl:flex-nowrap gap-4 py-6"
          >
            {plans?.length > 0
              ? plans.map((item: any, index: any) => (
                  <div
                    key={item.id}
                    className={`bg-white dark:bg-black-200 rounded-md px-4 py-4 text-center sm:w-full w-[264px] shadow-xl hover:shadow-2xl  ${
                      index === 2 && 'border-2 border-neargreen-200'
                    }`}
                  >
                    {index === 2 && (
                      <div className="bg-neargreen-200 text-white px-2 text-[10px] rounded-bl-md rounded-t-r-md py-1 float-right -mr-4 -mt-4">
                        Most used!
                      </div>
                    )}
                    <div className="border-b border-b-gray-200 py-2">
                      <h3 className="uppercase py-2 text-sm dark:text-neargray-10">
                        {item.title}
                      </h3>
                      <h1 className="py-2 text-4xl">
                        {!interval ? (
                          <p className="dark:text-neargray-10">
                            ${localFormat(String(item.price_monthly / 100))}
                            {item?.price_monthly !== 0 &&
                              item.price_annually !== 0 && (
                                <span className="text-lg">/mo</span>
                              )}
                          </p>
                        ) : (
                          <p className="dark:text-neargray-10">
                            {item?.price_monthly === 0 &&
                            item.price_annually === 0 ? (
                              <span>$0</span>
                            ) : (
                              <>
                                $
                                {dollarFormat(
                                  (item.price_annually / 100 / 12).toString(),
                                )}
                                <span className="text-lg">/mo</span>
                              </>
                            )}
                          </p>
                        )}
                      </h1>
                      <p className="py-2 text-gray-500 text-xs">
                        {item?.price_monthly === 0 &&
                        item.price_annually === 0 ? (
                          <span>* Attribution required</span>
                        ) : interval ? (
                          <>
                            <span className="text-red-500 through mr-1">
                              <s>
                                $
                                {dollarNonCentFormat(
                                  String((item.price_monthly / 100) * 12),
                                )}
                              </s>
                            </span>{' '}
                            $
                            {dollarFormat(
                              (item.price_annually / 100).toString(),
                            )}
                            /yr
                          </>
                        ) : (
                          <>
                            Or $
                            {dollarFormat(
                              (item.price_annually / 100 / 12).toString(),
                            )}{' '}
                            (15% off) when billed yearly
                          </>
                        )}

                        {}
                      </p>
                    </div>
                    <div className="py-2 font-thin dark:text-neargray-10">
                      <h3 className="py-2 text-sm">
                        {item?.id === 1
                          ? '6'
                          : localFormat(item?.limit_per_minute)}{' '}
                        calls/minute limit
                      </h3>
                      <h3 className="py-2 text-sm">
                        Up to{' '}
                        {item?.id === 1
                          ? '333'
                          : localFormat(item?.limit_per_day)}{' '}
                        API calls a day
                      </h3>
                      <h3 className="py-2 text-sm">
                        Up to{' '}
                        {item?.id === 1
                          ? '10,000'
                          : localFormat(item?.limit_per_month)}{' '}
                        API calls a month
                      </h3>
                      <h3 className="py-2 text-sm">
                        {item?.id === 1 || item?.id === 2
                          ? 'Personal Use'
                          : 'Commercial Use'}
                      </h3>
                      <button
                        onClick={() => onGetStarted(item)}
                        className="text-sm hover:bg-green-400 text-white font-thin px-7 py-3 mt-4 dark:bg-green-250 bg-green-500 rounded w-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-100 duration-300 hover:shadow-md hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Get started now
                      </button>
                    </div>
                  </div>
                ))
              : Array.from({ length: 5 }).map((_, index: number) => (
                  <div
                    key={index}
                    className={`bg-white dark:bg-black-200 rounded-md px-4 py-4 text-center sm:w-full w-[264px] shadow-xl hover:shadow-2xl  ${
                      index === 2 && 'border-2 border-neargreen-200'
                    }`}
                  >
                    <div className="border-b border-b-gray-200 py-2">
                      <h3 className="uppercase py-2 text-sm dark:text-neargray-10 flex justify-center">
                        <Skeleton className="h-4 w-20 dark:bg-black-600 dark:divide-black-200 divide-y" />
                      </h3>
                      <h1 className="py-2 text-4xl flex justify-center">
                        <Skeleton className="h-8 w-40 dark:bg-black-600 dark:divide-black-200 divide-y" />
                      </h1>
                      <h1 className="py-2 flex justify-center">
                        <Skeleton className="h-4 w-40 dark:bg-black-600 dark:divide-black-200 divide-y" />
                      </h1>
                    </div>
                    <div className="py-2 font-thin dark:text-neargray-10">
                      <h3 className="py-2 text-sm flex justify-center">
                        <Skeleton className="h-4 w-36 dark:bg-black-600 dark:divide-black-200 divide-y" />
                      </h3>
                      <h3 className="py-2 text-sm flex justify-center">
                        <Skeleton className="h-4 w-40 dark:bg-black-600 dark:divide-black-200 divide-y" />
                      </h3>
                      <h3 className="py-2 text-sm flex justify-center">
                        <Skeleton className="h-4 w-44 dark:bg-black-600 dark:divide-black-200 divide-y" />
                      </h3>
                      <h3 className="py-2 text-sm flex justify-center">
                        <Skeleton className="h-4 w-40 dark:bg-black-600 dark:divide-black-200 divide-y" />
                      </h3>
                      <h1 className="py-2 flex justify-center">
                        <Skeleton className="h-8 w-52 py-4 dark:bg-black-600 dark:divide-black-200 divide-y" />
                      </h1>
                    </div>
                  </div>
                ))}
          </div>
          <div
            key={theme}
            className="flex justify-between sm:px-10 2xl:px-20 sm:mx-20 max-sm:mx-4 flex-wrap md:flex-nowrap lg:flex-wrap xl:flex-nowrap gap-4 py-6 rounded-md relative"
            style={{
              background:
                theme === 'dark'
                  ? `url('data:image/svg+xml,<svg width="465" height="531" viewBox="0 0 465 531" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.15" filter="url(%23filter0_f_5812_5853)"><path d="M171.441 464.295L406.334 153.143C419.529 135.664 416.094 110.805 398.655 97.5588L349.496 60.2201C346.597 58.0182 343.493 56.2753 340.272 54.9795C324.033 48.4478 304.805 53.2759 293.748 67.9219L58.8548 379.074C45.6601 396.553 49.0945 421.412 66.5339 434.658L115.693 471.997C133.205 485.298 158.191 481.847 171.441 464.295Z" fill="url(%23paint0_linear_5812_5853)"/></g><defs><filter id="filter0_f_5812_5853" x="0.830566" y="2.125" width="463.528" height="527.967" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="25" result="effect1_foregroundBlur_5812_5853"/></filter><linearGradient id="paint0_linear_5812_5853" x1="-111.575" y1="466.16" x2="125.061" y2="623.426" gradientUnits="userSpaceOnUse"><stop stop-color="%23112D36"/><stop offset="0.526042" stop-color="%237BD6F3"/><stop offset="1" stop-color="%23112B36"/></linearGradient></defs></svg>') no-repeat right center, #1f2228`
                  : `url('data:image/svg+xml,<svg width="465" height="531" viewBox="0 0 465 531" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.15" filter="url(%23filter0_f_5812_5853)"><path d="M171.441 464.295L406.334 153.143C419.529 135.664 416.094 110.805 398.655 97.5588L349.496 60.2201C346.597 58.0182 343.493 56.2753 340.272 54.9795C324.033 48.4478 304.805 53.2759 293.748 67.9219L58.8548 379.074C45.6601 396.553 49.0945 421.412 66.5339 434.658L115.693 471.997C133.205 485.298 158.191 481.847 171.441 464.295Z" fill="url(%23paint0_linear_5812_5853)"/></g><defs><filter id="filter0_f_5812_5853" x="0.830566" y="2.125" width="463.528" height="527.967" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="25" result="effect1_foregroundBlur_5812_5853"/></filter><linearGradient id="paint0_linear_5812_5853" x1="-111.575" y1="466.16" x2="125.061" y2="623.426" gradientUnits="userSpaceOnUse"><stop stop-color="%23112D36"/><stop offset="0.526042" stop-color="%237BD6F3"/><stop offset="1" stop-color="%23112B36"/></linearGradient></defs></svg>') no-repeat right center, #0d494a`,
              backgroundSize: 'auto, cover',
            }}
          >
            <div className="w-full h-full max-sm:px-4">
              <div className="flex-grow-1">
                <div className="mb-1 text-sm text-neargray-10">Enterprise</div>
                <h4 className="text-white font-semibold text-2xl">
                  Dedicated Plan
                </h4>
                <div className="text-opacity-75 text-sm pt-2 text-neargray-10">
                  Greater rate limit with SLA support. Suitable for Enterprise
                  user that uses large scale of Nbcblocks data.
                </div>
              </div>
            </div>
            <div className="flex items-center md:w-1/3 justify-end max-sm:px-4">
              <Link
                href="/contact?subject=apis"
                className="bg-white text-green-500 text-nowrap d-block py-2 px-6 rounded-lg flex items-center dark:bg-green-250 dark:text-neargray-10"
                type="button"
              >
                Contact Us <Arrow className="text-black-600" />
              </Link>
            </div>
          </div>
          <div className="py-10 lg:px-32 px-5 dark:text-neargray-10">
            <div className="flex justify-center">
              <h2 className="text-center px-5 border-t py-10 text-2xl text-black dark:text-neargray-10">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="grid justify-items-start grid-cols-1 sm:grid-cols-2 gap-6 font-thin">
              <div className="w-fit">
                <h3 className="py-1 text-lg">
                  How do I Subscribe to NbcBlocks API services?
                </h3>
                <p className="text-sm text-gray-500 py-1">
                  Kindly visit the API self-checkout section above
                </p>
              </div>
              <div className="w-fit">
                <h3 className="py-1 text-lg">
                  What are the Payment Options available?
                </h3>
                <p className="text-sm text-gray-500 py-1">
                  We accept VISA and Mastercard credit card payments, via
                  Stripe.
                </p>
              </div>
              <div className="w-fit">
                <h3 className="py-1 text-lg">
                  How do I Upgrade or Cancel an account?
                </h3>
                <p className="text-sm text-gray-500 py-1">
                  API Account upgrades and cancellations can be done through
                  your API user dashboard. Head to the &quot;Current plan&quot;
                  section in your dashboard for more details.
                </p>
              </div>
              <div className="w-fit">
                <h3 className="py-1 text-lg">What is your refund policy?</h3>
                <p className="text-sm text-gray-500 py-1">
                  Payments made are non-refundable and we do not provide refunds
                  or credits for any services already paid for.
                </p>
              </div>
              <div className="w-fit">
                <h3 className="py-1 text-lg">How does Renewal work ? </h3>
                <p className="text-sm text-gray-500 py-1">
                  Reneawls are automatic, you will receive an email notification
                  coming up to your renewal date.
                </p>
              </div>
              <div className="w-fit">
                <h3 className="py-1 text-lg">
                  When will Account Activation occur?
                </h3>
                <p className="text-sm text-gray-500 py-1">
                  API Account activations are instant once the plan payment is
                  made. To setup an API key after the subscription payment is
                  made, head to API keys.
                </p>
              </div>
            </div>
          </div>
          <div className="flex sm:!flex-row flex-col items-center  justify-center my-5">
            <p className="text-xl text-black dark:text-neargray-10 text-center mx-4 my-6">
              Detailed documentation to get started.{' '}
            </p>
            <Link href={docsUrl} legacyBehavior>
              <button className="text-sm text-white font-thin px-8 mx-2 py-3 dark:bg-green-250 bg-green-500 rounded w-fit">
                View API Documentation
              </button>
            </Link>
          </div>
        </div>
        <div className="bg-white flex justify-center my-4 dark:bg-black-200 dark:text-neargray-10">
          <form className="my-10 md:w-1/2 w-full mx-4" onSubmit={submitForm}>
            <h2 className="text-2xl text-center py-2">
              Contact us for any inquiries
            </h2>
            <div className="w-full px-20">
              <p className="sm:text-lg text-xs text-gray-500 text-center pt-2  pb-5">
                If you have any questions on the NbcBlocks APIs, ask them here!
              </p>
            </div>

            <div className="flex sm:!flex-row flex-col">
              <div className="w-full sm:mr-2">
                <p className="text-sm my-2">
                  Name <span className="text-red-500">*</span>{' '}
                  <span className="text-gray-400">(required)</span>
                </p>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border px-3 outline-blue w-full rounded-md h-12"
                />
              </div>
              <div className="w-full sm:mr-2 ">
                <p className="text-sm my-2">
                  Email Address <span className="text-red-500">*</span>
                  <span className="text-gray-400">(required)</span>
                </p>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border px-3 w-full outline-blue rounded-md h-12"
                />
              </div>
            </div>
            <div className="w-full my-6">
              <p className="text-sm my-2">
                Message<span className="text-red-500">*</span>{' '}
                <span className="text-gray-400">(required)</span>
              </p>{' '}
              <textarea
                id="message"
                autoComplete="off"
                className="px-3 py-1.5 border w-full border-{#E5E7EB} rounded outline-blue text-base overflow-hidden"
                maxLength={300}
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="w-full text-center my-2">
              <button
                className="text-sm text-white my-2 text-center font-thin px-7 py-3 dark:bg-green-250 bg-green-500 rounded"
                disabled={loading}
              >
                {loading ? <LoadingCircular /> : 'Send message'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

ApiPlan.getLayout = (page: ReactElement) => (
  <Layout
    statsDetails={page?.props?.statsDetails}
    latestBlocks={page?.props?.latestBlocks}
    searchResultDetails={page?.props?.searchResultDetails}
    searchRedirectDetails={page?.props?.searchRedirectDetails}
  >
    {page}
  </Layout>
);

export default ApiPlan;
