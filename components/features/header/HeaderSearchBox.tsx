/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import { KeyboardEvent, useRef } from 'react';
import { useRecoilState } from 'recoil';

import { filterState } from '~/recoil/filters';

const HeaderSearchBox = () => {
    const router = useRouter();
    const searchRef = useRef<HTMLInputElement>(null);
    const [filters, setFilters] = useRecoilState(filterState);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setFilters({
                ...filters,
                searchTerm: searchRef.current!.value,
            });
            router.push('/explore/grid');
        }
    };

    return (
        <div className="relative hidden lg:block text-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <button
                    type="submit"
                    className="focus:shadow-outline p-1 text-dark-100focus:outline-none"
                    onClick={() =>
                        setFilters({
                            ...filters,
                            searchTerm: searchRef.current!.value,
                        })
                    }
                >
                    <img src="/search.svg" alt="icon" width={20} height={20} />
                </button>
            </span>
            <input
                ref={searchRef}
                onKeyDown={handleKeyDown}
                type="search"
                className="text-md h-10  rounded-lg border border-light py-2 pl-12 placeholder-dark-100 shadow-none focus:outline-none focus:ring-transparent w-[360px]"
                placeholder="Search projects..."
                autoComplete="off"
            />
        </div>
    );
};

export default HeaderSearchBox;
