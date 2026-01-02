"use client";

import React, { useState } from 'react';
import Breadcrumbs from '../../../components/Shared/Breadcrumbs/Breadcrumbs';
import useAxiosSecure from '../../../Hooks/Axios/useAxiosSecure';
import { Search } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import Loading from '../../../components/Shared/Loading/Loading';
import { DataTable } from '../../../components/ui/data-table';
import { createColumns } from './columns';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const CompletedOrders = () => {
    const axiosSecure = useAxiosSecure();

    // states________________________________________________________________________________________________________________
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));


    // requests and responses________________________________________________________________________________________________

    // Completed orders table data____________________________________________________
    const { data: completed_orders = [], refetch, isLoading: completedOrdersIsLoading } = useQuery({
        queryKey: ['completed_orders', search, month],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/order_lists/${'completed'}?search=${search}&month=${month}`);
            return data;
        }
    });

    // cancel order_____________________________________________________________________
    const { mutateAsync: cancelOrder } = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosSecure.patch(`/cancel_order/${id}`);
            return data;
        },
        onSuccess: () => {
            refetch();
            Swal.fire({
                title: "Congratulations!",
                text: "Your order has been cancelled.",
                icon: "error"
            });
        }
    });



    // functions_____________________________________________________________________________________________________________
    const handleSearch = (e) => {
        e.preventDefault();
        const form = e.target;
        const searchData = form.search.value;
        setSearch(searchData);
        // form.reset();
    };

    const handleCancelOrder = async (id) => {
        // console.log(id);
        Swal.fire({
            title: "Are you sure to cancel this order?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Proceed"
        }).then((result) => {
            if (result.isConfirmed) {
                cancelOrder(id);
            }
        });
    };


    // consoles______________________________________________________________________________________________________________
    // console.log(completed_orders);

    // Create columns with handleCancelOrder function
    const columns = createColumns(handleCancelOrder);


    if (completedOrdersIsLoading) return <Loading />;



    return (
        <div className='min-h-[100dvh] bg-[#F4F8FB] p-4 sm:p-6 md:p-10 relative'>
            <div className="space-y-4">

                <p className='text-xl sm:text-2xl font-bold'>Completed Orders</p>
                {/* breadcrumbs */}
                <Breadcrumbs />

                {/* header */}
                <div className="">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                        <h2 className="text-xl font-semibold">Orders</h2>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
                                <input name="search" placeholder="Search" type="text" className="border pl-5 pr-10 py-2 border-gray-300 w-full sm:w-[300px] h-full rounded-full outline-none" />
                                <button className="absolute right-3 top-2 text-gray-500 outline-none"><Search /></button>
                            </form>
                            <Select onValueChange={(value) => setMonth(value)} defaultValue={month}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="January">January</SelectItem>
                                    <SelectItem value="February">February</SelectItem>
                                    <SelectItem value="March">March</SelectItem>
                                    <SelectItem value="April">April</SelectItem>
                                    <SelectItem value="May">May</SelectItem>
                                    <SelectItem value="June">June</SelectItem>
                                    <SelectItem value="July">July</SelectItem>
                                    <SelectItem value="August">August</SelectItem>
                                    <SelectItem value="September">September</SelectItem>
                                    <SelectItem value="October">October</SelectItem>
                                    <SelectItem value="November">November</SelectItem>
                                    <SelectItem value="December">December</SelectItem>
                                </SelectContent>
                            </Select>
                            <button onClick={() => { setMonth(''), setSearch(''); }} className="px-4 py-1 bg-green-100 outline-none text-green-600 font-bold rounded">Reset</button>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="pb-12">
                    <DataTable columns={columns} data={completed_orders} />
                </div>



            </div>
        </div>
    );
};

export default CompletedOrders;