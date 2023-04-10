import { HTMLMotionProps, motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

const getVariants = (animateDuration: number) => ({
    one: {
        // background: 'linear-gradient(93.69deg, #ee3674 -2.5%, #5951f6 50%)',
        opacity: 0,
    },
    two: {
        background: 'linear-gradient(120deg, #2f2f37 100%, 100%, #ee3674 100%, #5951f6 180%)',
        opacity: 1,
        transition: {
            background: {
                duration: animateDuration,
            },
        },
    },
    three: {
        background: 'linear-gradient(120deg, #2f2f37 -100%, -20.5%, #ee3674 -2.5%, #5951f6 80%)',
    },
    four: {
        background: 'linear-gradient(120deg, #ee3674 -2.56%, #5951f6 60%)',
        transition: {
            background: {
                duration: 0.01,
            },
        },
    },
});

export default function BtnPrimaryText({
    children,
    animateDuration = 0.5,
    ...other
}: { animateDuration?: number } & PropsWithChildren<HTMLMotionProps<'button'>>) {
    return (
        <motion.button
            variants={getVariants(animateDuration)}
            initial="one"
            animate="two"
            whileHover="three"
            whileTap="four"
            {...other}
            className={`btn--primary-text ${other.className || ''}`}
        >
            <motion.span className="btn--primary-text__text">{children}</motion.span>
        </motion.button>
    );
}

export function BtnBlack({
    children,
    animateDuration = 0.5,
    ...other
}: { animateDuration?: number } & PropsWithChildren<HTMLMotionProps<'button'>>) {
    return (
        <motion.button
            variants={getVariants(animateDuration)}
            initial="one"
            animate="two"
            whileHover="three"
            whileTap="four"
            {...other}
            className={`btn--primary-text ${other.className || ''}`}
        >
            {children}
        </motion.button>
    );
}
