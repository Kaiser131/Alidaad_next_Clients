"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import Breadcrumbs from "../../../components/Shared/Breadcrumbs/Breadcrumbs";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Loading from "../../../components/Shared/Loading/Loading";
import { DataTable } from "../../../components/ui/data-table";
import { createColumns } from "./columns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NewOrders = () => {

    // API URL configuration
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    // states_____________________________________________________________________________________________________________
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));

    // data fetching and request________________________________________________________________________________________________________

    // listed new orders table data - using Next.js fetch API
    const { data: orders = [], refetch, isLoading: ordersLoading } = useQuery({
        queryKey: ['new_orders', search, month],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/order_lists/listed?search=${search}&month=${month}`, {
                cache: 'no-store', // Always get fresh order data for dashboard
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) throw new Error('Failed to fetch orders');
            return response.json();
        },
        staleTime: 0, // Always refetch when component mounts
        refetchOnMount: true,
    });

    // proceed order - using Next.js fetch API
    const { mutateAsync: proceedOrder } = useMutation({
        mutationFn: async (id) => {
            const response = await fetch(`${API_URL}/proceed_order/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            });
            if (!response.ok) throw new Error('Failed to proceed order');
            return response.json();
        },
        onSuccess: () => {
            refetch();
            Swal.fire({
                title: "Congratulations!",
                text: "Your order has been proceed.",
                icon: "success"
            });
        }
    });

    // cancel order - using Next.js fetch API
    const { mutateAsync: cancelOrder } = useMutation({
        mutationFn: async (id) => {
            const response = await fetch(`${API_URL}/cancel_order/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            });
            if (!response.ok) throw new Error('Failed to cancel order');
            return response.json();
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

    // functions - memoized callbacks

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        const form = e.target;
        const searchData = form.search.value;
        setSearch(searchData);
    }, []);

    const handleProceedOrder = useCallback(async (id) => {
        Swal.fire({
            title: "Are you sure to proceed this order?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Proceed"
        }).then((result) => {
            if (result.isConfirmed) {
                proceedOrder(id);
            }
        });
    }, [proceedOrder]);

    const handleCancelOrder = useCallback(async (id) => {
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
    }, [cancelOrder]);

    // Create columns with handler functions - memoized
    const columns = useMemo(
        () => createColumns(handleProceedOrder, handleCancelOrder),
        [handleProceedOrder, handleCancelOrder]
    );

    // Memoize reset handler
    const handleReset = useCallback(() => {
        setMonth('');
        setSearch('');
    }, []);

    if (ordersLoading) return <Loading />;

    return (
        <div className='min-h-[100dvh] p-4 md:p-10 bg-[#F4F8FB]'>
            <div className="space-y-4">
                <p className='text-xl md:text-2xl font-bold'>New Orders</p>

                {/* breadcrumbs */}
                <Breadcrumbs />

                {/* Header Section */}
                <div className="">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                        <h2 className="text-xl font-semibold">Orders</h2>

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
                                <Input
                                    name="search"
                                    placeholder="Search"
                                    type="text"
                                    className="pl-5 pr-10 w-full sm:w-[300px] rounded-full"
                                />
                                <Button
                                    type="submit"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                >
                                    <Search className="h-4 w-4 text-gray-500" />
                                </Button>
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

                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 w-full sm:w-auto"
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="pb-12">
                    <DataTable columns={columns} data={orders} />
                </div>
            </div>
        </div>
    );
};

export default NewOrders;