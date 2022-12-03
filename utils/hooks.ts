import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { ApiClient } from '~/api';
import { AxiosResponse } from 'axios';
import { LoginData } from '~/types/auth';
import { toast } from 'react-toastify';
import { getAuthHeader, getAuthToken } from '.';

// Lazy loading
export const useLazyLoading = () => {
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 0);
    }, []);

    return loading;
};

interface useAuthProps {
    middleware?: string;
    redirectIfAuthenticated?: string;
}

export const useAuth = ({
    middleware,
    redirectIfAuthenticated,
}: useAuthProps) => {
    const router = useRouter();

    const {
        data: user,
        error,
        mutate,
    } = useSWR('/api/user', () =>
        ApiClient.get(
            '/api/user' + (getAuthToken() ? `?token=${getAuthToken()}` : ''),
            { headers: getAuthHeader() as any }
        )
            .then((res: AxiosResponse) => {
                if (
                    res.data.status === 'Token is Invalid' ||
                    res.data.status === 'Token is Expired'
                ) {
                    logout();
                    return null;
                } else if (
                    res.data.status === 'Authorization Token not found'
                ) {
                    return null;
                }
                return res.data;
            })
            .catch((error: any) => {
                if (error.response.status !== 409) throw error;

                router.push('/verify-email');
            })
    );

    const csrf = () => ApiClient.get('/sanctum/csrf-cookie');

    const signup = async ({ ...props }: any) => {
        ApiClient.post('/api/register', props)
            .then((res) => {
                console.log(res);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                mutate();
            })
            .catch((error: any) => {
                if (error.response.status !== 422) throw error;
                toast.error(
                    'You have an error while creating an account. ' + error
                );
            });
    };

    const login = async (data: LoginData) => {
        ApiClient.post('/api/login', data)
            .then((res) => {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                mutate();
            })
            .catch((error: any) => {
                toast.error('Your credentials do not match our records');
                return;
            });
    };

    const forgotPassword = async ({ setErrors, setStatus, email }: any) => {
        await csrf();

        setErrors([]);
        setStatus(null);

        ApiClient.post('/api/forgot-password', { email })
            .then((response: AxiosResponse) => setStatus(response.data.status))
            .catch((error: any) => {
                if (error.response.status !== 422) throw error;

                setErrors(Object.values(error.response.data.errors).flat());
            });
    };

    const resetPassword = async ({ setErrors, setStatus, ...props }: any) => {
        await csrf();

        setErrors([]);
        setStatus(null);

        ApiClient.post('/api/reset-password', {
            token: router.query.token,
            ...props,
        })
            .then((response: AxiosResponse) =>
                router.push('/login?reset=' + btoa(response.data.status))
            )
            .catch((error: any) => {
                if (error.response.status !== 422) throw error;

                setErrors(Object.values(error.response.data.errors).flat());
            });
    };

    const resendEmailVerification = ({ setStatus }: any) => {
        ApiClient.post('/api/email/verification-notification').then(
            (response: any) => setStatus(response.data.status)
        );
    };

    const logout = async () => {
        if (!error) {
            await ApiClient.post(
                '/api/logout' +
                    (getAuthToken() ? `?token=${getAuthToken()}` : ''),
                {
                    headers: getAuthHeader() as any,
                }
            ).then(() => mutate());
        }

        window.localStorage.removeItem('user');

        window.location.pathname = '/login';
    };

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated);
        if (middleware === 'auth' && error) logout();
    }, [user, error]);

    return {
        user,
        signup,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    };
};
