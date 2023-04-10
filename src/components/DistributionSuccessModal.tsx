import { IoCheckmark } from '@react-icons/all-files/io5/IoCheckmark';
import AddressBox from './AddressBox';
import { Blockchain } from '../types';

export default function DistributionSuccessModal({
    transactionHash,
    onClose,
    blockchain,
}: {
    transactionHash: string;
    onClose: () => void;
    blockchain: Blockchain;
}) {
    return (
        <div className="add-affiliate-modal">
            <IoCheckmark className="add-affiliate-modal__icon" size={'7rem'} />
            <span className="transaction-loading-modal__subtitle">Funds distributed</span>
            {/* <span className="text--grey text--align-center">Changes will be visible in the dashboard within a minute</span> */}

            <div className="separator" />
            <div style={{ alignSelf: 'center' }}>
                <AddressBox blockchain={blockchain} label="Transaction" hexString={transactionHash} type="tx" />
            </div>

            <button onClick={onClose} className="btn--primary">
                Close
            </button>
        </div>
    );
}
