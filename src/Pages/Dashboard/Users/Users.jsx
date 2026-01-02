'use client';

import React, { useState } from 'react';
import useAxiosSecure from '../../../Hooks/Axios/useAxiosSecure';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Breadcrumbs from '../../../components/Shared/Breadcrumbs/Breadcrumbs';
import Loading from '../../../components/Shared/Loading/Loading';
import { UsersDataTable } from '../../../components/ui/users-data-table';
import { createUserColumns } from './userColumns';
import { UserSpendingsModal } from './UserSpendingsModal';
import Swal from 'sweetalert2';

const Users = () => {

    const axiosSecure = useAxiosSecure();

    // states_________________________________________________________________________________________________________________________________________________
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSpendingsModalOpen, setIsSpendingsModalOpen] = useState(false);
    const [userSpendingData, setUserSpendingData] = useState({ totalSpendings: 0, totalOrders: 0 });
    const [isLoadingSpending, setIsLoadingSpending] = useState(false);

    // fetching_______________________________________________________________________________________________________________________________________________
    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/users');
            return data;
        }
    });

    // functionalitys_________________________________________________________________________________________________________________________________________

    // update role
    const { mutateAsync: updateRole } = useMutation({
        mutationFn: async ({ id, role }) => {
            const { data } = await axiosSecure.patch(`/users/role/${id}`, { role });
            return data;
        },
        onSuccess: () => {
            refetch();
            toast.success('Role updated successfully');
        },
        onError: () => {
            toast.error('Failed to update role');
        }
    });

    // Handle role change
    const handleRoleChange = async (userId, newRole) => {
        const user = users.find(u => u._id === userId);

        Swal.fire({
            title: 'Change User Role?',
            html: `Are you sure you want to change <strong>${user?.name}</strong>'s role to <strong>${newRole}</strong>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) {
                updateRole({ id: userId, role: newRole });
            }
        });
    };

    // Handle view spendings
    const handleViewSpendings = async (user) => {
        try {
            setSelectedUser(user);
            setIsSpendingsModalOpen(true);
            setIsLoadingSpending(true);

            // Fetch user's order data
            const { data: orders } = await axiosSecure.get(`/account/${user.email}`);

            // Calculate total spent from orders
            const totalSpent = orders.reduce((sum, order) => sum + parseInt(order?.total_price || 0), 0);

            // Set the spending data
            setUserSpendingData({
                totalSpendings: totalSpent,
                totalOrders: orders.length
            });
        } catch (error) {
            console.error('Error fetching user spending data:', error);
            toast.error('Failed to load spending data');
            // Set default values on error
            setUserSpendingData({
                totalSpendings: 0,
                totalOrders: 0
            });
        } finally {
            setIsLoadingSpending(false);
        }
    };

    // Create columns with handlers
    const columns = createUserColumns(handleRoleChange, handleViewSpendings);

    // consoles_______________________________________________________________________________________________________________________________________________
    // console.log(users);

    if (isLoading) return <Loading />;

    return (
        <div className='min-h-[100dvh] bg-[#F4F8FB] p-4 sm:p-6 md:p-10'>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className='text-xl sm:text-2xl font-bold'>Users Management</h1>
                </div>

                {/* Breadcrumbs */}
                <Breadcrumbs />

                {/* Users Data Table */}
                <div className="bg-white rounded-xl p-4 sm:p-6">
                    <UsersDataTable columns={columns} data={users} />
                </div>

                {/* User Spendings Modal */}
                <UserSpendingsModal
                    user={selectedUser}
                    isOpen={isSpendingsModalOpen}
                    onClose={() => {
                        setIsSpendingsModalOpen(false);
                        setUserSpendingData({ totalSpendings: 0, totalOrders: 0 });
                    }}
                    totalSpendings={userSpendingData.totalSpendings}
                    totalOrders={userSpendingData.totalOrders}
                    isLoading={isLoadingSpending}
                />
            </div>
        </div>
    );
};

export default Users;