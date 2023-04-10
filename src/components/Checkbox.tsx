import { DetailedHTMLProps, InputHTMLAttributes, useRef, useState } from 'react';

export default function Checkbox({
    label,
    ...props
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & { label?: string }) {
    const ref = useRef<HTMLInputElement>(null);

    const checkbox = (
        <div className="checkbox">
            <input style={{ display: 'none' }} type="checkbox" ref={ref} {...props} />
            <div className={`checkbox__inner ${props.checked ? '--checked' : ''}`}></div>
        </div>
    );

    return label ? (
        <label className="checkbox__label">
            {checkbox}
            {label}
        </label>
    ) : (
        checkbox
    );
}
