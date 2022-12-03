/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import { KeyboardEvent, useRef } from 'react';
import { useRecoilState } from 'recoil';

import ALink from '~/components/features/ALink';

import { filterState } from '~/recoil/filters';

const TopFilter = () => {
    const router = useRouter();
    const searchRef = useRef<HTMLInputElement>(null);
    const [filters, setFilters] = useRecoilState(filterState);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setFilters({
                ...filters,
                searchTerm: searchRef.current!.value,
            });
        }
    };

    return (
        <div className="flex flex-wrap items-center justify-between mb-3">
            <div className="relative text-sm mr-3 mb-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <button
                        type="button"
                        className="focus:shadow-outline p-1 text-dark-100focus:outline-none"
                        onClick={() =>
                            setFilters({
                                ...filters,
                                searchTerm: searchRef.current!.value,
                            })
                        }
                    >
                        <img
                            src="/search.svg"
                            alt="icon"
                            width={20}
                            height={20}
                        />
                    </button>
                </span>
                <input
                    ref={searchRef}
                    onKeyDown={handleKeyDown}
                    type="search"
                    className="text-md h-10  rounded-lg border border-light py-2 pl-12 placeholder-dark-100 shadow-none focus:outline-none focus:ring-transparent sm:w-[360px]"
                    placeholder="Search projects..."
                    autoComplete="off"
                />
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <select
                    className="py-2 px-3 w-40 mb-2 rounded-md border-2 border-light text-sm  flex items-center appearance-none"
                    onChange={(e) => {
                        setFilters({ ...filters, status: e.target.value });
                    }}
                    value={filters.status}
                >
                    <option value="*">Status</option>
                    <option value="live">Sale Live</option>
                    <option value="end">Sale Ended</option>
                    <option value="coming">Coming Soon</option>
                </select>
                <select
                    className="py-2 px-3 w-40 mb-2 rounded-md border-2 border-light text-sm  flex items-center appearance-none"
                    defaultValue="*"
                    onChange={(e) => {
                        setFilters({ ...filters, raiseAmount: e.target.value });
                    }}
                    value={filters.raiseAmount}
                >
                    <option value="*">Raise Amount</option>
                    <option value={1000}>1000</option>
                    <option value={2000}>2000</option>
                    <option value={3000}>3000</option>
                    <option value={4000}>4000</option>
                    <option value={5000}>5000</option>
                </select>
                <select
                    className="py-2 px-3 w-40 mb-2 rounded-md border-2 border-light text-sm  flex items-center appearance-none"
                    onChange={(e) => {
                        setFilters({ ...filters, chainId: e.target.value });
                    }}
                    value={filters.chainId}
                >
                    <option value="*">Chain</option>
                    <option value={1}>Ethereum</option>
                    <option value={64}>BSC</option>
                </select>
                {router.pathname.includes('explore') && (
                    <div className="flex border border-light rounded-md overflow-hidden mb-2">
                        <ALink
                            href="/explore/grid"
                            className="h-10 w-10 flex items-center justify-center border-r-veryLight border-r"
                            style={{
                                backgroundColor: router.pathname.includes(
                                    'grid'
                                )
                                    ? '#F4F5F9'
                                    : '#FFFFFF',
                            }}
                        >
                            <img
                                src="/grid-icon.svg"
                                alt="icon"
                                width={24}
                                height={24}
                            />
                        </ALink>
                        <ALink
                            href="/explore/list"
                            className="h-10 w-10 flex items-center justify-center"
                            style={{
                                backgroundColor: router.pathname.includes(
                                    'list'
                                )
                                    ? '#F4F5F9'
                                    : '#FFFFFF',
                            }}
                        >
                            <img
                                src="/list-icon.svg"
                                alt="icon"
                                width={24}
                                height={24}
                            />
                        </ALink>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopFilter;
