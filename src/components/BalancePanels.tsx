import { Variants, motion } from 'framer-motion';
import { blockchainData } from '../constants';
import { formatUsd, formatBigValue } from '../utils';
import { USDTIcon, USDCIcon, BUSDIcon } from './Icons';
import { Blockchain } from '../types';
import { TokenBalances } from '../services/common';
import { useAtom } from '@dbeining/react-atom';
import LoadingIndicator from './Loading';
import { pricesAtom } from '../store';

export const boxesVariants: Variants = {
    hide: {
        opacity: 0,
        scale: 0.5,
    },
    show: {
        opacity: 1,
        scale: 1,
    },
};

function Box({ children }: { children: React.ReactNode }) {
    return (
        <motion.div variants={boxesVariants} className="valve-dash__box">
            {children}
        </motion.div>
    );
}

export default function BalancePanels({ balances, blockchain }: { balances?: TokenBalances; blockchain: Blockchain }) {
    const prices = useAtom(pricesAtom);

    const loading = <LoadingIndicator spinnerSize={8} className="loading" />;

    return (
        <motion.div animate="show" initial="hide" className="valve-dash__boxes">
            <Box>
                <div>{blockchainData[blockchain].currencyName}</div>
                <div className="valve-dash__box__usd">
                    <span>≈&nbsp;</span>
                    <div>{balances ? formatUsd(balances.eth.div(1e18).times(prices[blockchain])) : loading}</div>
                </div>
                <div className="valve-dash__box__value">
                    {blockchainData[blockchain].icon()}
                    <div>{balances ? `${formatBigValue(balances.eth)}` : loading}</div>
                </div>
            </Box>
            <Box>
                <div>USDT</div>

                <div className="valve-dash__box__value">
                    <div style={{ width: '2.5rem', display: 'flex' }}>
                        <USDTIcon />
                    </div>
                    <div>{balances ? `${formatBigValue(balances.usdt)}` : loading}</div>
                </div>
            </Box>
            <Box>
                <div>USDC</div>

                <div className="valve-dash__box__value">
                    <div style={{ width: '2.5rem', display: 'flex' }}>
                        <USDCIcon />
                    </div>
                    <div>{balances ? `${formatBigValue(balances.usdc)}` : loading}</div>
                </div>
            </Box>
            <Box>
                <div>BUSD</div>

                <div className="valve-dash__box__value">
                    <div style={{ width: '2.5rem', display: 'flex' }}>
                        <BUSDIcon />
                    </div>
                    <div>{balances ? `${formatBigValue(balances.busd)}` : loading}</div>
                </div>
            </Box>
        </motion.div>
    );
}
