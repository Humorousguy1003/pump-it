import type { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import { NextComponentType, NextPage, NextPageContext } from 'next';
import { RecoilRoot } from 'recoil';
import { SWRConfig } from 'swr';
import axios, { AxiosRequestConfig } from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import { SessionProvider, useSession } from 'next-auth/react';

import Fallback from '~/components/features/Fallback';
import ErrorBoundaryFallback from '~/components/features/ErrorBoundaryFallback';

import 'swiper/css';
import 'swiper/css/virtual';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import { Session } from 'next-auth';

export const fetcher =
    (options: AxiosRequestConfig = {}) =>
    async (url: string) => {
        const res = await axios({
            baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
            url,
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            withCredentials: true,
            ...options,
        });

        if (!res.data) {
            return <div>Error occured loading data</div>;
        }

        return res.data;
    };

interface AuthEnabledComponentConfig {
    authEnabled: boolean;
}

type NextComponentWithAuth = NextComponentType<NextPageContext, any, {}> &
    Partial<AuthEnabledComponentConfig>;

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout & NextComponentWithAuth;
} & { pageProps: { session?: Session } };

function MyApp({
    Component,
    pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page: any) => page);

    return (
        <SWRConfig
            value={{
                // refreshInterval: 60000,
                fetcher: fetcher(),
            }}
        >
            <SessionProvider session={session}>
                <RecoilRoot>
                    <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
                        {Component.authEnabled ? (
                            <Auth>
                                {getLayout(<Component {...pageProps} />)}
                            </Auth>
                        ) : (
                            getLayout(<Component {...pageProps} />)
                        )}
                    </ErrorBoundary>
                </RecoilRoot>
            </SessionProvider>
        </SWRConfig>
    );
}

const Auth = ({ children }: { children: any }) => {
    const { data: session } = useSession({ required: true });
    const isUser = !!session?.user;
    if (isUser) {
        return children;
    }

    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    return <Fallback />;
};

export default MyApp;
