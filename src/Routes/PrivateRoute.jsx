'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Loading from '../components/Shared/Loading/Loading';
import useAuth from '../Hooks/Auth/useAuth';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) return <Loading />;
    if (!user) return null;

    return children;
};

export default PrivateRoute;