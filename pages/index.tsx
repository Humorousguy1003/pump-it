/* eslint-disable @next/next/no-img-element */
/* update for PR*/
import Image from 'next/image';
import { ReactElement, Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import ALink from '~/components/features/ALink';
import Fallback from '~/components/features/Fallback';
import ArrowRight from '~/components/features/icons/ArrowRight';
import ProjectGridItem from '~/components/features/ProjectGridItem';
import Layout from '~/components/layouts/LayoutDefault';
import CategorySlider from '~/components/partials/home/CategorySlider';
import HowItWorks from '~/components/partials/home/HowItWorks';
import { homePageState } from '~/recoil/pages';

import { useLazyLoading } from '~/utils/hooks';
import { useWeb3 } from '~/utils/web3';

const HomePage = () => {
    const loading = useLazyLoading();

    if (loading) return <Fallback />;

    return (
        <Suspense fallback={<Fallback />}>
            <HomeSection />
        </Suspense>
    );
};

const HomeSection = () => {
    const { categories, projects } = useRecoilValue(homePageState);

    return (
        <div className="pb-[130px]">
            <div
                style={{
                    backgroundImage: 'url(/home-banner-bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="xl:container container max-w-full flex gap-10 py-24 items-center">
                    <div className="flex-1">
                        <h2 className="mb-8">
                            Pump the most promising NFT and blockchain projects
                        </h2>
                        <p className="font-medium text-base mb-12">
                            The First Meme Token Of 2022 In Memory of Mr Pump IT
                            himself to keep his legacy alive! The First OG of
                            Crypto Memes #HeSoldPumpIT
                        </p>
                        <div className="flex flex-wrap items-center gap-6">
                            <ALink
                                href="/explore/grid"
                                className="flex items-center gap-4 rounded-full bg-red p-1 text-white hover-arrow-right"
                            >
                                <div className="h-11 w-11 flex items-center justify-center bg-white rounded-full">
                                    <img
                                        src="/star.svg"
                                        alt="icon"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                                <h4 className="text-base text-white font-bold">
                                    Explore
                                </h4>
                                <ArrowRight className="mr-5" />
                            </ALink>
                            <ALink
                                href="/projects/create"
                                className="flex items-center gap-4 rounded-full p-1 text-black bg-white hover-arrow-right"
                            >
                                <div className="h-11 w-11 flex items-center justify-center bg-black rounded-full">
                                    <img
                                        src="/atom.svg"
                                        alt="icon"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                                <h4 className="text-base font-bold">Create</h4>
                                <ArrowRight className="mr-5" />
                            </ALink>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <Image
                            src="/cup.svg"
                            alt="cup"
                            width={548}
                            height={548}
                        />
                    </div>
                </div>
            </div>
            <div className="xl:container container max-w-full">
                <div className="flex items-center justify-between mt-[150px] mb-16">
                    <h3 className="">Trending Raises</h3>
                    <div className="flex gap-4 items-center font-semibold text-base hover:text-red transition">
                        <span className="w-12 bg-black h-0.5"></span>
                        <ALink href="/explore/grid">VIEW ALL</ALink>
                    </div>
                </div>
                {projects.length > 0 && (
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        slidesPerView={1}
                        breakpoints={{
                            576: {
                                slidesPerView: 2,
                            },
                            992: {
                                spaceBetween: 40,
                                slidesPerView: 3,
                            },
                        }}
                        navigation
                        className="navigation-outer navigation-arrow mb-[150px]"
                    >
                        {projects.map((item, index) => (
                            <SwiperSlide key={index}>
                                <ProjectGridItem project={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
                <div className="flex items-center justify-between mt-[150px] mb-16">
                    <h3 className="">Browse by Category</h3>
                </div>
            </div>
            {categories.length > 0 && (
                <CategorySlider categories={categories} />
            )}
            <HowItWorks />
        </div>
    );
};

HomePage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default HomePage;
