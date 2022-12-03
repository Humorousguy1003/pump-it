import { useMemo } from 'react';
import { useRecoilState } from 'recoil';

import { filterState } from '~/recoil/filters';

interface PaginationProps {
    totalCount: number;
}

const Pagination = ({ totalCount }: PaginationProps) => {
    const [filters, setFilters] = useRecoilState(filterState);
    const lastPage = useMemo(() => {
        return Math.floor(totalCount / filters.pageSize) + 1;
    }, [totalCount, filters]);

    const goNext = () => {
        if (filters.page < lastPage) {
            setFilters({
                ...filters,
                page: filters.page + 1,
            });
        }
    };

    const goPrevious = () => {
        if (filters.page > 1) {
            setFilters({
                ...filters,
                page: filters.page - 1,
            });
        }
    };

    return (
        <div className="items-center flex gap-5">
            <h6 className="font-semibold">
                <span className="text-red">{filters.page}</span> /{' '}
                <span className="">{lastPage}</span>
            </h6>
            <div className="flex items-center gap-3">
                <button
                    className="flex items-center justify-center w-10 h-10 border border-veryLight rounded-lg"
                    disabled={filters.page <= 1}
                    onClick={goPrevious}
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M8.75019 0.986567C9.08327 1.30199 9.08327 1.81339 8.75019 2.12882L4.66236 6L8.75019 9.87118C9.08327 10.1866 9.08327 10.698 8.75019 11.0134C8.41712 11.3288 7.87709 11.3288 7.54402 11.0134L2.25 6L7.54402 0.986567C7.87709 0.671144 8.41712 0.671144 8.75019 0.986567Z"
                                fill="#22272F"
                            />
                        </g>
                    </svg>
                </button>
                <button
                    className="flex items-center justify-center w-10 h-10 border border-veryLight rounded-lg"
                    disabled={filters.page >= lastPage}
                    onClick={goNext}
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.24981 0.986567C2.91673 1.30199 2.91673 1.81339 3.24981 2.12882L7.33764 6L3.24981 9.87118C2.91673 10.1866 2.91673 10.698 3.24981 11.0134C3.58288 11.3288 4.12291 11.3288 4.45598 11.0134L9.75 6L4.45598 0.986567C4.12291 0.671144 3.58288 0.671144 3.24981 0.986567Z"
                            fill="#22272F"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
