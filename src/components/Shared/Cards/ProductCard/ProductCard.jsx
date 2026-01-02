'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../../../Hooks/Auth/useAuth';

const ProductCard = ({ product }) => {
    const [hovered, setHovered] = useState(false);
    const { setSearchbarOpen, setCartOpen } = useAuth();
    const router = useRouter();

    const handleNavigate = useCallback(() => {
        setSearchbarOpen(false);
        setCartOpen(false);
        router.push(`/product_details/${product?._id}`);
    }, [product?._id, router, setSearchbarOpen, setCartOpen]);

    return (
        <div
            onClick={handleNavigate}
            className="bg-white rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 
            flex flex-col outline-gray-500 mb-4 h-[245px] md:h-[350px] relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="aspect-square overflow-hidden">
                <p className='absolute top-3 right-2 bg-white px-4 z-10 rounded-xl font-[Caluxe] shadow-2xl'>{product?.subCategory}</p>
                <img
                    src={hovered && product.images[0] ? product.images[0] : product.images[1]}
                    alt={product?.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[900ms] hover:scale-105"
                />
            </div>
            <div className='pt-4 flex-grow'>
                <h3 className="font-medium text-gray-500 text-sm">{product?.name.split(' ').slice(0, 3).join(' ')}</h3>
            </div>
            <div className='flex flex-col md:flex-row md:gap-5 md:items-center'>
                <p className="text-gray-500 text-sm mt-1 line-through">Tk {product?.price} BDT</p>
                <p className="font-medium text-gray-600 mt-1 font-lexend text-sm">Tk {Math.ceil(product?.discountedPrice)} BDT</p>
            </div>
        </div>
    );
};

export default ProductCard;