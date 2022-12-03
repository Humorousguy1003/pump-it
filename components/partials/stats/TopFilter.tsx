/* eslint-disable @next/next/no-img-element */
import { useRecoilState } from 'recoil';

import { filterState } from '~/recoil/filters';

const TopFilter = () => {
    const [filters, setFilters] = useRecoilState(filterState);

    return (
        <div className="flex flex-wrap items-center justify-between mb-3">
            <div className="flex flex-wrap items-center gap-3">
                <select
                    className="py-2 px-3 w-40 mb-2 rounded-md border-2 border-light text-sm  flex items-center appearance-none"
                    onChange={(e) => {
                        setFilters({ ...filters, status: e.target.value });
                    }}
                    defaultValue="*"
                >
                    <option value="*" disabled>
                        All projects
                    </option>
                    <option value="live">Sale Live</option>
                    <option value="end">Sale Ended</option>
                    <option value="coming">Coming Soon</option>
                </select>

                <select
                    className="py-2 px-3 w-40 mb-2 rounded-md border-2 border-light text-sm  flex items-center appearance-none"
                    onChange={(e) => {
                        setFilters({ ...filters, chainId: e.target.value });
                    }}
                    defaultValue="*"
                >
                    <option value="*" disabled>
                        All chains
                    </option>
                    <option value={1}>Ethereum</option>
                    <option value={64}>BSC</option>
                </select>
            </div>
        </div>
    );
};

export default TopFilter;
