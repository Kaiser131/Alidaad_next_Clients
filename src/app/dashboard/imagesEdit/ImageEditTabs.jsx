"use client";

import React, { useState } from 'react';
import BannerEditor from './BannerEditor';
import OfferEditor from './OfferEditor';
import FaqEditor from './FaqEditor';
import Breadcrumbs from '@/components/Shared/Breadcrumbs/Breadcrumbs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ImageEditTabs = ({ initialBanners, initialOffers, initialFaqs }) => {
    const [activeTab, setActiveTab] = useState('banner');

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6">
                <Breadcrumbs />
            </div>

            <div className="px-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-6">
                        <TabsTrigger value="banner" className="text-base">
                            Banner Images
                        </TabsTrigger>
                        <TabsTrigger value="offer" className="text-base">
                            What We Offer
                        </TabsTrigger>
                        <TabsTrigger value="faq" className="text-base">
                            FAQ Edit
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="banner" className="mt-0">
                        <BannerEditor initialBanners={initialBanners} />
                    </TabsContent>

                    <TabsContent value="offer" className="mt-0">
                        <OfferEditor initialOffers={initialOffers} />
                    </TabsContent>

                    <TabsContent value="faq" className="mt-0">
                        <FaqEditor initialFaqs={initialFaqs} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ImageEditTabs;
