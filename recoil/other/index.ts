import { atom } from 'recoil';
import { web3InitialState, Web3ProviderState } from '~/utils/web3';

export const isLoadingState = atom({
    key: 'isLoading',
    default: false,
});

export const updateIDState = atom({
    key: 'updateID',
    default: 1,
});

export const web3State = atom<Web3ProviderState>({
    key: 'web3',
    default: {
        provider: null,
        web3Provider: null,
        address: null,
        network: null,
        signer: null,
        connect: null,
        disconnect: null,
    },
    dangerouslyAllowMutability: true,
});
