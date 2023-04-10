import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Switch<Tab extends string>({
    onSwitch,
    tabs,
    selectedTab,
    identifier,
    disabled,
}: {
    selectedTab: Tab;
    tabs: Tab[];
    onSwitch: (tab: Tab) => void;
    identifier?: string;
    disabled?: boolean;
}) {
    // const [selectedTab, setSelectedTab] = useState(tabs[0]);

    return (
        <div className={`switch ${disabled ? '--disabled' : ''}`}>
            {tabs.map((tab, i) => (
                <div
                    className={`switch__item ${tab === selectedTab ? 'switch__item--selected' : ''}`}
                    onClick={() => onSwitch(tab)}
                    key={i}
                >
                    {tab === selectedTab ? (
                        <motion.div className="switch__selected" layoutId={(identifier || '') + 'underline'}></motion.div>
                    ) : null}
                    <span>{tab}</span>
                </div>
            ))}
        </div>
    );
}
