import { Atom, swap } from '@dbeining/react-atom';
import BigNumber from 'bignumber.js';
import { providers } from 'ethers';
import React from 'react';
import { proxy, ref } from 'valtio';
import { getEthPrice, getPrices } from './services/usd';
import { Blockchain } from './types';

export type ModalContentProps = { onClose: () => void };
export type ModalData = ['closed'] | ['open', { title: string; content: (props: ModalContentProps) => React.ReactNode }];

export const modalAtom = Atom.of<ModalData>(['closed']);
export const setModal = (data: ModalData) => {
    swap(modalAtom, () => data);
};

type WalletState = {
    provider?: providers.Web3Provider;
    connectedWallet?: string;
    connectionLoading?: boolean;
    chainId?: number;
};

export const walletState = proxy<WalletState>({ connectionLoading: true });

// export const ethPriceAtom = Atom.of<BigNumber>(BigNumber(0));
// export const maticPriceAtom = Atom.of<BigNumber>(BigNumber(0));
export const pricesAtom = Atom.of<Record<Blockchain, BigNumber>>({ ETH: BigNumber(0), POLYGON: BigNumber(0) });

export const setPriceAtoms = async () => {
    const prices = await getPrices();
    // swap(ethPriceAtom, () => BigNumber(prices.ethereum.usd));
    // swap(maticPriceAtom, () => BigNumber(prices['matic-network'].usd));
    swap(pricesAtom, () => ({ ETH: BigNumber(prices['ethereum'].usd), POLYGON: BigNumber(prices['matic-network'].usd) }));
};

export const setWalletProviderStore = async (provider: providers.Web3Provider | undefined) => {
    const oldProvider = walletState.provider;
    if (oldProvider) {
        oldProvider.removeAllListeners();

        //@ts-ignore
        if (oldProvider.provider?.removeAllListeners()) {
            //@ts-ignore
            oldProvider.provider.removeAllListeners();
        }
    }

    if (provider) {
        const address = await provider.getSigner().getAddress();
        if (address) {
            walletState.connectedWallet = address;
        } else {
            walletState.connectedWallet = undefined;
        }
    } else {
        walletState.connectedWallet = undefined;
    }
    walletState.provider = provider ? ref(provider) : undefined;
};
