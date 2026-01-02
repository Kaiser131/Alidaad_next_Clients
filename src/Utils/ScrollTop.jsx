'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ScrollTop = ({ children }) => {
    const pathname = usePathname();

    useEffect(() => {
        // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        window.scrollTo({ top: 0, left: 0 });
    }, [pathname]);

    return children;
};

export default ScrollTop;