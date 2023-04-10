/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export declare namespace BaseRSCPrepayment {
  export type InitContractSettingStruct = {
    owner: PromiseOrValue<string>;
    distributor: PromiseOrValue<string>;
    controller: PromiseOrValue<string>;
    immutableController: PromiseOrValue<boolean>;
    autoEthDistribution: PromiseOrValue<boolean>;
    minAutoDistributionAmount: PromiseOrValue<BigNumberish>;
    platformFee: PromiseOrValue<BigNumberish>;
    factoryAddress: PromiseOrValue<string>;
    supportedErc20addresses: PromiseOrValue<string>[];
    erc20PriceFeeds: PromiseOrValue<string>[];
  };

  export type InitContractSettingStructOutput = [
    string,
    string,
    string,
    boolean,
    boolean,
    BigNumber,
    BigNumber,
    string,
    string[],
    string[]
  ] & {
    owner: string;
    distributor: string;
    controller: string;
    immutableController: boolean;
    autoEthDistribution: boolean;
    minAutoDistributionAmount: BigNumber;
    platformFee: BigNumber;
    factoryAddress: string;
    supportedErc20addresses: string[];
    erc20PriceFeeds: string[];
  };
}

export interface XLAPrepaymentInterface extends utils.Interface {
  functions: {
    "autoEthDistribution()": FunctionFragment;
    "controller()": FunctionFragment;
    "distributor()": FunctionFragment;
    "factory()": FunctionFragment;
    "immutableController()": FunctionFragment;
    "initialize((address,address,address,bool,bool,uint256,uint256,address,address[],address[]),address,uint256,uint256,uint256,address[],uint256[],string[])": FunctionFragment;
    "interestRate()": FunctionFragment;
    "investedAmount()": FunctionFragment;
    "investor()": FunctionFragment;
    "investorAmountToReceive()": FunctionFragment;
    "investorReceivedAmount()": FunctionFragment;
    "minAutoDistributionAmount()": FunctionFragment;
    "numberOfRecipients()": FunctionFragment;
    "owner()": FunctionFragment;
    "platformFee()": FunctionFragment;
    "recipients(uint256)": FunctionFragment;
    "recipientsPercentage(address)": FunctionFragment;
    "redistributeEth()": FunctionFragment;
    "redistributeToken(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "residualInterestRate()": FunctionFragment;
    "setController(address)": FunctionFragment;
    "setDistributor(address)": FunctionFragment;
    "setRecipients(address[],uint256[],string[])": FunctionFragment;
    "setTokenEthPriceFeed(address,address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "autoEthDistribution"
      | "controller"
      | "distributor"
      | "factory"
      | "immutableController"
      | "initialize"
      | "interestRate"
      | "investedAmount"
      | "investor"
      | "investorAmountToReceive"
      | "investorReceivedAmount"
      | "minAutoDistributionAmount"
      | "numberOfRecipients"
      | "owner"
      | "platformFee"
      | "recipients"
      | "recipientsPercentage"
      | "redistributeEth"
      | "redistributeToken"
      | "renounceOwnership"
      | "residualInterestRate"
      | "setController"
      | "setDistributor"
      | "setRecipients"
      | "setTokenEthPriceFeed"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "autoEthDistribution",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "controller",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "distributor",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "immutableController",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      BaseRSCPrepayment.InitContractSettingStruct,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<string>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "interestRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "investedAmount",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "investor", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "investorAmountToReceive",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "investorReceivedAmount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "minAutoDistributionAmount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "numberOfRecipients",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "platformFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "recipients",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "recipientsPercentage",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "redistributeEth",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "redistributeToken",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "residualInterestRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setController",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setDistributor",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setRecipients",
    values: [
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<string>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenEthPriceFeed",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "autoEthDistribution",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "controller", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "distributor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "immutableController",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "interestRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "investedAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "investor", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "investorAmountToReceive",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "investorReceivedAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "minAutoDistributionAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "numberOfRecipients",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "platformFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "recipients", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "recipientsPercentage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "redistributeEth",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "redistributeToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "residualInterestRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setController",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDistributor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRecipients",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTokenEthPriceFeed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "ControllerChanged(address,address)": EventFragment;
    "DistributeToken(address,uint256)": EventFragment;
    "DistributorChanged(address,address)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "SetRecipients(address[],uint256[],string[])": EventFragment;
    "TokenPriceFeedSet(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ControllerChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DistributeToken"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DistributorChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetRecipients"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenPriceFeedSet"): EventFragment;
}

export interface ControllerChangedEventObject {
  oldController: string;
  newController: string;
}
export type ControllerChangedEvent = TypedEvent<
  [string, string],
  ControllerChangedEventObject
>;

export type ControllerChangedEventFilter =
  TypedEventFilter<ControllerChangedEvent>;

export interface DistributeTokenEventObject {
  token: string;
  amount: BigNumber;
}
export type DistributeTokenEvent = TypedEvent<
  [string, BigNumber],
  DistributeTokenEventObject
>;

export type DistributeTokenEventFilter = TypedEventFilter<DistributeTokenEvent>;

export interface DistributorChangedEventObject {
  oldDistributor: string;
  newDistributor: string;
}
export type DistributorChangedEvent = TypedEvent<
  [string, string],
  DistributorChangedEventObject
>;

export type DistributorChangedEventFilter =
  TypedEventFilter<DistributorChangedEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface SetRecipientsEventObject {
  recipients: string[];
  percentages: BigNumber[];
  names: string[];
}
export type SetRecipientsEvent = TypedEvent<
  [string[], BigNumber[], string[]],
  SetRecipientsEventObject
>;

export type SetRecipientsEventFilter = TypedEventFilter<SetRecipientsEvent>;

export interface TokenPriceFeedSetEventObject {
  token: string;
  priceFeed: string;
}
export type TokenPriceFeedSetEvent = TypedEvent<
  [string, string],
  TokenPriceFeedSetEventObject
>;

export type TokenPriceFeedSetEventFilter =
  TypedEventFilter<TokenPriceFeedSetEvent>;

export interface XLAPrepayment extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: XLAPrepaymentInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    autoEthDistribution(overrides?: CallOverrides): Promise<[boolean]>;

    controller(overrides?: CallOverrides): Promise<[string]>;

    distributor(overrides?: CallOverrides): Promise<[string]>;

    factory(overrides?: CallOverrides): Promise<[string]>;

    immutableController(overrides?: CallOverrides): Promise<[boolean]>;

    initialize(
      _settings: BaseRSCPrepayment.InitContractSettingStruct,
      _investor: PromiseOrValue<string>,
      _investedAmount: PromiseOrValue<BigNumberish>,
      _interestRate: PromiseOrValue<BigNumberish>,
      _residualInterestRate: PromiseOrValue<BigNumberish>,
      _initialRecipients: PromiseOrValue<string>[],
      _percentages: PromiseOrValue<BigNumberish>[],
      _names: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    interestRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    investedAmount(overrides?: CallOverrides): Promise<[BigNumber]>;

    investor(overrides?: CallOverrides): Promise<[string]>;

    investorAmountToReceive(overrides?: CallOverrides): Promise<[BigNumber]>;

    investorReceivedAmount(overrides?: CallOverrides): Promise<[BigNumber]>;

    minAutoDistributionAmount(overrides?: CallOverrides): Promise<[BigNumber]>;

    numberOfRecipients(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    platformFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    recipients(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    recipientsPercentage(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    redistributeEth(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    redistributeToken(
      _token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    residualInterestRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    setController(
      _controller: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setDistributor(
      _distributor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setRecipients(
      _newRecipients: PromiseOrValue<string>[],
      _percentages: PromiseOrValue<BigNumberish>[],
      _names: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTokenEthPriceFeed(
      _token: PromiseOrValue<string>,
      _priceFeed: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  autoEthDistribution(overrides?: CallOverrides): Promise<boolean>;

  controller(overrides?: CallOverrides): Promise<string>;

  distributor(overrides?: CallOverrides): Promise<string>;

  factory(overrides?: CallOverrides): Promise<string>;

  immutableController(overrides?: CallOverrides): Promise<boolean>;

  initialize(
    _settings: BaseRSCPrepayment.InitContractSettingStruct,
    _investor: PromiseOrValue<string>,
    _investedAmount: PromiseOrValue<BigNumberish>,
    _interestRate: PromiseOrValue<BigNumberish>,
    _residualInterestRate: PromiseOrValue<BigNumberish>,
    _initialRecipients: PromiseOrValue<string>[],
    _percentages: PromiseOrValue<BigNumberish>[],
    _names: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  interestRate(overrides?: CallOverrides): Promise<BigNumber>;

  investedAmount(overrides?: CallOverrides): Promise<BigNumber>;

  investor(overrides?: CallOverrides): Promise<string>;

  investorAmountToReceive(overrides?: CallOverrides): Promise<BigNumber>;

  investorReceivedAmount(overrides?: CallOverrides): Promise<BigNumber>;

  minAutoDistributionAmount(overrides?: CallOverrides): Promise<BigNumber>;

  numberOfRecipients(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  platformFee(overrides?: CallOverrides): Promise<BigNumber>;

  recipients(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  recipientsPercentage(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  redistributeEth(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  redistributeToken(
    _token: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  residualInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

  setController(
    _controller: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setDistributor(
    _distributor: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setRecipients(
    _newRecipients: PromiseOrValue<string>[],
    _percentages: PromiseOrValue<BigNumberish>[],
    _names: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTokenEthPriceFeed(
    _token: PromiseOrValue<string>,
    _priceFeed: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    autoEthDistribution(overrides?: CallOverrides): Promise<boolean>;

    controller(overrides?: CallOverrides): Promise<string>;

    distributor(overrides?: CallOverrides): Promise<string>;

    factory(overrides?: CallOverrides): Promise<string>;

    immutableController(overrides?: CallOverrides): Promise<boolean>;

    initialize(
      _settings: BaseRSCPrepayment.InitContractSettingStruct,
      _investor: PromiseOrValue<string>,
      _investedAmount: PromiseOrValue<BigNumberish>,
      _interestRate: PromiseOrValue<BigNumberish>,
      _residualInterestRate: PromiseOrValue<BigNumberish>,
      _initialRecipients: PromiseOrValue<string>[],
      _percentages: PromiseOrValue<BigNumberish>[],
      _names: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<void>;

    interestRate(overrides?: CallOverrides): Promise<BigNumber>;

    investedAmount(overrides?: CallOverrides): Promise<BigNumber>;

    investor(overrides?: CallOverrides): Promise<string>;

    investorAmountToReceive(overrides?: CallOverrides): Promise<BigNumber>;

    investorReceivedAmount(overrides?: CallOverrides): Promise<BigNumber>;

    minAutoDistributionAmount(overrides?: CallOverrides): Promise<BigNumber>;

    numberOfRecipients(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    platformFee(overrides?: CallOverrides): Promise<BigNumber>;

    recipients(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    recipientsPercentage(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redistributeEth(overrides?: CallOverrides): Promise<void>;

    redistributeToken(
      _token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    residualInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

    setController(
      _controller: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setDistributor(
      _distributor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setRecipients(
      _newRecipients: PromiseOrValue<string>[],
      _percentages: PromiseOrValue<BigNumberish>[],
      _names: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<void>;

    setTokenEthPriceFeed(
      _token: PromiseOrValue<string>,
      _priceFeed: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ControllerChanged(address,address)"(
      oldController?: null,
      newController?: null
    ): ControllerChangedEventFilter;
    ControllerChanged(
      oldController?: null,
      newController?: null
    ): ControllerChangedEventFilter;

    "DistributeToken(address,uint256)"(
      token?: null,
      amount?: null
    ): DistributeTokenEventFilter;
    DistributeToken(token?: null, amount?: null): DistributeTokenEventFilter;

    "DistributorChanged(address,address)"(
      oldDistributor?: null,
      newDistributor?: null
    ): DistributorChangedEventFilter;
    DistributorChanged(
      oldDistributor?: null,
      newDistributor?: null
    ): DistributorChangedEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "SetRecipients(address[],uint256[],string[])"(
      recipients?: null,
      percentages?: null,
      names?: null
    ): SetRecipientsEventFilter;
    SetRecipients(
      recipients?: null,
      percentages?: null,
      names?: null
    ): SetRecipientsEventFilter;

    "TokenPriceFeedSet(address,address)"(
      token?: null,
      priceFeed?: null
    ): TokenPriceFeedSetEventFilter;
    TokenPriceFeedSet(
      token?: null,
      priceFeed?: null
    ): TokenPriceFeedSetEventFilter;
  };

  estimateGas: {
    autoEthDistribution(overrides?: CallOverrides): Promise<BigNumber>;

    controller(overrides?: CallOverrides): Promise<BigNumber>;

    distributor(overrides?: CallOverrides): Promise<BigNumber>;

    factory(overrides?: CallOverrides): Promise<BigNumber>;

    immutableController(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _settings: BaseRSCPrepayment.InitContractSettingStruct,
      _investor: PromiseOrValue<string>,
      _investedAmount: PromiseOrValue<BigNumberish>,
      _interestRate: PromiseOrValue<BigNumberish>,
      _residualInterestRate: PromiseOrValue<BigNumberish>,
      _initialRecipients: PromiseOrValue<string>[],
      _percentages: PromiseOrValue<BigNumberish>[],
      _names: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    interestRate(overrides?: CallOverrides): Promise<BigNumber>;

    investedAmount(overrides?: CallOverrides): Promise<BigNumber>;

    investor(overrides?: CallOverrides): Promise<BigNumber>;

    investorAmountToReceive(overrides?: CallOverrides): Promise<BigNumber>;

    investorReceivedAmount(overrides?: CallOverrides): Promise<BigNumber>;

    minAutoDistributionAmount(overrides?: CallOverrides): Promise<BigNumber>;

    numberOfRecipients(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    platformFee(overrides?: CallOverrides): Promise<BigNumber>;

    recipients(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    recipientsPercentage(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redistributeEth(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    redistributeToken(
      _token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    residualInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

    setController(
      _controller: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setDistributor(
      _distributor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setRecipients(
      _newRecipients: PromiseOrValue<string>[],
      _percentages: PromiseOrValue<BigNumberish>[],
      _names: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTokenEthPriceFeed(
      _token: PromiseOrValue<string>,
      _priceFeed: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    autoEthDistribution(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    controller(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    distributor(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    factory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    immutableController(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _settings: BaseRSCPrepayment.InitContractSettingStruct,
      _investor: PromiseOrValue<string>,
      _investedAmount: PromiseOrValue<BigNumberish>,
      _interestRate: PromiseOrValue<BigNumberish>,
      _residualInterestRate: PromiseOrValue<BigNumberish>,
      _initialRecipients: PromiseOrValue<string>[],
      _percentages: PromiseOrValue<BigNumberish>[],
      _names: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    interestRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    investedAmount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    investor(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    investorAmountToReceive(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    investorReceivedAmount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    minAutoDistributionAmount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    numberOfRecipients(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    platformFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    recipients(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    recipientsPercentage(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    redistributeEth(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    redistributeToken(
      _token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    residualInterestRate(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setController(
      _controller: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setDistributor(
      _distributor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setRecipients(
      _newRecipients: PromiseOrValue<string>[],
      _percentages: PromiseOrValue<BigNumberish>[],
      _names: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTokenEthPriceFeed(
      _token: PromiseOrValue<string>,
      _priceFeed: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}