import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import AddressBox from '../components/AddressBox';
import BtnPrimaryText from '../components/BtnPrimaryText';
import ConnectWalletModal from '../components/ConnectWalletModal';
import Switch from '../components/Switch';
import { ContractsListItem, getContractsList } from '../services/factory';
import { setModal, walletState } from '../store';

type Filter = 'All' | 'Only mine';

export default function Contracts() {
    const [filter, setFilter] = useState<Filter>(walletState.connectedWallet ? 'Only mine' : 'All');
    const [list, setList] = useState<ContractsListItem[]>();
    const wallet = useSnapshot(walletState);

    useEffect(() => {
        async function cb() {
            const contracts = await getContractsList(filter === 'Only mine' ? wallet.connectedWallet || '' : undefined);
            setList(contracts);
        }
        if (filter === 'Only mine' && !wallet.connectedWallet) {
            switchFilter();
        } else {
            cb();
        }
    }, [filter, wallet.connectedWallet]);

    // refactor above useEffect to use async/await

    useEffect(() => {
        setTimeout(() => {
            setFilter(walletState.connectedWallet ? 'Only mine' : 'All');
        }, 200);
    }, []);

    function switchFilter() {
        setFilter(filter === 'All' ? 'Only mine' : 'All');
    }

    // function which seraches images

    return (
        <div className="contracts">
            <div className="contracts__head">
                <h1 className="h1">List of existing contracts</h1>
                <div className="contracts__head__buttons">
                    <Link href={'/factory/new'}>
                        <BtnPrimaryText>Add</BtnPrimaryText>
                    </Link>
                    <Switch
                        onSwitch={() => {
                            if (!walletState.connectedWallet) {
                                setModal([
                                    'open',
                                    {
                                        title: 'Connect Your Wallet',
                                        content: (props) => <ConnectWalletModal {...props} afterConnect={switchFilter} />,
                                    },
                                ]);
                            } else {
                                switchFilter();
                            }
                        }}
                        selectedTab={filter}
                        tabs={['All', 'Only mine']}
                    />
                </div>
            </div>
            <div className="contracts__table">
                <div className="contracts__sorting-row">
                    <div className="contracts__field-name">Name</div>
                    <div className="contracts__field-contract-address">Address</div>
                    <div className="contracts__field-owner">Owner</div>
                    <div className="contracts__field-type">Type</div>
                </div>
                <motion.div layout="position" className="contracts__list">
                    {list?.map(({ name, contractAddress, owner, type, blockchain }, i) => (
                        <Link
                            href={
                                type === 'Valve'
                                    ? `/valve/${blockchain}/${contractAddress}`
                                    : type === 'Waterfall'
                                    ? `/waterfall/${blockchain}/${contractAddress}`
                                    : `/prepayment/${blockchain}/${contractAddress}`
                            }
                            key={contractAddress}
                        >
                            <motion.div
                                key={contractAddress}
                                animate={{ opacity: 1, scale: 1 }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                className="contracts__item"
                            >
                                <div className="contracts__field-name">{name}</div>
                                <div onClick={(e) => e.stopPropagation()} className="contracts__field-contract-address">
                                    <AddressBox blockchain={blockchain} hexString={contractAddress} type="address" />
                                </div>
                                <div onClick={(e) => e.stopPropagation()} className="contracts__field-owner">
                                    <AddressBox blockchain={blockchain} hexString={owner} type="address" />
                                </div>
                                <div className="contracts__field-type text--fat">{type}</div>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
