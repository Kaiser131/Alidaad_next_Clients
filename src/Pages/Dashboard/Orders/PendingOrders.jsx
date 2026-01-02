"use client";

import React, { useState } from 'react';
import Breadcrumbs from '../../../components/Shared/Breadcrumbs/Breadcrumbs';
import useAxiosSecure from '../../../Hooks/Axios/useAxiosSecure';
import { Search } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import Loading from '../../../components/Shared/Loading/Loading';
import { DataTable } from '../../../components/ui/data-table';
import { createPendingColumns } from './pendingColumns';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const PendingOrders = () => {
    const axiosSecure = useAxiosSecure();

    // states_____________________________________________________________________________________________________________
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));


    // request and responses______________________________________________________________________________________________

    // listed new orders table data_________________________________________
    const { data: pending_orders = [], refetch, isLoading: pendingOrdersIsLoading } = useQuery({
        queryKey: ['pending_orders', search, month],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/order_lists/${'pending'}?search=${search}&month=${month}`);
            return data;
        }
    });

    // complete order_______________________________________________________
    const { mutateAsync: completeOrder } = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosSecure.patch(`/complete_order/${id}`);
            return data;
        },
        onSuccess: () => {
            refetch();
            Swal.fire({
                title: "Congratulations!",
                text: "Your order has been Completed.",
                icon: "success"
            });
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


    // add ordered products to the data base
    const { mutateAsync: orderedProducts } = useMutation({
        mutationFn: async (products) => {
            const { data } = await axiosSecure.post('/complete_order_products', products);
            return data;
        },
        onSuccess: () => {
            toast.success('Successful !');
        }
    });


    // functions__________________________________________________________________________________________________________
    const handleSearch = (e) => {
        e.preventDefault();
        const form = e.target;
        const searchData = form.search.value;
        setSearch(searchData);
        // form.reset();
    };

    const handleCompleteOrder = async (order) => {
        // console.log(order);
        //for add all ordered products to data base
        const updatedProducts = order?.products?.map(product => ({
            ...product,
            completed_date: new Date(),
            complete_order_day: new Date().toLocaleString('en-US', { day: 'numeric' }),
            complete_order_month: new Date().toLocaleString('en-US', { month: 'long' }),
            complete_order_year: new Date().toLocaleString('en-US', { year: 'numeric' }),
            mobile: order?.mobile,
            customer_name: order?.name,
            address: order?.address,
            status: 'completed',
        }));
        // console.log(updatedProducts[0]);
        Swal.fire({
            title: "Are you sure to Complete this order?",
            html: "This will automatically decrease product quantities and update stock status.",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Proceed"
        }).then((result) => {
            if (result.isConfirmed) {
                completeOrder(order?._id);
                orderedProducts(updatedProducts);
                // console.log(order?._id);
                // console.log('hello there');
            }
        });
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

    // consoles___________________________________________________________________________________________________________
    // console.log(pending_orders);

    // Create columns with handler functions
    const columns = createPendingColumns(handleCompleteOrder, handleCancelOrder);

    if (pendingOrdersIsLoading) return <Loading />;

    return (
        <div className='min-h-[100dvh] bg-[#F4F8FB] p-4 sm:p-6 md:p-10 relative'>
            <div className="space-y-4">
                <p className='text-xl sm:text-2xl font-bold'>Pending Orders</p>
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
                    <DataTable columns={columns} data={pending_orders} />
                </div>



            </div>
        </div>
    );
};

export default PendingOrders;