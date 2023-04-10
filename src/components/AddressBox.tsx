import { FiArrowUpRight } from '@react-icons/all-files/fi/FiArrowUpRight';
import { FiCopy } from '@react-icons/all-files/fi/FiCopy';
import Link from 'next/link';
import useCopy from '../hooks/useCopy';
import { formatAddress, HexStringType, makeScanUrl } from '../utils';
import InfoTooltip from './InfoTooltip';
import { Blockchain } from '../types';
import { blockchainData } from '../constants';

export default function AddressBox({
    hexString,
    type,
    label,
    tooltip,
    blockchain,
}: {
    hexString: string;
    type: HexStringType;
    blockchain: Blockchain;
    label?: string;
    tooltip?: string;
}) {
    const copy = useCopy();

    const _label: any = label && <span className="address-box__grey-text">{label}:</span>;

    return (
        <div className="address-box">
            {blockchainData[blockchain].icon()}
            <InfoTooltip tooltip={tooltip}>{_label}</InfoTooltip>
            <span className="address-box__address" onClick={() => copy(hexString)}>
                {formatAddress(hexString)}
            </span>
            <FiCopy className="address-box__copy-icon" onClick={() => copy(hexString)} />
            <div className="separator-vertical" />
            <Link href={makeScanUrl(type, hexString, blockchain)}>
                <a target={'_blank'} rel="norefferer" className="address-box__open-icon">
                    <FiArrowUpRight />
                </a>
            </Link>
        </div>
    );
}
