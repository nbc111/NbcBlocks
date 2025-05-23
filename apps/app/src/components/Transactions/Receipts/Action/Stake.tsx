import FaCoins from '@/components/Icons/FaCoins';
import { shortenHex, yoctoToPex } from '@/utils/libs';
import { TransactionActionInfo } from '@/utils/types';
import useTranslation from 'next-translate/useTranslation';

const Stake = (props: TransactionActionInfo) => {
  const { t } = useTranslation();

  const { args } = props;

  return (
    <div className="py-1">
      <FaCoins className="inline-flex text-yellow-500 mr-1" />
      {t ? t('txns:txn.actions.stake.0') : 'Staked'}
      <span className="font-bold">
        {args.stake ? yoctoToPex(args.stake, true) : args.stake ?? ''}Ⓟ
      </span>{' '}
      {t ? t('txns:txn.actions.stake.1') : 'with'} {shortenHex(args.public_key)}
    </div>
  );
};

export default Stake;
