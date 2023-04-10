import { IoCheckmark } from '@react-icons/all-files/io5/IoCheckmark';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import request, { gql } from 'graphql-request';
import AddressBox from '../components/AddressBox';
import DistributionSuccessModal from '../components/DistributionSuccessModal';
import SetRecipientsSuccessModal from '../components/SetRecipientsSuccessModal';
import { throwSnack } from '../components/SnackBars';
import TransactionLoadingModal from '../components/TransactionLoadingModal';
import TransactionPendingModal from '../components/TransactionPendingModal';
import { blockchainData } from '../constants';
import { XLAPrepayment__factory, XLAValve__factory, XLAWaterfall__factory } from '../generated';
import { setModal } from '../store';
import { formatAddress } from '../utils';
import { beforeTx, getRpcProvider } from './common';
import { getMessageFromEthersError } from './wallet';
import { WaterfallRecipientChangedType } from '../components/ValveManageTable';
import { Blockchain } from '../types';

export type RecipientType = { percentage: BigNumber; address: string; name: string };
export type GraphRecipientType = Omit<RecipientType, 'percentage'> & { percentage: string };

export type WaterfallRecipientType = {
    address: string;
    maxCap: BigNumber;
    name: string;
    priority: number;
    locked: boolean;
};

export type DashboardWaterfallRecipientType = WaterfallRecipientType & {
    received: BigNumber;
    receivedPercentage: BigNumber;
    left: BigNumber;
};

export type GraphWaterfallRecipientType = Omit<WaterfallRecipientType, 'maxCap'> & { maxCap: string; addedBlock: string; id: string };

export type PrepaymentDashboardData = ValveDashboardData & {
    investedAmount: BigNumber;
    interestRate: BigNumber;
    residualInterestRate: BigNumber;
    currency: 'USD' | 'ETH';

    paidOut: BigNumber;
    left: BigNumber;
    investorToReceiveTotal: BigNumber;
    investorAddress: string;
};

export type EthAndUsd = {
    value: BigNumber;
    usd: BigNumber;
};

export type ValveDashboardData = {
    recipients: RecipientType[];
    autoEthDistribution: boolean;
    immutableController: boolean;
    immutable: boolean;
    name: string;
    owner: string;
    version: number;
    controller?: string;
    distributor?: string;
    minAutoDistributeAmount: BigNumber;
};

export type GraphValveData = Omit<ValveDashboardData, 'recipients' | 'minAutoDistributeAmount'> & {
    recipients: GraphRecipientType[];
    minAutoDistributeAmount: string;
};

export type WaterfallDashboardData = Omit<ValveDashboardData, 'recipients'> & {
    recipients: DashboardWaterfallRecipientType[];
    currency: 'USD' | 'ETH';
};

type GraphWaterfallData = Omit<WaterfallDashboardData, 'recipients' | 'minAutoDistributeAmount'> & {
    recipients: GraphWaterfallRecipientType[];
    minAutoDistributeAmount: string;
};

type GraphPrepaymentData = GraphValveData &
    Omit<PrepaymentDashboardData, 'investorAddress' | 'paidOut' | 'left' | 'investedAmount' | 'interestRate' | 'residualInterestRate'> & {
        investedAmount: string;
        interestRate: string;
        residualInterestRate: string;
    };

export function areWaterfallRecipientsValid(items: WaterfallRecipientChangedType[]) {
    const viableItems = items.filter((item) => item.address && !item.locked);
    const addresses = viableItems.map((item) => item.address);
    const thereAreDuplicates = addresses.length !== new Set(addresses).size;

    const invalidRecs = viableItems.some(({ address, maxCap, name }) => !ethers.utils.isAddress(address) || maxCap.lte(0) || !name);

    console.log({ thereAreDuplicates }, !thereAreDuplicates && !invalidRecs);
    return !thereAreDuplicates && !invalidRecs;
}

export function recipientsToContractFormat(recipients: RecipientType[]) {
    const [addresses, percentages, names] = recipients.reduce<[string[], string[], string[]]>(
        ([addresses, percentages, names], item) => {
            if (item.percentage.lte(0)) {
                return [addresses, percentages, names];
            }

            return [
                [...addresses, item.address],
                [...percentages, item.percentage.multipliedBy(100).toFixed()],
                [...names, item.name],
            ];
        },
        [[], [], []]
    );

    return { addresses, percentages, names };
}

export function waterfallRecipientsToContractFormat(recipients: WaterfallRecipientType[]) {
    const [addresses, maxCaps, names, priorities] = recipients.reduce<[string[], string[], string[], string[]]>(
        ([addresses, maxCaps, names, priorities], item) => {
            if (item.maxCap.lte(0)) {
                return [addresses, maxCaps, names, priorities];
            }

            return [
                [...addresses, item.address],
                [...maxCaps, item.maxCap.times(1e18).toString()],
                [...names, item.name],
                [...priorities, item.priority.toString()],
            ];
        },
        [[], [], [], []]
    );

    return { addresses, maxCaps, names, priorities };
}

export async function setRecipients(contractAddress: string, recipients: RecipientType[], blockchain: Blockchain) {
    const { provider, connectedWallet } = await beforeTx(blockchain);

    try {
        const contract = XLAValve__factory.connect(contractAddress, provider.getSigner());

        const controller = await contract.controller();
        if (controller.toLowerCase() !== connectedWallet.toLowerCase()) {
            throwSnack(
                'error',
                "Connected wallet doesn't have permission to edit recipients.",
                <AddressBox blockchain={blockchain} label="Controller" hexString={controller} type="address" />
            );
            return;
        }

        const { addresses, percentages, names } = recipientsToContractFormat(recipients);

        setModal(['open', { content: () => <TransactionPendingModal />, title: 'Transaction pending' }]);

        const tx = await contract.setRecipients(addresses, percentages, names);

        setModal(['open', { content: () => <TransactionLoadingModal />, title: 'Transaction loading' }]);

        const receipt = await tx.wait();

        setModal([
            'open',
            {
                content: ({ onClose }) => (
                    <SetRecipientsSuccessModal blockchain={blockchain} onClose={onClose} transactionHash={receipt.transactionHash} />
                ),
                title: 'Transaction success',
            },
        ]);

        return true;
    } catch (e: any) {
        console.log(e);
        setModal(['closed']);
        const message =
            e.code === 'INVALID_ARGUMENT' && e.argument === 'name' ? 'Entered address is invalid' : getMessageFromEthersError(e).message;
        throwSnack('error', message);

        return false;
    }
}

export async function setWaterfallRecipients(contractAddress: string, recipients: WaterfallRecipientType[], blockchain: Blockchain) {
    const { provider, connectedWallet } = await beforeTx(blockchain);

    if (!areWaterfallRecipientsValid(recipients)) {
        throwSnack('error', 'Recipient list is not valid');
        return;
    }

    try {
        const contract = XLAWaterfall__factory.connect(contractAddress, provider.getSigner());

        const controller = await contract.controller();
        if (controller.toLowerCase() !== connectedWallet.toLowerCase()) {
            throwSnack(
                'error',
                "Connected wallet doesn't have permission to edit recipients.",
                <AddressBox blockchain={blockchain} label="Controller" hexString={controller} type="address" />
            );
            return;
        }

        const { addresses, maxCaps, names, priorities } = waterfallRecipientsToContractFormat(recipients);

        setModal(['open', { content: () => <TransactionPendingModal />, title: 'Transaction pending' }]);

        console.log(
            contractAddress,
            addresses,
            maxCaps,
            priorities,
            names,
            await contract.controller(),
            await provider.getSigner().getAddress()
        );
        const tx = await contract.setRecipients(addresses, maxCaps, priorities, names);

        setModal(['open', { content: () => <TransactionLoadingModal />, title: 'Transaction loading' }]);

        const receipt = await tx.wait();

        setModal([
            'open',
            {
                content: ({ onClose }) => (
                    <SetRecipientsSuccessModal blockchain={blockchain} onClose={onClose} transactionHash={receipt.transactionHash} />
                ),
                title: 'Transaction success',
            },
        ]);

        return true;
    } catch (e: any) {
        console.log(e);
        setModal(['closed']);
        const message =
            e.code === 'INVALID_ARGUMENT' && e.argument === 'name' ? 'Entered address is invalid' : getMessageFromEthersError(e).message;
        throwSnack('error', message);

        return false;
    }
}

export async function distribute(contractAddress: string, tokenAddress: string, blockchain: Blockchain) {
    const { provider, connectedWallet } = await beforeTx(blockchain);
    try {
        const contract = XLAValve__factory.connect(contractAddress, provider.getSigner());
        if ((await contract.distributor()).toLowerCase() !== connectedWallet.toLowerCase()) {
            throwSnack('error', "Connected wallet doesn't have permission to distribute tokens.");
            return;
        }
        setModal(['open', { content: () => <TransactionPendingModal />, title: 'Transaction pending' }]);
        const tx = await contract.functions.redistributeToken(tokenAddress);
        setModal(['open', { content: () => <TransactionLoadingModal />, title: 'Transaction loading' }]);
        const receipt = await tx.wait();
        setModal([
            'open',
            {
                content: ({ onClose }) => (
                    <DistributionSuccessModal blockchain={blockchain} onClose={onClose} transactionHash={receipt.transactionHash} />
                ),
                title: 'Transaction success',
            },
        ]);
        return true;
    } catch (e: any) {
        console.log(e);
        setModal(['closed']);
        const message =
            e.code === 'INVALID_ARGUMENT' && e.argument === 'name' ? 'Entered address is invalid' : getMessageFromEthersError(e).message;
        throwSnack('error', message);
    }
}

export async function distributeEth(contractAddress: string, blockchain: Blockchain) {
    const { provider, connectedWallet } = await beforeTx(blockchain);

    try {
        const contract = XLAValve__factory.connect(contractAddress, provider.getSigner());
        if ((await contract.distributor()).toLowerCase() !== connectedWallet.toLowerCase()) {
            throwSnack('error', "Connected wallet doesn't have permission to distribute ETH.");
            return;
        }
        setModal(['open', { content: () => <TransactionPendingModal />, title: 'Transaction pending' }]);
        const tx = await contract.functions.redistributeEth();
        setModal(['open', { content: () => <TransactionLoadingModal />, title: 'Transaction loading' }]);
        const receipt = await tx.wait();
        setModal([
            'open',
            {
                content: ({ onClose }) => (
                    <DistributionSuccessModal blockchain={blockchain} onClose={onClose} transactionHash={receipt.transactionHash} />
                ),
                title: 'Transaction success',
            },
        ]);
        return true;
    } catch (e: any) {
        console.log(e);
        setModal(['closed']);
        const message =
            e.code === 'INVALID_ARGUMENT' && e.argument === 'name' ? 'Entered address is invalid' : getMessageFromEthersError(e).message;
        throwSnack('error', message);
    }
}

export async function getValveManageData(
    contractAddress: string,
    blockchain: Blockchain
): Promise<{ recipients: RecipientType[]; name: string }> {
    const q = gql`
        {
            valveContractEntity(id: "${contractAddress.toLowerCase()}") {
                name
                recipients {
                    percentage
                    address
                    name
                }
            }
        }
    `;

    const res = await request<{
        valveContractEntity: { name: string; recipients: GraphRecipientType[] };
    }>(`${blockchainData[blockchain].graphUrl}`, q);

    return {
        recipients: res.valveContractEntity.recipients.map(({ percentage, ...other }) => ({
            ...other,
            percentage: BigNumber(percentage).div(100),
        })),
        name: res.valveContractEntity.name,
    };
}

export async function getPrepaymentManageData(
    contractAddress: string,
    blockchain: Blockchain
): Promise<{ recipients: RecipientType[]; name: string }> {
    const q = gql`
        {
            prepaymentContractEntity(id: "${contractAddress.toLowerCase()}") {
                name
                recipients {
                    percentage
                    address
                    name
                }
            }
        }
    `;

    const res = await request<{
        prepaymentContractEntity: { name: string; recipients: GraphRecipientType[] };
    }>(`${blockchainData[blockchain].graphUrl}`, q);

    return {
        recipients: res.prepaymentContractEntity.recipients.map(({ percentage, ...other }) => ({
            ...other,
            percentage: BigNumber(percentage).div(100),
        })),
        name: res.prepaymentContractEntity.name,
    };
}

export async function getWaterfallManageData(
    contractAddress: string,
    blockchain: Blockchain
): Promise<{ recipients: WaterfallRecipientType[]; name: string; currency: 'ETH' | 'USD' }> {
    const q = gql`
        {
            waterfallContractEntity(id: "${contractAddress.toLowerCase()}") {
                name
                currency
                recipients {
                    maxCap
                    address
                    name
                    priority
                    locked
                }
            }
        }
    `;

    const res = await request<{
        waterfallContractEntity: { name: string; recipients: GraphWaterfallRecipientType[]; currency: 'ETH' | 'USD' };
    }>(`${blockchainData[blockchain].graphUrl}`, q);

    return {
        recipients: res.waterfallContractEntity.recipients.map(({ maxCap, priority, ...other }) => ({
            ...other,
            maxCap: BigNumber(maxCap.toString()).div(1e18),
            priority: Number(priority),
        })),
        name: res.waterfallContractEntity.name,
        currency: res.waterfallContractEntity.currency,
    };
}

export async function getValveDashData(contractAddress: string, blockchain: Blockchain): Promise<ValveDashboardData> {
    const q = gql`
        {
              valveContractEntity(id: "${contractAddress.toLowerCase()}") {
                name
                version
                autoEthDistribution
                immutableController
                owner
                controller
                distributor
                minAutoDistributeAmount
                recipients {
                    percentage
                    address
                    name
                    addedBlock
                }
              }
        }
    `;

    const [res] = await Promise.all([
        request<{
            valveContractEntity?: GraphValveData;
        }>(`${blockchainData[blockchain].graphUrl}`, q),
    ]);

    if (!res.valveContractEntity) throw new Error();

    const { immutableController, recipients, autoEthDistribution, owner, controller, distributor, name, version, minAutoDistributeAmount } =
        res.valveContractEntity;

    return {
        recipients: recipients.map(({ percentage, ...other }) => {
            return {
                ...other,
                percentage: BigNumber(percentage).div(100),
            };
        }),
        autoEthDistribution,
        immutableController,
        owner,
        controller: ethers.constants.AddressZero === controller ? undefined : controller,
        distributor,
        name,
        version,
        immutable: ethers.constants.AddressZero === controller,
        minAutoDistributeAmount: BigNumber(minAutoDistributeAmount),
    };
}

export async function getPrepaymentDashData(contractAddress: string, blockchain: Blockchain): Promise<PrepaymentDashboardData> {
    const q = gql`
        {
              prepaymentContractEntity(id: "${contractAddress.toLowerCase()}") {
                name
                version
                autoEthDistribution
                immutableController
                owner
                controller
                distributor
                minAutoDistributeAmount

                investedAmount
                interestRate
                residualInterestRate
                currency
                ethUsdPriceFeed

                recipients {
                    percentage
                    address
                    name
                    addedBlock
                }

                tokenPriceFeeds {
                    tokenAddress
                    feedAddress
                    prepaymentContract
                }
              }
        }
    `;

    const prepayment = XLAPrepayment__factory.connect(contractAddress, getRpcProvider(blockchain));
    const [res, _investorReceived, investorAddress] = await Promise.all([
        request<{
            prepaymentContractEntity?: GraphPrepaymentData;
        }>(`${blockchainData[blockchain].graphUrl}`, q),
        prepayment.investorReceivedAmount().then((val) => BigNumber(val.toString())),
        prepayment.investor(),
    ]);

    const investorReceived = _investorReceived.div(1e18);

    if (!res.prepaymentContractEntity) throw new Error();

    const {
        immutableController,
        recipients,
        autoEthDistribution,
        owner,
        controller,
        distributor,
        name,
        version,
        minAutoDistributeAmount,
        interestRate: _interestRate,
        investedAmount: _investedAmount,
        residualInterestRate: _residualInterestRate,
        currency,
    } = res.prepaymentContractEntity;

    const investedAmount = BigNumber(_investedAmount).div(1e18);
    const interestRate = BigNumber(_interestRate).div(100);
    const residualInterestRate = BigNumber(_residualInterestRate).div(100);

    const investorToReceiveTotal = investedAmount.plus(investedAmount.times(interestRate).div(100));

    return {
        recipients: recipients.map(({ percentage, ...other }) => {
            return {
                ...other,
                percentage: BigNumber(percentage).div(100),
            };
        }),
        autoEthDistribution,
        immutableController,
        owner,
        controller: ethers.constants.AddressZero === controller ? undefined : controller,
        distributor,
        name,
        version,
        immutable: ethers.constants.AddressZero === controller,
        minAutoDistributeAmount: BigNumber(minAutoDistributeAmount),
        interestRate,
        investedAmount,
        residualInterestRate,
        currency,
        left: investorReceived.gt(investorToReceiveTotal) ? BigNumber(0) : investorToReceiveTotal.minus(investorReceived),
        paidOut: investorReceived,
        investorToReceiveTotal,
        investorAddress,
    };
}

export async function getWaterfallDashData(contractAddress: string, blockchain: Blockchain): Promise<WaterfallDashboardData> {
    const q = gql`
        {
              waterfallContractEntity(id: "${contractAddress.toLowerCase()}") {
                name
                version
                autoEthDistribution
                immutableController
                owner
                controller
                distributor
                minAutoDistributeAmount

                currency
                ethUsdPriceFeed

                recipients {
                    id
                    priority
                    maxCap
                    address
                    name
                    addedBlock
                    locked
                }

                tokenPriceFeeds {
                    tokenAddress
                    feedAddress
                }
              }
        }
    `;

    const waterfall = XLAWaterfall__factory.connect(contractAddress, getRpcProvider(blockchain));

    const [res] = await Promise.all([
        request<{
            waterfallContractEntity?: GraphWaterfallData;
        }>(`${blockchainData[blockchain].graphUrl}`, q),
    ]);

    if (!res.waterfallContractEntity) throw new Error();

    const useUsd = res.waterfallContractEntity.currency === 'USD';

    const recipients = await Promise.all(
        res.waterfallContractEntity.recipients.map(async (item) => {
            const data = await waterfall.recipientsData(item.address);
            const maxCap = useUsd ? BigNumber(item.maxCap).div(1e18) : BigNumber(item.maxCap);

            const notInContractAnymore = data.maxCap.eq(0) && data.received.eq(0);

            const received = notInContractAnymore
                ? maxCap
                : (() => {
                      if (item.locked) {
                          const found = res.waterfallContractEntity?.recipients.find((a) => {
                              return a.id !== item.id && a.address === item.address && Number(a.addedBlock) > Number(item.addedBlock);
                          });

                          if (found) {
                              return maxCap;
                          } else {
                              const reci = BigNumber(data.received.toString());
                              return useUsd ? reci.div(1e18) : reci;
                          }
                      }
                      return BigNumber(0);
                  })();

            return {
                ...item,
                maxCap,
                received,
                receivedPercentage: received.div(maxCap).times(100),
                left: maxCap.minus(received),
                addedBlock: Number(item.addedBlock),
            };
        })
    );

    const { immutableController, autoEthDistribution, owner, controller, distributor, name, version, minAutoDistributeAmount, currency } =
        res.waterfallContractEntity;

    return {
        recipients: recipients.sort((a, b) => {
            if (a.addedBlock !== b.addedBlock) {
                return a.addedBlock - b.addedBlock;
            }
            if (a.locked && !b.locked) return -1;
            if (b.locked && !a.locked) return 1;
            return b.priority - a.priority;
        }),
        autoEthDistribution,
        immutableController,
        owner,
        controller: ethers.constants.AddressZero === controller ? undefined : controller,
        distributor,
        name,
        version,
        immutable: ethers.constants.AddressZero === controller,
        minAutoDistributeAmount: BigNumber(minAutoDistributeAmount),
        currency,
    };
}

export async function setController(contractAddress: string, blockchain: Blockchain, controller: string | null) {
    const { provider } = await beforeTx(blockchain);

    const _controller = controller || ethers.constants.AddressZero;

    const valve = XLAValve__factory.connect(contractAddress, provider.getSigner());

    setModal(['open', { content: () => <TransactionPendingModal />, title: 'Transaction pending' }]);

    const res = await valve.setController(_controller);

    setModal(['open', { content: () => <TransactionLoadingModal />, title: 'Transaction loading' }]);

    const receipt = await res.wait();

    setModal([
        'open',
        {
            content: ({ onClose }) => {
                return (
                    <div className="add-affiliate-modal">
                        <IoCheckmark className="add-affiliate-modal__icon" size={'7rem'} />
                        <span className="transaction-loading-modal__subtitle">Controller was set successfully</span>
                        {controller && <AddressBox blockchain={blockchain} label="New Controller" hexString={controller} type="address" />}

                        <div className="separator" />
                        <AddressBox blockchain={blockchain} label="Transaction" hexString={receipt.transactionHash} type="tx" />

                        <button onClick={onClose} className="btn--primary">
                            Close
                        </button>
                    </div>
                );
            },
            title: `Controller set to ${formatAddress(_controller)}`,
        },
    ]);
}

export async function setDistributor(contractAddress: string, blockchain: Blockchain, distributor: string | null) {
    const { provider } = await beforeTx(blockchain);

    const _distributor = distributor || ethers.constants.AddressZero;

    const valve = XLAValve__factory.connect(contractAddress, provider.getSigner());

    setModal(['open', { content: () => <TransactionPendingModal />, title: 'Transaction pending' }]);

    const res = await valve.setDistributor(_distributor);

    setModal(['open', { content: () => <TransactionLoadingModal />, title: 'Transaction loading' }]);

    const receipt = await res.wait();

    setModal([
        'open',
        {
            content: ({ onClose }) => {
                return (
                    <div className="add-affiliate-modal">
                        <IoCheckmark className="add-affiliate-modal__icon" size={'7rem'} />
                        <span className="transaction-loading-modal__subtitle">Distributor was set successfully</span>
                        {_distributor && (
                            <AddressBox blockchain={blockchain} label="New Distributor" hexString={_distributor} type="address" />
                        )}

                        <div className="separator" />
                        <AddressBox blockchain={blockchain} label="Transaction" hexString={receipt.transactionHash} type="tx" />

                        <button onClick={onClose} className="btn--primary">
                            Close
                        </button>
                    </div>
                );
            },
            title: `Distributor set to ${formatAddress(_distributor)}`,
        },
    ]);
}

export async function transferOwnership(contractAddress: string, blockchain: Blockchain, newOwner: string | null) {
    const { provider } = await beforeTx(blockchain);

    const _newOwner = newOwner || ethers.constants.AddressZero;

    const valve = XLAValve__factory.connect(contractAddress, provider.getSigner());

    setModal(['open', { content: () => <TransactionPendingModal />, title: 'Transaction pending' }]);

    const res = await valve.transferOwnership(_newOwner);

    setModal(['open', { content: () => <TransactionLoadingModal />, title: 'Transaction loading' }]);

    const receipt = await res.wait();

    setModal([
        'open',
        {
            content: ({ onClose }) => {
                return (
                    <div className="add-affiliate-modal">
                        <IoCheckmark className="add-affiliate-modal__icon" size={'7rem'} />
                        <span className="transaction-loading-modal__subtitle">Ownership was transferred successfully</span>
                        {newOwner && <AddressBox blockchain={blockchain} label="New Owner" hexString={newOwner} type="address" />}

                        <div className="separator" />
                        <AddressBox blockchain={blockchain} label="Transaction" hexString={receipt.transactionHash} type="tx" />

                        <button onClick={onClose} className="btn--primary">
                            Close
                        </button>
                    </div>
                );
            },
            title: `Owner set to ${formatAddress(_newOwner)}`,
        },
    ]);
}
