"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useAxiosCommon from '../../../Hooks/Axios/useAxiosCommon';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '../../../components/Shared/Cards/ProductCard/ProductCard';
import { BiSearch } from 'react-icons/bi';
import { RxCrossCircled } from 'react-icons/rx';
import Loading from '../../../components/Shared/Loading/Loading';
import { useHead } from '@unhead/react';

const Search = () => {

    const params = useSearchParams();
    const searchQuery = params.get('search');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const axiosCommon = useAxiosCommon();
    const { data: searchData = [], isLoading: isLoadingSearchData } = useQuery({
        queryKey: ['search', searchQuery, debouncedSearch],
        queryFn: async () => {
            const { data } = await axiosCommon.get(`/search?search=${searchQuery}&searchInfo=${debouncedSearch}`);
            return data;
        },
    });


    // 🔹 Debounce so API isn’t called on every keystroke
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);


    // react head
    useHead({
        title: `Search: ${searchData?.length} items found for "${params.get('search') || debouncedSearch}" - Alidaad`,
        meta: [
            { name: 'Alidaad', content: `Search-${search}` }
        ]
    });

    if (isLoadingSearchData) return <Loading />;

    // console.log('search:', search);
    // console.log('debouncedSearch:', debouncedSearch);
    // console.log(searchData);


    return (
        <div className='min-h-screen mt-20 md:mt-24 md:max-w-10/12 mx-auto px-4'>
            <h1 className='text-2xl font-semibold md:text-4xl text-center md:font-light border-t py-4'>Search Results</h1>

            {/* search */}
            <div className='max-w-[520px] mx-auto w-full relative'>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className="max-w-[520px] w-full outline-none text-gray-700 border-2 border-black py-1 pl-3 pr-24 rounded-md"
                />
                {search && <button onClick={() => setSearch('')} className="absolute right-4 top-2 text-black"><RxCrossCircled size={18} /></button>}
            </div>

            <p className='text-gray-400 pt-2'>{searchData?.length} results found</p>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 my-4'>
                {
                    searchData?.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                }
            </div>
        </div >
    );
};

export default Search;