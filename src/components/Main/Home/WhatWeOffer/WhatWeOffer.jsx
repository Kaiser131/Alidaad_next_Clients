import React from 'react';
import { CursorHighlight } from "@/components/ui/cursor-highlight";
import FlipStack from "@/components/ui/flipstack";
import MotionCards, { MotionCardContent } from "@/components/ui/motioncards";
import { MorphoTextFlip } from "@/components/ui/morphotextflip";

import {
    Component,
    Layers,
    LayoutPanelTop,
    Package,
    Scroll,
    Shield,
    Truck,
    Headphones,
    Award,
} from "lucide-react";
import TextType from '../../../bits/TextType';


const WhatWeOffer = () => {


    const cards = [
        {
            id: 1,
            content: (
                <img
                    src="/images/alidaad_card_4.jpeg"
                    alt="Isabelle Carlos"
                    className="w-full h-full object-cover"
                />
            ),
        },
        {
            id: 2,
            content: (
                <img
                    src="/images/alidaad_card_2.jpeg"
                    alt="Lana Akash"
                    className="w-full h-full object-cover"
                />
            ),
        },
        {
            id: 3,
            content: (
                <img
                    src="/images/card_1.jpeg"
                    alt="Ahdeetai"
                    className="w-full h-full object-cover"
                />
            ),
        },
        {
            id: 4,
            content: (
                <img
                    src="/images/alidaad_card_1.jpeg"
                    alt="Isabella Mendes"
                    className="w-full h-full object-cover scale-x-[-1]"
                />
            ),
        },
        {
            id: 5,
            content: (
                <img
                    src="/images/alidaad_card_3.jpeg"
                    alt="Meera Patel"
                    className="w-full h-full object-cover"
                />
            ),
        },
    ];
    return (
        // <div className='mx-auto px-4 md:px-10'>
        <div className='mx-auto md:max-w-11/12 md:-mt-24 p-4 overflow-hidden md:p-20'>
            {/* <div>checking the server</div> */}
            {/* md:bg-[#D92A54] */}
            <div className='flex w-full gap-10 flex-col md:flex-row'>
                <div className='md:w-2/3 space-y-4'>
                    <div className='flex flex-col'>
                        <CursorHighlight
                            className="text-2xl sm:text-3xl md:text-2xl font-bold"
                            gradient="from-white via-fuchsia-500 to-rose-500"
                            showPointer={true}
                            pointerClassName="text-[#D92A54]"
                        >
                            <h1 className='text-black'>Al Idaad</h1>
                        </CursorHighlight>
                        {/* <h1 className='text-6xl font-bold'>What We Offer</h1> */}
                        <section className="items-center inline-flex gap-4">
                            <h1 className="text-4xl md:text-7xl font-bold mb-4 capitalize text-black">
                                What We
                            </h1>
                            <MorphoTextFlip
                                words={["Offer", "Desire", "Dream"]}
                                textClassName="text-4xl md:text-7xl text-rose-600 dark:text-rose-400 font-bold"
                                animationType="slideUp"
                            />
                        </section>
                        {/* <p className='text-gray-600'>We are largest cloth branding dealer on bangladesh, Its been 30 years since our beloved passions stars working</p> */}
                        <TextType
                            text={["We are largest cloth branding dealer on bangladesh.", " Its been 30 years since our beloved passions stars working", "We are proud to be your part of life!"]}
                            typingSpeed={75}
                            pauseDuration={1500}
                            showCursor={true}
                            cursorCharacter="|"
                            className='text-black'
                        />
                    </div>
                    <div>
                        <div className="w-full lg:hidden">
                            <FlipStack cards={cards} />
                        </div>
                        <div className="hidden lg:flex ">
                            <FlipStack cards={cards} />
                        </div>
                    </div>

                </div>

                <div className='md:w-1/3 relative md:mt-24 hidden md:block'>

                    <MotionCards interval={2500} >
                        <MotionCardContent className="flex gap-3">
                            <Layers className="w-6 h-6 text-purple-600" />
                            <span className=" font-semibold">Premium Quality Products</span>
                        </MotionCardContent>

                        <MotionCardContent className="flex gap-3">
                            <Component className="w-6 h-6 text-green-600" />
                            <span className=" font-semibold">100% Authentic Brands</span>
                        </MotionCardContent>

                        <MotionCardContent className="flex gap-3">
                            <LayoutPanelTop className="w-6 h-6 text-blue-600" />
                            <span className=" font-semibold">Nationwide Fast Delivery</span>
                        </MotionCardContent>

                        <MotionCardContent className="flex gap-3">
                            <Scroll className="w-6 h-6 text-amber-600" />
                            <span className=" font-semibold">30 Years of Trust & Excellence</span>
                        </MotionCardContent>

                        <MotionCardContent className="flex gap-3">
                            <Package className="w-6 h-6 text-[#D92A54]" />
                            <span className=" font-semibold">
                                Secure Payment & Easy Returns
                            </span>
                        </MotionCardContent>

                        <MotionCardContent className="flex gap-3">
                            <Shield className="w-6 h-6 text-emerald-600" />
                            <span className=" font-semibold">
                                Quality Assurance Guaranteed
                            </span>
                        </MotionCardContent>

                        <MotionCardContent className="flex gap-3">
                            <Truck className="w-6 h-6" />
                            <span className=" font-semibold">
                                Free Shipping Over 1000 BDT
                            </span>
                        </MotionCardContent>

                        <MotionCardContent className="flex gap-3">
                            <Headphones className="w-6 h-6 text-cyan-600" />
                            <span className=" font-semibold">
                                24/7 Customer Support
                            </span>
                        </MotionCardContent>

                        <MotionCardContent className="flex gap-3">
                            <Award className="w-6 h-6 text-yellow-600" />
                            <span className=" font-semibold">
                                Award-Winning Service
                            </span>
                        </MotionCardContent>
                    </MotionCards>
                </div>


            </div>

        </div>
    );
};

export default WhatWeOffer;