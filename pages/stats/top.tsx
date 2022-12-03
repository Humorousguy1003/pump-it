/* eslint-disable @next/next/no-img-element */
import { ReactElement, Suspense, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import ALink from '~/components/features/ALink';

import Fallback from '~/components/features/Fallback';
import Pagination from '~/components/features/Pagination';
import StatListItem from '~/components/features/StatListItem';
import Layout from '~/components/layouts/LayoutDefault';
import TopFilter from '~/components/partials/stats/TopFilter';
import { filterState } from '~/recoil/filters';

import { projectsState } from '~/recoil/projects';
import { Project, ProjectsResponse } from '~/types/projects';
import { useLazyLoading } from '~/utils/hooks';

const StatsTopPage = () => {
    return (
        <Suspense fallback={<Fallback />}>
            <ExploreList />
        </Suspense>
    );
};

const ExploreList = () => {
    const [filters, setFilters] = useRecoilState(filterState);
    const resetFilters = useResetRecoilState(filterState);
    const projectsResponse: ProjectsResponse = useRecoilValue(projectsState);
    const { totalCount, projects } = projectsResponse;

    return (
        <div className="xl:container container max-w-full mt-[60px] mb-[100px]">
            <h3 className="mb-[60px] text-center">Stat Page</h3>
            <div className="flex items-center justify-center gap-20">
                <span className="relative pb-4 text-xl font-semibold">
                    Top
                    <span className="absolute left-0 right-0 bottom-0 h-[5px] bg-red rounded-t-full"></span>
                </span>
                <ALink
                    href="/stats/trending"
                    className="pb-3 border-5 border-transparent text-xl font-semibold"
                >
                    Trending
                </ALink>
            </div>
            <hr className="border-veryLight mb-6" />
            <TopFilter />
            <div className="rounded-xl mb-5 overflow-hidden">
                <div className="overflow-auto">
                    <table className="min-w-full text-left">
                        <thead className="text-[#707480]">
                            <tr>
                                <th className="px-4 py-5 font-normal text-sm min-w-[50px]"></th>
                                <th className="px-4 py-5 font-normal text-sm min-w-[200px] w-[40%]">
                                    Project name
                                </th>
                                <th className="px-4 py-5 font-normal text-sm min-w-[150px]">
                                    Chain
                                </th>
                                <th className="px-4 py-5 font-normal text-sm min-w-[100px] text-right">
                                    Amount raised
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length > 0 ? (
                                projects.map(
                                    (project: Project, index: number) => (
                                        <StatListItem
                                            key={project.id}
                                            project={project}
                                            index={index}
                                        />
                                    )
                                )
                            ) : (
                                <tr className="">
                                    <td className="flex gap-3.5 py-5 px-4">
                                        No projects found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

StatsTopPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export async function getServerSideProps() {
    return {
        props: {},
    };
}

export default StatsTopPage;
