export interface ChainOption {
    id: number;
    name: string;
    image: string;
    tokenList: { name: string; address: string }[];
}

export const chainList: ChainOption[] = [
    {
        id: 1,
        name: 'Ethereum',
        image: '/ethereum-icon.svg',
        tokenList: [
            {
                name: 'ETH',
                address: '0x0000000000000000000000000000000000000000',
            },
            {
                name: 'USDT',
                address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            },
        ],
    },
    {
        id: 56,
        name: 'Binance',
        image: '/bsc-icon.svg',
        tokenList: [
            {
                name: 'BNB',
                address: '0x0000000000000000000000000000000000000000',
            },
            {
                name: 'BUSD',
                address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
            },
        ],
    },
];
