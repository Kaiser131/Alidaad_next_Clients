'use client';

import { motion } from "framer-motion";
import { X, Home, ShoppingBag, Star, Info, Phone, Shirt, Box, UserRound } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BsSmartwatch } from "react-icons/bs";
import queryString from "query-string";
import useAuth from "../../../Hooks/Auth/useAuth";
import useRole from "../../../Hooks/Role/useRole";

const links = [
    { name: "Luxury", icon: <Star className="w-5 h-5" />, href: "Luxury" },
    { name: "Smart Watch", icon: <BsSmartwatch className="w-5 h-5" />, href: "SmartWatches" },
    { name: "Casual", icon: <Shirt className="w-5 h-5" />, href: "Casual" },
    { name: "Household", icon: <Box className="w-5 h-5" />, href: "Household" },
];

const MenuSideBar = ({ menuIsOpen, setMenuIsOpen }) => {
    const router = useRouter();
    const { user } = useAuth();
    const { role } = useRole();

    const handleQuery = (category) => {
        let currentQuery = { category: category };
        const url = queryString.stringifyUrl({
            url: '/category',
            query: currentQuery
        });
        router.push(url);
        setMenuIsOpen(false);
    };

    return (
        <>
            {/* Background Overlay */}
            {menuIsOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setMenuIsOpen(false)}
                    className="fixed inset-0 bg-black z-40 cursor-pointer"
                />
            )}

            {/* Sidebar */}
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: menuIsOpen ? 0 : "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-0 left-0 w-[85%] sm:w-[350px] h-full bg-white shadow-xl z-[60] flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b">
                    <h2 className="text-lg font-semibold">Alidaad</h2>
                    <button
                        onClick={() => setMenuIsOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 py-6">
                    <ul className="space-y-2">
                        <li>
                            <button
                                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition text-gray-700"
                                onClick={() => {
                                    router.push('/');
                                    setMenuIsOpen(false);
                                }}>
                                <Home className="w-5 h-5" />
                                <span className="text-base">Home</span>
                            </button>

                            {role === 'admin' && <Link
                                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition text-gray-700"
                                href={'/dashboard'}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                <span className="text-base">Dashboard</span>
                            </Link>}

                            {user && <button
                                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition text-gray-700"
                                onClick={() => {
                                    router.push('/account');
                                    setMenuIsOpen(false);
                                }}>
                                <ShoppingBag className="w-5 h-5" />
                                <span className="text-base">My Account</span>
                            </button>}


                            <button
                                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition text-gray-700"
                                onClick={() => {
                                    router.push('/products');
                                    setMenuIsOpen(false);
                                }}>
                                <ShoppingBag className="w-5 h-5" />
                                <span className="text-base">All Products</span>
                            </button>


                            {links.map((link) => (
                                <a
                                    key={link.name}
                                    onClick={() => handleQuery(link.href)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition text-gray-700"
                                >
                                    {link.icon}
                                    <span className="text-base">{link.name}</span>
                                </a>
                            ))}
                        </li>
                    </ul>
                </nav>

                {/* Footer */}
                <div className="px-4 py-4 border-t bg-gray-100 text-sm text-gray-500">
                    <div className="flex justify-center">
                        {!user && <Link className="flex gap-2" href={'/login'}><UserRound /> Login</Link>}
                        {user && <Link onClick={() => setMenuIsOpen(false)} className="flex gap-2" href={'/account'}><UserRound /> Account</Link>}
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default MenuSideBar;
