import { useState, useEffect } from 'react';

export default function useDebouncedOnChange<T>(value: T, onChange: (value: T) => void, timeout = 500): [T, (arg: T) => void] {
    const [localValue, setLocalValue] = useState(value);
    const [timer, setTimer]: [number | null, Function] = useState(null);

    useEffect(() => {
        if (localValue !== value) {
            setLocalValue(value);
        }
    }, [value]); // check only when value changes, not local value

    return [
        localValue,
        function (newValue) {
            setLocalValue(newValue);
            if (timer) {
                window.clearTimeout(timer);
            }
            console.log(1);
            setTimer(
                window.setTimeout(() => {
                    onChange(newValue);
                }, timeout)
            );
        },
    ];
}
