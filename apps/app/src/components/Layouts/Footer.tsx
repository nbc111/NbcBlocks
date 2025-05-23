import Link from 'next/link';
import Image from 'next/legacy/image';
import useTranslation from 'next-translate/useTranslation';
//import { useTheme } from 'next-themes';
//import Arrow from '../Icons/Arrow';
const Footer = () => {
  const { t } = useTranslation('common');
  //const { theme } = useTheme();
  //const currentDate = new Date();
  return (
    <footer className="footer dark:bg-black-600  ">
      <div className="bg-bottom-right">
        <div className="bg-bottom-left">
          <div className="container mx-auto px-3 pb-32">
            <div className="grid grid-cols-1 lg:!grid-cols-6 gap-5 py-5">
              <div className="w-64">
                <div className="text-sm text-grey-dark flex flex-col py-3">
                  <Image
                  //{theme === 'dark' ? '/images/b.png' : '/images/b.png'}
                    src="/images/LOGO.jpg"
                    className="block"
                    width="110"
                    height="80"
                    alt="NBCBlocks"
                    layout="fixed"
                  />
                </div>
                <p className="max-w-xs text-black text-xs leading-6 pb-3 dark:text-gray-200">
                  {t('footer.description')}
                </p>
              </div>
              <div className="hidden lg:!block"></div>
              <div className="hidden lg:!block">
                <div className="text-black dark:text-green-250 font-semibold text-xl mb-3">
                  &nbsp;
                </div>
                <ul className="text-black opacity-80 footer-links text-sm leading-6 dark:text-gray-200">
                  <li>
                    <Link href="/">&nbsp;</Link>
                  </li>
                </ul>
              </div>
              <div className="">
                <div className="text-black dark:text-green-250 font-semibold text-xl mb-3">
                  {t('footer.links.explore')}
                </div>
                <ul className="text-black opacity-80 footer-links text-sm leading-6 dark:text-gray-200 ">
                  <li>
                    <Link href="/blocks" legacyBehavior>
                      <a>{t('footer.links.latestBlocks')}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/txns" legacyBehavior>
                      <a>{t('footer.links.latestTxns')}</a>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="">
                <div className="text-black dark:text-green-250 font-semibold text-xl mb-3">
                  {t('footer.links.company')}
                </div>
                <ul className="text-black opacity-80 footer-links text-sm leading-6 dark:text-gray-200">
                  <li>
                    <Link href="/about" legacyBehavior>
                      <a>{t('footer.links.about')}</a>
                    </Link>
                  </li>

                  <li>
                    <Link href="/contact" legacyBehavior>
                      <a>{t('footer.links.contact')}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions" legacyBehavior>
                      <a>{t('footer.links.terms')}</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
