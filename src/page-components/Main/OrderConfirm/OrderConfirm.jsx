"use client";

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Mail, Phone, MapPin, User, Trash2 } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import Loading from '../../../components/Shared/Loading/Loading';
import { useHead } from '@unhead/react';

const OrderConfirm = () => {

    const { order_id } = useParams();

    // API URL configuration
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    // Fetch order confirmation data with Next.js fetch API
    const { data: confirmOrders = [], isLoading } = useQuery({
        queryKey: ['confirmOrders', order_id],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/confirm_orders/${order_id}`, {
                next: { revalidate: 300 }, // Cache for 5 minutes
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) throw new Error('Failed to fetch order confirmation');
            return response.json();
        },
        enabled: !!order_id,
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    });

    // Memoize expensive calculations
    const subtotal = useMemo(
        () => (confirmOrders?.products_total || 0) - (confirmOrders?.deliveryCharge || 0),
        [confirmOrders?.products_total, confirmOrders?.deliveryCharge]
    );

    const productCount = useMemo(
        () => confirmOrders?.products?.length || 0,
        [confirmOrders?.products]
    );

    useHead({
        title: `Order: ${order_id} - Alidaad`,
        meta: [
            { name: 'Alidaad', content: `Order-${order_id}` }
        ]
    });

    if (isLoading) return <Loading />;


    return (
        <div className="min-h-screen mt-20 md:mt-24">
            <div className="max-w-5xl mx-auto p-6 bg-[#F5F5F5]">
                {/* Title */}
                <h1 className="text-2xl font-semibold mb-2">Your Order</h1>
                <p className="text-gray-500 mb-6">
                    Order ID : <span className="font-medium">{order_id}</span>
                </p>
                <p className="text-sm text-green-600 font-medium mb-8">
                    Thank you. Your order has been confirmed.
                </p>

                <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-6 relative">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product */}
                        {
                            confirmOrders?.products?.map((product, idx) => (
                                <div key={idx} className="border rounded-2xl p-4 flex items-center justify-between bg-white shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={product?.image}
                                            alt={product?.name}
                                            className="size-16 md:size-24 rounded-md object-cover"
                                        />
                                        <div>
                                            <p className="text-sm text-gray-500">{product?.category}</p>
                                            <h2 className="font-semibold">{product?.name}</h2>
                                            <div className='flex flex-col md:flex-row gap-4 mt-1'>
                                                {product?.color && <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    Variant : {product?.color} <span className="size-3 rounded-full" style={{ background: product?.color }}></span>
                                                </p>
                                                }
                                                {product?.size && <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    Size : {product?.size} <span className="size-3 rounded-full font-medium"></span>
                                                </p>}
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    Quantity : {product?.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="font-medium text-lg"><span className='text-xl font-mina'>৳ </span>{product?.total_price}</p>
                                    </div>
                                </div>
                            ))
                        }

                        {/* Order Summary */}
                        <div className="border rounded-2xl p-4 bg-white shadow-sm">
                            <h3 className="font-semibold mb-4">Order Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <p><span className='font-mina'>৳ </span>{subtotal}</p>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Charge</span>
                                    <p><span className='font-mina'>৳ </span>{confirmOrders?.deliveryCharge}</p>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-semibold">
                                    <span>Total</span>
                                    <p><span className='font-mina'>৳ </span>{confirmOrders?.products_total}</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center'>
                            <button
                                // onClick={generatePDF}
                                className="px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-indigo-700 transition"
                            >
                                Download Invoice
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6 md:sticky md:top-4 md:self-start">
                        {/* Customer */}
                        <div className="border rounded-2xl p-4 bg-white shadow-sm">
                            <h3 className="font-semibold mb-2">Customer</h3>
                            <div className="flex items-center gap-2 text-gray-700">
                                <User size={18} /> {confirmOrders?.name}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{productCount} Order</p>
                        </div>

                        {/* Customer Information */}
                        <div className="border rounded-2xl p-4 bg-white shadow-sm">
                            <h3 className="font-semibold mb-2">Customer Information</h3>
                            <div className="flex items-center gap-2 text-gray-700">
                                <Mail size={18} /> {confirmOrders?.email || 'No email provided'}
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 mt-2">
                                <Phone size={18} /> {confirmOrders?.mobile || 'No mobile number provided'}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="border rounded-2xl p-4 bg-white shadow-sm">
                            <h3 className="font-semibold mb-2">Delivery Address</h3>
                            <p className="text-gray-700">{confirmOrders?.name}</p>
                            <p className="text-sm text-gray-500">
                                {confirmOrders?.address}
                            </p>
                            {/* <button className="mt-3 flex items-center gap-1 text-sm text-indigo-600">
                                <MapPin size={16} /> select on map
                            </button> */}
                        </div>

                        {/* Billing Address */}
                        <div className="border rounded-2xl p-4 bg-white shadow-sm">
                            <h3 className="font-semibold mb-2">Note</h3>
                            <p className="text-sm text-gray-500">{confirmOrders?.special_instruction || 'No special instruction provided'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirm;