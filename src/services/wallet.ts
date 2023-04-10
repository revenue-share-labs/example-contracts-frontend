import WalletConnectProvider from '@walletconnect/web3-provider';
import { providers } from 'ethers';
import { throwSnack } from '../components/SnackBars';
import { CHAIN_ID } from '../constants';
import { setWalletProviderStore, walletState } from '../store';
import { hexToNumber, numberToHex, sleep } from '../utils';
import { connectWalletAction } from './walletActions';

// https://eips.ethereum.org/EIPS/eip-3085
interface AddEthereumChainParameter {
    chainId: string;
    blockExplorerUrls?: string[];
    chainName: string;
    iconUrls?: string[];
    nativeCurrency?: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls?: string[];
}

export type WalletProviderType = 'metamask' | 'walletconnect';
export type WalletInfo = { accountAddress: string; chainId: number; provider: providers.Web3Provider };
export type ConnectWalletWithProviderFn = (
    onDisconnect: () => void,
    onAccountsChange: (accountAddresses: string[]) => void,
    onChainChange: (chainId: number) => void
) => Promise<WalletInfo>;

const PERSIST_CONNECTED_WALLET_TYPE_KEY = 'WALLET_PROVIDER';
export const RPC_MAP: { [chainId: number]: string } = {
    5: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    1: 'https://eth-rpc.gateway.pokt.network',
    137: 'https://polygon-rpc.com/',
};

export const getMetamaskEthereum = (): any => {
    if (typeof window !== 'undefined') {
        return (window as any).ethereum;
    }

    return undefined;
};

export const isMetamaskAvailable = (): boolean => {
    return typeof getMetamaskEthereum() !== 'undefined';
};

export const isMetamaskConnected = (): boolean => {
    if (isMetamaskAvailable()) {
        return !!getMetamaskEthereum().selectedAddress;
    }
    return false;
};

export const persistConnectedWalletType = (walletType: WalletProviderType | undefined): void => {
    walletType
        ? localStorage.setItem(PERSIST_CONNECTED_WALLET_TYPE_KEY, walletType)
        : localStorage.removeItem(PERSIST_CONNECTED_WALLET_TYPE_KEY);
};

export const getConnectedWalletType = (): WalletProviderType | null => {
    return localStorage.getItem(PERSIST_CONNECTED_WALLET_TYPE_KEY) as WalletProviderType;
};

export const connectWalletByMetamask: ConnectWalletWithProviderFn = async (onDisconnect, onAccountsChange, onChainChange) => {
    const ethereum = getMetamaskEthereum();

    if (!ethereum) {
        throw new Error('Metamask extension is not available');
    }

    ethereum.removeAllListeners();

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    // try {
    //     await switchChainIdByMetamask(CHAIN_ID);
    // } catch {}

    function chainChanged(chainIdHex: string) {
        onChainChange(hexToNumber(chainIdHex));
    }

    function accountsChanged(accounts: string[]) {
        if (accounts.length) {
            onAccountsChange(accounts);
        } else {
            onDisconnect();
            ethereum.removeListener('accountsChanged', accountsChanged);
            ethereum.removeListener('chainChanged', chainChanged);
            ethereum.removeAllListeners?.();
        }
    }

    ethereum.on('disconnect', onDisconnect);
    ethereum.on('accountsChanged', accountsChanged);
    ethereum.on('chainChanged', chainChanged);

    return {
        accountAddress: ethereum.selectedAddress || accounts[0],
        chainId: parseInt(ethereum.chainId, 16),
        provider: new providers.Web3Provider(ethereum),
    };
};

export const connectWalletByWalletConnect: ConnectWalletWithProviderFn = async (onDisconnect, onAccountsChange, onChainChange) => {
    const walletConnectProvider = new WalletConnectProvider({
        rpc: RPC_MAP,
        chainId: CHAIN_ID,
    });
    const accounts = await walletConnectProvider.enable();

    walletConnectProvider.on('disconnect', onDisconnect);
    walletConnectProvider.on('accountsChanged', onAccountsChange);
    walletConnectProvider.on('chainChanged', onChainChange);

    function isIOS() {
        return (
            [
                'iPad Simulator',
                'iPhone Simulator',
                'iPod Simulator',
                'iPad',
                'iPhone',
                'iPod',
                // @ts-ignore
            ].includes(navigator.platform) ||
            // iPad on iOS 13 detection
            (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
        );
    }

    if (walletConnectProvider instanceof WalletConnectProvider) {
        if (walletConnectProvider.connector.peerMeta?.url === 'https://trustwallet.com') {
            if (document.body.offsetWidth <= 768 && isIOS()) {
                //@ts-ignore
                window['IS_TRUST_WALLET_MOBILE'] = true;
            }
        }
    }

    return {
        accountAddress: accounts[0],
        chainId: walletConnectProvider.chainId,
        provider: new providers.Web3Provider(walletConnectProvider),
    };
};

export const connectWallet = async (
    walletProvider: WalletProviderType,
    onDisconnect: () => void,
    onAccountsChange: (accountAddresses: string[]) => void,
    onChainChange: (chainId: number) => void
): Promise<WalletInfo> => {
    switch (walletProvider) {
        case 'metamask':
            return connectWalletByMetamask(onDisconnect, onAccountsChange, onChainChange);
            break;
        case 'walletconnect':
            return connectWalletByWalletConnect(onDisconnect, onAccountsChange, onChainChange);
            break;
    }
    throw new Error('Unknown wallet provider');
};

const switchChainIdByMetamask = async (chainId: number): Promise<void> => {
    const ethereum = getMetamaskEthereum();
    const chainIdHex = numberToHex(chainId);

    if (!ethereum) {
        throw new Error('Metamask extension is not available');
    }

    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }],
        });
    } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4001) {
            throw new Error('Chain was not changed to Goerli network');
        } else if (switchError.code === 4902) {
            try {
                const addChainParam: AddEthereumChainParameter = {
                    chainId: chainIdHex,
                    rpcUrls: [RPC_MAP[chainId]],
                    chainName: `Network ${chainId}`,
                };
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [addChainParam],
                });
            } catch (addError) {
                throw new Error('Please switch your network to Goerli in your connected wallet.');
            }
            return;
        }
        throw switchError;
    }
};

const switchChainIdByWalletConnect = async (chainId: number, walletConnectProvider: WalletConnectProvider) => {
    const chainIdHex = numberToHex(chainId);

    if (walletConnectProvider.chainId !== chainId) {
        try {
            walletConnectProvider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: chainIdHex }],
            });
        } catch {
            throw new Error('Please switch your network to Goerli in your connected wallet.');
        }
    }
    return;
};

export function getWalletProviderType(blockchain: providers.Web3Provider) {
    return blockchain.provider instanceof WalletConnectProvider ? 'walletconnect' : 'metamask';
}

export const switchWalletToChainId = async (chainId: number, _provider?: providers.Web3Provider): Promise<void> => {
    const provider = _provider || walletState.provider;

    if (!provider) {
        return;
    }

    switch (getWalletProviderType(provider)) {
        case 'metamask':
            await switchChainIdByMetamask(chainId);
        case 'walletconnect':
            await switchChainIdByWalletConnect(chainId, provider.provider as WalletConnectProvider);
    }

    await sleep(1000);
};

export const disconnectWallet = async (): Promise<void> => {
    const provider = walletState.provider;
    if (provider?.provider instanceof WalletConnectProvider && provider.provider.connected) {
        await provider.provider.disconnect();
    }

    await getMetamaskEthereum()?.removeAllListeners?.();

    setWalletProviderStore(undefined);

    console.log('disconnect');
    //@ts-ignore
    window['IS_TRUST_WALLET_MOBILE'] = false;

    persistConnectedWalletType(undefined);
};

export function tryToReconnectWalletAtInit() {
    const previouslyConnectedWalletType = getConnectedWalletType();

    if (previouslyConnectedWalletType) {
        connectWalletAction({ walletProviderType: previouslyConnectedWalletType });
    } else {
        walletState.connectionLoading = false;
    }
}

export function getMessageFromEthersError(e: any): { message: string; shouldRetry: boolean; contractException?: boolean } {
    // console.log(JSON.stringify(e));

    console.log(e.code);
    if (e.code === 4001) {
        return { message: 'Transaction canceled', shouldRetry: false };
    } else if (e.code === 'ACTION_REJECTED') {
        return { message: 'Transaction canceled', shouldRetry: false };
    } else if (e.code === -32002) {
        return { message: 'Connect request already pending. Check your wallet', shouldRetry: false };
    } else if (e.code === 'CALL_EXCEPTION') {
        return { message: 'Something went wrong', shouldRetry: true };
    } else if (e.code === 'INSUFFICIENT_FUNDS') {
        return { message: 'Insufficient funds', shouldRetry: false };
    } else if (e.code === 'UNPREDICTABLE_GAS_LIMIT') {
        if (e.error?.data?.message) {
            return { message: e.error.data.message, shouldRetry: true, contractException: true };
        } else if (e.error?.message) {
            return { message: e.error.message, shouldRetry: true, contractException: true };
        } else if (e.message) {
            return { message: e.message, shouldRetry: true, contractException: true };
        }
    } else if (e.code === 'REPLACEMENT_UNDERPRICED') {
        return { message: 'Replacement transaction was underpriced. Please try again', shouldRetry: false };
    } else if (e.code === 'TRANSACTION_REPLACED') {
        return { message: 'Transaction was replaced. Please try again', shouldRetry: false };
    }
    if (e?.data?.message) {
        return { message: (e as { data: { message: string } })?.data?.message || 'Something went wrong', shouldRetry: true };
    }
    return { message: (e as { message: string })?.message || 'Something went wrong', shouldRetry: true };
}
