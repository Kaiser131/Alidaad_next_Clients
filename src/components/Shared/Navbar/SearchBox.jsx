'use client';

import { ArrowRight, Search, } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { RxCross1, RxCrossCircled } from "react-icons/rx";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';

const SearchBox = ({ searchbarOpen, setSearchbarOpen }) => {

    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const router = useRouter();

    // prevent layout shaky shifting on search box open
    useEffect(() => {
        if (searchbarOpen) {
            // Force vertical scrollbar always visible
            // and changed the style to hidden
            document.documentElement.style.overflowY = "hidden";
            document.body.style.overflowY = "scroll";
        } else {
            // Reset back to default (auto scrolling)
            document.documentElement.style.overflowY = "";
            document.body.style.overflowY = "";
        }
    }, [searchbarOpen]);



    // disable scroll on search box open
    // didnt implemented because of layout shifting issue
    // useEffect(() => {
    //     if (searchbarOpen) {
    //         document.body.style.overflow = "hidden"; // disable scroll
    //     } else {
    //         document.body.style.overflow = "auto"; // enable scroll back
    //     }
    // }, [searchbarOpen]);

    // 🔹 Debounce so API isn’t called on every keystroke
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(handler);
    }, [query]);



    // get the search results using Next.js fetch
    const { data: searchData = [] } = useQuery({
        queryKey: ['search', debouncedQuery],
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/search?search=${debouncedQuery}`, {
                cache: 'no-store' // Real-time search, no caching
            });
            if (!response.ok) {
                throw new Error('Search failed');
            }
            return response.json();
        },
        enabled: debouncedQuery.length > 0 // Only fetch when there's a query
    });

    // navigate to product details
    const handleNavigateToProduct = (id) => {
        // Navigate to the product details page
        setSearchbarOpen(false);
        setQuery('');
        router.push(`/product_details/${id}`);
    };

    // handle and set search query
    const handleSearchQuery = (search) => {
        let currentQuery = { search: search };
        const url = queryString.stringifyUrl({
            url: '/search',
            query: currentQuery
        });
        setSearchbarOpen(false);
        setQuery('');
        router.push(url);
    };

    return (
        <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: searchbarOpen ? 0 : "-100%" }}
            transition={{ type: "tween", duration: 0.5 }}
            className="min-w-full fixed top-0 left-0 z-[60] bg-white shadow-lg">
            {/* Search Container */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                {/* Search Input */}
                <div className="flex relative gap-2 sm:gap-4 items-center w-full">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for products..."
                            className="w-full outline-none text-gray-700 border-2 border-gray-300 focus:border-blue-500 py-2 sm:py-3 pl-3 sm:pl-4 pr-20 sm:pr-24 rounded-lg transition-colors text-sm sm:text-base"
                        />
                        <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-2">
                            {query && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                    aria-label="Clear search"
                                >
                                    <RxCrossCircled className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            )}
                            <button
                                onClick={() => handleSearchQuery(query)}
                                className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                                aria-label="Search"
                            >
                                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                    <button
                        className='text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-full transition-colors'
                        onClick={() => setSearchbarOpen(!searchbarOpen)}
                        aria-label="Close search"
                    >
                        <RxCross1 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Dropdown */}
                {searchData.length > 0 && (
                    <div className="w-full bg-white shadow-xl border border-gray-200 rounded-xl overflow-hidden mt-3 sm:mt-4 max-h-[calc(100vh-120px)] sm:max-h-[500px] overflow-y-auto">
                        {/* Results Grid */}
                        <div className='flex flex-col lg:flex-row'>
                            {/* Suggestions */}
                            <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 p-3 sm:p-4 bg-gray-50">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b border-gray-300">
                                    Suggestions
                                </h3>
                                <ul className="space-y-2">
                                    {searchData
                                        ?.slice(0, 5)
                                        .sort(() => Math.random() - 0.5)
                                        .map((data, idx) => (
                                            <li
                                                key={idx}
                                                onClick={() => handleSearchQuery(data?.name.split(" ").slice(0, 2).join(" "))}
                                                className="cursor-pointer hover:text-blue-600 text-gray-700 text-sm py-1 px-2 rounded hover:bg-white transition-colors line-clamp-1"
                                            >
                                                {data?.name.split(" ").slice(0, 2).join(" ")}
                                            </li>
                                        ))}
                                </ul>
                            </div>

                            {/* Products */}
                            <div className="lg:w-2/3 p-3 sm:p-4">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b border-gray-200">
                                    Products
                                </h3>
                                <ul className="space-y-2">
                                    {searchData.slice(0, 6).map((data, idx) => (
                                        <li
                                            onClick={() => handleNavigateToProduct(data?._id)}
                                            key={idx}
                                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group"
                                        >
                                            <img
                                                src={data?.images[0]}
                                                alt={data?.name}
                                                className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md flex-shrink-0 border border-gray-200"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <span className="text-gray-800 text-sm sm:text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                    {data?.name}
                                                </span>
                                                {data?.discountedPrice && (
                                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                        ৳{data?.discountedPrice.toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* View All Results */}
                        <div className='p-3 sm:p-4 border-t border-gray-200 bg-gray-50'>
                            <button
                                onClick={() => handleSearchQuery(query)}
                                className='w-full flex justify-between items-center text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors group'
                            >
                                <span>Search for "<span className="text-blue-600">{query}</span>"</span>
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>

    );
};

export default SearchBox;