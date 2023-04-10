import { DetailedHTMLProps, InputHTMLAttributes, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';

export default function NumberInput({
    onChange,
    value,
    maximum,
    decimals = 4,
    preferWithDecimals = false,
    debounced = false,
    ...props
}: {
    onChange: (value: BigNumber | undefined) => void;
    value?: BigNumber;
    maximum?: BigNumber;
    preferWithDecimals?: boolean;
    decimals?: number;
    debounced?: boolean;
} & Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'value' | 'onChange' | 'max'>) {
    const [_value, setValue] = useState(toUIString(preferWithDecimals ? value?.toFixed(2) : value));

    const debouncedOnChange = useMemo(() => debounce(onChange, debounced ? 1000 : 0), [onChange]);

    useEffect(() => {
        const newUiString = toUIString(value);
        const prepared = prepareForExport(_value || '');
        if ((prepared && !value?.eq(prepared)) || (value && prepared === undefined)) {
            setValue(preferWithDecimals ? value?.toFixed(2) || '' : newUiString);
        }
    }, [value]);

    function prepareForExport(_val: string) {
        let val: string | undefined = _val.replace(',', '.');
        if (val === '') {
            return undefined;
        } else if (val.slice(-1) === '.') {
            val = val.replace('.', '.0');
        }
        if (val[0] === '.') {
            val = val.replace('.', '0.');
        }

        const bigNumber = new BigNumber(val);

        if (maximum && bigNumber.gt(maximum)) {
            return maximum;
        }

        if (bigNumber.toString() === 'NaN') return value;

        return bigNumber;
    }

    function toUIString(_val: BigNumber | string | undefined): string | undefined {
        if (_val === undefined) {
            return '';
        }
        let val = String(_val);

        val = val.replace(',', '.');

        if (/^[0-9]{0,}\.?$/.test(val)) {
            return val;
        } else if (/^[0-9]{0,}\.[0-9]{0,}$/.test(val)) {
            const split = val.split('.');
            if (split[1].length > decimals) {
                return val.replace(split[1], split[1].slice(0, decimals));
            }
            return val;
        }

        return undefined;
    }

    return (
        <input
            placeholder="0.00"
            pattern="^\d*(\.\d{0,2})?$"
            {...props}
            value={_value}
            type="number"
            onChange={(e) => {
                let val = e.target.value;
                const uiString = toUIString(val);

                if (uiString !== undefined && uiString !== _value) {
                    setValue(uiString);
                    const newVal = prepareForExport(val);
                    if (newVal?.toString() !== value?.toString()) {
                        debouncedOnChange(newVal);
                    }
                }
            }}
        />
    );
}
