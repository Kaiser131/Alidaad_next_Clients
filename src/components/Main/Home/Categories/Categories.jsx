import React from 'react';
import { Diamond, Watch, Shirt, Home } from "lucide-react";
import { motion } from 'framer-motion';

import { useRouter } from 'next/navigation';
import queryString from 'query-string';

const Categories = () => {

    const router = useRouter();


    // query string 
    const handleQuery = (category) => {
        let currentQuery = { category: category };
        const url = queryString.stringifyUrl({
            url: '/category',
            query: currentQuery
        });
        router.push(url);
    };

    const categories = [
        {
            name: "Luxury",
            image: "/images/luxury.jpg",
        },
        {
            name: "Religious",
            image: "/images/religious.jpg",
        },
        {
            name: "Casual",
            image: "/images/casual.jpg",
        },
        {
            name: "Household",
            image: "/images/household.avif",
        }];

    // animation
    const parentVariants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.2, // <-- stagger effect
                delayChildren: 0.3,  // <-- delay before children start animating
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
                duration: 1.2,
            },
        },
    };


    // here is

    return (
        <section className="py-2 md:py-8">
            <div className="max-w-6xl md:max-w-10/12 mx-auto px-4">
                <motion.p variants={childVariants} initial="hidden" animate="show" className="text-3xl font-medium text-center md:text-left mb-4 md:mb-8">Our Categories</motion.p>
                <motion.div
                    variants={parentVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }} // only animate when in view
                    className="grid grid-cols-2 sm:grid-cols-4 gap-6"
                >
                    {categories.map((cat) => (
                        <motion.div
                            key={cat.name}
                            variants={childVariants}
                            viewport={{ once: true, amount: 0.2 }}
                            className="flex flex-col items-center group cursor-pointer"
                            onClick={() => handleQuery(cat.name)}
                        >
                            <div className="w-full aspect-square overflow-hidden rounded-xl">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <span className="mt-3 text-sm font-medium text-gray-800 group-hover:text-blue-500 flex items-center gap-1">
                                {cat.name}
                                <span className="text-lg">→</span>
                            </span>
                        </motion.div>
                    ))}
                </motion.div>


            </div>
        </section>
    );
};

export default Categories;