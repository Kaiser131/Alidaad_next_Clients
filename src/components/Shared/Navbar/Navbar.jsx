'use client';

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWindowScroll } from "react-use";
import useAuth from "../../../Hooks/Auth/useAuth";
import { Landmark, ChevronDown, Gem, Home, Shirt, ShoppingBag, User, X, Menu, Search, Shield } from "lucide-react";
import SearchBox from "./SearchBox";
import CartSidebar from "../Toggle/CartSidebar";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/Axios/useAxiosSecure";
import NavCategoriesBtn from "../Buttons/NavCategoriesBtn";
import MenuSideBar from "../Toggle/MenuSideBar";
import NotificationsPanel from "../Notifications/NotificationsPanel";
import {
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuTrigger,
    ListItem,
    NavigationMenu,
    NavigationMenuList
} from "@/components/ui/navigation-menu";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import useRole from "../../../Hooks/Role/useRole";


const Navbar = () => {

    const { user, cartToken, searchbarOpen, setSearchbarOpen, cartOpen, setCartOpen } = useAuth();
    const { role } = useRole();

    const pathname = usePathname();
    const axiosSecure = useAxiosSecure();

    const navContainerRef = useRef(null);
    const navItems = [
        { name: 'Home', destination: '/' },
        { name: 'All Products', destination: '/products' },
    ];

    const categories = [
        { to: '/category?category=Luxury', name: "Luxury", icon: <Gem className="w-4 h-4" />, description: "Premium luxury items" },
        { to: '/category?category=Religious', name: "Religious", icon: <Landmark className="w-4 h-4" />, description: "Best for prayers" },
        { to: '/category?category=Casual', name: "Casual", icon: <Shirt className="w-4 h-4" />, description: "Everyday casual wear" },
        { to: '/category?category=Household', name: "Household", icon: <Home className="w-4 h-4" />, description: "Home essentials" },
    ];

    // scroll implementation using react-use
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { y: currentScrollY } = useWindowScroll();

    useEffect(() => {
        setMounted(true);
    }, []);

    // scrolling implementation for navbar_______________________________________________________________________________________________________________________________
    useEffect(() => {
        if (currentScrollY === 0) {
            setIsNavVisible(true),
                navContainerRef.current.classList.remove('floating-nav');
        } else if (currentScrollY > lastScrollY) {
            setIsNavVisible(false),
                navContainerRef.current.classList.add('floating-nav');
        } else if (currentScrollY < lastScrollY) {
            setIsNavVisible(true),
                navContainerRef.current.classList.add('floating-nav');
        }
        setLastScrollY(currentScrollY);
    }, [currentScrollY, lastScrollY]);


    useEffect(() => {
        gsap.to(navContainerRef.current, {
            y: isNavVisible ? 0 : -100,
            opacity: isNavVisible ? 1 : 0,
            duration: 0.2
        });
    }, [isNavVisible]);


    // prevent layout shaky shifting on search box open________________________________________________________________________________________________
    useEffect(() => {
        if (cartOpen || menuIsOpen) {
            // Force vertical scrollbar always visible
            // and changed the style to hidden
            document.documentElement.style.overflowY = "hidden";
            document.body.style.overflowY = "scroll";
        } else {
            // Reset back to default (auto scrolling)
            document.documentElement.style.overflowY = "";
            document.body.style.overflowY = "";
        }
    }, [cartOpen, menuIsOpen]);


    // ${location?.pathname !== '/' ? 'floating-nav' : ''}

    // get all cart products_______________________________________________________________________________________________________________________________
    const { data: cartProducts = [], refetch } = useQuery({
        queryKey: ["cartProducts", cartToken],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/cart/${cartToken}`);
            return data;
        }
    });

    // console.log(location);


    return (
        <div className="relative">
            {/* search bar */}
            <SearchBox searchbarOpen={searchbarOpen} setSearchbarOpen={setSearchbarOpen} />
            {/* menu sidebar */}
            <MenuSideBar menuIsOpen={menuIsOpen} setMenuIsOpen={setMenuIsOpen} />
            {/* </div> */}
            <CartSidebar isOpen={cartOpen} setIsOpen={setCartOpen} style={'top-0'} data={cartProducts} refetch={refetch} />
            <div ref={navContainerRef} className={`fixed inset-x-0 top-2 md:top-5  h-16 border-none transition-all duration-700 sm:inset-x-6 z-50`}>


                <header className={`absolute w-full top-1/2 ${pathname === '/' ? 'md:w-10/12' : 'md:w-9/12'} md:left-1/2 -translate-y-1/2 md:-translate-x-1/2`}>
                    <nav className={`flex size-full items-center justify-between p-4 
                    ${!mounted || currentScrollY === 0 ? 'text-black' : 'text-white'}
                    
                     `}>

                        {/* ${location.pathname === '/' && 'text-black'} */}

                        <div className="flex items-center md:hidden">
                            <button onClick={() => setMenuIsOpen(!menuIsOpen)}>
                                <Menu className="rotate-90" />
                            </button>
                        </div>


                        {/* website name */}
                        <div className={`h-full items-center `}>
                            <Link href='/' className={`font-kaushan text-3xl font-[Alverd] uppercase`}>Al Idaad</Link>
                        </div>

                        {/* left anchors */}
                        <div className={`hidden md:flex h-full items-center`}>

                            <div className={`flex md:items-center`}>
                                {navItems.map((nav, idx) => (
                                    <Link key={idx} href={nav?.destination} >
                                        <button className={`uppercase nav-hover-btn`}>{nav?.name}</button>
                                    </Link>
                                ))}
                                <div className="">
                                    {/* <NavCategoriesBtn /> */}
                                    <NavigationMenu>
                                        <NavigationMenuList>
                                            <NavigationMenuItem>
                                                <NavigationMenuTrigger
                                                    className="uppercase nav-hover-btn font-normal">Categories</NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                    <ul className="grid gap-2 p-4 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                        {categories.map((component) => (
                                                            <ListItem
                                                                key={component?.name}
                                                                title={component?.name}
                                                                icon={component?.icon}
                                                                to={component?.to}
                                                            >
                                                                {component.description}
                                                            </ListItem>
                                                        ))}
                                                    </ul>
                                                </NavigationMenuContent>
                                            </NavigationMenuItem>
                                        </NavigationMenuList>
                                    </NavigationMenu>
                                </div>
                            </div>


                        </div>

                        <div className="flex items-center gap-4 md:gap-10">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={() => setSearchbarOpen(!searchbarOpen)} className="hover:scale-105 outline-none"><Search size={22} /></button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Search</p>
                                </TooltipContent>
                            </Tooltip>

                            <NotificationsPanel />

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    {!user && <Link href={'/login'} className="hidden md:block md:nav-hover-btn hover:scale-105 outline-none"><User size={22} /></Link>}
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Profile</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    {user && <Link href={'/account'} className="hidden md:block md:nav-hover-btn hover:scale-105 outline-none"><User size={22} /></Link>}
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Profile</p>
                                </TooltipContent>
                            </Tooltip>

                            <div className="flex items-center">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button onClick={() => setCartOpen(!cartOpen)} className="hover:scale-105 outline-none relative">
                                            <ShoppingBag size={22} />
                                            {cartProducts?.length > 0 && <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full px-1 z-10">{cartProducts?.length}</span>}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Cart</p>
                                    </TooltipContent>
                                </Tooltip>

                                {role === 'admin' && <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href='/dashboard' className="hover:scale-105 outline-none hidden md:block ml-8">
                                            <Shield size={22} />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Dashboard</p>
                                    </TooltipContent>
                                </Tooltip>}
                            </div>
                        </div>


                    </nav>
                </header>
            </div>
        </div >
    );
};

export default Navbar;