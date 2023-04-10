import { useSnapshot } from 'valtio';
import { ModalContentProps, setModal, walletState } from '../../store';
import Head from 'next/head';
import { getTitle } from '../../utils';
import InputWithLabel from '../../components/InputWithLabel';
import NumberInput from '../../components/NumberInput';
import { getValveFactoryAdminData, setValveFactoryFee, setFactoryFeeWallet, ValveFactoryAdminData } from '../../services/factory';
import { useEffect, useState } from 'react';
import AddressBox from '../../components/AddressBox';
import { isAddress } from 'ethers/lib/utils';
import { throwSnack } from '../../components/SnackBars';
import BigNumber from 'bignumber.js';
import LoadingIndicator from '../../components/Loading';
import { blockchainData } from '../../constants';
import { Blockchain } from '../../types';
import Switch from '../../components/Switch';

export default function AdminValveFactory() {
    return <AdminFactoryCommonContent factoryType="Valve" />;
}

export function AdminFactoryCommonContent({ factoryType }: { factoryType: 'Valve' | 'Prepayment' | 'Waterfall' }) {
    const state = useSnapshot(walletState);
    const [data, setData] = useState<ValveFactoryAdminData>();

    const [blockchain, setBlockchain] = useState<Blockchain>('POLYGON');

    function update() {
        getValveFactoryAdminData(blockchain, factoryType).then(setData);
    }

    useEffect(() => {
        update();
    }, [blockchain]);

    const isOwner = state.connectedWallet && data?.owner === state.connectedWallet;

    return (
        <div className="factory">
            <Head>
                <title>{getTitle(`Manage ${factoryType} Factory`)}</title>
            </Head>
            <h1 className="h1">{factoryType} Factory</h1>
            <div className="separator" />
            <h1 className="text--big">Contract settings</h1>

            <Switch
                onSwitch={(tab) => setBlockchain(tab === 'Ethereum' ? 'ETH' : 'POLYGON')}
                tabs={['Polygon', 'Ethereum']}
                selectedTab={blockchain === 'ETH' ? 'Ethereum' : 'Polygon'}
            />

            {data ? (
                <>
                    <AddressBox
                        blockchain={blockchain}
                        label="Contract"
                        type="address"
                        hexString={
                            factoryType === 'Valve'
                                ? blockchainData[blockchain].valveFactoryAddress
                                : factoryType === 'Prepayment'
                                ? blockchainData[blockchain].prepaymentFactoryAddress
                                : blockchainData[blockchain].waterfallFactoryAddress
                        }
                    />
                    <AddressBox blockchain={blockchain} label="Owner" type="address" hexString={data.owner} />

                    <InputWithLabel
                        label="Fee percent"
                        input={() => (
                            <NumberInput
                                style={{ color: 'var(--color-pink)' }}
                                preferWithDecimals
                                disabled
                                value={data?.feePercent}
                                onChange={() => {}}
                            />
                        )}
                    />

                    <AddressBox blockchain={blockchain} label="Fee Receiver" type="address" hexString={data.feeWallet} />

                    {isOwner && (
                        <>
                            <button
                                className="btn--outline"
                                onClick={() =>
                                    setModal([
                                        'open',
                                        {
                                            title: 'Set Valve Fee Receiver',
                                            content: ({ onClose }) => (
                                                <SetFeeReceiverModal blockchain={blockchain} onClose={onClose} initVal={data.feeWallet} />
                                            ),
                                        },
                                    ])
                                }
                            >
                                Change Fee receiver wallet
                            </button>
                            <button
                                className="btn--outline"
                                onClick={() =>
                                    setModal([
                                        'open',
                                        {
                                            title: 'Set Valve Fee',
                                            content: ({ onClose }) => (
                                                <SetFeePercentModal blockchain={blockchain} onClose={onClose} initVal={data.feePercent} />
                                            ),
                                        },
                                    ])
                                }
                            >
                                Change Fee
                            </button>
                        </>
                    )}
                </>
            ) : (
                <LoadingIndicator />
            )}
        </div>
    );
}

function SetFeeReceiverModal({ onClose, initVal, blockchain }: ModalContentProps & { initVal: string; blockchain: Blockchain }) {
    const [val, setVal] = useState<string>(initVal);
    return (
        <div className="add-affiliate-modal" style={{ width: '65rem' }}>
            <span className="h1">Set Fee Receiver</span>
            <span>Set the address which will receive the fees from newly created valve contracts</span>

            <InputWithLabel
                label="Fee Receiver"
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
                            await setFactoryFeeWallet('valve', val, blockchain);
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

function SetFeePercentModal({ onClose, initVal, blockchain }: ModalContentProps & { initVal: BigNumber; blockchain: Blockchain }) {
    const [val, setVal] = useState<BigNumber | undefined>(initVal);
    return (
        <div className="add-affiliate-modal" style={{ width: '65rem' }}>
            <span className="h1">Set Fee</span>
            <span>Set the fee percentage for using newly created valve contracts</span>

            <InputWithLabel
                label="Fee Percent"
                input={(props) => (
                    <NumberInput debounced={false} decimals={2} preferWithDecimals {...props} value={val} onChange={setVal} />
                )}
            />

            <div className="box--with-icon" style={{ width: '100%', justifyContent: 'flex-end' }}>
                <button onClick={onClose} className="btn--black btn--wider">
                    Close
                </button>
                <button
                    onClick={async () => {
                        if (!val) {
                            throwSnack('error', 'Fee must be a number');
                            return;
                        }
                        if (val?.lt(0) || val?.gt(100)) {
                            throwSnack('error', 'Fee must be between 0 and 100 %');
                            return;
                        }
                        console.log(val.toString());
                        try {
                            await setValveFactoryFee(val, blockchain);
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
