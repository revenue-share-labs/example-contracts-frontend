import { MdClose } from '@react-icons/all-files/md/MdClose';
import BigNumber from 'bignumber.js';
import { AnimatePresence, Reorder, motion } from 'framer-motion';
import produce from 'immer';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { RecipientType, WaterfallRecipientType, areWaterfallRecipientsValid } from '../services/valveAndPrepayment';
import { makeScanUrl, formatAddress } from '../utils';
import CopyableLinkBox from './CopyableLinkBox';
import InputWithLabel from './InputWithLabel';
import LoadingIndicator from './Loading';
import { isAddress } from 'ethers/lib/utils';
import PercentageInput from './PercentageInput';
import BtnPrimaryText, { BtnBlack } from './BtnPrimaryText';
import BtnPrimary from './BtnPrimary';
import { MdDragHandle } from '@react-icons/all-files/md/MdDragHandle';
import NumberInput from './NumberInput';
import { IoChevronDown } from '@react-icons/all-files/io5/IoChevronDown';
import { IoChevronUp } from '@react-icons/all-files/io5/IoChevronUp';
import { AiFillLock } from '@react-icons/all-files/ai/AiFillLock';
import { Blockchain } from '../types';
import { blockchainData } from '../constants';
import useOnce from '../hooks/useOnce';

export type RecipientChangedType = RecipientType & { isNew?: boolean; tempId?: number };
export type WaterfallRecipientChangedType = WaterfallRecipientType & { isNew?: boolean; tempId?: number };

export function getItemsData(items: RecipientType[]) {
    return items.reduce(
        (acc, item) => {
            const totalAll = acc.totalAll.plus(item.percentage);
            if (item.address && isAddress(item.address) && item.name) {
                return { ...acc, totalValid: acc.totalValid.plus(item.percentage), totalAll };
            } else {
                return { ...acc, totalAll };
            }
        },
        { totalValid: BigNumber(0), totalAll: BigNumber(0) }
    );
}

export function RecipientsManageButtons({
    items,
    setItems,
}: {
    items: RecipientChangedType[];
    setItems: (items: RecipientChangedType[]) => void;
}) {
    const { totalAll } = getItemsData(items);

    return (
        <>
            <BtnPrimaryText
                onClick={() =>
                    setItems([...items, { isNew: true, address: '', percentage: BigNumber(20), tempId: Math.random(), name: '' }])
                }
            >
                Add recipient
            </BtnPrimaryText>
            <BtnPrimaryText
                disabled={totalAll.eq(100) || !items.length}
                className="btn--black-primary-text"
                style={{ flexBasis: 0 }}
                onClick={() => {
                    setItems(
                        produce(items, (mutable) => {
                            const remaining = BigNumber(100).minus(totalAll);

                            let _total = BigNumber(0);
                            mutable.forEach((item) => {
                                item.percentage = item.percentage.plus(remaining.div(items.length));
                                _total = _total.plus(item.percentage as BigNumber);
                            });

                            if (_total.gt(100)) {
                                mutable[mutable.length - 1].percentage = mutable[mutable.length - 1].percentage.minus(_total.minus(100));
                            } else if (_total.lt(100)) {
                                mutable[mutable.length - 1].percentage = mutable[mutable.length - 1].percentage.plus(
                                    BigNumber(100).minus(_total)
                                );
                            }
                        })
                    );
                }}
            >
                {totalAll.gt(100) ? 'Fit excess' : 'Split remaining'}
            </BtnPrimaryText>
            <BtnPrimaryText
                disabled={totalAll.eq(100) || !items.length}
                style={{ flexBasis: 0 }}
                onClick={() => {
                    setItems(
                        produce(items, (mutable) => {
                            const split = BigNumber(100).div(items.length);
                            let _total = BigNumber(0);
                            mutable.forEach((item) => {
                                item.percentage = split;
                                _total = _total.plus(split);
                            });

                            if (_total.gt(100)) {
                                mutable[mutable.length - 1].percentage = mutable[mutable.length - 1].percentage.minus(_total.minus(100));
                            } else if (_total.lt(100)) {
                                mutable[mutable.length - 1].percentage = mutable[mutable.length - 1].percentage.plus(
                                    BigNumber(100).minus(_total)
                                );
                            }
                        })
                    );
                }}
            >
                Split Evenly
            </BtnPrimaryText>
        </>
    );
}

export function WaterfallRecipientsManageButtons({
    items,
    setItems,
}: {
    items: WaterfallRecipientChangedType[];
    setItems: (items: WaterfallRecipientChangedType[]) => void;
}) {
    return (
        <>
            <BtnPrimaryText
                onClick={() => {
                    const increasedPriorities = items
                        .filter((item) => !item.locked)
                        .map((item) => {
                            return { ...item, priority: Number(item.priority) + 1 };
                        });

                    const minPriority = increasedPriorities.reduce(
                        (acc, item) => (Number(item.priority) < acc ? Number(item.priority) : acc),
                        10_000
                    );

                    const newItems = [
                        ...increasedPriorities,
                        {
                            isNew: true,
                            address: '',
                            maxCap: BigNumber(0),
                            tempId: Math.random(),
                            name: '',
                            priority: minPriority - 1,
                            locked: false,
                        },
                    ];
                    setItems(newItems);
                }}
            >
                Add recipient
            </BtnPrimaryText>
        </>
    );
}

export function ValveManageContent({
    items,
    onSubmit,
    saveButtonLabel,
    onBack,
    blockchain,
}: {
    items: RecipientType[];
    onSubmit: (recipients: RecipientChangedType[]) => void;
    saveButtonLabel: string;
    onBack?: () => void;
    blockchain: Blockchain;
}) {
    const [changed, setChanged] = useState<RecipientChangedType[]>(items);

    useEffect(() => {
        setChanged(items);
    }, [items]);

    const { totalValid, totalAll } = getItemsData(items);

    const totalIs100 = totalValid.eq(100);

    const isValid = totalIs100;

    return (
        <>
            <ValveRecipientsTableWithInfo blockchain={blockchain} items={changed} setItems={setChanged} />
            <div className="valve-manage__recipients__buttons">
                {onBack && <BtnBlack onClick={onBack}>Back</BtnBlack>}
                <RecipientsManageButtons items={changed} setItems={setChanged} />
                <BtnPrimary disabled={!isValid} className="btn--wider" onClick={() => onSubmit(changed)}>
                    {saveButtonLabel}
                </BtnPrimary>
            </div>
        </>
    );
}

export function WaterfallManageContent({
    items,
    onSubmit,
    saveButtonLabel,
    onBack,
    useUsd,
    blockchain,
}: {
    items: WaterfallRecipientType[];
    onSubmit: (recipients: WaterfallRecipientChangedType[]) => void;
    saveButtonLabel: string;
    onBack?: () => void;
    useUsd: boolean;
    blockchain: Blockchain;
}) {
    const [changed, setChanged] = useState<WaterfallRecipientChangedType[]>(items);

    useEffect(() => {
        setChanged(items);
    }, [items]);

    return (
        <>
            <WaterfallRecipientsTable blockchain={blockchain} useUsd={useUsd} items={changed} setItems={setChanged} />
            <div className="valve-manage__recipients__buttons">
                {onBack && <BtnBlack onClick={onBack}>Back</BtnBlack>}
                <WaterfallRecipientsManageButtons items={changed} setItems={setChanged} />
                <BtnPrimary
                    disabled={!areWaterfallRecipientsValid(changed)}
                    className="btn--wider"
                    onClick={() => {
                        onSubmit(changed);
                    }}
                >
                    {saveButtonLabel}
                </BtnPrimary>
            </div>
        </>
    );
}

export function ValveRecipientsTableWithInfo({
    items,
    setItems,
    blockchain,
}: {
    items: RecipientChangedType[];
    setItems: (items: RecipientChangedType[]) => void;
    blockchain: Blockchain;
}) {
    const { totalValid, totalAll } = getItemsData(items);

    const totalIs100 = totalValid.eq(100);

    return (
        <>
            <span className={`text--align-center ${!totalIs100 ? 'text--error' : ''}`}>
                Total: <span className="text-primary-gradient">{totalValid.toString()}%</span> / 100%
            </span>
            <span
                style={totalIs100 ? { visibility: 'hidden' } : { transition: 'all 0.5s' }}
                className="text--align-center text--small text--error"
            >
                Please make sure all shares add up to 100%
            </span>
            <div className={`valve-manage__bottom-line ${!totalIs100 ? '--error' : ''}`}>
                <div style={{ width: `${totalValid.toString()}%` }}></div>
            </div>
            <ValveRecipientsTable blockchain={blockchain} items={items} setItems={setItems} />
        </>
    );
}

export default function ValveRecipientsTable({
    items,
    setItems,
    blockchain,
}: {
    items: RecipientChangedType[];
    setItems: (items: RecipientChangedType[]) => void;
    blockchain: Blockchain;
}) {
    const isDesktop = useMediaQuery('(min-width: 1100px)');
    const isTablet = useMediaQuery('(min-width: 800px)');
    const isBigPhone = useMediaQuery('(min-width: 420px)');

    return (
        <>
            <div className="valve-manage__recipients">
                <AnimatePresence>
                    {items ? (
                        items.map(({ percentage, address, isNew, tempId, name }, i) => {
                            return (
                                <motion.div
                                    animate={{ opacity: 1, scale: 1 }}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="valve-manage__recipient"
                                    key={isNew ? tempId : address}
                                >
                                    <div className="valve-manage__recipient__first-part">
                                        <PercentageInput
                                            onChange={(val) => {
                                                setItems(
                                                    produce(items, (mutable) => {
                                                        mutable[i].percentage = val;
                                                    })
                                                );
                                            }}
                                            percentage={BigNumber(percentage)}
                                        />
                                    </div>
                                    <div className="separator-vertical" />
                                    {isNew ? (
                                        <div className="valve-manage__recipient__input-part">
                                            <InputWithLabel
                                                // lighter
                                                label="Name"
                                                style={{
                                                    border: !name ? '1px solid var(--color-error)' : undefined,
                                                }}
                                                input={(props) => (
                                                    <input
                                                        {...props}
                                                        value={name}
                                                        className="input-white-transparent"
                                                        style={{ textTransform: 'initial' }}
                                                        onChange={(e) => {
                                                            setItems(
                                                                produce(items, (mutable) => {
                                                                    mutable[i].name = e.target.value;
                                                                })
                                                            );
                                                        }}
                                                    />
                                                )}
                                            />
                                            <InputWithLabel
                                                // lighter
                                                label="Address"
                                                style={{
                                                    border: !isAddress(address) ? '1px solid var(--color-error)' : undefined,
                                                    height: 'unset',
                                                }}
                                                error={address && !isAddress(address) ? 'Invalid address' : undefined}
                                                input={(props) => (
                                                    <input
                                                        {...props}
                                                        value={address}
                                                        className="valve-manage__recipient__input-part__address-input"
                                                        onChange={(e) => {
                                                            setItems(
                                                                produce(items, (mutable) => {
                                                                    mutable[i].address = e.target.value;
                                                                })
                                                            );
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    ) : (
                                        <div className="valve-manage__recipient__address-part">
                                            <InputWithLabel
                                                // lighter
                                                input={(props) => (
                                                    <input
                                                        {...props}
                                                        value={name}
                                                        style={{ textTransform: 'initial' }}
                                                        className="input-white-transparent"
                                                        onChange={(e) => {
                                                            setItems(
                                                                produce(items, (mutable) => {
                                                                    mutable[i].name = e.target.value;
                                                                })
                                                            );
                                                        }}
                                                    />
                                                )}
                                            />
                                            {/* <input value={name} className="input-white-transparent" /> */}
                                            {/* <span className="valve-manage__recipient__address-part__name">{name}</span> */}
                                            <CopyableLinkBox url={makeScanUrl('address', address, blockchain)}>
                                                {isDesktop
                                                    ? address
                                                    : isTablet
                                                    ? formatAddress(address, 10, 10)
                                                    : isBigPhone
                                                    ? formatAddress(address, 7, 7)
                                                    : formatAddress(address, 5, 2)}
                                                {/* {address} */}
                                            </CopyableLinkBox>
                                        </div>
                                    )}
                                    <BtnPrimaryText
                                        onClick={() => {
                                            const newItems = [...items];
                                            newItems.splice(i, 1);
                                            setItems(newItems);
                                        }}
                                        className="valve-manage__recipient__remove"
                                    >
                                        <MdClose />
                                    </BtnPrimaryText>
                                </motion.div>
                            );
                        })
                    ) : (
                        <LoadingIndicator key="loading" className="loading" />
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

export function WaterfallRecipientsTable({
    items,
    setItems,
    useUsd,
    blockchain,
}: {
    items: WaterfallRecipientChangedType[];
    setItems: (items: WaterfallRecipientChangedType[]) => void;
    blockchain: Blockchain;
    useUsd?: boolean;
}) {
    const sorted = [...items]
        .sort((a, b) => {
            return b.priority - a.priority;
        })
        .filter((item) => !item.locked);

    useOnce(
        (ok) => {
            if (items.length && !sorted.length) {
                ok();
                const increasedPriorities = items
                    .filter((item) => !item.locked)
                    .map((item) => {
                        return { ...item, priority: Number(item.priority) + 1 };
                    });

                const minPriority = increasedPriorities.reduce(
                    (acc, item) => (Number(item.priority) < acc ? Number(item.priority) : acc),
                    10_000
                );

                const newItems = [
                    ...increasedPriorities,
                    {
                        isNew: true,
                        address: '',
                        maxCap: BigNumber(0),
                        tempId: Math.random(),
                        name: '',
                        priority: minPriority - 1,
                        locked: false,
                    },
                ];
                setItems(newItems);
            }
        },
        [items.length, sorted.length]
    );

    return (
        <>
            {/* <div className="valve-manage__recipients"> */}
            <Reorder.Group
                className="valve-manage__recipients"
                axis="y"
                onReorder={(val: WaterfallRecipientChangedType[]) => {
                    const newItems: WaterfallRecipientChangedType[] = val.map((val, i) => ({ ...val, priority: 10000 - i }));
                    setItems(newItems);
                }}
                values={items}
            >
                <AnimatePresence>
                    {items ? (
                        sorted.map((item, i) => {
                            const { maxCap, priority, address, isNew, tempId, name, locked } = item;

                            const found = sorted.find((item) => !isNew && !item.isNew && item.address === address);

                            const isDuplicateAddress = !!sorted
                                .filter((item) => !item.locked && item.address)
                                .find((it) => {
                                    return item !== it && it.address === address;
                                });

                            return (
                                <Reorder.Item
                                    style={{ position: 'relative', pointerEvents: locked ? 'none' : undefined }}
                                    key={isNew ? tempId : found ? address + name : address}
                                    value={item}
                                >
                                    {locked && (
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', translate: '-50% -50%' }}>
                                            <AiFillLock size={'4rem'} />
                                        </div>
                                    )}
                                    <motion.div
                                        animate={{ opacity: locked ? 0.3 : 1, scale: 1 }}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="waterfall-manage__recipient"
                                    >
                                        <div
                                            style={{ flexDirection: 'column', justifyContent: 'space-around' }}
                                            className="waterfall-manage__recipient__first-part"
                                        >
                                            <BtnPrimaryText
                                                onClick={() => {
                                                    if (i === 0 || !sorted.length) return;

                                                    setItems(
                                                        produce(sorted, (mutable) => {
                                                            mutable[i].priority = Number(mutable[i - 1].priority);
                                                            mutable[i - 1].priority = Number(priority);
                                                        })
                                                    );
                                                }}
                                                className="incremental-input__minus"
                                            >
                                                <IoChevronUp color="#fff" />
                                            </BtnPrimaryText>
                                            <MdDragHandle />
                                            <BtnPrimaryText
                                                onClick={() => {
                                                    if (i === sorted.length - 1 || !sorted.length) return;

                                                    setItems(
                                                        produce(sorted, (mutable) => {
                                                            mutable[i].priority = mutable[i + 1].priority;
                                                            mutable[i + 1].priority = priority;
                                                        })
                                                    );
                                                }}
                                                className="incremental-input__minus"
                                            >
                                                <IoChevronDown color="#fff" />
                                            </BtnPrimaryText>
                                            {/* <PercentageInput
                                                onChange={(val) => {
                                                    setItems(
                                                        produce(items, (mutable) => {
                                                            mutable[i].percentage = val;
                                                        })
                                                    );
                                                }}
                                                percentage={BigNumber(percentage)}
                                            /> */}
                                        </div>
                                        <div className="separator-vertical" />
                                        <div className="waterfall-manage__recipient__input-part">
                                            <InputWithLabel
                                                // lighter
                                                label="Name"
                                                style={{
                                                    border: !name ? '1px solid var(--color-error)' : undefined,
                                                }}
                                                input={(props) => (
                                                    <input
                                                        {...props}
                                                        value={name}
                                                        className="input-white-transparent"
                                                        style={{ textTransform: 'initial' }}
                                                        onChange={(e) => {
                                                            setItems(
                                                                produce(sorted, (mutable) => {
                                                                    mutable[i].name = e.target.value;
                                                                })
                                                            );
                                                        }}
                                                    />
                                                )}
                                            />
                                            <InputWithLabel
                                                // lighter
                                                label="Address"
                                                style={{
                                                    border:
                                                        !isAddress(address) || isDuplicateAddress
                                                            ? '1px solid var(--color-error)'
                                                            : undefined,
                                                    height: 'unset',
                                                }}
                                                error={
                                                    address && !isAddress(address)
                                                        ? 'Invalid address'
                                                        : isDuplicateAddress
                                                        ? 'There is a recipient with the same address'
                                                        : undefined
                                                }
                                                input={(props) => (
                                                    <input
                                                        {...props}
                                                        value={address}
                                                        className="waterfall-manage__recipient__input-part__address-input"
                                                        onChange={(e) => {
                                                            setItems(
                                                                produce(sorted, (mutable) => {
                                                                    mutable[i].address = e.target.value;
                                                                })
                                                            );
                                                        }}
                                                    />
                                                )}
                                            />
                                            <InputWithLabel
                                                // lighter
                                                label="Max Cap"
                                                style={{
                                                    border: maxCap.lte(0) ? '1px solid var(--color-error)' : undefined,
                                                    height: 'unset',
                                                }}
                                                startOrnament={useUsd ? '$' : undefined}
                                                endOrnament={useUsd ? undefined : blockchainData[blockchain].currencyName}
                                                error={maxCap.lte(0) ? 'Max cap must be bigger than 0' : undefined}
                                                input={(props) => (
                                                    <NumberInput
                                                        {...props}
                                                        value={maxCap}
                                                        className="waterfall-manage__recipient__input-part__address-input input-white-transparent"
                                                        onChange={(val) => {
                                                            if (val === undefined) return;
                                                            setItems(
                                                                produce(sorted, (mutable) => {
                                                                    mutable[i].maxCap = val;
                                                                })
                                                            );
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <BtnPrimaryText
                                            onClick={() => {
                                                const newItems = [...sorted];
                                                newItems.splice(i, 1);
                                                setItems(newItems);
                                            }}
                                            className="waterfall-manage__recipient__remove"
                                        >
                                            <MdClose />
                                        </BtnPrimaryText>
                                    </motion.div>
                                </Reorder.Item>
                            );
                        })
                    ) : (
                        <LoadingIndicator key="loading" className="loading" />
                    )}
                </AnimatePresence>
            </Reorder.Group>
            {/* </div> */}
        </>
    );
}
