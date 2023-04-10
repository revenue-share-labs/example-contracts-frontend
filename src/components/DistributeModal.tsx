import { motion } from 'framer-motion';
import { useState } from 'react';
import { CHAIN_ID, TOKENS_ADDRESSES } from '../constants';
import { commonAppearVariants, erc20tokensNames, TokenBalances, Tokens } from '../services/common';
import { distribute } from '../services/valveAndPrepayment';
import { formatBigValue } from '../utils';
import { BUSDIcon, USDCIcon, USDTIcon } from './Icons';
import { Blockchain } from '../types';

export default function DistributeModal({
    contractAddress,
    balances,
    blockchain,
}: {
    contractAddress: string;
    balances: Omit<TokenBalances, 'eth'>;
    blockchain: Blockchain;
}) {
    const [activeToken, setActiveToken] = useState<Exclude<Tokens, 'eth'>>('usdt');

    return (
        <div className="distribute-modal">
            <div className="distribute-modal__nav">
                {erc20tokensNames.map((name) => (
                    <button
                        key={name}
                        onClick={() => setActiveToken(name)}
                        className={`box--with-icon box--round ${activeToken === name ? 'btn--light' : 'btn--grey'}`}
                    >
                        {name === 'busd' ? <BUSDIcon size="2rem" /> : name === 'usdc' ? <USDCIcon size="2rem" /> : <USDTIcon size="2rem" />}
                        {name.toUpperCase()}
                    </button>
                ))}
            </div>
            <motion.div variants={commonAppearVariants} key={activeToken} className="distribute-modal__top-card">
                <span className="text--fat">Contract balance</span>
                <div className="box--with-icon text--white">
                    {activeToken === 'busd' ? <BUSDIcon /> : activeToken === 'usdc' ? <USDCIcon /> : <USDTIcon />}
                    <span className="text--big">{formatBigValue(balances[activeToken])}</span>
                </div>
            </motion.div>
            <span className="h1">Distribute</span>
            <p className="text--align-center text--grey">All funds will be distributed to the recipients according to their shares.</p>
            <motion.button
                variants={commonAppearVariants}
                initial="closed"
                animate="open"
                onClick={() => distribute(contractAddress, TOKENS_ADDRESSES[CHAIN_ID][activeToken], blockchain)}
                style={{ alignSelf: 'stretch' }}
                className="btn--primary"
            >
                Distribute{' '}
                <motion.span key={activeToken} variants={commonAppearVariants} initial="closed" animate="open">
                    {activeToken.toUpperCase()}
                </motion.span>
            </motion.button>
        </div>
    );
}
