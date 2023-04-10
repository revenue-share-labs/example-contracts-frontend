import { throwSnack } from '../components/SnackBars';
import { setWalletProviderStore, walletState } from '../store';
import { formatAddress } from '../utils';
import { connectWallet, disconnectWallet, getMessageFromEthersError, persistConnectedWalletType, WalletProviderType } from './wallet';

export type ConnectWalletActionPayload = {
    walletType: WalletProviderType;
    balance: string;
    lpBalance: string;
    accountAddress: string;
    chainId: number;
};

export const connectWalletAction = async ({ walletProviderType }: { walletProviderType: WalletProviderType }) => {
    walletState.connectionLoading = true;
    try {
        const throwDisconnectedSnack = () => throwSnack('info', 'Wallet disconnected', undefined, { autoClose: 1000 });
        const { provider, ...connectResult } = await connectWallet(
            walletProviderType,
            () => {
                disconnectWallet();
                throwDisconnectedSnack();
            },
            async (accountAddresses) => {
                const addressToBeSet = accountAddresses[0];

                if (!addressToBeSet) {
                    disconnectWallet();
                    throwDisconnectedSnack();

                    return;
                } else {
                    walletState.connectedWallet = addressToBeSet;
                    throwSnack('info', `Wallet changed to ${formatAddress(addressToBeSet)}`);
                }
            },
            async (chainId) => {
                // TODO chain changed
                await disconnectWallet();
                await connectWalletAction({ walletProviderType });
                walletState.chainId = chainId;
            }
        );

        setWalletProviderStore(provider);

        // await switchWalletToChainId(CHAIN_ID, provider);

        persistConnectedWalletType(walletProviderType);

        walletState.connectionLoading = false;
        walletState.chainId = (await provider.getNetwork()).chainId;

        return {
            ...connectResult,
            walletProviderType,
        };
    } catch (err: any) {
        walletState.connectionLoading = false;
        console.error(err);
        const message = getMessageFromEthersError(err).message;
        throwSnack('error', message);
        return Promise.reject();
    }
};
