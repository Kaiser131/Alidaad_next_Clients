"use client";

import React, { useState } from 'react';
import Breadcrumbs from '../../../components/Shared/Breadcrumbs/Breadcrumbs';
import { Search, Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import useAxiosSecure from '../../../Hooks/Axios/useAxiosSecure';
import { useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { DataTable } from '../../../components/ui/data-table';
import { createProductColumns } from './productColumns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Loading from '../../../components/Shared/Loading/Loading';
import { Card, CardContent } from '@/components/ui/card';

const AllProducts = () => {
    const axiosSecure = useAxiosSecure();

    // states_______________________________________________________________________________________________________________
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState('');
    const [stockFilter, setStockFilter] = useState('all'); // all, in-stock, low-stock, out-of-stock
    const [categoryFilter, setCategoryFilter] = useState('all');


    // fetching request and responses_______________________________________________________________________________________

    // all products
    const { data: dashboard_products = [], refetch, isLoading } = useQuery({
        queryKey: ['dashboard_products'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/dashboard_products');
            return data;
        }
    });

    // delete product
    const { mutateAsync: deleteProduct } = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosSecure.delete(`/dashboard_product_delete/${id}`);
            return data;
        },
        onSuccess: () => {
            refetch();
            Swal.fire({
                title: "Congratulations!",
                text: "You have deleted your product.",
                icon: "success"
            });
        }
    });

    // functions____________________________________________________________________________________________________________


    const handleSearch = (e) => {
        e.preventDefault();
        const form = e.target;
        const searchData = form.search.value;
        setSearch(searchData);
        form.reset();
    };

    const handleDeleteProduct = async (id) => {
        Swal.fire({
            title: "Are you sure to delete this product?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Proceed"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProduct(id);
            }
        });
    };

    // Filter products based on search
    const filteredProducts = dashboard_products.filter((product) => {
        const matchesSearch = search
            ? product?.name?.toLowerCase().includes(search.toLowerCase()) ||
            product?.SKU?.toLowerCase().includes(search.toLowerCase()) ||
            product?.category?.toLowerCase().includes(search.toLowerCase())
            : true;

        const matchesCategory = categoryFilter === 'all' || product?.category === categoryFilter;

        const quantity = parseInt(product?.quantity) || 0;
        const matchesStock =
            stockFilter === 'all' ||
            (stockFilter === 'out-of-stock' && quantity === 0) ||
            (stockFilter === 'low-stock' && quantity > 0 && quantity <= 5) ||
            (stockFilter === 'in-stock' && quantity > 5);

        return matchesSearch && matchesCategory && matchesStock;
    });

    // Calculate statistics
    const totalProducts = dashboard_products.length;
    const outOfStockCount = dashboard_products.filter(p => parseInt(p?.quantity) === 0).length;
    const lowStockCount = dashboard_products.filter(p => {
        const qty = parseInt(p?.quantity) || 0;
        return qty > 0 && qty <= 5;
    }).length;
    const totalValue = dashboard_products.reduce((sum, p) => sum + (parseFloat(p?.discountedPrice || p?.price) * parseInt(p?.quantity || 0)), 0);

    // Get unique categories
    const categories = [...new Set(dashboard_products.map(p => p?.category).filter(Boolean))];

    // Create columns with handler functions
    const columns = createProductColumns(handleDeleteProduct);

    if (isLoading) return <Loading />;



    return (
        <div className='min-h-[100dvh] bg-[#F4F8FB] p-4 sm:p-6 md:p-10'>
            <div className="space-y-4">

                <p className='text-xl sm:text-2xl font-bold'>All Products</p>
                {/* breadcrumbs */}
                <div className="hidden md:block">
                    <Breadcrumbs />
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Products</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                                </div>
                                <Package className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Out of Stock</p>
                                    <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
                                </div>
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Low Stock</p>
                                    <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Inventory Value</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {totalValue.toLocaleString()} <span className="text-lg font-mina">৳</span>
                                    </p>
                                </div>
                                <DollarSign className="w-8 h-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Heading and Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                            <h2 className="text-lg sm:text-xl font-semibold">Products</h2>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
                                    <Input
                                        name="search"
                                        placeholder="Search products..."
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-5 pr-10 w-full sm:w-[250px] md:w-[300px] rounded-full"
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
                            </div>
                        </div>

                        {/* Additional Filters Row */}
                        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                            <Select onValueChange={(value) => setCategoryFilter(value)} value={categoryFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select onValueChange={(value) => setStockFilter(value)} value={stockFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by stock" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Stock Levels</SelectItem>
                                    <SelectItem value="in-stock">In Stock</SelectItem>
                                    <SelectItem value="low-stock">Low Stock (≤5)</SelectItem>
                                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select onValueChange={(value) => setMonth(value)} value={month}>
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <SelectValue placeholder="Filter by month" />
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
                                onClick={() => {
                                    setMonth('');
                                    setSearch('');
                                    setCategoryFilter('all');
                                    setStockFilter('all');
                                }}
                                variant="outline"
                                className="bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 w-full sm:w-auto"
                            >
                                Reset Filters
                            </Button>
                        </div>

                        {/* Results count */}
                        <div className="text-sm text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of{' '}
                            <span className="font-semibold text-gray-900">{totalProducts}</span> products
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="pb-12">
                    <DataTable columns={columns} data={filteredProducts} />
                </div>

            </div>
        </div>
    );
};

export default AllProducts;