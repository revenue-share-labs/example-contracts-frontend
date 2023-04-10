import * as React from 'react';
import { AnimatePresence, motion, SVGMotionProps, useCycle, Variants } from 'framer-motion';
import { navItems } from './navItems';
import { useRouter } from 'next/router';
import Link from 'next/link';
import WalletButton from '../WalletButton';

const Path = (props: SVGMotionProps<SVGPathElement>) => (
    <motion.path fill="transparent" strokeWidth="3" stroke="#fff" strokeLinecap="round" {...props} />
);

const MenuToggle = ({ toggle }: { toggle: () => void }) => (
    <button className="mobile-nav__hamburger" onClick={toggle}>
        <svg width={'3rem'} height={'3rem'} viewBox="0 0 23 20">
            <Path
                variants={{
                    closed: { d: 'M 2 2.5 L 20 2.5' },
                    open: { d: 'M 3 16.5 L 17 2.5' },
                }}
            />
            <Path
                d="M 2 9.423 L 20 9.423"
                variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                }}
                transition={{ duration: 0.1 }}
            />
            <Path
                variants={{
                    closed: { d: 'M 2 16.346 L 20 16.346' },
                    open: { d: 'M 3 2.5 L 17 16.346' },
                }}
            />
        </svg>
    </button>
);

const variants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        },
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
};

const variantsNav: Variants = {
    open: {
        // display: 'initial',
        visibility: 'visible',
        transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
        display: 'hidden',
        visibility: 'hidden',
        transition: { staggerChildren: 0.05, staggerDirection: -1, when: 'afterChildren' },
    },
};

export const Navigation = () => {
    const router = useRouter();
    return (
        <>
            <motion.nav className="mobile-nav__list" variants={variantsNav}>
                {navItems.map(({ name, href }, i) => {
                    const isActive = router.pathname === href;
                    return (
                        <Link href={href} key={i}>
                            <motion.div variants={variants} className={`mobile-nav__item ${isActive ? '--active' : ''}`}>
                                {name}
                            </motion.div>
                        </Link>
                    );
                })}
            </motion.nav>
            <motion.div className="mobile-nav__other" style={{ display: 'flex', flexDirection: 'inherit' }} variants={variants}>
                <WalletButton />
            </motion.div>
        </>
    );
};

const sidebar: Variants = {
    open: {
        pointerEvents: 'initial',
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 50,
        },
    },
    closed: {
        background: '#000',
        pointerEvents: 'none',
        opacity: 0,
        transition: {
            type: 'spring',
            stiffness: 50,
        },
    },
};

export const MobileNav = () => {
    const [isOpen, toggleOpen] = useCycle(false, true);

    return (
        <motion.nav initial={'closed'} animate={isOpen ? 'open' : 'closed'} whileHover={'hover'} exit="closed">
            <motion.div onClick={() => toggleOpen()} className="mobile-nav" variants={sidebar}>
                <Navigation />
            </motion.div>
            <MenuToggle toggle={() => toggleOpen()} />
        </motion.nav>
    );
};
