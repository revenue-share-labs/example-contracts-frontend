import Link from 'next/link';
import { useRouter } from 'next/router';
import { MobileNav } from './MobileNav';
import Logo from '../Logo';
import WalletButton from '../WalletButton';
import { navItems } from './navItems';
import { motion } from 'framer-motion';

export default function Navbar() {
    const router = useRouter();

    const maskImage1 = `repeating-radial-gradient(
        circle at 50% 50%,
        #fff,
        #fff 2rem,
        rgba(255,255,255, 1) 1.5rem,
        rgba(255,255,255, 1) 2.1rem
        )`;

    const maskImage2 = `repeating-radial-gradient(
            circle at 50% 50%,
            #fff,
            #fff 2rem,
            rgba(255,255,255, 0.3) 7.5rem,
            rgba(255,255,255, 0.3) 2.1rem
            )`;

    return (
        <div className="navbar">
            <div className="navbar__content">
                <Link href="/">
                    <motion.div
                        variants={{
                            closed: {
                                backdropFilter: 'blur(0px)',
                                maskImage: maskImage1,
                                //@ts-ignore
                                '-webkit-mask-image': maskImage1,
                                transition: { duration: 0.5 },
                            },
                            open: {
                                backdropFilter: 'blur(10px)',
                                maskImage: maskImage2,
                                //@ts-ignore
                                '-webkit-mask-image': maskImage2,
                                transition: { duration: 0.5 },
                            },
                            hover: {
                                scale: 1.05,
                                transition: { delay: 0.2 },
                            },
                            active: {
                                scale: 0.9,
                            },
                        }}
                        initial={'closed'}
                        whileHover={['open', 'hover']}
                        whileTap={router.pathname === '/' ? '' : 'active'}
                        className="navbar__logo"
                    >
                        <Logo />
                    </motion.div>
                </Link>
                <nav className="navbar__navigation--desktop">
                    {navItems.map(({ name, href, subroutes }, i) => {
                        const isActive = router.pathname === href || subroutes?.includes(router.pathname);
                        return (
                            <Link href={href} key={i}>
                                <span className={`navbar__navigation__item ${isActive ? '--active' : ''}`}>{name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="wallet-btn--desktop">
                    <WalletButton />
                </div>
                <div className="navbar__navigation--mobile">
                    <MobileNav />
                </div>
            </div>
        </div>
    );
}
