"use client";

import React, { useState } from 'react';
import BannerEditor from './BannerEditor';
import OfferEditor from './OfferEditor';
import Breadcrumbs from '@/components/Shared/Breadcrumbs/Breadcrumbs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ImageEditTabs = ({ initialBanners, initialOffers }) => {
    const [activeTab, setActiveTab] = useState('banner');

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6">
                <Breadcrumbs />
            </div>

            <div className="px-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                        <TabsTrigger value="banner" className="text-base">
                            Banner Images
                        </TabsTrigger>
                        <TabsTrigger value="offer" className="text-base">
                            What We Offer
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="banner" className="mt-0">
                        <BannerEditor initialBanners={initialBanners} />
                    </TabsContent>

                    <TabsContent value="offer" className="mt-0">
                        <OfferEditor initialOffers={initialOffers} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ImageEditTabs;
