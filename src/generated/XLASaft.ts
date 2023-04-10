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

export interface XLASaftInterface extends utils.Interface {
  functions: {
    "SAFTAddresses(uint256)": FunctionFragment;
    "addSAFTPartner(address,uint256,bytes32,string)": FunctionFragment;
    "addressSAFTData(address)": FunctionFragment;
    "calculateCost(uint256)": FunctionFragment;
    "exponent()": FunctionFragment;
    "founderReward()": FunctionFragment;
    "initialPriceUSD()": FunctionFragment;
    "k()": FunctionFragment;
    "k2()": FunctionFragment;
    "markAsRedeemed(address)": FunctionFragment;
    "numberOfPartners()": FunctionFragment;
    "owner()": FunctionFragment;
    "redeemer()": FunctionFragment;
    "referralReward()": FunctionFragment;
    "removeAll()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "reservedSupply()": FunctionFragment;
    "setRedeemer(address)": FunctionFragment;
    "setSAFTPartners(address[],uint256[],bytes32[],string[])": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "SAFTAddresses"
      | "addSAFTPartner"
      | "addressSAFTData"
      | "calculateCost"
      | "exponent"
      | "founderReward"
      | "initialPriceUSD"
      | "k"
      | "k2"
      | "markAsRedeemed"
      | "numberOfPartners"
      | "owner"
      | "redeemer"
      | "referralReward"
      | "removeAll"
      | "renounceOwnership"
      | "reservedSupply"
      | "setRedeemer"
      | "setSAFTPartners"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "SAFTAddresses",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "addSAFTPartner",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "addressSAFTData",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateCost",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "exponent", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "founderReward",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialPriceUSD",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "k", values?: undefined): string;
  encodeFunctionData(functionFragment: "k2", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "markAsRedeemed",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "numberOfPartners",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "redeemer", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "referralReward",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "removeAll", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "reservedSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setRedeemer",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setSAFTPartners",
    values: [
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BytesLike>[],
      PromiseOrValue<string>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "SAFTAddresses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addSAFTPartner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addressSAFTData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateCost",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "exponent", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "founderReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initialPriceUSD",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "k", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "k2", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "markAsRedeemed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "numberOfPartners",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeemer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "referralReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "removeAll", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "reservedSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRedeemer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSAFTPartners",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "AddedSAFTPartner(address,uint256,uint256,bytes32,string)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "RedeemerChanged(address,address)": EventFragment;
    "RemovedAll()": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AddedSAFTPartner"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RedeemerChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RemovedAll"): EventFragment;
}

export interface AddedSAFTPartnerEventObject {
  partnerAddress: string;
  usdCost: BigNumber;
  tokenAmount: BigNumber;
  affCode: string;
  name: string;
}
export type AddedSAFTPartnerEvent = TypedEvent<
  [string, BigNumber, BigNumber, string, string],
  AddedSAFTPartnerEventObject
>;

export type AddedSAFTPartnerEventFilter =
  TypedEventFilter<AddedSAFTPartnerEvent>;

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

export interface RedeemerChangedEventObject {
  owner: string;
  redeemer: string;
}
export type RedeemerChangedEvent = TypedEvent<
  [string, string],
  RedeemerChangedEventObject
>;

export type RedeemerChangedEventFilter = TypedEventFilter<RedeemerChangedEvent>;

export interface RemovedAllEventObject {}
export type RemovedAllEvent = TypedEvent<[], RemovedAllEventObject>;

export type RemovedAllEventFilter = TypedEventFilter<RemovedAllEvent>;

export interface XLASaft extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: XLASaftInterface;

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
    SAFTAddresses(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    addSAFTPartner(
      _partner: PromiseOrValue<string>,
      _tokens: PromiseOrValue<BigNumberish>,
      _affCode: PromiseOrValue<BytesLike>,
      _name: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addressSAFTData(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, boolean, string] & {
        usdCost: BigNumber;
        tokenAmount: BigNumber;
        redeemed: boolean;
        affCode: string;
      }
    >;

    calculateCost(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { cost: BigNumber }>;

    exponent(overrides?: CallOverrides): Promise<[BigNumber]>;

    founderReward(overrides?: CallOverrides): Promise<[BigNumber]>;

    initialPriceUSD(overrides?: CallOverrides): Promise<[BigNumber]>;

    k(overrides?: CallOverrides): Promise<[BigNumber]>;

    k2(overrides?: CallOverrides): Promise<[BigNumber]>;

    markAsRedeemed(
      _partner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    numberOfPartners(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    redeemer(overrides?: CallOverrides): Promise<[string]>;

    referralReward(overrides?: CallOverrides): Promise<[BigNumber]>;

    removeAll(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    reservedSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    setRedeemer(
      _redeemer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setSAFTPartners(
      _partners: PromiseOrValue<string>[],
      _tokens: PromiseOrValue<BigNumberish>[],
      _affCodes: PromiseOrValue<BytesLike>[],
      _names: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  SAFTAddresses(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  addSAFTPartner(
    _partner: PromiseOrValue<string>,
    _tokens: PromiseOrValue<BigNumberish>,
    _affCode: PromiseOrValue<BytesLike>,
    _name: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addressSAFTData(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, boolean, string] & {
      usdCost: BigNumber;
      tokenAmount: BigNumber;
      redeemed: boolean;
      affCode: string;
    }
  >;

  calculateCost(
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  exponent(overrides?: CallOverrides): Promise<BigNumber>;

  founderReward(overrides?: CallOverrides): Promise<BigNumber>;

  initialPriceUSD(overrides?: CallOverrides): Promise<BigNumber>;

  k(overrides?: CallOverrides): Promise<BigNumber>;

  k2(overrides?: CallOverrides): Promise<BigNumber>;

  markAsRedeemed(
    _partner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  numberOfPartners(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  redeemer(overrides?: CallOverrides): Promise<string>;

  referralReward(overrides?: CallOverrides): Promise<BigNumber>;

  removeAll(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  reservedSupply(overrides?: CallOverrides): Promise<BigNumber>;

  setRedeemer(
    _redeemer: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setSAFTPartners(
    _partners: PromiseOrValue<string>[],
    _tokens: PromiseOrValue<BigNumberish>[],
    _affCodes: PromiseOrValue<BytesLike>[],
    _names: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    SAFTAddresses(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    addSAFTPartner(
      _partner: PromiseOrValue<string>,
      _tokens: PromiseOrValue<BigNumberish>,
      _affCode: PromiseOrValue<BytesLike>,
      _name: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    addressSAFTData(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, boolean, string] & {
        usdCost: BigNumber;
        tokenAmount: BigNumber;
        redeemed: boolean;
        affCode: string;
      }
    >;

    calculateCost(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    exponent(overrides?: CallOverrides): Promise<BigNumber>;

    founderReward(overrides?: CallOverrides): Promise<BigNumber>;

    initialPriceUSD(overrides?: CallOverrides): Promise<BigNumber>;

    k(overrides?: CallOverrides): Promise<BigNumber>;

    k2(overrides?: CallOverrides): Promise<BigNumber>;

    markAsRedeemed(
      _partner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    numberOfPartners(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    redeemer(overrides?: CallOverrides): Promise<string>;

    referralReward(overrides?: CallOverrides): Promise<BigNumber>;

    removeAll(overrides?: CallOverrides): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    reservedSupply(overrides?: CallOverrides): Promise<BigNumber>;

    setRedeemer(
      _redeemer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setSAFTPartners(
      _partners: PromiseOrValue<string>[],
      _tokens: PromiseOrValue<BigNumberish>[],
      _affCodes: PromiseOrValue<BytesLike>[],
      _names: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AddedSAFTPartner(address,uint256,uint256,bytes32,string)"(
      partnerAddress?: null,
      usdCost?: null,
      tokenAmount?: null,
      affCode?: null,
      name?: null
    ): AddedSAFTPartnerEventFilter;
    AddedSAFTPartner(
      partnerAddress?: null,
      usdCost?: null,
      tokenAmount?: null,
      affCode?: null,
      name?: null
    ): AddedSAFTPartnerEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "RedeemerChanged(address,address)"(
      owner?: null,
      redeemer?: null
    ): RedeemerChangedEventFilter;
    RedeemerChanged(owner?: null, redeemer?: null): RedeemerChangedEventFilter;

    "RemovedAll()"(): RemovedAllEventFilter;
    RemovedAll(): RemovedAllEventFilter;
  };

  estimateGas: {
    SAFTAddresses(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    addSAFTPartner(
      _partner: PromiseOrValue<string>,
      _tokens: PromiseOrValue<BigNumberish>,
      _affCode: PromiseOrValue<BytesLike>,
      _name: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addressSAFTData(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateCost(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    exponent(overrides?: CallOverrides): Promise<BigNumber>;

    founderReward(overrides?: CallOverrides): Promise<BigNumber>;

    initialPriceUSD(overrides?: CallOverrides): Promise<BigNumber>;

    k(overrides?: CallOverrides): Promise<BigNumber>;

    k2(overrides?: CallOverrides): Promise<BigNumber>;

    markAsRedeemed(
      _partner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    numberOfPartners(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    redeemer(overrides?: CallOverrides): Promise<BigNumber>;

    referralReward(overrides?: CallOverrides): Promise<BigNumber>;

    removeAll(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    reservedSupply(overrides?: CallOverrides): Promise<BigNumber>;

    setRedeemer(
      _redeemer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setSAFTPartners(
      _partners: PromiseOrValue<string>[],
      _tokens: PromiseOrValue<BigNumberish>[],
      _affCodes: PromiseOrValue<BytesLike>[],
      _names: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    SAFTAddresses(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addSAFTPartner(
      _partner: PromiseOrValue<string>,
      _tokens: PromiseOrValue<BigNumberish>,
      _affCode: PromiseOrValue<BytesLike>,
      _name: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addressSAFTData(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculateCost(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    exponent(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    founderReward(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialPriceUSD(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    k(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    k2(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    markAsRedeemed(
      _partner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    numberOfPartners(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    redeemer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    referralReward(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removeAll(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    reservedSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setRedeemer(
      _redeemer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setSAFTPartners(
      _partners: PromiseOrValue<string>[],
      _tokens: PromiseOrValue<BigNumberish>[],
      _affCodes: PromiseOrValue<BytesLike>[],
      _names: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}