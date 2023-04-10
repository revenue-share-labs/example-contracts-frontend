import { IoCheckmark } from '@react-icons/all-files/io5/IoCheckmark';
import BigNumber from 'bignumber.js';
import { constants } from 'ethers';
import request, { gql } from 'graphql-request';
import AddressBox from '../components/AddressBox';
import CreateValveContractSuccessModal from '../components/CreatePercentageContractSuccessModal';
import InputWithLabel from '../components/InputWithLabel';
import NumberInput from '../components/NumberInput';
import { throwSnack } from '../components/SnackBars';
import TransactionLoadingModal from '../components/TransactionLoadingModal';
import TransactionPendingModal from '../components/TransactionPendingModal';
import { blockchainData } from '../constants';
import { XLAPrepaymentFactory__factory, XLAValveFactory__factory, XLAWaterfallFactory__factory } from '../generated';
import { setModal } from '../store';
import { formatAddress } from '../utils';
import { beforeTx, getRpcProvider } from './common';
import {
    RecipientType,
    WaterfallRecipientType,
    recipientsToContractFormat,
    waterfallRecipientsToContractFormat,
} from './valveAndPrepayment';
import { getMessageFromEthersError } from './wallet';
import router from 'next/router';
import { ContractSettings } from '../pages/factory/new';
import { Blockchain } from '../types';

export async function createValveContract(
    {
        name,
        controller,
        immutableController,
        autoEthDistribution,
        minAutoDistributeAmount,
        distributor,
        recipients,
        blockchain,
    }: Omit<ContractSettings, 'isImmutable' | 'waterfall' | 'prepayment' | 'useUsd' | 'ethUsdPriceFeed'> & { recipients: RecipientType[] },
    onAddAnother: () => void
) {
    const data = blockchainData[blockchain];

    try {
        const { provider } = await beforeTx(blockchain);

        const factory = XLAValveFactory__factory.connect(data.valveFactoryAddress, provider.getSigner());

        setModal(['open', { content: () => <TransactionPendingModal />, title: 'Transaction pending' }]);

        const { addresses, percentages, names } = recipientsToContractFormat(recipients);

        const res = await factory.createRSCValve({
            name,
            controller,
            immutableController,
            autoEthDistribution,
            initialRecipients: addresses,
            percentages,
            names,
            minAutoDistributeAmount: minAutoDistributeAmount.times(1e18).toString(),
            distributor,
        });
        setModal(['open', { content: () => <TransactionLoadingModal />, title: 'Transaction loading' }]);

        const receipt = await res.wait();

        setModal([
            'open',
            {
                content: ({ onClose }) => (
                    <CreateValveContractSuccessModal
                        onClose={onClose}
                        transactionHash={receipt.transactionHash}
                        contractAddress={receipt.logs[0].address}
                        onAddAnother={onAddAnother}
                        contractType="valve"
                        blockchain={blockchain}
                    />
                ),
                title: 'Transaction success',
            },
        ]);
    } catch (e: any) {
        console.log(e);
        setModal(['closed']);
        const message =
            e.code === 'INVALID_ARGUMENT' && e.argument === 'name' ? 'Entered address is invalid' : getMessageFromEthersError(e).message;
        throwSnack('error', message);

        return false;
    }
}

export async function createPrepaymentContract(
    {
        name,
        controller,
        immutableController,
        autoEthDistribution,
        minAutoDistributeAmount,
        distributor,
        recipients,
        prepayment: { interestRate, investedAmount, investor, residualInterestRate },
        useUsd,
        ethUsdPriceFeed,
        blockchain,
    }: Omit<ContractSettings, 'isImmutable' | 'prepayment'> & {
        recipients: RecipientType[];
        prepayment: NonNullable<ContractSettings['prepayment']>;
    },
    onAddAnother: () => void
) {
    const data = blockchainData[blockchain];

    try {
        const { provider } = await beforeTx(blockchain);

        const factory = XLAPrepaymentFactory__factory.connect(data.prepaymentFactoryAddress, provider.getSigner());

        setModal(['open', { content: () => <TransactionPendingModal />, title: 'Transaction pending' }]);

        const { addresses, percentages, names } = recipientsToContractFormat(recipients);

        const res = !useUsd
            ? await factory.createRSCPrepayment({
                  name,
                  controller: controller || constants.AddressZero,
                  immutableController,
                  autoEthDistribution,
                  initialRecipients: addresses,
                  percentages,
                  names,
                  minAutoDistributeAmount: minAutoDistributeAmount.times(1e18).toString(),
                  distributor,
                  investedAmount: investedAmount.times(1e18).toString(),
                  interestRate: interestRate.times(100).decimalPlaces(0).toString(),
                  investor,
                  residualInterestRate: residualInterestRate.times(100).decimalPlaces(0).toString(),
                  supportedErc20addresses: [],
                  erc20PriceFeeds: [],
              })
            : await factory.createRSCPrepaymentUsd({
                  name,
                  controller: controller || constants.AddressZero,
                  immutableController,
                  autoEthDistribution,
                  initialRecipients: addresses,
                  percentages,
                  names,
                  minAutoDistributeAmount: minAutoDistributeAmount.times(1e18).toString(),
                  distributor,
                  investedAmount: investedAmount.times(1e18).toString(),
                  interestRate: interestRate.times(100).decimalPlaces(0).toString(),
                  investor,
                  residualInterestRate: residualInterestRate.times(100).decimalPlaces(0).toString(),
                  ethUsdPriceFeed,
                  supportedErc20addresses: [],
                  erc20PriceFeeds: [],
              });

        setModal(['open', { content: () => <TransactionLoadingModal />, title: 'Transaction loading' }]);

        const receipt = await res.wait();

        router.push('/');
        setModal([
            'open',
            {
                content: ({ onClose }) => (
                    <CreateValveContractSuccessModal
                        onClose={onClose}
                        transactionHash={receipt.transactionHash}
                        contractAddress={receipt.logs[0].address}
                        onAddAnother={onAddAnother}
                        contractType="prepayment"
                        blockchain={blockchain}
                    />
                ),
                title: 'Transaction success',
            },
        ]);
    } catch (e: any) {
        // console.log(e);
        setModal(['closed']);
        const message =
            e.code === 'INVALID_ARGUMENT' && e.argument === 'name' ? 'Entered address is invalid' : getMessageFromEthersError(e).message;
        throwSnack('error', message);

        return false;
    }
}

export async function createWaterfallContract(
    {
        name,
        controller,
        immutableController,
        autoEthDistribution,
        minAutoDistributeAmount,
        distributor,
        recipients,
        useUsd,
        ethUsdPriceFeed,
        blockchain,
    }: Omit<ContractSettings, 'isImmutable' | 'prepayment'> & {
        recipients: WaterfallRecipientType[];
    },
    onAddAnother: () => void
) {
    const blData = blockchainData[blockchain];

    try {
        const { provider } = await beforeTx(blockchain);

        const factory = XLAWaterfallFactory__factory.connect(blData.waterfallFactoryAddress, provider.getSigner());

        setModal(['open', { content: () => <TransactionPendingModal />, title: 'Transaction pending' }]);

        const { addresses, maxCaps, priorities, names } = waterfallRecipientsToContractFormat(recipients);

        const data = {
            name,
            controller: controller || constants.AddressZero,
            immutableController,
            autoEthDistribution,
            initialRecipients: addresses,
            maxCaps,
            names,
            priorities,
            minAutoDistributeAmount: minAutoDistributeAmount.times(1e18).toString(),
            distributor,
            supportedErc20addresses: [],
            erc20PriceFeeds: [],
        };

        const res = !useUsd
            ? await factory.createRSCWaterfall(data)
            : await factory.createRSCWaterfallUsd({
                  ...data,
                  ethUsdPriceFeed,
              });

        setModal(['open', { content: () => <TransactionLoadingModal />, title: 'Transaction loading' }]);

        const receipt = await res.wait();

        router.push('/');
        setModal([
            'open',
            {
                content: ({ onClose }) => (
                    <CreateValveContractSuccessModal
                        onClose={onClose}
                        transactionHash={receipt.transactionHash}
                        contractAddress={receipt.logs[0].address}
                        onAddAnother={onAddAnother}
                        contractType="waterfall"
                        blockchain={blockchain}
                    />
                ),
                title: 'Transaction success',
            },
        ]);
    } catch (e: any) {
        // console.log(e);
        setModal(['closed']);
        const message =
            e.code === 'INVALID_ARGUMENT' && e.argument === 'name' ? 'Entered address is invalid' : getMessageFromEthersError(e).message;
        throwSnack('error', message);

        return false;
    }
}

export type ContractsListItem = {
    name: string;
    owner: string;
    version: number;
    contractAddress: string;
    // received: BigNumber;
    // receivedUsd: BigNumber;
    type: 'Valve' | 'Prepayment' | 'Waterfall';
    blockchain: Blockchain;
};

export type ContractsListFilter = 'All' | 'Only mine';

export async function getContractsList(owner?: string) {
    const polygonQuery = gql`
        {
            valveContractEntities${owner ? `( where: { owner: "${owner}" })` : ''} {
                name
                owner
                version
                contractAddress
            }
            prepaymentContractEntities${owner ? `( where: { owner: "${owner}" })` : ''} {
                name
                owner
                version
                contractAddress
            }
            waterfallContractEntities${owner ? `( where: { owner: "${owner}" })` : ''} {
                name
                owner
                version
                contractAddress
            }
        }
    `;
    const ethQuery = gql`
    {
        valveContractEntities${owner ? `( where: { owner: "${owner}" })` : ''} {
            name
            owner
            version
            contractAddress
        }
        prepaymentContractEntities${owner ? `( where: { owner: "${owner}" })` : ''} {
            name
            owner
            version
            contractAddress
        }
    }
`;

    const polygonRes = await request<{
        valveContractEntities: ContractsListItem[];
        prepaymentContractEntities: ContractsListItem[];
        waterfallContractEntities: ContractsListItem[];
    }>(blockchainData['POLYGON'].graphUrl, polygonQuery);

    const ethRes = await request<{
        valveContractEntities: ContractsListItem[];
        prepaymentContractEntities: ContractsListItem[];
    }>(blockchainData['ETH'].graphUrl, ethQuery);

    return [
        ...ethRes.valveContractEntities.map<ContractsListItem>((item) => {
            return {
                ...item,
                type: 'Valve',
                blockchain: 'ETH',
            };
        }),
        ...polygonRes.valveContractEntities.map<ContractsListItem>((item) => {
            return {
                ...item,
                type: 'Valve',
                blockchain: 'POLYGON',
            };
        }),
        ...ethRes.prepaymentContractEntities.map<ContractsListItem>((item) => {
            return {
                ...item,
                type: 'Prepayment',
                blockchain: 'ETH',
            };
        }),
        ...polygonRes.prepaymentContractEntities.map<ContractsListItem>((item) => {
            return {
                ...item,
                type: 'Prepayment',
                blockchain: 'POLYGON',
            };
        }),
        ...polygonRes.waterfallContractEntities.map<ContractsListItem>((item) => {
            return {
                ...item,
                type: 'Waterfall',
                blockchain: 'POLYGON',
            };
        }),
    ];
}

export async function setFactoryFeeWallet(factoryType: 'valve' | 'prepayment' | 'waterfall', feeWallet: string, blockchain: Blockchain) {
    const data = blockchainData[blockchain];

    try {
        const { provider } = await beforeTx(blockchain);

        const factory =
            factoryType === 'valve'
                ? XLAValveFactory__factory.connect(data.valveFactoryAddress, provider.getSigner())
                : factoryType === 'prepayment'
                ? XLAPrepaymentFactory__factory.connect(data.prepaymentFactoryAddress, provider.getSigner())
                : XLAWaterfallFactory__factory.connect(data.waterfallFactoryAddress, provider.getSigner());

        setModal(['open', { content: () => <TransactionPendingModal />, title: 'Transaction pending' }]);

        const res = await factory.setPlatformWallet(feeWallet);
        setModal(['open', { content: () => <TransactionLoadingModal />, title: 'Transaction loading' }]);

        const receipt = await res.wait();

        setModal([
            'open',
            {
                content: ({ onClose }) => {
                    return (
                        <div className="add-affiliate-modal">
                            <IoCheckmark className="add-affiliate-modal__icon" size={'7rem'} />
                            <span className="transaction-loading-modal__subtitle">Fee wallet was set successfully</span>
                            <AddressBox blockchain={blockchain} label="New Distributor" hexString={feeWallet} type="address" />

                            <div className="separator" />
                            <AddressBox blockchain={blockchain} label="Transaction" hexString={receipt.transactionHash} type="tx" />

                            <button onClick={onClose} className="btn--primary">
                                Close
                            </button>
                        </div>
                    );
                },
                title: `Fee Wallet set to ${formatAddress(feeWallet)}`,
            },
        ]);
    } catch (e: any) {
        console.log(e);
        setModal(['closed']);
        const message =
            e.code === 'INVALID_ARGUMENT' && e.argument === 'name' ? 'Entered address is invalid' : getMessageFromEthersError(e).message;
        throwSnack('error', message);

        return false;
    }
}

export async function setValveFactoryFee(feePercent: BigNumber, blockchain: Blockchain) {
    const blData = blockchainData[blockchain];
    try {
        const { provider } = await beforeTx(blockchain);

        const factory = XLAValveFactory__factory.connect(blData.valveFactoryAddress, provider.getSigner());

        setModal(['open', { content: () => <TransactionPendingModal />, title: 'Transaction pending' }]);

        const res = await factory.setPlatformWallet(feePercent.times(100).decimalPlaces(0).toString());
        setModal(['open', { content: () => <TransactionLoadingModal />, title: 'Transaction loading' }]);

        const receipt = await res.wait();

        setModal([
            'open',
            {
                content: ({ onClose }) => {
                    return (
                        <div className="add-affiliate-modal">
                            <IoCheckmark className="add-affiliate-modal__icon" size={'7rem'} />
                            <span className="transaction-loading-modal__subtitle">Fee wallet was set successfully</span>
                            <InputWithLabel label="New fee" input={() => <NumberInput disabled value={feePercent} onChange={() => {}} />} />

                            <div className="separator" />
                            <AddressBox blockchain={blockchain} label="Transaction" hexString={receipt.transactionHash} type="tx" />

                            <button onClick={onClose} className="btn--primary">
                                Close
                            </button>
                        </div>
                    );
                },
                title: `Fee percentage set to ${feePercent.toString()}`,
            },
        ]);
    } catch (e: any) {
        console.log(e);
        setModal(['closed']);
        const message =
            e.code === 'INVALID_ARGUMENT' && e.argument === 'name' ? 'Entered address is invalid' : getMessageFromEthersError(e).message;
        throwSnack('error', message);

        return false;
    }
}

export type ValveFactoryAdminData = { feePercent: BigNumber; feeWallet: string; owner: string };
export type FactoryType = 'Valve' | 'Prepayment' | 'Waterfall';

export async function getValveFactoryAdminData(blockchain: Blockchain, factoryType: FactoryType): Promise<ValveFactoryAdminData> {
    const provider = getRpcProvider(blockchain);

    const data = blockchainData[blockchain];

    const factory =
        factoryType === 'Valve'
            ? XLAValveFactory__factory.connect(data.valveFactoryAddress, provider)
            : factoryType === 'Prepayment'
            ? XLAPrepaymentFactory__factory.connect(data.prepaymentFactoryAddress, provider)
            : XLAWaterfallFactory__factory.connect(data.waterfallFactoryAddress, provider);

    const [platformFee, platformWallet, owner] = await Promise.all([factory.platformFee(), factory.platformWallet(), factory.owner()]);

    return { feePercent: BigNumber(platformFee.toString()).div(100), feeWallet: platformWallet, owner };
}
