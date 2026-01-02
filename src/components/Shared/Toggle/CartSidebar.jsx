'use client';

import { motion } from "framer-motion";
import { Trash2, X, ShoppingCart, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import useAuth from "../../../Hooks/Auth/useAuth";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const CartSidebar = ({ isOpen, setIsOpen, data, refetch, style }) => {

    // e130c528-a07f-44e2-bd9b-a4c95c920ba3

    const { user, cartToken } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();
    const queryClient = new QueryClient();

    // new category
    const [newCategory, setNewCategory] = useState('');
    const [product, setProduct] = useState({});
    // total price
    const total = data?.reduce((sum, item) => sum + item.total_price, 0);

    // cart navigate to products_______________________________________________________________________________________________________________________________
    const gotoProducts = () => {
        setIsOpen(false);
        router.push('/products');
    };
    // cart products navigate_______________________________________________________________________________________________________________________________
    const productNavigate = (id) => {
        setIsOpen(false);
        router.push(`/product_details/${id}`);
    };


    // update a cart item_______________________________________________________________________________________________________________________________
    const { mutateAsync: updateCart } = useMutation({
        mutationFn: async ({ id, updateData }) => {
            const response = await fetch(`${API_URL}/cart/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
                cache: 'no-store'
            });
            if (!response.ok) throw new Error('Failed to update cart');
            return response.json();
        },
        onSuccess: () => {
            refetch();
        }
    });

    // handle update_______________________________________________________________________________________________________________________________
    const handleUpdate = async (action, item, id) => {
        if (action === 'decrease' && item.quantity === 1) return toast.error('Minimum quantity is 1');

        // Check if increasing quantity would exceed available stock
        if (action === 'increase') {
            try {
                // Fetch current product data to check available quantity
                const response = await fetch(`${API_URL}/product_details/${item.product_id}`, {
                    cache: 'no-store' // Always check fresh stock data
                });
                if (!response.ok) throw new Error('Failed to fetch product');
                const productData = await response.json();
                const availableQuantity = parseInt(productData.quantity) || 0;

                if (item.quantity >= availableQuantity) {
                    return toast.error(`Only ${availableQuantity} items available in stock`);
                }

                if (productData.stock === 'out of stock') {
                    return toast.error('This product is out of stock');
                }
            } catch (error) {
                console.error('Error checking stock:', error);
                return toast.error('Unable to verify stock availability');
            }
        }

        const updateData = {
            quantity: action === 'increase' ? item.quantity + 1 : item.quantity - 1,
            total_price: action === 'increase' ? item.total_price + item.discountedPrice : item.total_price - item.discountedPrice,
        };
        // console.log(id, updateData);
        await updateCart({ id, updateData });
    };


    // delete cart item_______________________________________________________________________________________________________________________________
    const { mutateAsync: deleteCartItem } = useMutation({
        mutationFn: async (id) => {
            const response = await fetch(`${API_URL}/cart/${id}`, {
                method: 'DELETE',
                cache: 'no-store'
            });
            if (!response.ok) throw new Error('Failed to delete cart item');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Item deleted'),
                queryClient.invalidateQueries(["cartProducts", cartToken]);
            refetch();
        }
    });

    const handleDelete = async (id) => {
        await deleteCartItem(id);
    };

    const handleBuyNow = () => {
        setIsOpen(false);
        router.push('/checkout');
    };


    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: isOpen ? 0 : "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className={`fixed ${style} right-0 w-[90%] md:w-[400px] h-full bg-white shadow-lg z-[60] flex flex-col`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4">
                <h1 className="text-2xl">Your Cart</h1>
                <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>
            <div className="flex items-center justify-between p-4 border-b text-gray-500 text-xs uppercase">
                <h1>Product</h1>
                <h1>Total</h1>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {data?.map((item) => (
                    <div key={item?._id} className="flex gap-3 relative">
                        <img onClick={() => productNavigate(item?.product_id)} src={item?.image} alt="Product" className="cursor-pointer size-16 md:size-24 object-cover rounded" />
                        <div className="flex-1">
                            <div className="flex justify-between text-justify gap-4">
                                <div className="w-3/4">
                                    <h3 onClick={() => productNavigate(item?.product_id)} className="cursor-pointer font-medium text-gray-800 text-justify">{item?.name.split(' ').slice(0, 5).join(' ')}</h3>
                                    <h3 className="text-justify text-gray-500 text-sm">Tk {Math.ceil(item?.discountedPrice)}</h3>
                                </div>
                                <div className="w-1/4 flex justify-center mx-auto">
                                    <h3 className="text-justify text-sm pt-1 ">Tk {Math.ceil(item?.total_price)}</h3>
                                </div>
                            </div>

                            {/* <span className="line-through text-gray-400">৳ {item?.main_price}</span> */}

                            {/* Quantity */}
                            <div className="flex gap-5 items-center mt-2 justify-between">
                                <div className="flex items-center border border-gray-400 px-2 w-32 rounded-md">
                                    <button
                                        className="px-3 py-1 text-xl text-gray-600"
                                        onClick={() => handleUpdate('decrease', item, item?._id)}
                                    >
                                        -
                                    </button>
                                    <span className="flex-1 text-center text-gray-500">{item?.quantity}</span>
                                    <button
                                        className="px-3 py-1 text-xl text-gray-600"
                                        onClick={() => handleUpdate('increase', item, item?._id)}
                                    >
                                        +
                                    </button>
                                </div>
                                <h3 className="text-justify text-gray-500 text-sm font-medium">{item?.size}</h3>
                                <span className={`size-5 rounded-full shadow border ${item?.color === 'white' && 'border-gray-300'}`} style={{ background: item?.color }} />
                                <Trash2 size={20} onClick={() => handleDelete(item?._id)} className="cursor-pointer text-gray-600" />
                            </div>
                        </div>

                    </div>
                ))}

                {/* Continue Shopping */}
                <div className="text-center text-cyan-600 font-medium cursor-pointer mt-4">
                    <button onClick={gotoProducts}>+ Continue Shopping</button>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t p-4 flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm">Total:</p>
                    <p className="text-lg font-bold"><span className="text-xl font-mina">৳</span> {Math.ceil(total)}</p>
                </div>
                <button
                    onClick={() => handleBuyNow()}
                    className="bg-black text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-gray-800">
                    Buy Now →
                </button>
            </div>
        </motion.div >
    );
};

export default CartSidebar;
