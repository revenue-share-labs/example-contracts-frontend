/* eslint-disable @next/next/no-img-element */
import { FC } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

export interface LoadingIndicatorProps {
    spinnerSize?: number | string;
    className?: string;
    style?: React.CSSProperties;
}

function LoadingIndicator({ spinnerSize, className, style }: LoadingIndicatorProps) {
    return <PulseLoader color="var(--colorPrimary)" className={`loading ${className || ''}`} size={spinnerSize || '1rem'} style={style} />;
}

export default LoadingIndicator;
