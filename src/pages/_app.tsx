import '../../styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css';

import type { AppProps } from 'next/app';
import Navbar from '../components/navbar/Navbar';
import Modal from '../components/Modal';
import Snackbar from '../components/SnackBars';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { tryToReconnectWalletAtInit } from '../services/wallet';
import { useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { setPriceAtoms } from '../store';
import 'tippy.js/dist/tippy.css'; // optional

BigNumber.set({ EXPONENTIAL_AT: 50 });

if (typeof window !== 'undefined') {
    const setVh = () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
    };
    setVh();

    window.addEventListener('resize', setVh);
}

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    useEffect(() => {
        tryToReconnectWalletAtInit();
        setPriceAtoms();
        // calculateCost(BigNumber(900000), 0).then(({ usdCost }) => {
        //     console.log({ usdCost: usdCost.toString(), aaa: usdCost.div(1e18).toString() });
        // });
        // localEstimatePrice(BigNumber(900000), 0).then(async (res) => {
        //     console.log('estimated:', res.toString());
        //     console.log('reverse:', await (await localEstimatePriceReverse(res, 0)).toString());
        // });
    }, []);

    return (
        <div className="layout">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />

                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    //@ts-ignore
                    crossOrigin
                />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;600;700&display=swap" rel="stylesheet" />
            </Head>
            <Snackbar />
            <Modal />
            <Navbar />

            <AnimatePresence exitBeforeEnter>
                <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                    key={router.route}
                    className="layout__inner"
                >
                    <Component {...pageProps} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default MyApp;
