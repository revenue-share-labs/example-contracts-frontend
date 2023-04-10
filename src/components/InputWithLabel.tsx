import React, { InputHTMLAttributes, ReactNode, useRef } from 'react';

const blurClass = 'input-with-label--blur';
const focusClass = 'input-with-label--focus';
const errorClass = 'input-with-label--error';

export default function InputWithLabel({
    label,
    vertical,
    endOrnament,
    startOrnament,
    input,
    error,
    lighter,
    smaller,
    style,
    note,
}: {
    label?: string;
    vertical?: boolean;
    endOrnament?: ReactNode;
    startOrnament?: ReactNode;
    input: (inputProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) => ReactNode;
    error?: string;
    note?: React.ReactNode;
    lighter?: boolean;
    smaller?: boolean;
    style?: React.CSSProperties;
}) {
    const ref = useRef<HTMLInputElement>(null);

    const { blurClass, focusClass, errorClass } = lighter
        ? {
              blurClass: 'input-with-label--blur2',
              focusClass: 'input-with-label--focus2',
              errorClass: 'input-with-label--error',
          }
        : {
              blurClass: 'input-with-label--blur',
              focusClass: 'input-with-label--focus',
              errorClass: 'input-with-label--error',
          };

    return (
        <div
            onClick={() => {
                ref.current?.getElementsByTagName('input')[0]?.focus();
            }}
            className="input-with-label__wrapper"
        >
            <div
                ref={ref}
                className={`input-with-label ${vertical ? 'input-with-label--vertical' : ''} ${smaller ? '--smaller' : ''} ${
                    error ? errorClass : blurClass
                }`}
                style={style}
            >
                {label && <span className={`input-with-label__label`}>{label}</span>}
                {startOrnament && <span className="input-with-label__label">{startOrnament}</span>}

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
                })}
                {endOrnament && <span className="input-with-label__label">{endOrnament}</span>}
            </div>
            {note && <div className="input-with-label__note">{note}</div>}
            {error && <div className="input-with-label__error-message">{error}</div>}
        </div>
    );
}
