import { constants } from 'ethers';
import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BtnPrimary from '../../components/BtnPrimary';
import BtnPrimaryText, { BtnBlack } from '../../components/BtnPrimaryText';
import ContractFactorySettings from '../../components/factory/ContractFactorySettings';
import ContractCreationSummary from '../../components/factory/ContractCreationSummary';
import {
    RecipientChangedType,
    RecipientsManageButtons,
    ValveRecipientsTableWithInfo,
    WaterfallRecipientChangedType,
    WaterfallRecipientsManageButtons,
    WaterfallRecipientsTable,
    getItemsData,
} from '../../components/ValveManageTable';
import { createPrepaymentContract, createValveContract, createWaterfallContract } from '../../services/factory';
import { getTitle } from '../../utils';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { blockchainData } from '../../constants';
import { isAddress } from 'ethers/lib/utils';
import { object, string, boolean, mixed } from 'yup';
import BigNumber from 'bignumber.js';
import Link from 'next/link';
import Roadmap from '../../components/factory/Roadmap';
import { Blockchain } from '../../types';
import { throwSnack } from '../../components/SnackBars';

// function useOnBack() {
//     const router = useRouter();

//     useEffect(() => {
//         document.addEventListener('history:back', () => {');
//     }, []);
// }

function useMultiStepRoute() {
    const router = useRouter();
    const [step, _setStep] = useState(1);

    useEffect(() => {
        const { step } = router.query;
        if (Number(step)) {
            _setStep(Number(step));
        }
    }, [router.query.step]);

    function setStep(step: number) {
        _setStep(step);
        router.push(`?step=${step}`, undefined, { shallow: true });
    }

    return { step, setStep };
}

const formSchema = object({
    name: string().required('Name is required'),
    isImmutable: boolean(),
    controller: string().test({
        message: 'Not a valid address',
        test: (val, { parent }) => {
            if ((parent as ContractSettings).isImmutable) return true;
            return isAddress(val || '');
        },
    }),
    distributor: string().test({
        message: 'Not a valid address',
        test: (val) => {
            return isAddress(val || '');
        },
    }),
    immutableController: boolean(),
    autoEthDistribution: boolean(),
    minAutoDistributeAmount: mixed()
        .test((bn: BigNumber | undefined) => {
            return bn?.gte(0) || false;
        })
        .nullable(),
    useUsd: boolean(),
    ethUsdPriceFeed: string().test({
        message: 'Not a valid address',
        test: (val, { parent }) => {
            if (!(parent as ContractSettings).useUsd) return true;
            return isAddress(val || '');
        },
    }),
    waterfall: boolean(),
    prepayment: object({
        investor: string().test({
            message: 'Not a valid address',
            test: (val, { parent }) => {
                if (val === undefined) return true;

                if ((parent as ContractSettings).isImmutable) return true;
                return isAddress(val || '');
            },
        }),
        investedAmount: mixed().test({
            message: 'Invested amount must be greater than 0',
            test: (bn: BigNumber | undefined, { parent }) => {
                if (bn === undefined) return true;

                return bn?.gt(0) || false;
            },
        }),
        interestRate: mixed(),
        // .test({
        //     message: 'Interest rate must be greater than 0',
        //     test: (bn: BigNumber | undefined, { parent }) => {
        //         if (!parent) return true;

        //         return bn?.gt(0) || false;
        //     },
        // }),
        residualInterestRate: mixed().test((bn: BigNumber | undefined, { parent }) => {
            if (bn === undefined) return true;

            return bn?.lt(100) || false;
        }),
    }).test({
        message: 'Prepayment settings are required',
        test: () => true,
    }),
}).required();

const defaultPrepayment: ContractSettings['prepayment'] = {
    investor: '',
    investedAmount: BigNumber(0),
    interestRate: BigNumber(10),
    residualInterestRate: BigNumber(2),
};

export type ContractSettings = {
    name: string;
    isImmutable: boolean;
    controller: string;
    distributor: string;
    immutableController: boolean;
    autoEthDistribution: boolean;
    minAutoDistributeAmount: BigNumber;
    useUsd: boolean;
    ethUsdPriceFeed: string;
    prepayment?: {
        investor: string;
        investedAmount: BigNumber;
        interestRate: BigNumber;
        residualInterestRate: BigNumber;
    };
    waterfall: boolean;
    blockchain: Blockchain;
};

export default function NewContract() {
    const [settings, setContractSettings] = useState<ContractSettings>();
    const [recipients, setRecipients] = useState<RecipientChangedType[]>([]);
    const [waterfallRecipients, setWaterfallRecipients] = useState<WaterfallRecipientChangedType[]>([]);
    const router = useRouter();

    const form = useForm<ContractSettings>({
        resolver: yupResolver(formSchema),
        defaultValues: settings || {
            autoEthDistribution: false,
            immutableController: false,
            controller: '',
            distributor: '',
            isImmutable: false,
            minAutoDistributeAmount: BigNumber(0.1),
            ethUsdPriceFeed: blockchainData['POLYGON'].defaultUsdPriceFeed,
            blockchain: 'POLYGON',
        },
    });

    const waterfall = useWatch({
        control: form.control,
        name: 'waterfall',
        defaultValue: undefined,
    });
    const useUsd = useWatch({
        control: form.control,
        name: 'useUsd',
        defaultValue: undefined,
    });
    const blockchain = useWatch({
        control: form.control,
        name: 'blockchain',
        defaultValue: undefined,
    });

    const [step, setStep] = useState<1 | 2 | 3>(1);

    function submitSettings() {
        const settings = form.getValues();
        if (!settings) return;

        if (!settings.isImmutable && !settings.controller) {
            form.setError('controller', { message: 'Controller must be set to a valid address' });
            return;
        }
        if (waterfall && !waterfallRecipients.length) return;

        if (!waterfall && !recipients.length) return;

        setContractSettings(settings);
        setStep(3);
    }

    async function submitSummary() {
        if (settings) {
            const {
                name,
                immutableController,
                isImmutable,
                autoEthDistribution,
                controller,
                distributor,
                minAutoDistributeAmount,
                prepayment,
                ethUsdPriceFeed,
                useUsd,
                waterfall,
                blockchain,
            } = settings;

            if (waterfall) {
                if (blockchain === 'ETH') {
                    throwSnack('error', 'Waterfall is not supported on ETH yet');
                    return;
                }

                createWaterfallContract(
                    {
                        name,
                        immutableController,
                        autoEthDistribution,
                        controller: isImmutable ? constants.AddressZero : controller,
                        recipients: waterfallRecipients,
                        distributor,
                        minAutoDistributeAmount,
                        ethUsdPriceFeed,
                        useUsd,
                        waterfall,
                        blockchain,
                    },
                    () => {
                        router.push('/factory');
                    }
                );
            } else if (prepayment) {
                createPrepaymentContract(
                    {
                        name,
                        immutableController,
                        autoEthDistribution,
                        controller: isImmutable ? constants.AddressZero : controller,
                        recipients,
                        distributor,
                        minAutoDistributeAmount,
                        prepayment,
                        ethUsdPriceFeed,
                        useUsd,
                        waterfall,
                        blockchain,
                    },
                    () => {
                        router.push('/factory');
                    }
                );
            } else {
                createValveContract(
                    {
                        name,
                        immutableController,
                        autoEthDistribution,
                        controller: isImmutable ? constants.AddressZero : controller,
                        recipients,
                        distributor,
                        minAutoDistributeAmount,
                        blockchain,
                    },
                    () => {
                        router.push('/factory');
                    }
                );
            }
        }
    }

    const { totalValid, totalAll } = getItemsData(recipients);

    const totalIs100 = totalValid.eq(100);

    useEffect(() => {
        console.log('NOW');
    }, []);

    return (
        <AnimatePresence>
            <Head>
                <title>{getTitle(`Create Prepayment`)}</title>
            </Head>
            <div className="factory__roadmap__wrapper">
                <Roadmap step={step} />
            </div>

            <motion.div
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.9 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                key={step}
                className="factory"
            >
                {step === 1 ? (
                    <>
                        <h1 className="h1 text--align-center">Select contract type</h1>
                        <div className="factory__boxes">
                            {/* <Link href="/factory/valve"> */}
                            <div
                                onClick={() => {
                                    form.setValue('prepayment', undefined);
                                    setStep(2);
                                }}
                                className="factory__box"
                            >
                                <span>Valve</span>
                                <p>
                                    Payable smart contract that splits all ETH & ERC2.0 tokens it receives proportionally to recipients
                                    shares
                                </p>
                            </div>
                            <div
                                onClick={() => {
                                    form.setValue('prepayment', defaultPrepayment);
                                    setStep(2);
                                }}
                                className="factory__box"
                            >
                                <span>Prepayment</span>
                                <p>Percentage contract with special investor’s role, who recieves revenue before the recipients</p>
                            </div>
                            <div
                                onClick={() => {
                                    form.setValue('prepayment', undefined);
                                    form.setValue('waterfall', true);
                                    setStep(2);
                                }}
                                className="factory__box"
                            >
                                <span>Waterfall</span>
                                <p>Percentage contract with special investor’s role, who recieves revenue before the recipients</p>
                            </div>
                        </div>
                    </>
                ) : step === 2 || !settings ? (
                    <>
                        <ContractFactorySettings form={form} />

                        <div className="factory__section">
                            <h1 className="text--big text--align-center">Recipients</h1>
                            <br />
                            {waterfall ? (
                                <>
                                    <WaterfallRecipientsManageButtons items={waterfallRecipients} setItems={setWaterfallRecipients} />
                                    <WaterfallRecipientsTable
                                        useUsd={useUsd}
                                        blockchain={blockchain}
                                        items={waterfallRecipients}
                                        setItems={setWaterfallRecipients}
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="valve-manage__recipients__buttons">
                                        <RecipientsManageButtons items={recipients} setItems={setRecipients} />
                                    </div>
                                    <ValveRecipientsTableWithInfo blockchain={blockchain} items={recipients} setItems={setRecipients} />
                                </>
                            )}
                        </div>
                        <div className="valve-manage__recipients__buttons">
                            <BtnBlack onClick={() => setStep(1)}>Back</BtnBlack>
                            <BtnPrimaryText
                                disabled={waterfall ? !waterfallRecipients.length : !totalIs100}
                                onClick={form.handleSubmit(submitSettings, console.log)}
                            >
                                Continue
                            </BtnPrimaryText>
                        </div>
                    </>
                ) : (
                    <>
                        <ContractCreationSummary recipients={recipients} waterfallRecipients={waterfallRecipients} settings={settings} />
                        <div className="factory__buttons">
                            <BtnBlack onClick={() => setStep(2)}>Back</BtnBlack>
                            <BtnPrimary onClick={submitSummary}>Continue</BtnPrimary>
                        </div>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
