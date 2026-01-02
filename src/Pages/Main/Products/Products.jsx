"use client";

import React, { useEffect, useState, useRef } from 'react';
import useAxiosCommon from '../../../Hooks/Axios/useAxiosCommon';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import useAuth from '../../../Hooks/Auth/useAuth';
import FilterSortSidebar from '../../../components/Shared/Toggle/FilterSortSidebar';
import { ChevronDown, Settings2 } from 'lucide-react';
import Loading from '../../../components/Shared/Loading/Loading';
import { useHead } from '@unhead/react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const Products = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const isInitialMount = useRef(true);

    // pagination related - Initialize from URL params
    const [itemsPerPage] = useState(12);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(() => {
        const page = searchParams.get('page');
        return page ? parseInt(page) : 1;
    });
    const [filter, setFilter] = useState(() => searchParams.get('filter') || '');
    const [sort, setSort] = useState(() => searchParams.get('sort') || '');
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [isOpen, setIsOpen] = useState(false);
    const [hovered, setHovered] = useState(false);
    const { setSearchbarOpen, setCartOpen } = useAuth();

    // Update URL when state changes
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const params = new URLSearchParams();
        if (currentPage > 1) params.set('page', currentPage.toString());
        if (filter) params.set('filter', filter);
        if (sort) params.set('sort', sort);
        if (priceRange[0] !== 0) params.set('minPrice', priceRange[0].toString());
        if (priceRange[1] !== 1000000) params.set('maxPrice', priceRange[1].toString());

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [currentPage, filter, sort, priceRange, pathname, router]);

    const handleNavigate = (id) => {
        setSearchbarOpen(false);
        setCartOpen(false);
        router.push(`/product_details/${id}`);
    };


    const queryParams = new URLSearchParams();
    if (filter) queryParams.append('filter', filter);
    if (sort) queryParams.append('sort', sort);
    if (priceRange[0] !== 0) queryParams.append('minPrice', priceRange[0]);
    if (priceRange[1] !== 1000000) queryParams.append('maxPrice', priceRange[1]);

    // prevent layout shaky shifting on search box open________________________________________________________________________________________________
    useEffect(() => {
        if (isOpen) {
            // Force vertical scrollbar always visible
            // and changed the style to hidden
            document.documentElement.style.overflowY = "hidden";
            document.body.style.overflowY = "scroll";
        } else {
            // Reset back to default (auto scrolling)
            document.documentElement.style.overflowY = "";
            document.body.style.overflowY = "";
        }
    }, [isOpen]);


    const axiosCommon = useAxiosCommon();
    const { data: allProducts = [], isLoading } = useQuery({
        queryKey: ['allProducts', currentPage, queryParams.toString(), itemsPerPage],
        queryFn: async () => {
            // const { data } = await axiosCommon.get(`/all_products?${queryParams.toString()}`);
            const { data } = await axiosCommon.get(`/all_products?${queryParams.toString()}&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`);
            return data;
        }
    });

    // Fetch max price from all products
    const { data: maxPriceData } = useQuery({
        queryKey: ['maxPrice'],
        queryFn: async () => {
            const { data } = await axiosCommon.get('/products_max_price');
            return data;
        }
    });

    const maxPrice = maxPriceData?.maxPrice || 1000000;

    const totalPages = Math.ceil(count / itemsPerPage);

    // Generate page numbers with ellipsis - shows current page with 2 before and 2 after
    const getPageNumbers = () => {
        const pages = [];
        const delta = 2; // Show 2 pages before and after current page

        if (totalPages <= 7) {
            // Show all pages if total is 7 or less
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate range around current page
            let startPage = Math.max(2, currentPage - delta);
            let endPage = Math.min(totalPages - 1, currentPage + delta);

            // Adjust range if we're at the beginning
            if (currentPage <= 3) {
                startPage = 2;
                endPage = 5; // Show 1, 2, 3, 4, 5, ..., last
            }

            // Adjust range if we're at the end
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 4;
                endPage = totalPages - 1; // Show 1, ..., last-4, last-3, last-2, last-1, last
            }

            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pages.push('ellipsis-start');
            }

            // Add pages around current page
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pages.push('ellipsis-end');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    // send data query for length
    const { isLoading: isLoadingProductCount } = useQuery({
        queryKey: ['productCount', currentPage],
        queryFn: async () => {
            const { data } = await axiosCommon.get(`/products_count?currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`);
            setCount(data?.count);
            return data;
        }
    });

    // react head
    useHead({
        title: 'Products-Alidaad',
        meta: [
            { name: 'Alidaad', content: 'Products' }
        ]
    });

    if (isLoading || isLoadingProductCount) return <Loading />;

    return (
        <div className='min-h-[70dvh] mt-20 md:mt-24 md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 border-t'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 mt-2'>Products</h1>
            <div className='mb-4'>
                {/* <Breadcrumbs /> */}
            </div>

            {/* filter section */}
            <div>
                <FilterSortSidebar
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    productLength={allProducts?.length}
                    setFilter={setFilter}
                    setSort={setSort}
                    setPriceRange={setPriceRange}
                    maxPrice={maxPrice}
                />
                {/* for small */}
                <div className='flex justify-between text-gray-500 my-4 md:hidden text-sm'>
                    <button onClick={() => setIsOpen(!isOpen)} className='flex gap-2 items-center hover:text-gray-700 transition-colors'>
                        <Settings2 size={16} />
                        <span className="hidden xs:inline">Filter and sort</span>
                        <span className="xs:hidden">Filters</span>
                    </button>
                    <p className="text-xs sm:text-sm">{allProducts?.length} products</p>
                </div>
                {/* for large */}
                <div className="hidden md:flex items-center justify-between border-gray-200 text-sm text-gray-700 my-3">
                    {/* Left Side - Filters */}
                    <div className="flex items-center space-x-4">

                        <span className='text-gray-700 text-sm'>Filter:</span>
                        <div className="relative">
                            <select onChange={(e) => setFilter(e.target.value)} className="appearance-none outline-none px-2 py-1 text-sm w-40 rounded-md hover:border-gray-400 focus:border-gray-500 transition-colors">
                                <option disabled selected value="">Featured</option>
                                <option value="A-Z">Alphabetically A-Z</option>
                                <option value="Z-A">Alphabetically Z-A</option>
                                <option value="old_to_new">Date, old to new</option>
                                <option value="new_to_old">Date, new to old</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                        </div>

                    </div>
                    {/* Right Side - Sort + Count */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center gap-1">
                            <span className='text-gray-700 text-sm'>Sort by:</span>
                            <div className="relative">
                                <select onChange={(e) => setSort(e.target.value)} className="appearance-none outline-none px-2 py-1 text-sm w-32 rounded-md hover:border-gray-400 focus:border-gray-500 transition-colors">
                                    <option disabled selected value="">Price</option>
                                    <option value="low_to_high">Low to High</option>
                                    <option value="high_to_low">High to Low</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                            </div>
                        </div>
                        {allProducts && <span className="text-gray-500">{allProducts?.length} products</span>}
                    </div>

                </div>
            </div>

            {/* product cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 md:gap-6 gap-2">
                {
                    allProducts.map((product) => (
                        <div key={product?._id} className="flex-shrink-0 w-auto relative">
                            <div
                                onClick={() => handleNavigate(product?._id)}
                                className="bg-white rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 
                                flex flex-col outline-gray-500 mb-4 h-[270px] md:h-[322px]"
                                onMouseEnter={() => setHovered(product?._id)}
                                onMouseLeave={() => setHovered(false)}
                            >
                                <p className='absolute top-2 right-2 bg-white px-4 z-10 rounded-xl font-[Caluxe] shadow-2xl'>{product?.subCategory}</p>
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={hovered === product?._id ? product.images[0] : product.images[1]}
                                        alt={product?.name}
                                        className="w-full h-full object-cover transition-transform duration-[900ms] hover:scale-105"
                                    />
                                </div>
                                <div className='pt-4 flex-grow'>
                                    <h3 className="font-medium text-gray-500 text-sm">{product?.name.split(' ').slice(0, 3).join(' ')}</h3>
                                </div>
                                <div className='flex flex-col md:flex-row md:gap-5 md:items-center'>
                                    {/* <p className="text-gray-500 text-sm mt-1 line-through">Tk {product?.price} BDT</p> */}
                                    {product?.discount > 0 && <p className="text-gray-500 text-sm mt-1 line-through">Tk {product?.price} BDT</p>}
                                    <p className="font-medium text-gray-600 mt-1 font-lexend text-sm">Tk {Math.ceil(product?.discountedPrice)} BDT</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 mb-8">
                    <Pagination>
                        <PaginationContent className="flex-wrap gap-1 sm:gap-2">
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                    className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-100'} text-xs sm:text-sm px-2 sm:px-3`}
                                />
                            </PaginationItem>

                            {pageNumbers.map((page, index) => (
                                <PaginationItem key={index}>
                                    {typeof page === 'string' ? (
                                        <PaginationEllipsis className="h-8 w-8 sm:h-9 sm:w-9" />
                                    ) : (
                                        <PaginationLink
                                            onClick={() => setCurrentPage(page)}
                                            isActive={currentPage === page}
                                            className={`cursor-pointer text-xs sm:text-sm h-8 w-8 sm:h-9 sm:w-9 ${currentPage === page
                                                ? 'bg-gray-900 text-white hover:bg-gray-800'
                                                : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                    className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-100'} text-xs sm:text-sm px-2 sm:px-3`}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default Products;