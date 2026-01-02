
import React from 'react';
import { delay, motion } from 'framer-motion';

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


    return (
        <>
            <Swiper
                spaceBetween={30}
                effect={"fade"}
                navigation={true}
                loop={true}
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
                <SwiperSlide>
                    <div className="relative w-full  h-[70dvh] overflow-hidden inline-block">
                        <img
                            className="absolute inset-0 h-[70dvh] w-full object-cover animate-float-circle"
                            // src="https://swiperjs.com/demos/images/nature-1.jpg"
                            src="/images/alidaad_banner_1.jpeg"
                        />
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/20 space-y-3 md:space-y-5">
                            <motion.h2 variants={textStyle} className="text-gray-50 text-3xl md:text-4xl px-4 font-medium">Welcome !</motion.h2>
                            <motion.p variants={textStyle} className="text-gray-100 text-sm md:text-base px-4">Shop the latest trends and essentials at prices made just for you.</motion.p>
                            <motion.div variants={textStyle}
                                onClick={() => router.push('/products')}
                            >
                                <MorphyButton size="lg">
                                    See All
                                </MorphyButton>
                            </motion.div>
                        </motion.div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="relative w-full h-[70dvh] overflow-hidden inline-block">
                        <img
                            className="absolute inset-0 h-[70dvh] object-cover animate-float-circle"
                            // src="https://swiperjs.com/demos/images/nature-2.jpg"
                            src="/images/alidaad_banner_2.jpeg"
                        />
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/20 space-y-3 md:space-y-5">
                            <motion.h2 variants={textStyle} className="text-gray-50 text-3xl md:text-4xl px-4 font-medium">Pure Luxury !</motion.h2>
                            <motion.p variants={textStyle} className="text-gray-100 text-sm md:text-base px-4">Elegance shouldn’t just be admired, it should be lived.</motion.p>
                            <motion.div variants={textStyle}
                                onClick={() => router.push('/products')}
                            >
                                <MorphyButton size="lg">
                                    See All
                                </MorphyButton>
                            </motion.div>
                        </motion.div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="relative w-full h-[70dvh]  overflow-hidden inline-block">
                        <img
                            className="absolute inset-0 h-[70dvh] object-cover animate-float-circle"
                            // src="https://swiperjs.com/demos/images/nature-3.jpg"
                            src="/images/banner_8.jpg"
                        />
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/20 space-y-3 md:space-y-5">
                            <motion.h2 variants={textStyle} className="text-gray-50 text-3xl md:text-4xl px-4 font-medium">Timepathy !</motion.h2>
                            <motion.p variants={textStyle} className="text-gray-100 text-sm md:text-base px-4">More than a watch — your health, style, and lifestyle in one smart device.</motion.p>
                            <motion.div variants={textStyle}
                                onClick={() => router.push('/products')}
                            >
                                <MorphyButton size="lg">
                                    See All
                                </MorphyButton>
                            </motion.div>
                        </motion.div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="relative w-full h-[70dvh] overflow-hidden inline-block">
                        <img
                            className="absolute inset-0 h-[70dvh] object-cover animate-float-circle"
                            // src="https://swiperjs.com/demos/images/nature-4.jpg"
                            src="/images/banner_1.jpg"
                        />
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/20 space-y-3 md:space-y-5">
                            <motion.h2 variants={textStyle} className="text-gray-50 text-3xl md:text-4xl px-4 font-medium">Everyday Style !</motion.h2>
                            <motion.p variants={textStyle} className="text-gray-100 text-sm md:text-base px-4">Wear it, love it, live in it. Casual looks that never feel boring.</motion.p>
                            <motion.button variants={textStyle}
                                onClick={() => router.push('/products')}
                            >
                                <MorphyButton size="lg">
                                    See All
                                </MorphyButton>
                            </motion.button>
                        </motion.div>
                    </div>
                </SwiperSlide>
            </Swiper>

        </>
    );
};

export default Banner;