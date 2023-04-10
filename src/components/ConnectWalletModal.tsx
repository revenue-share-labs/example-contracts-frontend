import { isMetamaskAvailable, WalletProviderType } from '../services/wallet';
import Image from 'next/image';
import { connectWalletAction } from '../services/walletActions';
import { setModal } from '../store';
import { motion, Variants } from 'framer-motion';
import { throwSnack } from './SnackBars';
import { PUBLIC_BASE_PATH } from '../utils';

const itemVariants: Variants = {
    open: {
        opacity: 1,
        translateY: '0rem',
        transition: {
            opacity: {
                type: 'tween',
                duration: 0.3,
                ease: 'linear',
            },
            translateY: {
                type: 'tween',
                // stiffness: 10,
                // damping: 100,
                // restDelta: 0,
                duration: 0.3,
                ease: 'easeOut',
            },
        },
    },
    closed: {
        opacity: 0,
        translateY: '10rem',
    },
};

export default function ConnectWalletModal({ afterConnect, onError }: { afterConnect?: () => void; onError?: () => void }) {
    async function handleSubmit(walletProvider: WalletProviderType) {
        try {
            setModal(['closed']);
            await connectWalletAction({ walletProviderType: walletProvider });
            throwSnack('success', 'Wallet connected', undefined, { autoClose: 1000 });
            afterConnect?.();
        } catch {
            onError?.();
        }
    }

    return (
        <div className="connect-wallet-modal">
            <span className="connect-wallet-modal__title">Connect your wallet</span>

            <motion.div
                variants={{
                    open: {
                        // opacity: 1,
                        transition: {
                            delayChildren: 0.1,
                            staggerChildren: 0.1,
                            // delay: 1,
                        },
                    },
                    closed: {
                        // opacity: 0,
                    },
                }}
                // initial="hidden"
                // animate="show"
                className="connect-wallet-modal__buttons"
            >
                {isMetamaskAvailable() ? (
                    <motion.button variants={itemVariants} onClick={() => handleSubmit('metamask')}>
                        <Image src={`${PUBLIC_BASE_PATH}/img/icon_metamask.svg`} alt="Metamask" layout="fixed" height={26} width={26} />
                        Metamask
                    </motion.button>
                ) : null}
                <motion.button variants={itemVariants} onClick={() => handleSubmit('walletconnect')}>
                    <Image
                        src={`${PUBLIC_BASE_PATH}/img/icon_walletconnect.png`}
                        alt="WalletConnect"
                        layout="fixed"
                        height={26}
                        width={26}
                    />
                    WalletConnect
                </motion.button>
            </motion.div>
        </div>
    );
}
