export const dynamic = 'force-dynamic';

import BannerEditor from './BannerEditor';
import OfferEditor from './OfferEditor';
import FaqEditor from './FaqEditor';
import ImageEditTabs from './ImageEditTabs';

// Server Component - Fetch data using Next.js built-in fetch
async function getBanners() {
    try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
        const res = await fetch(`${serverUrl}/banners`, {
            cache: 'no-store', // Always get fresh data
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch banners');
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching banners:', error);
        return [];
    }
}

async function getOffers() {
    try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
        const res = await fetch(`${serverUrl}/offers`, {
            cache: 'no-store', // Always get fresh data
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch offers');
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching offers:', error);
        return [];
    }
}

async function getFaqs() {
    try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
        const res = await fetch(`${serverUrl}/faqs`, {
            cache: 'no-store', // Always get fresh data
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch FAQs');
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        return [];
    }
}

export default async function ImagesEditPage() {
    const [initialBanners, initialOffers, initialFaqs] = await Promise.all([
        getBanners(),
        getOffers(),
        getFaqs()
    ]);

    return (
        <ImageEditTabs
            initialBanners={initialBanners}
            initialOffers={initialOffers}
            initialFaqs={initialFaqs}
        />
    );
}
