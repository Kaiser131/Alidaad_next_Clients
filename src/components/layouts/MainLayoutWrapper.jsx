'use client';

import Navbar from "@/components/Shared/Navbar/Navbar";
import Footer from "@/components/Shared/Footer/Footer";
import useAuth from "@/Hooks/Auth/useAuth";
import useRole from "@/Hooks/Role/useRole";
import ChatWidget from "@/components/Shared/Chat/ChatWidget";
import { usePathname } from "next/navigation";

const MainLayout = ({ children }) => {
    const { user } = useAuth();
    const { role, roleLoading } = useRole();
    const pathname = usePathname();

    // Don't render layout for auth pages
    if (pathname === '/login' || pathname === '/register') {
        return children;
    }

    // Don't render layout for dashboard pages
    if (pathname?.startsWith('/dashboard')) {
        return children;
    }

    return (
        <div className="selection:bg-[#262626] selection:text-white">
            <Navbar />
            {role !== 'admin' && <ChatWidget user={user} />}
            {children}
            <Footer />
        </div>
    );
};

export default MainLayout;
