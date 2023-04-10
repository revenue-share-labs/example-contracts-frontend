import { TOKENS_ADDRESSES, blockchainData } from '../constants';
import { setModal, walletState } from '../store';
import { RPC_MAP, switchWalletToChainId } from './wallet';
import { closeSnacks, throwSnack } from '../components/SnackBars';
import ConnectWalletModal from '../components/ConnectWalletModal';
import { providers } from 'ethers';
import BigNumber from 'bignumber.js';
import { ERC20__factory } from '../generated';
import { Variants } from 'framer-motion';
import { Blockchain } from '../types';

export type PartialProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export async function makeSureTheChainIsCorrect(chainId: number) {
    if (!walletState.provider) {
        throw new Error('Wallet not connected');
    }
    if (walletState.chainId !== chainId) {
        const switchSnack = throwSnack('warning', 'Please switch your network to Polygon in your connected wallet.');
        try {
            await switchWalletToChainId(chainId);
        } catch (e: any) {
            throwSnack('error', e.message);

            throw e;
        } finally {
            closeSnacks([switchSnack]);
        }
    }
}

export async function makeSureWalletIsConnected() {
    if (walletState.provider && walletState.connectedWallet) {
        return Promise.resolve();
    } else {
        return new Promise<void>((resolve, reject) => {
            setModal([
                'open',
                {
                    title: 'Connect Your Wallet',
                    content: () => (
                        <ConnectWalletModal
                            afterConnect={() => {
                                resolve();
                            }}
                            onError={reject}
                        />
                    ),
                },
            ]);
        });
    }
}

export function getRpcProvider(blockchain: Blockchain) {
    return new providers.JsonRpcProvider(RPC_MAP[blockchainData[blockchain].chainId]);
}

export async function getBalance(address: string, blockchain: Blockchain) {
    const provider = getRpcProvider(blockchain);

    return new BigNumber((await provider.getBalance(address)).toString());
}

export type TokenBalances = { busd: BigNumber; usdc: BigNumber; usdt: BigNumber; eth: BigNumber };
export type Tokens = keyof TokenBalances;
export const erc20tokensNames: Exclude<Tokens, 'eth'>[] = ['usdt', 'usdc', 'busd'];

export async function getTokenBalances(address: string, blockchain: Blockchain): Promise<TokenBalances> {
    const ethBalance = await getBalance(address, blockchain);
    const { busd, usdc, usdt } = TOKENS_ADDRESSES[blockchainData[blockchain].chainId];

    const provider = getRpcProvider(blockchain);

    const [busdBalance, usdcBalance, usdtBalance] = await Promise.all(
        [busd, usdc, usdt].map(async (tokenAddress, i) => {
            const tokenContract = ERC20__factory.connect(tokenAddress, provider);
            const balance = new BigNumber((await tokenContract.balanceOf(address)).toString());

            return balance;
        })
    );

    return { busd: busdBalance, usdc: usdcBalance, usdt: usdtBalance, eth: ethBalance };
}

// export function devOnlyStaticProps() {
//     // const isProd = Boolean(Number(process.env.IS_PROD));
//     if (IS_PROD) {
//         return {
//             // returns the default 404 page with a status code of 404
//             notFound: true,
//         };
//     }
//     return { props: {} };
// }

export const commonParentAppearVariants: Variants = {
    open: {
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.1,
        },
    },
    closed: {},
};

export const commonAppearVariants: Variants = {
    open: {
        opacity: 1,
        translateY: '0px',
    },
    closed: {
        opacity: 0,
        translateY: '10px',
    },
};

export async function beforeTx(blockchain: Blockchain) {
    await makeSureWalletIsConnected();

    try {
        await makeSureTheChainIsCorrect(blockchainData[blockchain].chainId);
    } catch {
        throw new Error();
    }

    const { provider, connectedWallet } = walletState;

    if (!provider || !connectedWallet) {
        throw new Error();
    }

    return { provider, connectedWallet };
}

export function validateBlockchainIDString(blockchain?: string): blockchain is Blockchain {
    return (blockchain as Blockchain) === 'POLYGON' || (blockchain as Blockchain) === 'ETH';
}
