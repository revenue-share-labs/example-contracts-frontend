import { useAtom } from '@dbeining/react-atom';
import { AnimatePresence, motion } from 'framer-motion';
import { modalAtom, setModal } from '../store';
import { IoCloseOutline } from '@react-icons/all-files/io5/IoCloseOutline';
import { useIsPhone } from '../hooks/useIsPhone';

export default function Modal() {
    function onClose() {
        setModal(['closed']);
    }

    const isPhone = useIsPhone();

    const radialHidden = `repeating-radial-gradient(
        circle at 50% 50%,
        rgba(0,0,0, 1),
        rgba(0,0,0, 1) 20px,
        rgba(0,0,0, 0.3) 60px,
        rgba(0,0,0, 1) 60px
        )`;

    const radialShow = `repeating-radial-gradient(
        circle at 50% 50%,
        rgba(0,0,0, 1),
        rgba(0,0,0, 1) 20px,
        rgba(0,0,0, 1) 80px,
        rgba(0,0,0, 1) 140px
        )`;

    const modal = useAtom(modalAtom);
    const backdrop = (
        <>
            <motion.div
                variants={{
                    closed: {
                        backdropFilter: 'blur(0px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.00)',
                        maskImage: !isPhone ? radialHidden : undefined,
                        WebkitMaskImage: !isPhone ? radialHidden : undefined,
                        transition: { duration: 0.5 },
                    },
                    closed2: {
                        backdropFilter: 'blur(0px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.00)',
                        transition: { duration: 0.5 },
                    },
                    open: {
                        backdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.01)',
                        maskImage: !isPhone ? radialShow : undefined,
                        WebkitMaskImage: !isPhone ? radialShow : undefined,
                        transition: { duration: 0.7 },
                    },
                }}
                initial={'closed'}
                animate={'open'}
                exit={'closed2'}
                transition={{ duration: 1 }}
                className="modal__backdrop-2"
                onClick={onClose}
            ></motion.div>
        </>
    );

    return (
        <>
            <AnimatePresence>
                {modal[0] === 'open' ? (
                    <>
                        {backdrop}
                        <motion.div
                            key={modal[1].title}
                            variants={{
                                closed: isPhone
                                    ? {
                                          opacity: 0,
                                          translateY: '100%',
                                      }
                                    : {
                                          opacity: 0,
                                          scale: 0,
                                      },
                                open: isPhone
                                    ? {
                                          opacity: 1,
                                          translateY: '0%',
                                      }
                                    : {
                                          opacity: 1,
                                          scale: 1,
                                      },
                            }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="modal"
                        >
                            <div className="modal__content">
                                {modal[1].title && (
                                    <div className="modal__head">
                                        {/* <span className="modal__head__title">{modal[1].title}</span> */}
                                        <div onClick={() => setModal(['closed'])} className="modal__head__close">
                                            <IoCloseOutline color="currentColor" />
                                        </div>
                                    </div>
                                )}
                                {modal[1].content({ onClose })}
                            </div>
                        </motion.div>
                    </>
                ) : null}
            </AnimatePresence>
        </>
    );
}
