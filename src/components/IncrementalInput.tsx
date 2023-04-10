import { InputHTMLAttributes, ReactNode, useRef } from 'react';
import { AiFillPlusCircle } from '@react-icons/all-files/ai/AiFillPlusCircle';
import BtnPrimaryText from './BtnPrimaryText';

const blurClass = '--blur';
const focusClass = '--focus';
const errorClass = '--error';

export default function IncrementalInput({
    input,
    error,
    onIncrement,
    onDecrement,
    style,
}: {
    input: (inputProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) => ReactNode;
    error?: string;
    onIncrement: () => void;
    onDecrement: () => void;
    style?: React.CSSProperties;
}) {
    const ref = useRef<HTMLInputElement>(null);

    return (
        <div
            onClick={() => {
                ref.current?.getElementsByTagName('input')[0]?.focus();
            }}
            className="incremental-input__wrapper"
        >
            <div ref={ref} className={`incremental-input ${error ? errorClass : blurClass}`} style={style}>
                <BtnPrimaryText
                    onClick={(e) => {
                        e.stopPropagation();
                        onDecrement();
                    }}
                    className="incremental-input__minus"
                >
                    -
                </BtnPrimaryText>
                <div className="incremental-input__center">
                    {input({
                        onBlur: () => {
                            ref.current?.classList.add(error ? errorClass : blurClass);
                            ref.current?.classList.remove(focusClass);
                        },
                        onFocus: () => {
                            ref.current?.classList.add(focusClass);
                            ref.current?.classList.remove(blurClass);
                            ref.current?.classList.remove(errorClass);
                        },
                        onKeyDown: (e) => {
                            if (e.key === 'ArrowDown') {
                                onDecrement();
                            } else if (e.key === 'ArrowUp') {
                                onIncrement();
                            }
                        },
                    })}
                    %
                </div>
                <BtnPrimaryText
                    onClick={(e) => {
                        e.stopPropagation();
                        onIncrement();
                    }}
                    className="incremental-input__plus"
                >
                    {/* <AiFillPlusCircle color="blue"  /> */}+
                </BtnPrimaryText>
            </div>
            {/* <div className="input-with-label__error-message">{error}</div> */}
        </div>
    );
}
