"use client";

import { useState, useCallback, useMemo } from "react";
import { Trash2, Wallet } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter, useParams } from 'next/navigation';
import useAuth from "../../../Hooks/Auth/useAuth";
import Swal from "sweetalert2";
import Loading from "../../../components/Shared/Loading/Loading";
import { useHead } from "@unhead/react";
import PathaoShipping from "../../../components/Shared/PathaoShipping/PathaoShipping";

export default function Checkout() {

    const { user, cartToken, color, quantity, sizes } = useAuth();
    const queryClient = useQueryClient();
    const [orderId, setOrderId] = useState('');
    const [pathaoDeliveryInfo, setPathaoDeliveryInfo] = useState(null);
    const [special_instruction, setSpecial_instruction] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    // get users data_________________________________________________________________________________________________________________
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const router = useRouter();
    const { id } = useParams();

    // API URL configuration
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    // console.log(id);

    // single buy data Product - using Next.js fetch API
    const { data: product = {}, isLoading: isLoadingProduct } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/product_details/${id}`, {
                next: { revalidate: 60 }, // Cache for 60 seconds
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) throw new Error('Failed to fetch product');
            return response.json();
        },
        enabled: !!id // only run the query if id exists
    });


    // get all cart data - using Next.js fetch API
    const { data: cartProducts = [], refetch, isLoading: isLoadingCartProducts } = useQuery({
        queryKey: ['cartProducts', cartToken],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/cart/${cartToken}`, {
                cache: 'no-store', // Always get fresh cart data
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) throw new Error('Failed to fetch cart');
            return response.json();
        },
        enabled: !!cartToken
    });

    // delete cart item - using Next.js fetch API
    const { mutateAsync: clearCart } = useMutation({
        mutationFn: async (id) => {
            const response = await fetch(`${API_URL}/cart/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) throw new Error('Failed to clear cart');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["cartProducts", cartToken]);
        }
    });

    // filtering the product array to get some data_________________________________________________________________________________________
    const filteredArray = cartProducts.map(item => item);
    // console.log(product);
    // console.log(cartProducts);
    // console.table(filteredArray);



    // Memoize expensive calculations to prevent recalculation on every render
    const cartTotal = useMemo(
        () => cartProducts.reduce((sum, item) => sum + item.total_price, 0),
        [cartProducts]
    );

    const deliveryCharge = useMemo(
        () => pathaoDeliveryInfo ? pathaoDeliveryInfo.price : 0,
        [pathaoDeliveryInfo]
    );

    const total = useMemo(
        () => cartTotal + deliveryCharge,
        [cartTotal, deliveryCharge]
    );

    const singleTotal = useMemo(
        () => (product?.discountedPrice || 0) * quantity + deliveryCharge,
        [product?.discountedPrice, quantity, deliveryCharge]
    );

    // Calculate total item weight for Pathao - memoized
    const totalItemWeight = useMemo(
        () => id
            ? (quantity * 0.5)
            : (cartProducts.reduce((sum, item) => sum + item.quantity, 0) * 0.5),
        [id, quantity, cartProducts]
    );

    // Handle Pathao price calculation callback
    const handlePathaoPrice = useCallback((priceInfo) => {
        setPathaoDeliveryInfo(priceInfo);
    }, []);


    // add user cart data to the server - using Next.js fetch API
    const { mutateAsync: placedOrder } = useMutation({
        mutationFn: async (placedOrderInfo) => {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(placedOrderInfo),
                cache: 'no-store'
            });
            if (!response.ok) throw new Error('Failed to place order');
            return response.json();
        },
        onSuccess: async () => {
            toast.success('Order placed successfully');
            router.push(`/order_confirm/${orderId}`);
            if (!id) {
                await clearCart(cartToken);
            }
        }
    });




    // add user details to the server - memoized callback
    const handlePlaceOrder = useCallback(async () => {
        // Check required fields first
        if (!name || !mobile || !address) {
            toast.error('Please fill all the fields');
            return;
        }

        // Check mobile length
        if (mobile.length !== 11) {
            toast.error('Please enter a valid 11-digit mobile number');
            return;
        }

        // Check Bangladeshi mobile number prefix
        const sliceMobile = mobile.slice(0, 3);
        if (sliceMobile !== '017' && sliceMobile !== '018' && sliceMobile !== '019' &&
            sliceMobile !== '016' && sliceMobile !== '015' && sliceMobile !== '013' &&
            sliceMobile !== '014') {
            toast.error('Please enter a valid Bangladeshi mobile number');
            return;
        }

        // Check address length
        if (address.length < 10) {
            toast.error('Address must be at least 10 characters long');
            return;
        }

        // Check delivery information
        if (!deliveryCharge || !pathaoDeliveryInfo) {
            toast.error('Please complete delivery location selection');
            return;
        }
        // console.log(address.length);

        // generate random order id_________________________________________________________________________________________
        const order_id = Math.floor(1000000000 + Math.random() * 9000000000);
        setOrderId(order_id);

        let products_total;
        let products;

        if (id) {
            products_total = singleTotal;
            products = [{
                cartToken,
                category: product?.category,
                product_id: product._id,
                name: product.name,
                email: user?.email || 'guest',
                discountedPrice: product.discountedPrice,
                quantity: quantity,
                total_price: product.discountedPrice * quantity,
                color,
                size: sizes,
                ordered_date: new Date(),
                ordered_month: new Date().toLocaleString('en-US', { month: 'long' }),
                ordered_year: new Date().getFullYear(),
                image: product.images?.[0] || "/placeholder.png",
            }];
        } else if (!id) {
            products_total = total;
            products = filteredArray;
        }

        const formData = {
            name,
            email: user?.email || 'guest',
            cartToken,
            deliveryCharge,
            order_id,
            mobile,
            address,
            special_instruction,
            delivery: 'Pathao',
            paymentMethod,
            products_total: products_total - deliveryCharge,
            ordered_date: new Date(),
            ordered_month: new Date().toLocaleString('en-US', { month: 'long' }),
            ordered_year: new Date().getFullYear(),
            status: 'listed',
            products,
            pathao_city_id: pathaoDeliveryInfo.cityId,
            pathao_zone_id: pathaoDeliveryInfo.zoneId,
            pathao_area_id: pathaoDeliveryInfo.areaId,
        };
        try {
            await placedOrder(formData);
        } catch (error) {
            console.log(error);
        }

    }, [name, mobile, address, deliveryCharge, pathaoDeliveryInfo, id, singleTotal, total,
        product, quantity, color, sizes, cartToken, user?.email, special_instruction,
        paymentMethod, filteredArray, placedOrder]);




    // delete cart item - using Next.js fetch API
    const { mutateAsync: deleteCartItem } = useMutation({
        mutationFn: async (id) => {
            const response = await fetch(`${API_URL}/cart/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) throw new Error('Failed to delete item');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Item deleted');
            refetch();
        }
    });


    // console.log(product);
    const handleDelete = useCallback(async (id) => {
        await deleteCartItem(id);
    }, [deleteCartItem]);


    useHead({
        title: `Checkout - A`,
        meta: [
            { name: 'A', content: `Checkout` }
        ]
    });


    if (isLoadingProduct || isLoadingCartProducts) return <Loading />;


    return (

        <div className='mt-20 md:mt-24 md:max-w-10/12 mx-auto px-4 border-t py-4'>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 relative">
                {/* Left Side - Form */}
                <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }} className="bg-white p-4 rounded-xl shadow space-y-4 md:sticky md:top-24 md:h-[80vh]">
                    <h2 className="text-xl font-semibold">
                        Shipping Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input required name="name" className="border rounded p-2 text-sm outline-none" placeholder="Your Name"
                            onChange={(e) => setName(e.target.value)} />
                        <div className="flex border rounded overflow-hidden">
                            <span className="bg-gray-100 px-2 py-2 text-sm">(BD)+88</span>
                            <input
                                type="text"
                                name="mobile"
                                required
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="flex-1 p-2 text-sm outline-none"
                                placeholder="Mobile Number"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/\D/g, ""); // remove non-digits
                                }}
                                onChange={(e => setMobile(e.target.value))}
                            />

                        </div>
                    </div>
                    <textarea required name="address" className="border rounded w-full p-2 text-sm outline-none" placeholder="Delivery Address"
                        onChange={(e) => setAddress(e.target.value)}></textarea>

                    <div className="space-y-4">
                        <h3 className="font-semibold mb-2">Shipping method</h3>
                        <div className="flex-grow">
                            <div className="bg-gray-50 p-2 rounded shadow">
                                <PathaoShipping
                                    onPriceCalculated={handlePathaoPrice}
                                    itemWeight={totalItemWeight}
                                />
                            </div>
                        </div>
                        <div
                            className={`relative border rounded-md p-4 w-60 cursor-pointer transition-all bg-gray-50 border-black border-gray-300'
                                }`}
                        >
                            <div className="absolute top-2 right-2">
                                <span
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center border-black
                                        }`}
                                >
                                    <span className="w-2.5 h-2.5 bg-black rounded-full"></span>
                                </span>
                            </div>
                            <div className="flex justify-center mb-2">
                                <Wallet className="w-8 h-8 " />
                            </div>
                            <p className="text-center font-medium text-gray-800">Cash On Delivery</p>
                        </div>
                    </div>

                </form>

                {/* Right Side - Order Summary */}
                <div className="bg-[#F5F5F5] p-4 mx-3 rounded-xl space-y-4 flex flex-col">
                    <h2 className="font-semibold">Your Order</h2>

                    {/* for all the cart data_________________________________________________________________________________________________________ */}
                    {!id && cartProducts.map((item) => (
                        <div key={item?._id} className="border rounded-lg p-3 flex gap-3 relative bg-white">
                            <div className="relative">
                                <img src={item?.image} alt="Product" className="size-20 object-cover rounded" />
                                <span className="absolute -top-2 -left-2 bg-black text-white text-xs px-1 rounded-full ">{item?.quantity}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium">{item?.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm">৳ {Math.ceil(item?.discountedPrice)}</span>
                                </div>

                                <div className="mt-2 flex items-center gap-2 justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`size-4 rounded-full shadow ${item?.color === 'white' && 'border border-gray-300'}`} style={{ background: item?.color }} />
                                        <h3 className="text-justify text-gray-500 text-sm font-medium">{item?.size}</h3>
                                        <p className="text-sm">Quantity: {item?.quantity}</p>
                                    </div>
                                    <p className="text-sm font-semibold">{Math.ceil(item?.total_price)} <span className="font-mina text-lg">৳</span></p>
                                </div>
                            </div>

                            <Trash2 onClick={() => handleDelete(item?._id)} className="absolute top-2 right-2 cursor-pointer" />
                        </div>
                    ))}


                    {/* for only single product buy_________________________________________________________________________________________________________ */}
                    {id && (
                        <div className="border rounded-lg p-3 flex gap-3 relative bg-white">
                            <div className="relative">
                                <img
                                    src={product?.images?.[0] || "/placeholder.png"}
                                    alt="Product"
                                    className="size-20 object-cover rounded"
                                />
                                <span className="absolute -top-2 -left-2 bg-black text-white text-xs px-1 rounded-full ">{product?.quantity}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium">{product?.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm">৳ {Math.ceil(product?.discountedPrice)}</span>
                                </div>

                                <div className="mt-2 flex items-center gap-2 justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`size-4 rounded-full shadow ${color === 'white' && 'border border-red-500'}`} style={{ background: color }} />
                                        <h3 className="text-justify text-black text-sm font-medium">{sizes}</h3>
                                        <p className="text-sm">Quantity: {quantity}</p>
                                    </div>
                                    <p className="text-sm font-semibold">{Math.ceil(product?.discountedPrice * quantity)} <span className="font-mina text-lg">৳</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white p-2 rounded">
                        <label className="font-medium">Note</label>
                        <textarea
                            className="border w-full p-2 my-2 rounded outline-none text-sm"
                            placeholder="Note For Delivery"
                            rows={4}
                            value={special_instruction}
                            onChange={(e) => setSpecial_instruction(e.target.value)} />
                    </div>

                    <div className="bg-white p-4 rounded shadow space-y-2 text-sm">
                        <div className="flex justify-between font-medium pt-2">
                            <span className="font-medium">Sub Total</span>
                            {!id && <span className="font-mina">৳ {Math.ceil(cartTotal)}</span>}
                            {id && <span className="font-mina">৳ {Math.ceil(product?.discountedPrice * quantity)}</span>}
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Delivery Charge</span>
                            <span className="font-mina">৳{Math.ceil(deliveryCharge)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2 text-base">
                            <span className="">Total Amount</span>
                            {!id && <span className="font-mina">৳{Math.ceil(total)}</span>}
                            {id && <span className="font-mina">৳{Math.ceil(singleTotal)}</span>}
                        </div>
                        <div className="my-4">
                            <button type="button" onClick={handlePlaceOrder} className="bg-black text-white py-2 px-4 rounded w-full">Place Order</button>
                        </div>
                    </div>
                </div>
            </div>


        </div >
    );
}