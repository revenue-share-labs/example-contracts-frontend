// useOnce hook

import { useEffect, useState } from 'react';

export default function useOnce(fn: (setAsCalled: () => void) => void, deps: any[] = []) {
    const [wasCalled, setWasCalled] = useState(false);

    useEffect(() => {
        if (!wasCalled) fn(() => setWasCalled(true));
    }, deps);
}
