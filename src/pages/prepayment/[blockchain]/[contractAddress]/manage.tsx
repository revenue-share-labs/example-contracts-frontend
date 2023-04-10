import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AddressBox from '../../../../components/AddressBox';
import { BtnBlack } from '../../../../components/BtnPrimaryText';
import { ValveManageContent, RecipientChangedType } from '../../../../components/ValveManageTable';
import { RecipientType, getPrepaymentManageData, setRecipients } from '../../../../services/valveAndPrepayment';
import { getTitle } from '../../../../utils';
import { validateBlockchainIDString } from '../../../../services/common';

export default function PrepaymentManage() {
    const router = useRouter();
    const contractAddress = router.query.contractAddress as string | undefined;
    const blockchain = router.query.blockchain as string | undefined;

    const blockchainIsValid = validateBlockchainIDString(blockchain);

    const [items, setItems] = useState<RecipientType[]>([]);
    const [name, setName] = useState<string>('');

    useEffect(() => {
        if (contractAddress && blockchainIsValid) {
            getPrepaymentManageData(contractAddress, blockchain).then((res) => {
                setItems(res.recipients);
                setName(res.name);
            });
        }
    }, [contractAddress, blockchainIsValid]);

    async function submit(changed: RecipientChangedType[]) {
        if (contractAddress && blockchainIsValid) {
            if (await setRecipients(contractAddress, changed, blockchain)) {
                router.push(`/prepayment/${contractAddress}`);
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
                    <Link href={`/prepayment/${blockchain}/${contractAddress}`}>
                        <BtnBlack style={{ alignSelf: 'flex-end' }} className="btn--wider only--desktop-sm--down">
                            Cancel managing
                        </BtnBlack>
                    </Link>
                </div>
            </div>
            <div className="valve-manage__right">
                <Link href={`/prepayment/${blockchain}/${contractAddress}`}>
                    <BtnBlack style={{ alignSelf: 'flex-end' }} className="btn--wider only--desktop-sm--up">
                        Cancel managing
                    </BtnBlack>
                </Link>
                <ValveManageContent blockchain={blockchain} items={items} onSubmit={submit} saveButtonLabel={'Save Changes'} />
            </div>
        </div>
    );
}
