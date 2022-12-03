/* eslint-disable @next/next/no-img-element */
import { ReactElement, Suspense, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import Fallback from '~/components/features/Fallback';
import ProjectGridItem from '~/components/features/ProjectGridItem';
import Layout from '~/components/layouts/LayoutDefault';
import TopFilter from '~/components/partials/explore/TopFilter';
import { filterState } from '~/recoil/filters';
import { favoriteProjectsState } from '~/recoil/projects';
import { Project, ProjectsResponse } from '~/types/projects';

import { useLazyLoading } from '~/utils/hooks';

const FavoritePage = () => {
    const loading = useLazyLoading();

    if (loading) return <Fallback />;

    return (
        <Suspense fallback={<Fallback />}>
            <Favorite />
        </Suspense>
    );
};

const Favorite = () => {
    const [filters, setFilters] = useRecoilState(filterState);
    const projectsResponse: ProjectsResponse = useRecoilValue(
        favoriteProjectsState
    );
    const [data, setData] = useState<Project[]>([]);
    const resetFilters = useResetRecoilState(filterState);
    const [hasMore, setHasMore] = useState(true);

    const scrollHandler = () => {
        if (hasMore) {
            setFilters({
                ...filters,
                page: filters.page + 1,
            });
        }
    };

    useEffect(() => {
        if (filters.page === 1) {
            setData([...projectsResponse.projects]);
        } else setData([...data, ...projectsResponse.projects]);

        if (projectsResponse.totalCount <= filters.page * filters.pageSize) {
            setHasMore(false);
        }
    }, [projectsResponse]);

    return (
        <div className="xl:container container max-w-full mt-[60px] mb-[100px]">
            <h3 className="mb-[60px] text-center">Explore Your Favorites</h3>
            <TopFilter />
            {data.length === 0 ? (
                <div className="flex gap-3.5 py-5 px-4">No projects found</div>
            ) : (
                <InfiniteScroll
                    dataLength={data.length}
                    next={scrollHandler}
                    className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4 md:gap-10 gap-y-10"
                    hasMore={hasMore}
                    loader={
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 relative">
                            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                        </div>
                    }
                >
                    {data.map((project, index: number) => (
                        <div className="col-span-1" key={index}>
                            <ProjectGridItem project={project} />
                        </div>
                    ))}
                </InfiniteScroll>
            )}

            <div className="flex items-center justify-between"></div>
        </div>
    );
};

FavoritePage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default FavoritePage;
