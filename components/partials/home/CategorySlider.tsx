/* eslint-disable @next/next/no-img-element */
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import CategoryCard from '~/components/features/CategoryCard';

import { Category } from '~/types/projects';

interface CategorySliderProps {
    categories: Category[];
}

const CategorySlider = ({ categories }: CategorySliderProps) => {
    return (
        <div className="relative">
            <div
                className="h-[414px]"
                style={{
                    backgroundImage: 'url(/category-bg.svg)',
                    backgroundSize: 'cover',
                }}
            ></div>
            <div className="absolute top-0 left-0 right-0">
                <div className="xl:container container max-w-full">
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        slidesPerView={2}
                        breakpoints={{
                            576: {
                                slidesPerView: 3,
                            },
                            768: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                        }}
                        navigation
                        className="navigation-top item-shadow mb-[150px] -mt-[125px] category-slider"
                    >
                        {categories.map((category, index) => (
                            <SwiperSlide key={index}>
                                <CategoryCard category={category} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default CategorySlider;
