import { Controller, UseFormReturn, useWatch } from 'react-hook-form';
import { useSnapshot } from 'valtio';
import Checkbox from '../Checkbox';
import InputWithLabel from '../InputWithLabel';
import { walletState } from '../../store';
import BigNumber from 'bignumber.js';
import NumberInput from '../NumberInput';
import PercentageInput from '../PercentageInput';
import { blockchainData } from '../../constants';
import { formatAddress } from '../../utils';
import Switch from '../Switch';
import { ContractSettings } from '../../pages/factory/new';

const defaultPrepayment: ContractSettings['prepayment'] = {
    investor: '',
    investedAmount: BigNumber(0),
    interestRate: BigNumber(10),
    residualInterestRate: BigNumber(2),
};

export default function ContractFactorySettings({ form }: { form: UseFormReturn<ContractSettings> }) {
    const state = useSnapshot(walletState);
    const { control } = form;

    const useUsd = useWatch({
        control,
        name: 'useUsd',
        defaultValue: false,
    });

    const prepayment = useWatch({
        control,
        name: 'prepayment',
        defaultValue: undefined,
    });

    const waterfall = useWatch({
        control,
        name: 'waterfall',
        defaultValue: undefined,
    });

    const blockchain = useWatch({
        control,
        name: 'blockchain',
        defaultValue: undefined,
    });

    return (
        <>
            <h1 className="h1 text--align-center">Set up your contract</h1>
            <div className="separator" />
            {/* <h1 className="text--big text--align-center">Contract settings</h1> */}

            <div className="factory__section">
                <Controller
                    control={control}
                    name="blockchain"
                    render={({ field }) => {
                        return (
                            <div className="factory__section__cell">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <h1 className="text--big text--align-center">Network</h1>

                                    <Switch
                                        onSwitch={(tab) => {
                                            if (waterfall && tab === 'Ethereum') return;
                                            const values = form.getValues();
                                            if (values.ethUsdPriceFeed === blockchainData[values.blockchain].defaultUsdPriceFeed) {
                                                const blData = blockchainData[tab === 'Ethereum' ? 'ETH' : 'POLYGON'];
                                                form.setValue('ethUsdPriceFeed', blData.defaultUsdPriceFeed);
                                            }
                                            field.onChange(tab === 'Ethereum' ? 'ETH' : 'POLYGON');
                                        }}
                                        tabs={waterfall ? ['Polygon'] : ['Ethereum', 'Polygon']}
                                        selectedTab={field.value === 'ETH' ? 'Ethereum' : 'Polygon'}
                                        identifier="network-switch"
                                    />
                                </div>
                            </div>
                        );
                    }}
                />
            </div>

            <div className="factory__section">
                <Controller
                    control={control}
                    name="name"
                    render={({ field, fieldState }) => {
                        return (
                            <InputWithLabel
                                label="Contract Name"
                                error={fieldState.error?.message}
                                note={'Public name of your contract for easy finding it in the list'}
                                input={() => <input {...field} style={{ textTransform: 'none' }} />}
                            />
                        );
                    }}
                />
            </div>

            <div className="factory__section">
                <Controller
                    control={control}
                    name="distributor"
                    render={({ field, fieldState }) => {
                        const canChangeCurrentWallet =
                            state.connectedWallet && field.value.toLowerCase() !== state.connectedWallet.toLowerCase();

                        return (
                            <InputWithLabel
                                label="Distributor address"
                                error={fieldState.error?.message}
                                endOrnament={
                                    canChangeCurrentWallet ? (
                                        <button onClick={() => field.onChange(state.connectedWallet)} className="btn--for-input">
                                            Use {formatAddress(state.connectedWallet, 4, 3)}
                                        </button>
                                    ) : undefined
                                }
                                input={() => {
                                    return (
                                        <input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                            }}
                                            style={{ textTransform: 'none' }}
                                        />
                                    );
                                }}
                            />
                        );
                    }}
                />

                <Controller
                    control={control}
                    name="autoEthDistribution"
                    render={({ field }) => {
                        return (
                            <>
                                <Checkbox
                                    label={`Automatically distribute ${blockchainData[blockchain].currencyName}`}
                                    checked={field.value}
                                    onChange={(e) => {
                                        field.onChange(e.target.checked);
                                    }}
                                />

                                {field.value && (
                                    <Controller
                                        control={control}
                                        name="minAutoDistributeAmount"
                                        render={({ field }) => {
                                            return (
                                                <InputWithLabel
                                                    endOrnament={blockchainData[blockchain].currencyName}
                                                    label="Treshhold for auto distribution"
                                                    input={(props) => <NumberInput {...field} {...props} />}
                                                />
                                            );
                                        }}
                                    />
                                )}
                            </>
                        );
                    }}
                />
            </div>

            <div className="factory__section">
                <Controller
                    control={control}
                    name="isImmutable"
                    render={({ field }) => {
                        return (
                            <>
                                <div className="factory__section__cell">
                                    <Checkbox
                                        label="Recipients cannot be changed after contract deployment"
                                        checked={field.value}
                                        onChange={(e) => {
                                            field.onChange(e.target.checked);
                                        }}
                                    />
                                </div>

                                {field.value ? null : (
                                    <>
                                        <div className="separator" />
                                        <div className="factory__section__cell">
                                            <Controller
                                                control={control}
                                                name="controller"
                                                render={({ field, fieldState }) => {
                                                    const canChangeCurrentWallet =
                                                        state.connectedWallet &&
                                                        field.value.toLowerCase() !== state.connectedWallet.toLowerCase();
                                                    return (
                                                        <InputWithLabel
                                                            label="Recipient editor address"
                                                            error={fieldState.error?.message}
                                                            endOrnament={
                                                                canChangeCurrentWallet ? (
                                                                    <button
                                                                        onClick={() => field.onChange(state.connectedWallet)}
                                                                        className="btn--for-input"
                                                                    >
                                                                        Use {formatAddress(state.connectedWallet, 4, 3)}
                                                                    </button>
                                                                ) : undefined
                                                            }
                                                            input={() => {
                                                                return (
                                                                    <input
                                                                        {...field}
                                                                        onChange={(e) => {
                                                                            field.onChange(e);
                                                                        }}
                                                                        style={{ textTransform: 'none' }}
                                                                    />
                                                                );
                                                            }}
                                                        />
                                                    );
                                                }}
                                            />
                                        </div>
                                    </>
                                )}

                                {field.value ? null : (
                                    <>
                                        <div className="separator" />
                                        <div className="factory__section__cell">
                                            <Controller
                                                control={control}
                                                name="immutableController"
                                                render={({ field }) => {
                                                    return (
                                                        <Checkbox
                                                            label="Editor of recipients cannot be changed"
                                                            checked={field.value}
                                                            onChange={(e) => {
                                                                field.onChange(e.target.checked);
                                                            }}
                                                        />
                                                    );
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        );
                    }}
                />
            </div>

            <div className="factory__section">
                <Controller
                    control={control}
                    name="waterfall"
                    render={({ field }) => {
                        return (
                            <>
                                <div className="factory__section__cell">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <h1 className="text--big text--align-center">Waterfall</h1>

                                        <Switch
                                            onSwitch={() => {
                                                field.onChange(!field.value);

                                                if (blockchain === 'ETH') {
                                                    form.setValue('blockchain', 'POLYGON');
                                                }
                                                if (field.value) {
                                                    form.setValue('prepayment', undefined);
                                                }
                                            }}
                                            tabs={['on', 'off']}
                                            selectedTab={field.value ? 'on' : 'off'}
                                            identifier="waterfall-switch"
                                        />
                                    </div>
                                </div>
                            </>
                        );
                    }}
                />
            </div>

            {!waterfall && (
                <div className="factory__section">
                    <Controller
                        control={control}
                        name="prepayment"
                        render={({ field }) => {
                            return (
                                <>
                                    <div className="factory__section__cell">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <h1 className="text--big text--align-center">Prepayment</h1>

                                            <Switch
                                                onSwitch={() => {
                                                    field.onChange(field.value ? undefined : defaultPrepayment);
                                                }}
                                                tabs={['on', 'off']}
                                                selectedTab={field.value ? 'on' : 'off'}
                                                identifier="prepayment-switch"
                                            />
                                        </div>
                                    </div>
                                </>
                            );
                        }}
                    />

                    {prepayment && (
                        <>
                            <div className="separator" />
                            <div className="factory__section__cell">
                                <div className="factory-prepayment__grid-section">
                                    <Controller
                                        control={control}
                                        name="prepayment.investor"
                                        render={({ field, fieldState }) => {
                                            return (
                                                <InputWithLabel
                                                    label="Investor address"
                                                    error={fieldState.error?.message}
                                                    note="Investor's wallet address (immutable)"
                                                    input={() => {
                                                        return (
                                                            <input
                                                                {...field}
                                                                onChange={(e) => {
                                                                    console.log(e.target.value);
                                                                    field.onChange(e);
                                                                }}
                                                                style={{ textTransform: 'none' }}
                                                            />
                                                        );
                                                    }}
                                                />
                                            );
                                        }}
                                    />
                                    <Controller
                                        control={control}
                                        name="prepayment.investedAmount"
                                        render={({ field, fieldState }) => {
                                            return (
                                                <InputWithLabel
                                                    note={`Base amount invested by the investor in ${
                                                        useUsd ? 'USD' : 'ETH'
                                                    } without interest`}
                                                    label="Invested amount"
                                                    error={fieldState.error?.message}
                                                    input={() => <NumberInput {...field} />}
                                                    {...(useUsd
                                                        ? { startOrnament: '$' }
                                                        : { endOrnament: blockchainData[blockchain].currencyName })}
                                                />
                                            );
                                        }}
                                    />
                                    <Controller
                                        control={control}
                                        name="prepayment.interestRate"
                                        render={({ field, fieldState }) => {
                                            return (
                                                <InputWithLabel
                                                    note="Investor's interest in percentage"
                                                    label="Interest rate"
                                                    error={fieldState.error?.message}
                                                    input={() => (
                                                        <PercentageInput
                                                            style={{ padding: 0 }}
                                                            onChange={field.onChange}
                                                            percentage={field.value}
                                                        />
                                                    )}
                                                />
                                            );
                                        }}
                                    />
                                    <Controller
                                        control={control}
                                        name="prepayment.residualInterestRate"
                                        render={({ field, fieldState }) => {
                                            return (
                                                <InputWithLabel
                                                    note="Interest that stays for investor after the base amount with interest is already paid out"
                                                    label="Residual interest rate"
                                                    error={fieldState.error?.message}
                                                    input={() => (
                                                        <PercentageInput
                                                            style={{ padding: 0 }}
                                                            onChange={field.onChange}
                                                            percentage={field.value}
                                                        />
                                                    )}
                                                />
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {(waterfall || prepayment) && (
                <div className="factory__section">
                    <Controller
                        control={control}
                        name="useUsd"
                        render={({ field }) => {
                            return (
                                <>
                                    <div className="factory__section__cell">
                                        <Checkbox
                                            label={waterfall ? 'Recipient max caps are in USD' : 'Invested amount is in USD'}
                                            checked={field.value}
                                            onChange={(e) => {
                                                field.onChange(e.target.checked);
                                            }}
                                        />
                                    </div>

                                    {!field.value ? null : (
                                        <>
                                            <div className="separator" />
                                            <div className="factory__section__cell">
                                                <Controller
                                                    control={control}
                                                    name="ethUsdPriceFeed"
                                                    render={({ field, fieldState }) => {
                                                        return (
                                                            <InputWithLabel
                                                                label="Price feed ETH/USD"
                                                                error={fieldState.error?.message}
                                                                endOrnament={
                                                                    <button
                                                                        onClick={() =>
                                                                            field.onChange(blockchainData[blockchain].defaultUsdPriceFeed)
                                                                        }
                                                                        className="btn--for-input"
                                                                    >
                                                                        Use default
                                                                    </button>
                                                                }
                                                                note={
                                                                    <div>
                                                                        Price feed contract address
                                                                        <br />
                                                                        <br />
                                                                        <div className="text--error">
                                                                            Warning: Only edit this if you really know what you are doing
                                                                        </div>
                                                                    </div>
                                                                }
                                                                input={() => {
                                                                    return (
                                                                        <input
                                                                            {...field}
                                                                            onChange={(e) => {
                                                                                field.onChange(e);
                                                                            }}
                                                                            style={{ textTransform: 'none' }}
                                                                        />
                                                                    );
                                                                }}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}
                                </>
                            );
                        }}
                    />
                </div>
            )}
        </>
    );
}
