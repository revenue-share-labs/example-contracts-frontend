import { FaEthereum } from '@react-icons/all-files/fa/FaEthereum';
import PolygonLogo from './components/PolygonLogo';
import { Blockchain } from './types';

if (true) {
    if (!process.env.NEXT_PUBLIC_POLYGON_CHAIN_ID) {
        throw new Error(`env var NEXT_PUBLIC_POLYGON_CHAIN_ID is missing`);
    }
    if (!process.env.NEXT_PUBLIC_POLYGON_GRAPH_URL) {
        throw new Error(`env var NEXT_PUBLIC_POLYGON_GRAPH_URL is missing`);
    }
    if (!process.env.NEXT_PUBLIC_POLYGON_SCAN_BASE) {
        throw new Error(`env var NEXT_PUBLIC_POLYGON_SCAN_BASE is missing`);
    }
    if (!process.env.NEXT_PUBLIC_POLYGON_VALVE_FACTORY_ADDRESS) {
        throw new Error(`env var NEXT_PUBLIC_POLYGON_VALVE_FACTORY_ADDRESS is missing`);
    }
    if (!process.env.NEXT_PUBLIC_POLYGON_PREPAYMENT_FACTORY_ADDRESS) {
        throw new Error(`env var NEXT_PUBLIC_POLYGON_PREPAYMENT_FACTORY_ADDRESS is missing`);
    }
    if (!process.env.NEXT_PUBLIC_POLYGON_WATERFALL_FACTORY_ADDRESS) {
        throw new Error(`env var NEXT_PUBLIC_POLYGON_WATERFALL_FACTORY_ADDRESS is missing`);
    }
    if (!process.env.NEXT_PUBLIC_POLYGON_DEFAULT_USD_PRICE_FEED) {
        throw new Error(`env var NEXT_PUBLIC_POLYGON_DEFAULT_USD_PRICE_FEED is missing`);
    }

    if (!process.env.NEXT_PUBLIC_ETH_CHAIN_ID) {
        throw new Error(`env var NEXT_PUBLIC_ETH_CHAIN_ID is missing`);
    }
    if (!process.env.NEXT_PUBLIC_ETH_GRAPH_URL) {
        throw new Error(`env var NEXT_PUBLIC_ETH_GRAPH_URL is missing`);
    }
    if (!process.env.NEXT_PUBLIC_ETH_SCAN_BASE) {
        throw new Error(`env var NEXT_PUBLIC_ETH_SCAN_BASE is missing`);
    }
    if (!process.env.NEXT_PUBLIC_ETH_VALVE_FACTORY_ADDRESS) {
        throw new Error(`env var NEXT_PUBLIC_ETH_VALVE_FACTORY_ADDRESS is missing`);
    }
    if (!process.env.NEXT_PUBLIC_ETH_PREPAYMENT_FACTORY_ADDRESS) {
        throw new Error(`env var NEXT_PUBLIC_ETH_PREPAYMENT_FACTORY_ADDRESS is missing`);
    }
    // if (!process.env.NEXT_PUBLIC_ETH_WATERFALL_FACTORY_ADDRESS) {
    //     throw new Error(`env var NEXT_PUBLIC_ETH_WATERFALL_FACTORY_ADDRESS is missing`);
    // }
    if (!process.env.NEXT_PUBLIC_ETH_DEFAULT_USD_PRICE_FEED) {
        throw new Error(`env var NEXT_PUBLIC_ETH_DEFAULT_USD_PRICE_FEED is missing`);
    }
}

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_POLYGON_CHAIN_ID);

type BlockchainData = {
    chainId: number;
    graphUrl: string;
    scanBase: string;
    valveFactoryAddress: string;
    prepaymentFactoryAddress: string;
    waterfallFactoryAddress: string;
    defaultUsdPriceFeed: string;
    icon: () => JSX.Element;
    currencyName: string;
};

export const blockchainData: Record<Blockchain, BlockchainData> = {
    POLYGON: {
        chainId: Number(process.env.NEXT_PUBLIC_POLYGON_CHAIN_ID),
        graphUrl: process.env.NEXT_PUBLIC_POLYGON_GRAPH_URL,
        scanBase: process.env.NEXT_PUBLIC_POLYGON_SCAN_BASE,
        valveFactoryAddress: process.env.NEXT_PUBLIC_POLYGON_VALVE_FACTORY_ADDRESS,
        prepaymentFactoryAddress: process.env.NEXT_PUBLIC_POLYGON_PREPAYMENT_FACTORY_ADDRESS,
        waterfallFactoryAddress: process.env.NEXT_PUBLIC_POLYGON_WATERFALL_FACTORY_ADDRESS,
        defaultUsdPriceFeed: process.env.NEXT_PUBLIC_POLYGON_DEFAULT_USD_PRICE_FEED,
        icon: () => <PolygonLogo size={'2.5rem'} />,
        currencyName: 'MATIC',
    },
    ETH: {
        chainId: Number(process.env.NEXT_PUBLIC_ETH_CHAIN_ID),
        graphUrl: process.env.NEXT_PUBLIC_ETH_GRAPH_URL,
        scanBase: process.env.NEXT_PUBLIC_ETH_SCAN_BASE,
        valveFactoryAddress: process.env.NEXT_PUBLIC_ETH_VALVE_FACTORY_ADDRESS,
        prepaymentFactoryAddress: process.env.NEXT_PUBLIC_ETH_PREPAYMENT_FACTORY_ADDRESS,
        waterfallFactoryAddress: process.env.NEXT_PUBLIC_ETH_WATERFALL_FACTORY_ADDRESS || '',
        defaultUsdPriceFeed: process.env.NEXT_PUBLIC_ETH_DEFAULT_USD_PRICE_FEED,
        icon: () => <FaEthereum size={'2.5rem'} />,
        currencyName: 'ETH',
    },
};

export const TOKENS_ADDRESSES: { [chainId: number]: { usdt: string; usdc: string; busd: string } } = {
    1: {
        usdt: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        usdc: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        busd: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    },
    5: {
        usdt: '0x50FB4816b0Fe856Fcb39359f91461d397D0F4767',
        usdc: '0xBe1dA5aCA0d97db003e663d6b895C7DaFED5d286',
        busd: '0x1f690a2CE013A4297D770158D4Aed5F286A2460f',
    },
    137: {
        usdt: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        usdc: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        busd: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    },
};
