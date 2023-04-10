import { IoReload } from '@react-icons/all-files/io5/IoReload';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

export default function ReloadBtn(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <button
            {...props}
            onClick={(e) => {
                props?.onClick?.(e);
                const target = e.currentTarget.firstElementChild as HTMLElement;
                if (target) {
                    target.style.animationName = 'spin';
                    setTimeout(() => {
                        target.style.animationName = '';
                    }, 500);
                }
            }}
            className="btn--grey btn--padding-small reload-btn"
        >
            <IoReload style={{ animationDuration: '0.5s' }} size={'2rem'} />
        </button>
    );
}
