import BannerEditor from './BannerEditor';
import OfferEditor from './OfferEditor';
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

export default async function ImagesEditPage() {
    const [initialBanners, initialOffers] = await Promise.all([
        getBanners(),
        getOffers()
    ]);

    return (
        <ImageEditTabs
            initialBanners={initialBanners}
            initialOffers={initialOffers}
        />
    );
}
