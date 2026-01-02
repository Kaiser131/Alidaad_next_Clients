"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import Breadcrumbs from "../../../components/Shared/Breadcrumbs/Breadcrumbs";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/Axios/useAxiosSecure";
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
    const axiosSecure = useAxiosSecure();

    // states_____________________________________________________________________________________________________________
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));

    // data fetching and request________________________________________________________________________________________________________

    // listed new orders table data____________________________________________________________
    const { data: orders = [], refetch, isLoading: ordersLoading } = useQuery({
        queryKey: ['new_orders', search, month],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/order_lists/${'listed'}?search=${search}&month=${month}`);
            return data;
        }
    });

    // proceed order___________________________________________________________________
    const { mutateAsync: proceedOrder } = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosSecure.patch(`/proceed_order/${id}`);
            return data;
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

    // functions___________________________________________________________________________________________________________

    const handleSearch = (e) => {
        e.preventDefault();
        const form = e.target;
        const searchData = form.search.value;
        setSearch(searchData);
    };

    const handleProceedOrder = async (id) => {
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
    };

    const handleCancelOrder = async (id) => {
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

    // Create columns with handler functions
    const columns = createColumns(handleProceedOrder, handleCancelOrder);

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
                                onClick={() => { setMonth(''); setSearch(''); }}
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