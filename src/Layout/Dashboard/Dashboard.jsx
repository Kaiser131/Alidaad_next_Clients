'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Analytic from '../../components/Dash/Analytic/Analytic';
import { SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar';
import AppSidebar from '../../components/ui/app-sidebar';
import { AdminNotificationProvider } from '../../Providers/AdminNotificationProvider';
import AdminNotificationPanel from '../../components/Dash/Notifications/AdminNotificationPanel';
import { Toaster } from 'react-hot-toast';
import { Home } from 'lucide-react';

const Dashboard = ({ children }) => {

    const pathname = usePathname();
    // console.log(pathname);



    return (
        <AdminNotificationProvider>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
                <SidebarProvider>
                    <AppSidebar />

                    {/* Dashboard Header */}
                    <div className="fixed top-0 right-0 left-0 md:left-64 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-4">
                                <div className="md:hidden">
                                    <SidebarTrigger />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        Dashboard
                                    </h1>
                                    <p className="text-sm text-gray-600">Welcome back, Admin</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link href={'/'}><Home /></Link>
                                <AdminNotificationPanel />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    {pathname !== '/dashboard' && (
                        <div className="pt-20 w-full min-h-[calc(100dvh-84px)]">
                            {children}
                        </div>
                    )}

                    {pathname === '/dashboard' && (
                        <div className="pt-20 w-full min-h-[calc(100dvh-84px)]">
                            <Analytic />
                        </div>
                    )}
                </SidebarProvider>
            </div>
        </AdminNotificationProvider>
    );
};

export default Dashboard;