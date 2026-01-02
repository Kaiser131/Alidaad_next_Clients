'use client';

import ProductCard from '../Cards/ProductCard/ProductCard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import queryString from 'query-string';
import { motion } from 'framer-motion';


const Product = ({ products, collectionName, link, category }) => {
    const router = useRouter();

    const handleQuery = () => {
        let currentQuery = { category: category };
        const url = queryString.stringifyUrl({
            url: '/category',
            query: currentQuery
        });
        router.push(url);
    };


    const parentVariants = {
        hidden: { opacity: 0 }, // even a dummy state works
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };


    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                ease: "easeInOut",
                duration: 0.8,
            },
        },
    };

    return (
        <section className="">
            <div className="max-w-10/12 mx-auto md:px-4">
                <h2 className="text-4xl mb-8">{collectionName}</h2>
                <motion.div
                    key={products.length} // to re-trigger animation when products change
                    variants={parentVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.05 }} // only animate when in view
                    className="flex gap-2 overflow-y-hidden md:grid md:grid-cols-5 md:gap-6 scrollbar-hide">
                    {products.map((product) => (
                        <motion.div
                            variants={childVariants}
                            key={product?._id} className="flex-shrink-0 w-[140px] md:w-auto">
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>

                <div className='flex justify-center my-5'>
                    <Link
                        href={link || '/products'}
                        className={`bg-black text-white py-3 px-8 rounded-lg text-md
                            ${category ? 'hidden' : ''}
                            `}
                    >View all</Link>
                    {category && (
                        <button
                            onClick={handleQuery}
                            className={`bg-black text-white py-3 px-8 rounded-lg text-md
                            `}
                        >
                            View all
                        </button>
                    )}

                </div>
            </div>
        </section>
    );
};

export default Product;