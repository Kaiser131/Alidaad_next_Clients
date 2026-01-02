"use client";

import React from 'react';
import { delay, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/Hooks/Axios/useAxiosSecure';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
// import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MorphyButton } from "@/components/ui/morphy-button";
import './styles.css';

// import required modules
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { useRouter } from 'next/navigation';

const Banner = () => {
    const router = useRouter();
    const axiosSecure = useAxiosSecure();

    // Fetch banners from database
    const { data: banners = [], isLoading } = useQuery({
        queryKey: ['banners'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/banners');
            return data;
        }
    });

    const container = {
        hidden: { opacity: 0, },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.5, duration: 2, ease: "easeInOut", delayChildren: 0.3
            }
        }
    };

    const textStyle = {
        hidden: {
            opacity: 0, y: 20
        },
        show: {
            opacity: 1, y: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
        }
    };

    // Show loading or fallback if no banners
    if (isLoading) {
        return (
            <div className="w-full h-[70dvh] bg-gray-200 animate-pulse flex items-center justify-center">
                <p className="text-gray-500">Loading banners...</p>
            </div>
        );
    }

    if (banners.length === 0) {
        // Fallback banner if database is empty
        return (
            <div className="relative w-full h-[70dvh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center text-center space-y-5 p-4">
                    <h2 className="text-white text-4xl font-medium">Welcome to Al-Idaat</h2>
                    <p className="text-white text-base">Your one-stop shop for quality products</p>
                    <MorphyButton size="lg" onClick={() => router.push('/products')}>
                        See All Products
                    </MorphyButton>
                </div>
            </div>
        );
    }

    return (
        <>
            <Swiper
                spaceBetween={30}
                effect={"fade"}
                navigation={true}
                loop={banners.length > 1}
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                modules={[EffectFade, Pagination, Autoplay]}
                className="mySwiper"
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={banner._id || index}>
                        <div className="relative w-full h-[70dvh] overflow-hidden inline-block">
                            <img
                                className="absolute inset-0 h-[70dvh] w-full object-cover animate-float-circle"
                                src={banner.image}
                                alt={banner.heading || `Banner ${index + 1}`}
                                loading="eager"
                                fetchPriority="high"
                                style={{
                                    imageRendering: '-webkit-optimize-contrast',
                                    imageRendering: 'crisp-edges',
                                }}
                                onError={(e) => {
                                    e.target.src = '/images/placeholder-banner.jpg';
                                }}
                            />
                            <motion.div
                                variants={container}
                                initial="hidden"
                                whileInView="show"
                                className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/20 space-y-3 md:space-y-5"
                            >
                                <motion.h2
                                    variants={textStyle}
                                    className="text-gray-50 text-3xl md:text-4xl px-4 font-medium"
                                >
                                    {banner.heading}
                                </motion.h2>
                                {banner.text && (
                                    <motion.p
                                        variants={textStyle}
                                        className="text-gray-100 text-sm md:text-base px-4"
                                    >
                                        {banner.text}
                                    </motion.p>
                                )}
                                <motion.div
                                    variants={textStyle}
                                    onClick={() => router.push('/products')}
                                >
                                    <MorphyButton size="lg">
                                        See All
                                    </MorphyButton>
                                </motion.div>
                            </motion.div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
};

export default Banner;
