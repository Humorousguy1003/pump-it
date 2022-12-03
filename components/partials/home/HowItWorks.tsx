/* eslint-disable @next/next/no-img-element */
import { Swiper, SwiperSlide } from 'swiper/react';
import ALink from '~/components/features/ALink';

const HowItWorks = () => {
    return (
        <div className="xl:container container max-w-full mt-[150px]">
            <div className="relative">
                <div className="flex items-center justify-center mx-auto">
                    <img
                        src="/hiw.svg"
                        alt="banner"
                        className="w-auto min-h-[580px] object-cover"
                    />
                </div>
                <div className="absolute top-0 left-0 right-0 bottom-0">
                    <h3 className="text-center mt-[76px] mb-[68px]">
                        How it Works
                    </h3>
                    <Swiper
                        spaceBetween={16}
                        slidesPerView={1}
                        breakpoints={{
                            992: {
                                slidesPerView: 3,
                                spaceBetween: 40,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                        }}
                        className="item-shadow"
                    >
                        <SwiperSlide>
                            <div
                                className="py-9 px-8 bg-white"
                                style={{
                                    boxShadow:
                                        '0px 16px 22px rgba(53, 69, 92, 0.04)',
                                }}
                            >
                                <img
                                    src="/wallet-Icon.svg"
                                    alt="icon"
                                    width={60}
                                    height={60}
                                    className="mb-8"
                                />
                                <h5 className="text-xl font-semibold mb-3">
                                    Set up your wallet
                                </h5>
                                <p className="text-sm ">
                                    Once you&apos;ve{' '}
                                    <span className="text-red font-semibold">
                                        set up your wallet
                                    </span>{' '}
                                    of choice, connect it to OpenSea by clicking
                                    the wallet icon in the top right corner.
                                </p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div
                                className="py-9 px-8 bg-white"
                                style={{
                                    boxShadow:
                                        '0px 16px 22px rgba(53, 69, 92, 0.04)',
                                }}
                            >
                                <img
                                    src="/gear-icon.svg"
                                    alt="icon"
                                    width={60}
                                    height={60}
                                    className="mb-8"
                                />
                                <h5 className="text-xl font-semibold mb-3">
                                    Create your project
                                </h5>
                                <p className="text-sm ">
                                    Click{' '}
                                    <ALink
                                        href="/projects/create"
                                        className="text-red font-semibold"
                                    >
                                        Create
                                    </ALink>{' '}
                                    and set up your project. Add social links, a
                                    description, profile &amp; banner images,
                                    and set a secondary sales fee.
                                </p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div
                                className="py-9 px-8 bg-white"
                                style={{
                                    boxShadow:
                                        '0px 16px 22px rgba(53, 69, 92, 0.04)',
                                }}
                            >
                                <img
                                    src="/rocket-icon.svg"
                                    alt="icon"
                                    width={60}
                                    height={60}
                                    className="mb-8"
                                />
                                <h5 className="text-xl font-semibold mb-3">
                                    List for sale
                                </h5>
                                <p className="text-sm ">
                                    Choose between auctions, fixed-price
                                    listings, and declining-price listings. You
                                    choose how you want to sell!
                                </p>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
