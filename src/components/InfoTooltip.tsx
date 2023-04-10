import { BsInfo } from '@react-icons/all-files/bs/BsInfo';
import Tippy from '@tippyjs/react';
import React from 'react';

export default function InfoTooltip({ tooltip, children }: { tooltip?: string } & React.PropsWithChildren) {
    return tooltip ? (
        <Tippy
            content={
                <div className="box--with-icon">
                    <BsInfo size={'3rem'} />
                    {tooltip}
                </div>
            }
        >
            {children as any}
        </Tippy>
    ) : (
        <>{children}</>
    );
}
