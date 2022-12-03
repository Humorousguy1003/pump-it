import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import { useAuth } from '~/utils/hooks';
import ALink from '../ALink';
import HeaderSearchBox from './HeaderSearchBox';

/* eslint-disable @next/next/no-img-element */
const Header = () => {
    const session = useSession();
    return (
        <div
            className="sticky"
            style={{ boxShadow: '0px 6px 16px rgba(37, 52, 56, 0.05)' }}
        >
            <div className="xl:container container h-[72px] flex items-center max-w-full sticky">
                <ALink href="/">
                    <img
                        src="/logo.svg"
                        className="mr-16"
                        alt="logo"
                        width={136}
                        height={40}
                    />
                </ALink>
                <div className="items center md:flex gap-10 mr-auto hidden">
                    <ALink
                        href="/"
                        className="font-semibold text-sm py-2 border-b-2 border-solid border-transparent hover:border-black transition"
                    >
                        Home
                    </ALink>
                    <ALink
                        href="/explore/grid"
                        className="font-semibold text-sm py-2 border-b-2 border-solid border-transparent hover:border-black transition"
                    >
                        Explore
                    </ALink>
                    <ALink
                        href="/stats/top"
                        className="font-semibold text-sm py-2 border-b-2 border-solid border-transparent hover:border-black transition"
                    >
                        Stats
                    </ALink>
                    <ALink
                        href="/projects/create"
                        className="font-semibold text-sm py-2 border-b-2 border-solid border-transparent hover:border-black transition"
                    >
                        Create
                    </ALink>
                    <ALink
                        href="/help"
                        className="font-semibold text-sm py-2 border-b-2 border-solid border-transparent hover:border-black transition"
                    >
                        Help
                    </ALink>
                </div>
                <div className="flex items-center gap-8 ml-auto">
                    <HeaderSearchBox />
                    {session.status !== 'authenticated' ? (
                        <ALink href="/login">
                            <img
                                src="/user.svg"
                                alt="user"
                                width={24}
                                height={24}
                            />
                        </ALink>
                    ) : (
                        <Menu
                            as="div"
                            className="relative inline-block text-left"
                        >
                            <Menu.Button>
                                <img
                                    src="/user.svg"
                                    alt="user"
                                    width={24}
                                    height={24}
                                />
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="px-1 py-1 ">
                                        <Menu.Item>
                                            <ALink
                                                className="group flex w-full items-center rounded-md px-2 py-2 font-semibold text-sm"
                                                href="/favorites"
                                            >
                                                Favorites
                                            </ALink>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <ALink
                                                className="group flex w-full items-center rounded-md px-2 py-2 font-semibold text-sm"
                                                href="/invested"
                                            >
                                                Invested
                                            </ALink>
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
