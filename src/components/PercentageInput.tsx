import BigNumber from 'bignumber.js';
import IncrementalInput from './IncrementalInput';
import NumberInput from './NumberInput';

export default function PercentageInput({
    onChange,
    percentage,
    style,
}: {
    onChange: (val: BigNumber) => void;
    percentage: BigNumber;
    style?: React.CSSProperties;
}) {
    return (
        <IncrementalInput
            style={style}
            onIncrement={() => {
                const newVal = percentage.gt(99) ? BigNumber(100) : percentage.plus(1);
                onChange(newVal);
            }}
            onDecrement={() => {
                const newVal = percentage.lt(1) ? BigNumber(0) : percentage.gt(100) ? BigNumber(100) : percentage.minus(1);
                onChange(newVal);
            }}
            input={(props) => (
                <NumberInput
                    decimals={2}
                    onChange={(val) => {
                        if (val) {
                            onChange(val);
                        }
                    }}
                    {...props}
                    value={BigNumber(percentage)}
                    preferWithDecimals
                    // maximum={BigNumber(100)}
                />
            )}
        />
    );
}
