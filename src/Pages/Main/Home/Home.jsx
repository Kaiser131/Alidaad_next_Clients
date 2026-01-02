import React, { Suspense, lazy } from 'react';
import Banner from '../../../components/Main/Home/Banner/Banner';
import Loading from '../../../components/Shared/Loading/Loading';
import { useHead } from '@unhead/react';
import Categories from '../../../components/Main/Home/Categories/Categories';
import WhatWeOffer from '../../../components/Main/Home/WhatWeOffer/WhatWeOffer';
import { useFeaturedProducts } from '../../../Hooks/Products/useFeaturedProducts';
import Faq from '../../../components/Shared/Faq/Faq';
import Stats from '../../../components/Shared/Stats/Stats';

// Lazy load heavy components
const Product = lazy(() => import('../../../components/Shared/Product/Product'));
const OfficeMap = lazy(() => import('../../../components/Shared/Map/OfficeMap'));
const ChatWidget = lazy(() => import('../../../components/Shared/Chat/ChatWidget'));

const Home = () => {



    // Fetch all products using custom hook
    const {
        newArrivals,
        luxuryProducts,
        menProducts,
        casualProducts,
        householdProducts,
        isLoadingHousehold,
        isLoadingNewArrivals,
        isLoadingLuxury,
        isLoadingCasual,
        religiousProducts,
        isLoadingReligious,
        isLoadingMen
    } = useFeaturedProducts();


    // react head
    useHead({
        title: 'Alidaad | Home',
        meta: [
            { name: 'Alidaad', content: 'Home' }
        ]
    });

    // Show loading only for initial critical data
    if (isLoadingNewArrivals) return <Loading />;


    return (
        <div className='min-h-screen space-y-10'>
            <div className='mt-20 md:mt-24'>
                <Banner />
            </div>
            <WhatWeOffer />
            <div className=' md:mt-10'>
                <Categories />
            </div>

            {/* Load new arrivals immediately */}
            <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loading /></div>}>
                <Product products={newArrivals.slice(0, 10)} collectionName="Newly Arrived Collection" />
            </Suspense>

            {/* Lazy load other sections */}

            {/* cover_image */}
            <div className='max-w-10/12 mx-auto'>
                <img src="/images/alidaad_cover_thobe.jpeg" alt="Alidaad Cover Thobe" className='w-full object-cover h-[65dvh]' />
            </div>

            <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loading /></div>}>
                {!isLoadingMen && <Product products={menProducts} collectionName="Men" category={'Men'} />}
            </Suspense>

            {/* cover_image */}
            <div className='max-w-10/12 mx-auto'>
                <img src="/images/alidaad_cover_jubbah.jpeg" alt="Alidaad Cover Jubbah" className='w-full object-contain h-[65dvh]' />
            </div>

            <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loading /></div>}>
                {!isLoadingLuxury && <Product products={luxuryProducts} collectionName="Luxury" category={'Luxury'} />}
            </Suspense>

            {/* <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loading /></div>}>
                {!isLoadingCasual && <Product products={casualProducts} collectionName="Casual" category={'Casual'} />}
            </Suspense> */}

            {/* <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loading /></div>}>
                {!isLoadingHousehold && <Product products={householdProducts} collectionName="Household" category={'Household'} />}
            </Suspense> */}


            <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loading /></div>}>
                <Stats />
            </Suspense>

            <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loading /></div>}>
                <Faq />
            </Suspense>

            <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loading /></div>}>
                <OfficeMap />
            </Suspense>

            {/* <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loading /></div>}>
            </Suspense> */}



        </div>
    );
};

export default Home;