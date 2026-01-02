import { ChevronDown, Gem, Home, Shirt, Watch } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowScroll } from 'react-use';
import queryString from 'query-string';
import { useRouter } from 'next/navigation';

const NavCategoriesBtn = () => {
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('');
    const { y: currentScrollY } = useWindowScroll();
    const router = useRouter();

    useEffect(() => {
        if (currentScrollY !== scroll) {
            setOpen(false);
        }
    }, [scroll, currentScrollY]);

    const handleQuery = (category) => {
        let currentQuery = { category: category };
        const url = queryString.stringifyUrl({
            url: '/category',
            query: currentQuery
        });
        setOpen(false);
        router.push(url);
    };



    const categories = [
        { href: 'Luxury', name: "Luxury", icon: <Gem className="w-4 h-4" /> },
        { href: 'Smartwatches', name: "Smart Watches", icon: <Watch className="w-4 h-4" /> },
        { href: 'Casual', name: "Casual", icon: <Shirt className="w-4 h-4" /> },
        { href: 'Household', name: "Household", icon: <Home className="w-4 h-4" /> },
    ];
    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-1 px-4 py-2 rounded-md transition outline-none"
            >
                <span onClick={() => setScroll(currentScrollY)} className="uppercase nav-hover-btn">Categories</span>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-20"
                    >
                        <ul className="py-1">
                            {categories.map((cat) => (
                                <li key={cat.name}>
                                    <button
                                        className="flex w-full items-center text-black gap-2 px-3 py-2 text-sm hover:bg-gray-100 transition"
                                        onClick={() => {
                                            handleQuery(cat.href);
                                        }}
                                    >
                                        {cat.icon}
                                        <span>{cat.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NavCategoriesBtn;