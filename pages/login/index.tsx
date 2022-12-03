/* eslint-disable @next/next/no-img-element */

import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import ALink from '~/components/features/ALink';

import LayoutAuth from '~/components/layouts/LayoutAuth';
import { isLoadingState } from '~/recoil/other';

import { LoginData } from '~/types/auth';
import { useAuth } from '~/utils/hooks';

const LoginPage = () => {
    const router = useRouter();
    const [, setIsLoading] = useRecoilState(isLoadingState);

    // const { login } = useAuth({
    //     middleware: 'guest',
    //     redirectIfAuthenticated: '/',
    // });

    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState<string | null>(null);

    const { handleSubmit, register } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async ({ email, password }: LoginData) => {
        // login({ email, password });
        setIsLoading(true);
        const res: any = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password,
            callbackUrl: `/`,
        });

        console.log(res);
        if (res?.error) {
            setIsLoading(false);
        } else {
            router.push(res?.url || '/');
            setIsLoading(false);
        }
    };

    return (
        <div className="xl:container container max-w-full mt-[60px] mb-[100px] flex items-center justify-center">
            <div className="w-full" style={{ maxWidth: '660px' }}>
                <h3 className="mb-[60px] text-center">Sign In</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-8">
                        <label
                            htmlFor=""
                            className="font-semibold block text-sm mb-4"
                        >
                            Email address
                        </label>
                        <input
                            type="text"
                            className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                            {...register('email', {
                                required: true,
                            })}
                            required
                            placeholder="email"
                        />
                    </div>
                    <div className="mb-8">
                        <label
                            htmlFor=""
                            className="font-semibold flex items-center justify-between text-sm mb-4"
                        >
                            Password
                            {/* <span className="text-sm font-medium cursor-pointer">
                                Forgot your password?{' '}
                                <span className="text-[#E2B877]">
                                    Send reset link
                                </span>
                            </span> */}
                        </label>
                        <input
                            type="password"
                            className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                            {...register('password', {
                                required: true,
                            })}
                            required
                            placeholder="Password"
                        />
                    </div>
                    <button className="w-full rounded-full bg-red text-white py-4 font-bold mb-8">
                        Sign In
                    </button>

                    <p className="text-sm font-medium text-center">
                        Don&apos;t have an account?{' '}
                        <ALink href="/signup" className="text-red">
                            Sign Up
                        </ALink>
                    </p>
                </form>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                permanent: false,
                destination: '/',
            },
        };
    } else {
        return { props: {} };
    }
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
    return <LayoutAuth>{page}</LayoutAuth>;
};

export default LoginPage;
