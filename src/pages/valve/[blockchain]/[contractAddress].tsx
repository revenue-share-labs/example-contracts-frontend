import { IoChevronDown } from '@react-icons/all-files/io5/IoChevronDown';
import { motion, Variants } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getTokenBalances, TokenBalances, validateBlockchainIDString } from '../../../services/common';
import { useRouter } from 'next/router';
import BtnPrimary from '../../../components/BtnPrimary';
import ContractControlPanel from '../../../components/ContractControlPanel';
import CopyableLinkBox from '../../../components/CopyableLinkBox';
import DistributeModal from '../../../components/DistributeModal';
import { USDTIcon, USDCIcon, BUSDIcon } from '../../../components/Icons';
import LoadingIndicator from '../../../components/Loading';
import ReloadBtn from '../../../components/ReloadBtn';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { ValveDashboardData, getValveDashData, distributeEth, RecipientType } from '../../../services/valveAndPrepayment';
import { setModal } from '../../../store';
import { getTitle, formatBigValue, makeScanUrl, formatAddress } from '../../../utils';
import { Blockchain } from '../../../types';
import { blockchainData } from '../../../constants';
import BalancePanels, { boxesVariants } from '../../../components/BalancePanels';

const pieStyle = (percent: number) => ({
    background:
        percent > 70
            ? `conic-gradient(var(--color-pink), var(--color-blue), var(--color-pink) ${percent}%, var(--color-grey1) ${percent}%)`
            : `conic-gradient(var(--color-pink), var(--color-blue) ${percent}%, var(--color-grey1) ${percent}%)`,
});

export default function ValveContractDash() {
    const router = useRouter();
    const [data, setData] = useState<ValveDashboardData>();
    const [balances, setBalances] = useState<TokenBalances>();

    const contractAddress = router.query.contractAddress as string | undefined;

    const blockchain = router.query.blockchain as string | undefined;
    const blockchainIsValid = validateBlockchainIDString(blockchain);

    function updateData() {
        if (contractAddress && blockchainIsValid) {
            getValveDashData(contractAddress, blockchain).then(setData);
            getTokenBalances(contractAddress, blockchain).then(setBalances);
        }
    }

    useEffect(() => {
        updateData();
        const i = setInterval(() => {
            updateData();
        }, 30_000);
        return () => clearInterval(i);
    }, [contractAddress, contractAddress]);

    const loading = <LoadingIndicator spinnerSize={8} className="loading" />;

    if (!blockchainIsValid) return null;

    const blData = blockchainData[blockchain];

    return (
        <div className="valve-dash">
            <Head>
                <title>{getTitle(`${data?.name || 'Valve'} Dashboard`)}</title>
            </Head>
            {!data ? (
                loading
            ) : (
                <>
                    <div className="valve-dash__left">
                        <div className="valve-dash__head">
                            <h1 className="valve-dash__title">{data?.name}</h1>
                            <ReloadBtn
                                style={{ marginLeft: 'auto' }}
                                onClick={() => {
                                    if (contractAddress) {
                                        setData(undefined);
                                        setTimeout(updateData);
                                    }
                                }}
                            />
                        </div>

                        <ContractControlPanel blockchain={blockchain} data={data} contractAddress={contractAddress} />
                    </div>
                    <div className="valve-dash__right">
                        <BalancePanels blockchain={blockchain} balances={balances} />
                        <div className="valve-dash__buttons">
                            {!data.autoEthDistribution && balances?.eth.gt(0) ? (
                                <BtnPrimary
                                    className="valve-dash__distribute-btn text--fat"
                                    onClick={async () => {
                                        if (!contractAddress) return;
                                        await distributeEth(contractAddress, blockchain);
                                    }}
                                >
                                    Distribute {blData.currencyName}
                                </BtnPrimary>
                            ) : null}
                            <BtnPrimary
                                className="valve-dash__distribute-btn"
                                onClick={() => {
                                    if (!balances || !contractAddress) return;
                                    setModal([
                                        'open',
                                        {
                                            content: () => (
                                                <DistributeModal
                                                    blockchain={blockchain}
                                                    contractAddress={contractAddress}
                                                    balances={balances}
                                                />
                                            ),
                                            title: 'Distribute',
                                        },
                                    ]);
                                }}
                            >
                                Distribute token
                            </BtnPrimary>

                            <Link href={contractAddress ? `/valve/${blockchain}/${contractAddress}/manage` : '/'}>
                                <motion.button
                                    variants={boxesVariants}
                                    animate="show"
                                    initial="hide"
                                    className="btn--grey btn--padding-small btn--wider"
                                >
                                    <span className="text-primary-gradient">Manage Split</span>
                                </motion.button>
                            </Link>
                        </div>

                        <div className="separator" />

                        <div className="valve-dash__head">
                            <h2 className="valve-dash__title2">Recipients</h2>
                        </div>
                        {data.recipients.length ? (
                            <>
                                <div className="valve-dash__recipients">
                                    {data?.recipients.map((recipient, i) => (
                                        <Recipient blockchain={blockchain} {...recipient} key={i} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <span className="text--grey">No recipients so far</span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

function Recipient({ percentage, address, name, blockchain }: RecipientType & { blockchain: Blockchain }) {
    const [open, setOpen] = useState(false);
    const [balances, setBalances] = useState<TokenBalances>();
    const isMobile = useMediaQuery('(max-width: 425px)');

    useEffect(() => {
        if (!balances && open) {
            getTokenBalances(address, blockchain).then(setBalances);
        }
    });

    return (
        <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.5 }}
            onClick={() => setOpen(!open)}
            className="valve-dash__recipient"
        >
            <div className="valve-dash__recipient__first-part">
                <div style={pieStyle(percentage.toNumber())} className="valve-dash__pie"></div>
                <div>{percentage.toString()}%</div>
            </div>
            <div className="separator-vertical" />
            <div className="valve-dash__recipient__second-part">
                <div className="valve-dash__recipient__second-part__top">
                    <div className="valve-dash__recipient__address-part">
                        <span>{name}</span>
                        <CopyableLinkBox url={makeScanUrl('address', address, blockchain)}>
                            {formatAddress(address, isMobile ? 5 : 7, isMobile ? 3 : 7)}
                        </CopyableLinkBox>
                    </div>
                    <button className="box--transparent box--with-icon" style={{ cursor: 'pointer' }}>
                        <IoChevronDown style={{ transition: 'rotate 0.2s', rotate: open ? '180deg' : '0deg' }} />
                    </button>
                </div>
                {open && (
                    <motion.div
                        layout
                        animate={{ translateY: '0px' }}
                        initial={{ position: 'relative', translateY: '100px' }}
                        className="valve-dash__recipient__details"
                    >
                        {balances ? (
                            <>
                                <div className="valve-dash__recipient__details__item">
                                    {/* <span style={{ color: 'var(--color-grey3)' }}>Wallet</span> */}
                                    <div className="box--with-icon text--white">
                                        {blockchainData[blockchain].icon()}
                                        <span>{formatBigValue(balances.eth)}</span>
                                    </div>
                                </div>
                                <div className="valve-dash__recipient__details__item">
                                    <div className="box--with-icon text--white">
                                        <USDTIcon size={'2rem'} />
                                        <span>{formatBigValue(balances.usdt)}</span>
                                    </div>
                                </div>
                                <div className="valve-dash__recipient__details__item">
                                    <div className="box--with-icon text--white">
                                        <USDCIcon size={'2rem'} />
                                        <span>{formatBigValue(balances.usdc)}</span>
                                    </div>
                                </div>
                                <div className="valve-dash__recipient__details__item">
                                    <div className="box--with-icon text--white">
                                        <BUSDIcon size={'2rem'} />
                                        <span>{formatBigValue(balances.busd)}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div key="loading">
                                <LoadingIndicator className="loading" spinnerSize={4} />
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
