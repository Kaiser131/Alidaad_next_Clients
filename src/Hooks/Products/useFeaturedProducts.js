import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../Axios/useAxiosSecure';
import useAxiosCommon from '../Axios/useAxiosCommon';

// Custom hook to fetch featured products with optimized caching
export const useFeaturedProducts = () => {
    const axiosCommon = useAxiosCommon();

    // Fetch all products
    const { data: newArrivals = [], isLoading: isLoadingNewArrivals } = useQuery({
        queryKey: ['products', 'all'],
        queryFn: async () => {
            const res = await axiosCommon.get('/all_products');
            return res.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in newer versions)
        refetchOnWindowFocus: false, // Don't refetch on window focus
    });

    // Fetch luxury products
    const { data: luxuryProducts = [], isLoading: isLoadingLuxury } = useQuery({
        queryKey: ['products', 'luxury'],
        queryFn: async () => {
            const res = await axiosCommon.get('/featured_products/Luxury');
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // Fetch religious products
    const { data: religiousProducts = [], isLoading: isLoadingReligious } = useQuery({
        queryKey: ['products', 'religious'],
        queryFn: async () => {
            const res = await axiosCommon.get('/featured_products/Religious');
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // Fetch casual products
    const { data: casualProducts = [], isLoading: isLoadingCasual } = useQuery({
        queryKey: ['products', 'casual'],
        queryFn: async () => {
            const res = await axiosCommon.get('/featured_products/Casual');
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });


    // Fetch casual products
    const { data: menProducts = [], isLoading: isLoadingMen } = useQuery({
        queryKey: ['products', 'men'],
        queryFn: async () => {
            const res = await axiosCommon.get('/featured_products/Men');
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // Fetch household products
    const { data: householdProducts = [], isLoading: isLoadingHousehold } = useQuery({
        queryKey: ['products', 'household'],
        queryFn: async () => {
            const res = await axiosCommon.get('/featured_products/Household');
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    return {
        newArrivals,
        luxuryProducts,
        religiousProducts,
        menProducts,
        casualProducts,
        householdProducts,
        isLoadingNewArrivals,
        isLoadingLuxury,
        isLoadingMen,
        isLoadingReligious,
        isLoadingCasual,
        isLoadingHousehold,
        isLoading: isLoadingNewArrivals || isLoadingLuxury || isLoadingReligious || isLoadingCasual || isLoadingHousehold,
    };
};
