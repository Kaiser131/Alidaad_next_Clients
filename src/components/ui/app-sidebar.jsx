import React from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    useSidebar
} from "@/components/ui/sidebar";
import { Package, MessageSquare, PackagePlus, Inbox, Ban, Hourglass, BadgeCheck, Truck, UserRound, } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { ChevronDown, ChevronUp, User2 } from 'lucide-react';
import useAuth from '../../Hooks/Auth/useAuth';

const AppSidebar = () => {

    const { user, logOut } = useAuth();
    const { isMobile, setOpenMobile } = useSidebar();

    const handleLinkClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    const ordersButtons = [
        { title: "New Order", url: '/dashboard/new_orders', icon: Inbox },
        { title: "Pending Orders", url: '/dashboard/pending_orders', icon: Hourglass },
        { title: "Completed Orders", url: '/dashboard/completed_orders', icon: BadgeCheck },
        { title: "Cancelled Orders", url: '/dashboard/cancelled_orders', icon: Ban },
    ];

    const productsButtons = [
        { title: "All Products", url: '/dashboard/all_product', icon: Package },
        { title: "Add Product", url: '/dashboard/add_product', icon: PackagePlus },
    ];


    const utilityButtons = [
        { title: "Pathao ", url: 'https://merchant.pathao.com/courier/orders/list', icon: Truck },
        { title: "Live Chat", url: '/dashboard/admin_chat', icon: MessageSquare },
        { title: "Users ", url: '/dashboard/users', icon: UserRound },
    ];

    const editButtons = [
        { title: "Image ", url: '/dashboard/imagesEdit', icon: PackagePlus },
    ];


    return (
        <Sidebar variant={'sidebar'} collapsible={'icon'}>
            {/* sidebar header */}
            <SidebarHeader collapsible={'none'}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <span className='text-2xl font-bold'>Al Idaad</span>
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <Link href={'/'} onClick={handleLinkClick}>Home</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={'/dashboard'} onClick={handleLinkClick}>Dashboard</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={'/products'} onClick={handleLinkClick}>All Products</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* side menus buttons */}
            <SidebarContent>
                {/* order */}
                <SidebarGroup>
                    <SidebarGroupLabel>Order Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {ordersButtons.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item?.url} onClick={handleLinkClick}>
                                                <IconComponent />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* product */}
                <SidebarGroup>
                    <SidebarGroupLabel>Product Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {productsButtons.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item?.url} onClick={handleLinkClick}>
                                                <IconComponent />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* utility */}
                <SidebarGroup>
                    <SidebarGroupLabel>Utility Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {utilityButtons.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item?.url} onClick={handleLinkClick}>
                                                <IconComponent />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>



                {/* Edits */}
                <SidebarGroup>
                    <SidebarGroupLabel>Edit Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {editButtons.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item?.url} onClick={handleLinkClick}>
                                                <IconComponent />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>



            </SidebarContent>

            {/* side bar footer */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> {user?.name || 'Admin'}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                {/* <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Billing</span>
                                </DropdownMenuItem> */}
                                <DropdownMenuItem>
                                    <button onClick={logOut}>Sign out</button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};

export default AppSidebar;