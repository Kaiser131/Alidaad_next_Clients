"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import useAxiosSecure from '../../../Hooks/Axios/useAxiosSecure';
import { useMutation, useQuery } from '@tanstack/react-query';
import Breadcrumbs from '../../../components/Shared/Breadcrumbs/Breadcrumbs';
import Swal from 'sweetalert2';
import { ArrowRight, Trash2, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Loading from '../../../components/Shared/Loading/Loading';
import { generateInvoicePDF } from '../../../Utils/generateInvoicePDF';

const OrderDetails = () => {
    const { order_id } = useParams();
    const axiosSecure = useAxiosSecure();

    // states___________________________________________________________________________________________________


    // request and fetching_____________________________________________________________________________________
    const { data: order = [], refetch, isLoading: orderIsLoading } = useQuery({
        queryKey: ['order', order_id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/order_details/${order_id}`);
            return data;
        }
    });

    console.log(order);

    // proceed order___________________________________________________________________
    const { mutateAsync: proceedOrder } = useMutation({
        mutationFn: async () => {
            const { data } = await axiosSecure.patch(`/proceed_order/${order_id}`);
            return data;
        },
        onSuccess: () => {
            refetch();
            Swal.fire({
                title: "Congratulations!",
                text: `Your order has been ${status}.`,
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

    // handle cancel or delete one product
    const { mutateAsync: cancelProduct } = useMutation({
        mutationFn: async (productId) => {
            const { data } = await axiosSecure.delete(`/cancel_product/${order_id}?productId=${productId}`);
            console.log(data);

            return data;
        },
        onSuccess: () => {
            refetch();
            toast.success('A product has been cancelled');
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



    // functions_______________________________________________________________________________________________
    const handleProceedOrder = async (id) => {
        // console.log(id);
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

    const handleCancelProduct = async (id) => {
        // console.log(id);

        Swal.fire({
            title: "Are you sure to cancel this product?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Proceed"
        }).then((result) => {
            if (result.isConfirmed) {
                cancelProduct(id);
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
    const handleDownloadInvoice = async () => {
        try {
            // Validate order data
            if (!order || !order.order_id) {
                toast.error('Order data is not available. Please refresh the page.');
                console.error('Order data missing:', order);
                return;
            }

            if (!order.products || order.products.length === 0) {
                toast.error('No products found in this order.');
                console.error('Products missing:', order);
                return;
            }

            await generateInvoicePDF(order);
            toast.success('Invoice downloaded successfully!');
        } catch (error) {

            toast.error(`Failed to generate invoice: ${error.message || 'Unknown error'}`);
        }
    };


    // consoles________________________________________________________________________________________________
    // console.log(order?.status);

    if (orderIsLoading) return <Loading />;



    return (
        <div className='min-h-[100dvh] bg-[#F4F8FB] p-10'>

            <div className='space-y-5'>
                <p className='text-2xl font-bold'>Order Details</p>

                {/* breadcrumbs */}
                <Breadcrumbs />

                <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
                    {/* Header */}
                    <div className="flex justify-between border-b pb-3">
                        <div>
                            <p className="text-sm text-gray-500">
                                Name : {order?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                Address : {order?.address}
                            </p>
                            {
                                order?.email && <p className="text-sm text-gray-500">
                                    Email : {order?.email}
                                </p>
                            }
                            <p className="text-sm text-gray-500">
                                Mobile : {order?.mobile}
                            </p>
                            <p className="text-sm text-gray-500">
                                Order Date : {new Date(order?.ordered_date).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}
                            </p>

                        </div>
                        <div className="text-gray-500">
                            {/* <button className="bg-indigo-600 text-white">Buy NOW</button> */}
                            <div className='text-sm'>
                                <p className="font-medium">Order: {order?.order_id}</p>
                                <p className="font-medium">Delivery: {order?.deliveryCharge}  <span className="text-base font-mina">৳</span></p>
                                <p className={`font-medium ${order?.delivery === 'Outside Dhaka' ? 'text-red-600' : 'text-blue-600'}`}>{order?.delivery}</p>
                                {order?.status === 'listed' && <p className={`font-medium ${order?.status === 'listed' && 'text-green-600'}`}>{order?.status}</p>}
                                {order?.status === 'pending' && <p className={`font-medium ${order?.status === 'pending' && 'text-orange-600'}`}>{order?.status}</p>}
                                {order?.status === 'completed' && <p className={`font-medium ${order?.status === 'completed' && 'text-blue-600'}`}>{order?.status}</p>}
                                {order?.status === 'cancelled' && <p className={`font-medium ${order?.status === 'cancelled' && 'text-red-600'}`}>{order?.status}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="divide-y">
                        {order?.products?.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex gap-4 py-4 items-center justify-between"
                            >
                                {/* Image */}
                                <img
                                    src={item?.image}
                                    alt={item?.name}
                                    className="size-20 object-cover rounded-md"
                                />

                                {/* Info */}
                                <div className="flex-1">
                                    {item?.category === 'Luxury' && <p className='text-pink-500'>{item?.category}</p>}
                                    {item?.category === 'Smartwatches' && <p className='text-orange-600'>{item?.category}</p>}
                                    {item?.category === 'Casual' && <p className='text-green-500'>{item?.category}</p>}
                                    {item?.category === 'Household' && <p className='text-blue-500'>{item?.category}</p>}
                                    <p className="font-medium">{item?.name}</p>
                                    <div className='flex gap-3'>
                                        {item?.color && <p className='text-sm text-gray-500'>Variant : <span className='font-bold'>{item?.color}</span></p>}
                                        <p className="text-sm text-gray-500">
                                            Quantity: <span className='font-bold'>{item?.quantity}</span>
                                        </p>

                                        {item?.size && <p className='text-sm text-gray-500'>Size : <span className='font-bold'>{item?.size}</span></p>}
                                    </div>
                                    <div className='flex gap-3'>
                                        <p className="text-sm text-gray-500">Price : {item?.discountedPrice}  <span className="text-base font-mina">৳</span></p>
                                        <p className="font-semibold text-sm text-gray-500">Total Price: {item?.total_price} <span className="text-base font-mina">৳</span></p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex flex-col items-end min-w-[150px]">
                                    <div className='flex gap-3'>
                                        <button disabled={order?.products?.length === 1}
                                            onClick={() => handleCancelProduct(item?._id)}
                                            className='disabled:cursor-not-allowed text-red-600'><Trash2 /></button>
                                        <Link href={`/product_details/${item?.product_id}`} className='text-blue-600'><ArrowRight /></Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="border-t space-y-2 pt-4 text-sm">
                        <p className="text-right font-semibold">Total Price: {order?.products_total} <span className="text-base font-mina">৳</span></p>
                        <div className='flex flex-wrap gap-3 justify-between'>
                            <button disabled={order?.status === 'cancelled'} onClick={() => handleCancelOrder(order?._id)} className="disabled:cursor-not-allowed flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors shadow-md">
                                Cancel Order
                            </button>
                            <button
                                onClick={handleDownloadInvoice}
                                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                            >
                                <Download className="w-4 h-4" />
                                Download Invoice
                            </button>
                            {order?.status === 'listed' && <button disabled={order?.status === 'pending'} onClick={() => handleProceedOrder(order?._id)} className="disabled:cursor-not-allowed flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors shadow-md">
                                Proceed Order
                            </button>}
                            {order?.status === 'pending' && <button disabled={order?.status === 'completed'} onClick={() => handleCompleteOrder(order)} className="disabled:cursor-not-allowed flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors shadow-md">
                                Complete Order
                            </button>}
                        </div>
                    </div>
                </div>


            </div>

        </div>
    );
};

export default OrderDetails;