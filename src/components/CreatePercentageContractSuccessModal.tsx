import { IoCheckmark } from '@react-icons/all-files/io5/IoCheckmark';
import AddressBox from './AddressBox';
import Link from 'next/link';
import BtnPrimaryText from './BtnPrimaryText';
import BtnPrimary from './BtnPrimary';
import { Blockchain } from '../types';

export default function CreateValveContractSuccessModal({
    transactionHash,
    contractAddress,
    onClose,
    onAddAnother,
    contractType,
    blockchain,
}: {
    transactionHash: string;
    contractAddress: string;
    onClose: () => void;
    onAddAnother: () => void;
    contractType: 'valve' | 'prepayment' | 'waterfall';
    blockchain: Blockchain;
}) {
    return (
        <div className="add-affiliate-modal">
            <IoCheckmark className="add-affiliate-modal__icon" size={'7rem'} />
            <span className="transaction-loading-modal__subtitle">Contract created successfully</span>

            <AddressBox blockchain={blockchain} label="Contract" type="address" hexString={contractAddress} />

            <div className="separator" />
            <AddressBox blockchain={blockchain} label="Transaction" hexString={transactionHash} type="tx" />

            <div className="add-affiliate-modal__buttons">
                <BtnPrimaryText
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => {
                        onClose();
                        onAddAnother();
                    }}
                >
                    Add Another
                </BtnPrimaryText>

                <Link
                    href={
                        contractType === 'valve'
                            ? `/valve/${blockchain}/${contractAddress}`
                            : contractType === 'waterfall'
                            ? `/waterfall/${blockchain}/${contractAddress}`
                            : `/prepayment/${blockchain}/${contractAddress}`
                    }
                >
                    <BtnPrimary onClick={onClose}>Contract dashboard</BtnPrimary>
                </Link>
            </div>
        </div>
    );
}
