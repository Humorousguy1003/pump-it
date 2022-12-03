import { useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { toast } from 'react-toastify';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { web3State } from '~/recoil/other';

export type Web3ProviderState = {
    provider: any;
    web3Provider: ethers.providers.Web3Provider | null | undefined;
    address: string | null | undefined;
    network: ethers.providers.Network | null | undefined;
    chainId?: number | null;
    signer: any;
    connect: (() => Promise<void>) | null;
    disconnect: (() => Promise<void>) | null;
};

export const web3InitialState: Web3ProviderState = {
    provider: null,
    web3Provider: null,
    address: null,
    network: null,
    signer: null,
    connect: null,
    disconnect: null,
    chainId: null,
};

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: '0267a87b8abb49379bf3a5b7c8e2f4d7', // required
            rpc: {
                56: 'https://bsc-dataseed3.defibit.io',
                97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
            },
        },
    },
};

let web3Modal: Web3Modal | null;
if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: true,
        providerOptions, // required
    });
}

export const useWeb3 = () => {
    const [web3Value, setWeb3Value] = useRecoilState(web3State);
    const resetWeb3 = useResetRecoilState(web3State);
    const { provider, web3Provider, address, network, signer, chainId } =
        web3Value;

    const connect = useCallback(async () => {
        if (web3Modal) {
            try {
                //         const provider: any = new ethers.providers.Web3Provider(instance);
                //         await provider.send('eth_requestAccounts', []);
                //         const signer = provider.getSigner();

                //         const address = await signer.getAddress();
                const provider = await web3Modal.connect();
                const web3Provider = new ethers.providers.Web3Provider(
                    provider
                );
                const signer = web3Provider.getSigner();
                const address = await signer.getAddress();
                const network = await web3Provider.getNetwork();
                // REMOVE THIS ON MAINNET
                const chainId =
                    Number(network.chainId) === 4
                        ? 1
                        : Number(network.chainId) === 97
                        ? 56
                        : Number(network.chainId);

                setWeb3Value({
                    ...web3Value,
                    provider,
                    web3Provider,
                    address,
                    signer,
                    network,
                    chainId,
                });
            } catch (e) {
                console.log('connect error', e);
            }
        } else {
            console.error('No Web3Modal');
        }
    }, []);

    const disconnect = useCallback(async () => {
        if (web3Modal) {
            web3Modal.clearCachedProvider();
            if (
                provider?.disconnect &&
                typeof provider.disconnect === 'function'
            ) {
                await provider.disconnect();
            }
            toast.error('Disconnected from Web3');
            resetWeb3();
        } else {
            console.error('No Web3Modal');
        }
    }, [provider]);

    // Auto connect to the cached provider
    useEffect(() => {
        if (web3Modal && web3Modal.cachedProvider) {
            connect();
        }
    }, [connect]);

    // EIP-1193 events
    useEffect(() => {
        if (provider?.on) {
            const handleAccountsChanged = (accounts: string[]) => {
                toast.info('Changed Web3 Account');
                setWeb3Value({
                    ...web3Value,
                    address: accounts[0],
                });
            };

            // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
            const handleChainChanged = (_hexChainId: string) => {
                if (typeof window !== 'undefined') {
                    console.log('switched to chain...', _hexChainId);
                    toast.info('Web3 Network Changed');
                    window.location.reload();
                } else {
                    console.log('window is undefined');
                }
            };

            const handleDisconnect = (error: {
                code: number;
                message: string;
            }) => {
                // eslint-disable-next-line no-console
                console.log('disconnect', error);
                disconnect();
            };

            provider.on('accountsChanged', handleAccountsChanged);
            provider.on('chainChanged', handleChainChanged);
            provider.on('disconnect', handleDisconnect);

            // Subscription Cleanup
            return () => {
                if (provider.removeListener) {
                    provider.removeListener(
                        'accountsChanged',
                        handleAccountsChanged
                    );
                    provider.removeListener('chainChanged', handleChainChanged);
                    provider.removeListener('disconnect', handleDisconnect);
                }
            };
        }
    }, [provider, disconnect]);

    return {
        provider,
        web3Provider,
        address,
        network,
        signer,
        connect,
        disconnect,
        chainId,
    } as Web3ProviderState;
};
