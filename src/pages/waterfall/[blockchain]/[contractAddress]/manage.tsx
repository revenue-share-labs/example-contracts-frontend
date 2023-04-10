import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AddressBox from '../../../../components/AddressBox';
import { BtnBlack } from '../../../../components/BtnPrimaryText';
import { WaterfallRecipientChangedType, WaterfallManageContent } from '../../../../components/ValveManageTable';
import { WaterfallRecipientType, getWaterfallManageData, setWaterfallRecipients } from '../../../../services/valveAndPrepayment';
import { getTitle } from '../../../../utils';
import { validateBlockchainIDString } from '../../../../services/common';

export default function WaterfallManage() {
    const router = useRouter();
    const contractAddress = router.query.contractAddress as string | undefined;

    const blockchain = router.query.blockchain as string | undefined;
    const blockchainIsValid = validateBlockchainIDString(blockchain);

    const [items, setItems] = useState<WaterfallRecipientType[]>([]);
    const [name, setName] = useState<string>('');
    const [useUsd, setUseUsd] = useState<boolean>(false);

    useEffect(() => {
        if (contractAddress && blockchainIsValid) {
            getWaterfallManageData(contractAddress, blockchain).then((res) => {
                setItems(res.recipients);
                setName(res.name);
                setUseUsd(res.currency === 'USD');
            });
        }
    }, [contractAddress, blockchainIsValid]);

    async function submit(changed: WaterfallRecipientChangedType[]) {
        if (contractAddress && blockchainIsValid) {
            if (await setWaterfallRecipients(contractAddress, changed, blockchain)) {
                router.push(`/waterfall/${contractAddress}`);
            }
        }
    }

    if (!blockchainIsValid) return null;

    return (
        <div className="valve-manage">
            <Head>
                <title>{getTitle('Manage Valve contract')}</title>
            </Head>
            <div className="valve-manage__left">
                <div className="valve-manage__head">
                    <h1 className="valve-manage__title">Manage {name}</h1>
                </div>
                <div className="valve-manage__left__content">
                    {contractAddress && <AddressBox blockchain={blockchain} type="address" hexString={contractAddress} label="Contract" />}
                    <Link href={`/waterfall/${blockchain}/${contractAddress}`}>
                        <BtnBlack style={{ alignSelf: 'flex-end' }} className="btn--wider only--desktop-sm--down">
                            Cancel managing
                        </BtnBlack>
                    </Link>
                </div>
            </div>
            <div className="valve-manage__right">
                <Link href={`/waterfall/${blockchain}/${contractAddress}`}>
                    <BtnBlack style={{ alignSelf: 'flex-end' }} className="btn--wider only--desktop-sm--up">
                        Cancel managing
                    </BtnBlack>
                </Link>
                <WaterfallManageContent
                    blockchain={blockchain}
                    useUsd={useUsd}
                    items={items}
                    onSubmit={submit}
                    saveButtonLabel={'Save Changes'}
                />
            </div>
        </div>
    );
}
