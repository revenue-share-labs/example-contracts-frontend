// import Decimal from 'decimal.js';

import BigNumber from 'bignumber.js';
import { utils, BigNumber as BigNumberEthers } from 'ethers';
import { blockchainData } from './constants';
import { Blockchain } from './types';

export const PUBLIC_BASE_PATH = '/contracts/old';

export const hexToNumber = (val: string): number => {
    return parseInt(val, 16);
};

export const numberToHex = (val: number): string => {
    return `0x${val.toString(16)}`;
};

export const numberToStringWithDecimals = (amount: number) => {};

export function numberToFullLengthString(num: number) {
    return Number(num).toLocaleString('fullwide', { useGrouping: false });
}

export const stringWithDecimalsToNumber = (amount: string): number => {
    return parseFloat(`${amount.slice(0, -18)}.${amount.slice(-18)}`);
};

export const stringToDecimal = (str: string | undefined) => {};

export const parseFormattedNumber = (str: string): number => {
    if (str === '') {
        return 0;
    }
    return parseFloat(str.replace(/,/g, ''));
};

export const formatAddress = (address: string, first = 5, last = 4): string => {
    if (address.length <= first + last) {
        return address;
    }
    const beginning = address.slice(0, first);
    const end = address.slice(-last);
    const isShorter = address.length >= first + last;
    return `${beginning}${isShorter ? '...' : ''}${end}`;
    return `${address.substring(0, first)}...${address.slice(-last)}`;
};

export const sleep = async (timeout: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
};

export const getEnvironment = () => {
    return process.env.NEXT_PUBLIC_ENV || 'dev';
};

export const isTouchDevice = (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0;
};

export function stripZeroesAtTheEnd(number: string) {
    if (number.match(/^.+\./)) {
        return number.replace(/[.]?[0]+$/, '');
    }
    return number;
}

export function numberWithCommas(x: number | string | undefined) {
    if (x !== undefined) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return '0';
}

export function stringToBytes32(text: string) {
    let result = utils.toUtf8Bytes(text);
    // if (result.length > 32) { throw new Error('String too long') }
    let result2 = utils.hexlify(result);
    while (result2.length < 66) {
        result2 += '0';
    }
    if (result2.length !== 66) {
        throw new Error('invalid web3 implicit bytes32');
    }
    return result2;
}

export function bigNumberToContractString(bn: BigNumber) {
    return bn.decimalPlaces(0).toString();
}

export function isNullAddress(address: string) {
    return address.includes('0x000000000');
}

export function formatBigValue(bn: BigNumber | BigNumberEthers) {
    const _bn = bn instanceof BigNumberEthers ? BigNumber(bn.toString()) : bn;
    return _bn.div(1e18).decimalPlaces(4).toFormat();
}

export function formatUsd(bn: BigNumber) {
    return bn.decimalPlaces(2).toFormat({ ...BigNumber.config({}).FORMAT, prefix: '$' });
}

export function formatMoney(value: BigNumber, blockchain: Blockchain | 'USD') {
    if (blockchain === 'USD') {
        return formatUsd(value);
    } else {
        return `${value.toFixed(4)} ${blockchainData[blockchain].currencyName}`;
    }
}

export function formatPermille(bn: BigNumber) {
    return bn
        .div(100)
        .decimalPlaces(2)
        .toFormat({ ...BigNumber.config({}).FORMAT, suffix: '%' });
}

export type HexStringType = 'address' | 'tx';

export function makeScanUrl(type: HexStringType, hexString: string, blockchain: Blockchain) {
    return `${blockchainData[blockchain].scanBase}${type}/${hexString}`;
}

export function getTitle(title: String) {
    return `${title} | X.LA`;
}

export async function asyncMap<T, R>(items: T[], callback: (item: T) => Promise<R>): Promise<R[]> {
    const result: R[] = [];

    for (let i = 0; i < items.length; i++) {
        result.push(await callback(items[i]));
    }

    return result;
}
