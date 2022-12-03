/* eslint-disable @next/next/no-img-element */
import { ReactElement, Suspense, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import Fallback from '~/components/features/Fallback';
import Pagination from '~/components/features/Pagination';
import ProjectListItem from '~/components/features/ProjectIistItem';
import Layout from '~/components/layouts/LayoutDefault';
import TopFilter from '~/components/partials/explore/TopFilter';
import { filterState } from '~/recoil/filters';
import { updateIDState } from '~/recoil/other';

import { projectsState } from '~/recoil/projects';
import { Project, ProjectsResponse } from '~/types/projects';
import { useLazyLoading } from '~/utils/hooks';

const ExploreListPage = () => {
    // const loading = useLazyLoading();

    // if (loading) return <Fallback />;

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
            <h3 className="mb-[60px] text-center">Explore Projects</h3>
            <TopFilter />

            <div className="rounded-xl mb-5 border border-veryLight overflow-hidden">
                <div className="overflow-auto">
                    <table className="min-w-full text-left">
                        <thead className="border-b border-veryLight bg-[#FAFAFA]">
                            <tr>
                                <th className="px-4 py-5 font-normal text-sm min-w-[180px] w-[30%]">
                                    Project Name
                                </th>
                                <th className="px-4 py-5 font-normal text-sm min-w-[180px]">
                                    Status
                                </th>
                                <th className="px-4 py-5 font-normal text-sm min-w-[150px]">
                                    Participants
                                </th>
                                <th className="px-4 py-5 font-normal text-sm min-w-[150px]">
                                    Raise Amount
                                </th>
                                <th className="px-4 py-5 font-normal text-sm min-w-[150px] w-[10%] text-right">
                                    Ends in
                                </th>
                                <th className="px-4 py-5 font-normal text-sm min-w-[100px] w-[8%] text-right">
                                    Chain
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length > 0 ? (
                                projects.map((project: Project) => (
                                    <ProjectListItem
                                        key={project.id}
                                        project={project}
                                    />
                                ))
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
            <div className="flex items-center justify-between">
                <select
                    className="py-2 px-3 w-40 rounded-md border-2 border-light text-sm  flex items-center appearance-none"
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            pageSize: Number(e.target.value),
                        })
                    }
                >
                    <option value={9}>Show 9 results</option>
                    <option value={15}>Show 15 results</option>
                    <option value={21}>Show 21 results</option>
                </select>
                <Pagination totalCount={totalCount} />
            </div>
        </div>
    );
};

ExploreListPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export async function getServerSideProps() {
    return {
        props: {},
    };
}

export default ExploreListPage;
