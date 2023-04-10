import { isMetamaskAvailable, WalletProviderType } from '../services/wallet';
import Image from 'next/image';
import { connectWalletAction } from '../services/walletActions';
import { setModal } from '../store';
import { FadeLoader } from 'react-spinners';

export default function TransactionLoadingModal() {
    return (
        <div className="transaction-loading-modal">
            <FadeLoader className="" color="var(--color-primary)" />
            <span className="transaction-loading-modal__title">Please wait</span>
            <span className="transaction-loading-modal__subtitle">Proccessing your transaction</span>
        </div>
    );
}
