import { IoCheckmark } from '@react-icons/all-files/io5/IoCheckmark';
import { SetControllerModal, SetDistributorModal, TransferOwnershipModal } from '../pages/prepayment/[blockchain]/[contractAddress]';
import { setModal, walletState } from '../store';
import AddressBox from './AddressBox';
import { ValveDashboardData } from '../services/valveAndPrepayment';
import { useSnapshot } from 'valtio';
import { Blockchain } from '../types';
import { blockchainData } from '../constants';
import BigNumber from 'bignumber.js';

export default function ContractControlPanel({
    contractAddress,
    data,
    blockchain,
}: {
    contractAddress?: string;
    blockchain: Blockchain;
    data: Omit<ValveDashboardData, 'recipients'>;
}) {
    const state = useSnapshot(walletState);

    return (
        <div className="valve-dash__side-panel">
            {contractAddress && <AddressBox blockchain={blockchain} type="address" hexString={contractAddress} label="Contract" />}
            <AddressBox
                type="address"
                hexString={data.owner}
                label="Owner"
                tooltip="Address which has the permission to set the controller and the distributor"
                blockchain={blockchain}
            />
            {data.controller && (
                <AddressBox
                    type="address"
                    hexString={data.controller}
                    label="Controller"
                    tooltip="Address which has the permission to change the list of recipients"
                    blockchain={blockchain}
                />
            )}
            {data.distributor && (
                <AddressBox
                    type="address"
                    hexString={data.distributor}
                    label="Distributor"
                    tooltip="Address which has the permission to manually distribute the tokens which are on the contract"
                    blockchain={blockchain}
                />
            )}
            {data.autoEthDistribution ? (
                <div className="box--black box--with-icon btn--padding-small" style={{ justifyContent: 'space-between' }}>
                    <span className="text--grey">Auto {blockchainData[blockchain].currencyName} Distribution</span>
                    <IoCheckmark />
                </div>
            ) : null}
            {data.immutable ? (
                <div className="box--black box--with-icon btn--padding-small" style={{ justifyContent: 'space-between' }}>
                    <span className="text--grey">Recipients are locked</span>
                    <IoCheckmark />
                </div>
            ) : data.immutableController ? (
                <div className="box--black box--with-icon btn--padding-small" style={{ justifyContent: 'space-between' }}>
                    <span className="text--grey">Controller is immutable</span>
                    <IoCheckmark />
                </div>
            ) : null}

            <div className="box--black box--with-icon btn--padding-small" style={{ justifyContent: 'space-between' }}>
                <span className="text--grey">Version</span>
                <span className="text--fat">{BigNumber(data.version).div(100).toString()}</span>
            </div>

            {data.owner.toLowerCase() === state.connectedWallet?.toLowerCase() && contractAddress ? (
                <>
                    <div className="separator" />
                    <span
                        style={{ justifyContent: 'center' }}
                        className="text-primary-gradient text--align-center box box--with-icon btn--padding-small"
                    >
                        You are the owner
                    </span>

                    {!data.immutable && !data.immutableController ? (
                        <button
                            className="btn--black btn--padding-small"
                            onClick={() => {
                                setModal([
                                    'open',
                                    {
                                        content: ({ onClose }) => (
                                            <SetControllerModal
                                                blockchain={blockchain}
                                                onClose={onClose}
                                                contractAddress={contractAddress}
                                            />
                                        ),
                                        title: 'Set Controller',
                                    },
                                ]);
                            }}
                        >
                            Set controller
                        </button>
                    ) : null}

                    <button
                        className="btn--black btn--padding-small"
                        onClick={() => {
                            setModal([
                                'open',
                                {
                                    content: ({ onClose }) => (
                                        <SetDistributorModal blockchain={blockchain} onClose={onClose} contractAddress={contractAddress} />
                                    ),
                                    title: 'Set Distributor',
                                },
                            ]);
                        }}
                    >
                        Set Distributor
                    </button>

                    <button
                        className="btn--black btn--padding-small"
                        onClick={() => {
                            setModal([
                                'open',
                                {
                                    content: ({ onClose }) => (
                                        <TransferOwnershipModal
                                            blockchain={blockchain}
                                            onClose={onClose}
                                            contractAddress={contractAddress}
                                        />
                                    ),
                                    title: 'Set Distributor',
                                },
                            ]);
                        }}
                    >
                        Transfer Ownership
                    </button>
                </>
            ) : null}
        </div>
    );
}
