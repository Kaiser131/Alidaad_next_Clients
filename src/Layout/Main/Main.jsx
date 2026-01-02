'use client';

import React, { Suspense } from "react";
import ScrollTop from "../../Utils/ScrollTop";
import Navbar from "../../components/Shared/Navbar/Navbar";
import Footer from "../../components/Shared/Footer/Footer";
import useAuth from "../../Hooks/Auth/useAuth";
import useRole from "../../Hooks/Role/useRole";
import ChatWidget from "../../components/Shared/Chat/ChatWidget";

const Main = ({ children }) => {
    const { user } = useAuth();
    const { role, roleLoading } = useRole();

    return (
        <div className="selection:bg-[#262626] selection:text-white">
            <ScrollTop>
                <Navbar />
                {role !== 'admin' && <Suspense fallback={<div className="h-20" />}>
                    <ChatWidget user={user} />
                </Suspense>}
                {children}
                <Footer />
            </ScrollTop>
        </div>
    );
};

export default Main;