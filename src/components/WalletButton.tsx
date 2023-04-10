import { useSnapshot } from 'valtio';
import { disconnectWallet } from '../services/wallet';
import { setModal, walletState } from '../store';
import { formatAddress } from '../utils';
import BtnPrimary from './BtnPrimary';
import { BtnBlack } from './BtnPrimaryText';
import ConnectWalletModal from './ConnectWalletModal';
import { throwSnack } from './SnackBars';
// import LoadingIndicator from './Loading';

export default function WalletButton() {
    const snap = useSnapshot(walletState);

    const isConnected = !!snap.connectedWallet;

    if (snap.connectionLoading) {
        return null;
        // return (
        //     <div className="btn--primary">
        //         <LoadingIndicator />
        //     </div>
        // );
    }

    if (!isConnected) {
        return (
            <BtnPrimary
                className="wallet-btn"
                onClick={() => {
                    setModal(['open', { title: 'Connect Your Wallet', content: () => <ConnectWalletModal /> }]);
                }}
            >
                Connect Wallet
            </BtnPrimary>
        );
    }

    return (
        <>
            <div className="box--light btn-padding wallet-btn">{formatAddress(snap.connectedWallet)}</div>
            <BtnBlack
                onClick={() => {
                    disconnectWallet();
                    throwSnack('info', 'Wallet disconnected', undefined, { autoClose: 1000 });
                }}
            >
                Disconnect
            </BtnBlack>
        </>
    );
}
