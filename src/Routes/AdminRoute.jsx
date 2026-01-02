'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../Hooks/Auth/useAuth';
import useRole from '../Hooks/Role/useRole';
import Loading from '../components/Shared/Loading/Loading';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, roleLoading } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !roleLoading) {
            if (!user) {
                router.push('/login');
            } else if (role !== 'admin') {
                router.push('/');
            }
        }
    }, [user, loading, role, roleLoading, router]);

    if (loading || roleLoading) return <Loading />;
    if (!user || role !== 'admin') return null;

    return children;
};

export default AdminRoute;