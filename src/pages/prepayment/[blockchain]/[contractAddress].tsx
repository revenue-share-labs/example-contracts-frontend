import { IoChevronDown } from '@react-icons/all-files/io5/IoChevronDown';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DistributeModal from '../../../components/DistributeModal';
import LoadingIndicator from '../../../components/Loading';
import ReloadBtn from '../../../components/ReloadBtn';
import { getTokenBalances, TokenBalances, validateBlockchainIDString } from '../../../services/common';
import {
    RecipientType,
    distributeEth,
    setController,
    setDistributor,
    transferOwnership,
    getPrepaymentDashData,
    PrepaymentDashboardData,
} from '../../../services/valveAndPrepayment';
import { ModalContentProps, setModal } from '../../../store';
import { formatBigValue, getTitle } from '../../../utils';
import { BUSDIcon, USDCIcon, USDTIcon } from '../../../components/Icons';
import { useRouter } from 'next/router';
import InputWithLabel from '../../../components/InputWithLabel';
import { isAddress } from 'ethers/lib/utils';
import { throwSnack } from '../../../components/SnackBars';
import { ethers } from 'ethers';
import { getMessageFromEthersError } from '../../../services/wallet';
import BtnPrimary from '../../../components/BtnPrimary';
import InvestorDashData from '../../../components/InvestorDashData';
import { BtnBlack } from '../../../components/BtnPrimaryText';
import ContractControlPanel from '../../../components/ContractControlPanel';
import { Blockchain } from '../../../types';
import { blockchainData } from '../../../constants';
import AddressBox from '../../../components/AddressBox';
import BalancePanels from '../../../components/BalancePanels';

const pieStyle = (percent: number) => ({
    background:
        percent > 70
            ? `conic-gradient(var(--color-pink), var(--color-blue), var(--color-pink) ${percent}%, var(--color-grey1) ${percent}%)`
            : `conic-gradient(var(--color-pink), var(--color-blue) ${percent}%, var(--color-grey1) ${percent}%)`,
});
export default function PrepaymentContractDash() {
    const router = useRouter();
    const [contractAddress, setContractAddress] = useState<string>();
    const [data, setData] = useState<PrepaymentDashboardData>();
    const [balances, setBalances] = useState<TokenBalances>();
    const blockchain = router.query.blockchain as string | undefined;
    const blockchainIsValid = validateBlockchainIDString(blockchain);

    function updateData() {
        if (contractAddress && blockchainIsValid) {
            getPrepaymentDashData(contractAddress, blockchain).then(setData);
            getTokenBalances(contractAddress, blockchain).then(setBalances);
        }
    }

    useEffect(() => {
        updateData();
        if (router.query.contractAddress && router.query.contractAddress !== contractAddress) {
            setContractAddress(router.query.contractAddress as string);
        }
        const i = setInterval(() => {
            updateData();
        }, 30_000);
        return () => clearInterval(i);
    }, [contractAddress, router.query.contractAddress]);

    const loading = <LoadingIndicator spinnerSize={8} className="loading" />;

    if (!blockchainIsValid) return null;

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
                                    Distribute ETH
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

                            <Link href={contractAddress ? `/prepayment/${blockchain}/${contractAddress}/manage` : '/'}>
                                <BtnBlack className="btn--padding-small btn--wider">Manage Split</BtnBlack>
                            </Link>
                        </div>

                        <InvestorDashData blockchain={blockchain} data={data} />

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
                <div style={pieStyle(percentage.toNumber())} className="valve-dash__waterfall__recipient__progress"></div>
                <div>{percentage.toString()}%</div>
            </div>
            <div className="separator-vertical" />
            <div className="valve-dash__recipient__second-part">
                <div className="valve-dash__recipient__second-part__top">
                    <div className="valve-dash__recipient__address-part">
                        <span>{name}</span>
                        <AddressBox hexString={address} type="address" blockchain={blockchain} />
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

export function SetControllerModal({
    onClose,
    contractAddress,
    blockchain,
}: ModalContentProps & { contractAddress: string; blockchain: Blockchain }) {
    const [val, setVal] = useState<string>('');
    return (
        <div className="add-affiliate-modal" style={{ width: '65rem' }}>
            <span className="h1">Set Controller</span>
            <span>Set the address which has the permission to change the list of recipients</span>

            <InputWithLabel
                label="Controller"
                input={() => <input className="input" onChange={(e) => setVal(e.target.value)} value={val} />}
            />

            <div className="box--with-icon" style={{ width: '100%', justifyContent: 'flex-end' }}>
                <button onClick={onClose} className="btn--black btn--wider">
                    Close
                </button>
                <button
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => setVal(ethers.constants.AddressZero)}
                    className="btn--black btn--wider"
                >
                    Lock recipients forever
                </button>
                <button
                    onClick={async () => {
                        console.log(val);

                        if (!isAddress(val)) {
                            throwSnack('error', 'Invalid address');
                            return;
                        }
                        try {
                            await setController(contractAddress, blockchain, val);
                        } catch (e) {
                            throwSnack('error', getMessageFromEthersError(e).message);
                            onClose();
                        }
                    }}
                    className="btn--primary btn--widest"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export function SetDistributorModal({
    onClose,
    contractAddress,
    blockchain,
}: ModalContentProps & { contractAddress: string; blockchain: Blockchain }) {
    const [val, setVal] = useState<string>('');
    return (
        <div className="add-affiliate-modal" style={{ width: '65rem' }}>
            <span className="h1">Set Distributor</span>
            <span>Set the address which has the permission to manually distribute the tokens which are on the contract</span>

            <InputWithLabel
                label="Distributor"
                input={() => <input className="input" onChange={(e) => setVal(e.target.value)} value={val} />}
            />

            <div className="box--with-icon" style={{ width: '100%', justifyContent: 'flex-end' }}>
                <button onClick={onClose} className="btn--black btn--wider">
                    Close
                </button>
                <button
                    onClick={async () => {
                        if (!isAddress(val)) {
                            throwSnack('error', 'Invalid address');
                            return;
                        }
                        try {
                            await setDistributor(contractAddress, blockchain, val);
                        } catch {
                            onClose();
                        }
                    }}
                    className="btn--primary btn--widest"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export function TransferOwnershipModal({
    onClose,
    contractAddress,
    blockchain,
}: ModalContentProps & { contractAddress: string; blockchain: Blockchain }) {
    const [val, setVal] = useState<string>('');
    return (
        <div className="add-affiliate-modal" style={{ width: '65rem' }}>
            <span className="h1">Set Owner</span>
            <span>Set the address which has the permission to set the controller and the distributor</span>

            <InputWithLabel
                label="New Owner"
                input={() => <input className="input" onChange={(e) => setVal(e.target.value)} value={val} />}
            />

            <div className="box--with-icon set-owner-modal__buttons" style={{ width: '100%' }}>
                <button onClick={onClose} className="btn--black btn--wider">
                    Close
                </button>
                <button
                    onClick={async () => {
                        if (!isAddress(val)) {
                            throwSnack('error', 'Invalid address');
                            return;
                        }
                        try {
                            await transferOwnership(contractAddress, blockchain, val);
                        } catch (e) {
                            throwSnack('error', getMessageFromEthersError(e).message);
                            onClose();
                        }
                    }}
                    className="btn--primary btn--widest"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
