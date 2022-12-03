/* eslint-disable @next/next/no-img-element */

import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ALink from '~/components/features/ALink';

import LayoutAuth from '~/components/layouts/LayoutAuth';

import { LoginData } from '~/types/auth';
import { useAuth } from '~/utils/hooks';

const LoginPage = () => {
    const router = useRouter();

    const { signup } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/',
    });

    const { handleSubmit, register, watch } = useForm({
        defaultValues: {
            email: '',
            password: '',
            confirm: '',
        },
    });

    const onSubmit = async ({ email, password }: LoginData) => {
        signup({ email, password });
    };

    return (
        <div className="xl:container container max-w-full mt-[60px] mb-[100px] flex items-center justify-center">
            <div className="w-full" style={{ maxWidth: '660px' }}>
                <h3 className="mb-[60px] text-center">Sign Up</h3>
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
                            className="block font-semibold text-sm mb-4"
                        >
                            Password
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
                    <div className="mb-8">
                        <label
                            htmlFor=""
                            className="block font-semibold text-sm mb-4"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                            {...register('confirm', {
                                required: true,
                            })}
                            required
                            placeholder="Password"
                        />
                    </div>
                    <button
                        className="w-full rounded-full bg-red text-white py-4 font-bold mb-8"
                        disabled={
                            watch('password') !== watch('confirm') ||
                            watch('password') === ''
                        }
                    >
                        Sign Up
                    </button>

                    <p className="text-sm font-medium text-center">
                        Already have an account?{' '}
                        <ALink href="/login" className="text-red">
                            Sign In
                        </ALink>
                    </p>
                </form>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
    return <LayoutAuth>{page}</LayoutAuth>;
};

export default LoginPage;
