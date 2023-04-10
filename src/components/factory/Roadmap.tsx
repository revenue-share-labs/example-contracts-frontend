import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import { IoCheckmarkCircleSharp } from '@react-icons/all-files/io5/IoCheckmarkCircleSharp';
import { CgShapeCircle } from '@react-icons/all-files/cg/CgShapeCircle';
import { useEffect } from 'react';

const steps = {
    '1': 'Select type',
    '2': 'Settings',
    '3': 'Summary',
} as const;

export default function Roadmap({ step }: { step: number }) {
    const content = (
        <>
            <div className="factory__roadmap">
                {Object.entries(steps).map(([key, val], i, items) => {
                    const stepIsOk = Number(step) >= Number(key);

                    return (
                        <>
                            {i === 0 ? null : <Line filled={stepIsOk ? 2 : 0} />}

                            <div className="factory__roadmap__item">
                                <AnimatePresence mode="wait">
                                    {stepIsOk ? (
                                        <motion.div
                                            key="ok"
                                            animate={{
                                                scale: [0.5, 1.2, 1],
                                                filter: ['grayscale(1)', 'grayscale(0)'],
                                            }}
                                        >
                                            <IoCheckmarkCircleSharp color={'var(--color-primary)'} size={'3rem'} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="notOk"
                                            exit={{
                                                scale: 0.5,
                                            }}
                                        >
                                            <CgShapeCircle color="var(--color-grey1)" size={'3rem'} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <span
                                    style={{ color: stepIsOk ? 'var(--color-primary)' : undefined }}
                                    className="factory__roadmap__item__label"
                                >
                                    {val}
                                </span>
                            </div>
                        </>
                    );
                })}
            </div>
        </>
    );

    return <>{content}</>;
}

function Line({ filled }: { filled: 0 | 1 | 2 }) {
    const flex1 = useMotionValue(filled);
    const flex2 = useMotionValue(2 - filled);

    // const flex1 = useTransform(_flex1, ["0", "0.5", "1"], ["0", "1", "2"])

    useEffect(() => {
        animate(flex1, filled, { duration: 1 });
        animate(flex2, 2 - filled, { duration: 1 });
    }, [filled]);

    return (
        <>
            <motion.div
                style={{ flex: flex1 }}
                // transition={{ duration: 2, type: "tween" }}
                className={`factory__roadmap__separator --active`}
            />
            <motion.div
                style={{ flex: flex2 }}
                // transition={{ duration: 2, type: "tween" }}
                className={`factory__roadmap__separator`}
            />
        </>
    );
}
