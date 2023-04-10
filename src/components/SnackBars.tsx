import CircleLoader from 'react-spinners/CircleLoader';
import { MdClose } from '@react-icons/all-files/md/MdClose';
import { IoMdClose } from '@react-icons/all-files/io/IoMdClose';
import { ImCheckmark } from '@react-icons/all-files/im/ImCheckmark';
import { BsInfo } from '@react-icons/all-files/bs/BsInfo';
import { MdOpenInNew } from '@react-icons/all-files/md/MdOpenInNew';
import { providers } from 'ethers';
import { useEffect } from 'react';
import { swap } from '@dbeining/react-atom';
import { ToastContainer, toast, Id, TypeOptions, ToastOptions } from 'react-toastify';

export default function Snackbar() {
    return (
        <ToastContainer
            toastClassName={(context) => {
                if (context && context.type) {
                    switch (context.type) {
                        case 'success':
                            return 'snackbar__variant-success';
                        case 'error':
                            return 'snackbar__variant-error';
                        case 'info':
                            return 'snackbar__variant-info';
                        case 'warning':
                            return 'snackbar__variant-warning';
                        default:
                            return '';
                    }
                }
                return '';
            }}
            icon={false}
            hideProgressBar
            position="bottom-left"
        />
    );
}

export function Close({ close }: { close: () => void }) {
    return (
        <div className={'snackbar__close'} onClick={close}>
            <MdClose size={24} />
        </div>
    );
}

export function LoadingSnack({ title = 'Loading', subtitle }: { title?: string; subtitle?: React.ReactNode }) {
    return (
        <SnackSimple title={title} subtitle={subtitle} icon={<CircleLoader style={{ display: 'block' }} color="#fff" size={'20px'} />} />
    );
}

export function SnackSimple({ title, subtitle, icon }: { title: React.ReactNode; subtitle?: React.ReactNode; icon?: React.ReactNode }) {
    return (
        <div className="snackbar__content">
            {icon ? <div style={{ display: 'flex' }}>{icon}</div> : null}
            <div className="snackbar__content__left">
                <span style={{ textAlign: 'left' }} className="text--fat" color="#fff">
                    {title}
                </span>
                {subtitle ? <span style={{ textAlign: 'left' }}>{subtitle}</span> : null}
            </div>
        </div>
    );
}

export function OpenTrustWallet({ message, provider }: { message: string; provider: providers.ExternalProvider }) {
    let button = null;

    // const url = `https://link.trustwallet.com/wc?uri=${provider.wc.session.peerId}&bridge=${provider.wc.bridge}&key=${provider.wc.key}`;
    //@ts-ignore
    if (window['IS_TRUST_WALLET_MOBILE']) {
        button = (
            <button
                className={'btn'}
                onClick={() => {
                    window.open('https://link.trustwallet.com', '_blank');
                }}
            >
                <span>Check your wallet for incoming transaction</span>
            </button>
        );
    } else if (!provider.isMetaMask) {
        button = <span>Check your wallet for incoming transaction</span>;
    }

    return <LoadingSnack title={message} subtitle={button} />;
}

export function throwTransactionPendingSnack(message: string, provider: providers.ExternalProvider, snacksToClose?: Id[]) {
    closeSnacks(snacksToClose);

    const mess = <OpenTrustWallet message={message} provider={provider} />;
    const options: ToastOptions = {
        type: 'info',
        autoClose: false,
    };

    return toast(mess, options);
}

export function throwTransactionInProgressSnack(message: string, subtitle?: string, snacksToClose?: Id[]): Id {
    closeSnacks(snacksToClose);

    const mess = (
        <LoadingSnack
            title={message}
            subtitle={
                subtitle || (
                    <>
                        This may take a while <br />
                        depending on network conditions
                    </>
                )
            }
        />
    );

    return toast(mess, {
        type: 'info',
        autoClose: false,
    });
}

export function throwSuccessTxSnack(message: React.ReactNode, txHash?: string, options?: ToastOptions, snacksToClose?: Id[]) {
    closeSnacks(snacksToClose);

    return throwSnack(
        'success',
        message,
        <>
            {txHash ? (
                <a
                    href={`https://polygonscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'underline', color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}
                >
                    <MdOpenInNew /> View on polygonscan
                </a>
            ) : null}
        </>,
        options
    );
}

export function closeSnacks(snacksToClose?: Id[]) {
    if (!snacksToClose) {
    } else if (snacksToClose.length === 0) {
        toast.dismiss();
    } else {
        snacksToClose.forEach((item) => {
            toast.dismiss(item);
        });
    }
}

export function throwSnack(
    type: TypeOptions,
    message: React.ReactNode,
    subtitle?: React.ReactNode,
    options?: ToastOptions | undefined,
    snacksToClose?: Id[]
) {
    closeSnacks(snacksToClose);

    function getIcon() {
        return type === 'error' ? (
            <IoMdClose color="#fff" size={24} />
        ) : type === 'success' ? (
            <ImCheckmark color="#fff" size={'20px'} />
        ) : type === 'info' ? (
            <BsInfo color="#000" size={24} />
        ) : null;
    }

    const mess = <SnackSimple title={message} subtitle={subtitle} icon={getIcon()} />;

    return toast(mess, { type, ...options });
}
