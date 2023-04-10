import { FiCopy } from '@react-icons/all-files/fi/FiCopy';
import Link from 'next/link';
import useCopy from '../hooks/useCopy';

export default function CopyableLinkBox({ url, children, style }: { url: string; children?: string; style?: React.CSSProperties }) {
    const copy = useCopy();

    return (
        <div className="address-box" style={style}>
            <Link href={url}>
                <a
                    // data-content-start={(children || url).slice(0, -4)}
                    // data-content-end={(children || url).slice(-4)}
                    target={'_blank'}
                    rel="norefferer"
                    className="address-box__address"
                >
                    {children || url}
                </a>
            </Link>
            <FiCopy
                className="address-box__copy-icon"
                onClick={(e) => {
                    e.stopPropagation();
                    copy(url);
                }}
            />
        </div>
    );
}
