import { throwSnack } from '../components/SnackBars';

export default function useCopy() {
    return (value: string) => {
        navigator.clipboard.writeText(value);
        throwSnack('success', 'Copied!', undefined, { autoClose: 1000 });
    };
}
