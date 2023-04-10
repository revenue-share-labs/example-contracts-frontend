import { HTMLMotionProps, motion, useAnimationControls } from 'framer-motion';
import { PropsWithChildren, useEffect } from 'react';

export default function BtnPrimary({
    children,
    animateDuration = 0.5,
    ...other
}: { animateDuration?: number } & PropsWithChildren<HTMLMotionProps<'button'>>) {
    return (
        <motion.button
            key={other.disabled ? 'disabled' : 'enabled'}
            {...other}
            variants={
                other.disabled
                    ? undefined
                    : {
                          one: {
                              background: 'linear-gradient(120deg, #ee3674 0%, #5951f6 50%)',
                              opacity: 0,
                              // scale: 0.5,
                          },
                          two: {
                              background: 'linear-gradient(120deg, #ee3674 20%, #5951f6 80%)',
                              opacity: 1,
                              scale: 1,
                              transition: {
                                  background: {
                                      duration: animateDuration,
                                  },
                              },
                          },
                          three: {
                              background: 'linear-gradient(120deg, #ee3674 10%, #5951f6 50%)',
                          },
                          four: {
                              background: 'linear-gradient(120deg, #ee3674 70%, #5951f6 90%)',
                              transition: {
                                  background: {
                                      duration: 0.005,
                                  },
                              },
                          },
                          disabled: {
                              background: 'unset',
                          },
                      }
            }
            {...(other.disabled ? {} : { initial: 'one', animate: 'two', whileHover: 'three', whileTap: 'four' })}
            className={`btn--primary ${other.className || ''}`}
        >
            {children}
        </motion.button>
    );
}
