"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import useAxiosSecure from "../../../Hooks/Axios/useAxiosSecure";
import Zoom from "react-medium-image-zoom";
import 'react-medium-image-zoom/dist/styles.css';
import ProductCard from "../Cards/ProductCard/ProductCard";
import useAuth from "../../../Hooks/Auth/useAuth";
import Loading from "../Loading/Loading";
import { useHead } from "@unhead/react";
import { AppWindowIcon, CodeIcon, Loader, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import Rating from "./Rating";
import { Progress } from "@/components/ui/progress";
import { RxCross2 } from "react-icons/rx";
import { imageUpload } from "../../../Utils/ImageUpload";
import toast from "react-hot-toast";
import useAxiosCommon from "../../../Hooks/Axios/useAxiosCommon";

const ProductDetails = () => {
    const { color, setColor, quantity, setQuantity, sizes, setSizes, user } = useAuth();
    const [selectedImage, setSelectedImage] = useState("");
    const [openShipping, setOpenShipping] = useState(true);
    const router = useRouter();

    const [rating, setRating] = useState(5);
    const [name, setName] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [images, setImages] = useState([]);

    const [hovered, setHovered] = useState(false);
    const [loading, setLaoding] = useState(false);
    const { setSearchbarOpen, } = useAuth();

    // Navigation handler for related products
    const handleNavigate = (productId) => {
        router.push(`/product_details/${productId}`);
    };

    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const axiosCommon = useAxiosCommon();
    const queryClient = useQueryClient();

    // get the token from local storage
    const { cartToken, setCartOpen } = useAuth();


    // main product
    const { data: product = {}, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const result = await axiosCommon.get(`/product_details/${id}`);
            return result.data;
        },
    });

    // set selected color______________________________________________________________________________
    useEffect(() => {
        if (product?.variant) {
            setColor(product?.variant[0]); // ✅ first one selected
        }
    }, [product?.variant, setColor]);

    // set Sizes
    useEffect(() => {
        if (product?.sizes) {
            setSizes(product?.sizes[0]); // ✅ first one selected
        }
    }, [product?.sizes, setSizes]);


    // set new quantity 1 on different page_____________________________________________________________
    useEffect(() => {
        if (product) {
            setQuantity(1); // ✅ first one selected
        }
    }, [product, setQuantity]);


    // related product datas
    const { data: relatedProducts = [], isLoading: isLoadingRelatedProducts } = useQuery({
        queryKey: ["related_products", id, product?.category],
        queryFn: async () => {
            const { data } = await axiosCommon.get(`/related_products/${id}?category=${product?.category}`);
            return data;
        },
    });

    // fetch all reviews
    const { data: reviewsData = [], refetch: reviewsRefetch } = useQuery({
        queryKey: ['reviewsData', id],
        queryFn: async () => {
            const { data } = await axiosCommon.get(`/reviews_data/${id}`);
            return data;
        }
    });

    // fetch review rating statistics
    const { data: reviewStats = {} } = useQuery({
        queryKey: ['reviewStats', id],
        queryFn: async () => {
            const { data } = await axiosCommon.get(`/review_rating/${id}`);
            return data;
        }
    });

    // add to cart 
    const { mutateAsync: addToCart } = useMutation({
        mutationFn: async (cartItem) => {
            const { data } = await axiosSecure.post("/cart", cartItem);
            return data;
        },
        onSuccess: () => {
            toast.success("Product added to cart");
            setQuantity(1);
            queryClient.invalidateQueries(["cartProducts", cartToken]);
        }
    });

    // check if a user has purchased the product before allowing review submission
    const { data: purchaseData = [], purchaseLoading } = useQuery({
        queryKey: ['purchased_check', user?.email, id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/purchased_info/${user?.email}?product_id=${id}`);
            return data;
        }
    });

    // add reviews
    const { mutateAsync: addReviews, isPending: reviewPending } = useMutation({
        mutationFn: async (reviewData) => {
            const { data } = await axiosCommon.post('/add_review', reviewData);
            return data;
        },
        onSuccess: () => {
            setImages([]);
            setLaoding(false);
            setName('');
            setRating(5);
            setReviewText('');
            reviewsRefetch();
            queryClient.invalidateQueries(['reviewStats', id]);
            toast.success('Thanks for your review !');
        }
    });


    const handleAddToCart = async (product) => {
        // Check if product is out of stock
        if (product?.stock === 'out of stock') {
            return toast.error('This product is out of stock');
        }

        // Check if requested quantity exceeds available stock
        const availableQuantity = parseInt(product?.quantity) || 0;
        if (quantity > availableQuantity) {
            return toast.error(`Only ${availableQuantity} items available in stock`);
        }

        if (availableQuantity === 0) {
            return toast.error('This product is currently unavailable');
        }

        const cartItem = {
            cartToken,
            category: product?.category,
            product_id: product?._id,
            name: product?.name,
            email: user?.email || 'guest',
            discountedPrice: Math.ceil(product?.discountedPrice),
            quantity,
            total_price: Math.ceil(product?.discountedPrice * quantity),
            color,
            size: sizes,
            ordered_date: new Date(),
            ordered_month: new Date().toLocaleString('en-US', { month: 'long' }),
            ordered_year: new Date().getFullYear(),
            image: selectedImage || product.images?.[0],
        };
        await addToCart(cartItem);
    };

    const handleBuyNowNavigate = (id) => {
        setCartOpen(false);
        router.push(`/checkout/${id}`);
    };

    const specificationsPoints = product.specification?.split(",,") || [];


    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                previews.push({ file, preview: reader.result });
                if (previews.length === files.length) {
                    setImages((prev) => [...prev, ...previews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleReview = async () => {
        if (!user) return toast.error('Please Login To Submit A Review !');
        if (!rating) return toast.error('Please Rate This Product !');
        if (!purchaseData.purchased) return toast.error('You need to purchase this product to submit a review !');
        if (!reviewText) return toast.error('Please Write Something About This Product To Submit A Review !');
        try {
            setLaoding(true);
            const imageUploadPromises = [...images].map(image => imageUpload(image.file));
            const imageUrls = await Promise.all(imageUploadPromises);
            const data = {
                rating,
                images: imageUrls,
                reviewText,
                product_id: id,
                reviewer_name: name || user?.displayName || 'Anonymoys User',
                review_time: new Date()
            };
            await addReviews(data);
        } catch (error) {
            toast.error('Failed to submit review');
        } finally {
            setLaoding(false);
        }
    };

    // react head
    useHead({
        title: `${product?.name || 'Item'} - Alidaad`,
        meta: [
            { name: 'Alidaad', content: `Product-${product?.name}` }
        ]
    });

    if (isLoading || isLoadingRelatedProducts || purchaseLoading) return <Loading />;

    return (
        <div className='min-h-screen mt-20 md:mt-24 max-w-6xl md:max-w-9/12 mx-auto  border-t px-4'>
            <div className="grid lg:grid-cols-2 md:gap-8 gap-2 relative mt-4">
                {/* Left Side - Main Image + Thumbnails */}
                <div className="lg:sticky lg:self-start lg:top-20">
                    <Zoom>
                        <img
                            src={selectedImage || product.images?.[0]}
                            alt={product?.name}
                            className="w-full h-[50dvh] lg:size-[70dvh] object-cover rounded-md border"
                        />
                    </Zoom>
                    <div className="flex gap-3 mt-4 overflow-x-auto pb-4">
                        {product.images?.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`thumb-${idx}`}
                                className={`w-20 h-20 object-cover rounded-md cursor-pointer border ${selectedImage === img ? "border-black" : "border-gray-300"
                                    }`}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                </div>


                {/* Right Side - Product Info */}
                <div>
                    <h1 className="text-3xl md:text-4xl font mb-2">{product?.name}</h1>

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-2 md:text-lg">
                        {
                            product?.discount && <span className="line-through text-gray-500">
                                Tk {product?.price}
                            </span>
                        }
                        <span className="font-bold">
                            Tk {Math.ceil(product?.discountedPrice)} BDT
                        </span>
                        {product?.stock && (
                            <span className="bg-black text-white px-2 py-0.5 rounded text-sm capitalize">
                                {product?.stock}
                            </span>
                        )}
                        {product?.quantity && (<span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-sm capitalize">
                            {product?.quantity} available
                        </span>
                        )}
                    </div>

                    {/* Bullet Points */}
                    <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                        {specificationsPoints.map((point, idx) => (
                            <li key={idx}>{point.trim()}.</li>
                        ))}
                    </ul>

                    {/* sizes */}
                    <div>
                        {product?.sizes?.length !== 0 && <p className="block mb-1 capitalize font-medium">Variants :<span className="font-normal"> {sizes}</span></p>}
                        <div className="flex flex-wrap gap-2 md:gap-4">
                            {product?.sizes?.length !== 0 && product?.sizes?.map((s, idx) => (
                                <button
                                    key={idx}
                                    className={`border border-gray-400 px-4 rounded-md py-1
                                         ${sizes === s ? "ring-1 ring-black" : ""
                                        }`}
                                    onClick={() => setSizes(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* variant */}
                    <div>
                        {product?.variant.length !== 0 && <p className="block mb-1 capitalize font-medium">Color :<span className="font-normal"> {color}</span></p>}
                        <div className="flex flex-wrap gap-4">
                            {product?.variant?.map((v, idx) => (
                                <button
                                    key={idx}
                                    className={`size-8 rounded border outline-none 
                                        ${color === v ? "ring-2 ring-black" : ""}`}
                                    style={{ backgroundColor: v }}
                                    onClick={() => setColor(v)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="mb-5">
                        <span className="font-medium block mb-1">Quantity</span>
                        <div className="flex items-center border border-black px-2 py-1 w-32 rounded-md">
                            <button
                                className="px-3 py-1 text-xl"
                                disabled={quantity <= 1}
                                onClick={() => setQuantity(quantity - 1)}
                            >
                                -
                            </button>
                            <span className="flex-1 text-center">{quantity}</span>
                            <button
                                className="px-3 py-1 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={quantity >= parseInt(product?.quantity || 0)}
                                onClick={() => {
                                    const availableQuantity = parseInt(product?.quantity) || 0;
                                    if (quantity >= availableQuantity) {
                                        toast.error(`Only ${availableQuantity} items available in stock`);
                                    } else {
                                        setQuantity(quantity + 1);
                                    }
                                }}
                            >
                                +
                            </button>
                        </div>
                        {product?.quantity && (
                            <p className="text-xs text-gray-500 mt-1">
                                Max: {product?.quantity} available
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3 mb-5">
                        <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product?.stock === 'out of stock' || parseInt(product?.quantity || 0) === 0}
                            className="border border-black text-black px-6 py-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                        >
                            {product?.stock === 'out of stock' || parseInt(product?.quantity || 0) === 0 ? 'Out of Stock' : 'Add to cart'}
                        </button>
                        <button
                            onClick={() => handleBuyNowNavigate(product?._id)}
                            disabled={product?.stock === 'out of stock' || parseInt(product?.quantity || 0) === 0}
                            className="bg-black text-center text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
                        >
                            {product?.stock === 'out of stock' || parseInt(product?.quantity || 0) === 0 ? 'Currently Unavailable' : 'Buy it now'}
                        </button>
                    </div>

                    {/* Shipping & Delivery Accordion */}
                    <div className="border rounded">
                        <button
                            onClick={() => setOpenShipping(!openShipping)}
                            className="flex justify-between w-full px-4 py-3 border-b text-left font-medium"
                        >
                            <span>Shipping & Delivery</span>
                            <span>{openShipping ? "−" : "+"}</span>
                        </button>
                        {openShipping && (
                            <div className="p-4 text-sm text-gray-700 space-y-3 text-justify">
                                <p>
                                    আমরা সারা বাংলাদেশে ক্যাশ অন ডেলিভারির মাধ্যমে প্রোডাক্ট পাঠাই।
                                    কিছু ক্ষেত্রে, কাস্টমারের রিভিউ এর উপর নির্ভর করে অগ্রিম ডেলিভারি চার্জ
                                    নেয়া হয়।
                                </p>
                                <p>
                                    আপনাকে পার্সেল গন্তব্যে পৌঁছানোর চেক করার পারমিশন দিচ্ছি, যাতে
                                    আপনি নিশ্চিত হতে পারেন যে প্রোডাক্ট সঠিক পেয়েছেন। তবে, প্রোডাক্ট
                                    ব্যবহার করা যাবে না।
                                </p>
                                <p>
                                    আমরা পাঠানো ও স্টককৃত পণ্য ফেরত পার্টি ডেলিভারির ক্ষেত্রে
                                    ব্যবহার করি।
                                </p>
                                <p>
                                    নোট: অর্ডার দেয়ার পর প্রোডাক্টের বিস্তারিত, ফটো এবং ভিডিও দেখুন।
                                </p>
                                <p>
                                    পার্সেল ডেলিভারির সময় সামনে মূল্য চেক করুন। প্রোডাক্ট ঠিক না
                                    থাকলে রিটার্ন করতে পারবেন, কোনো টাকা লাগবে না। কেবল প্রোডাক্ট
                                    ঠিক থাকলে রিটার্ন করলে ডেলিভারি চার্জ দিতে হবে।
                                </p>
                                <p>
                                    ডেলিভারি ম্যান চলে যাওয়ার পর কোনো রিটার্ন বা রিফান্ড হবে না।
                                </p>
                                <p>
                                    <strong>ডেলিভারি খরচ:</strong>
                                    <br /> ◉ ঢাকা সিটি: ৭০ টাকা
                                    <br /> ◉ ঢাকা সিটির বাইরে: ১৩০ টাকা
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* tabs */}
            <div className="flex w-full min-h-[50dvh] flex-col gap-6 my-12">
                <Tabs defaultValue="reviews">
                    <TabsList>
                        <TabsTrigger value="reviews">Reviews</TabsTrigger>
                        <TabsTrigger value="description">Description</TabsTrigger>
                    </TabsList>

                    <TabsContent value="reviews" className={'p-2 lg:p-6 space-y-8'}>
                        {/* Rating Overview Section */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 lg:p-8 shadow-sm border border-amber-100">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                                Customer Reviews
                            </h3>

                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Rating Distribution */}
                                <div className="flex-1 space-y-3">
                                    <h4 className="font-semibold text-gray-700 mb-4">Rating Distribution</h4>
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <div key={star} className="flex gap-3 items-center">
                                            <div className="flex items-center gap-1 w-20 text-sm">
                                                <span className="font-medium text-gray-700">{star}</span>
                                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            </div>
                                            <Progress
                                                value={reviewStats?.ratingPercentages?.[star] || 0}
                                                className="flex-1 h-2.5 bg-gray-200"
                                            />
                                            <span className="text-sm font-medium text-gray-600 w-12 text-right">
                                                {reviewStats?.ratingDistribution?.[star] || 0}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Average Rating Card */}
                                <div className="lg:w-80 bg-white rounded-xl p-8 shadow-md border border-amber-200 flex flex-col justify-center items-center">
                                    <div className="text-6xl font-bold text-amber-500 mb-3">
                                        {reviewStats?.averageRating || 0}
                                    </div>
                                    <Rating value={reviewStats?.averageRating || 0} size={24} readOnly={true} />
                                    <p className="text-gray-600 mt-3 font-medium">
                                        Based on {reviewStats?.totalReviews || 0} reviews
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                        <User className="w-4 h-4" />
                                        <span>Verified Purchases</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Add Review Section */}
                        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Write a Review</h3>

                            <div className="space-y-5">
                                {/* Rating Input */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <label className="font-semibold text-gray-700 min-w-[120px]">Your Rating:</label>
                                    <Rating
                                        value={rating}
                                        onChange={(value) => setRating(value)}
                                        size={28}
                                    />
                                    <span className="text-sm text-gray-500 ml-2">({rating} out of 5)</span>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-3">
                                    <label className="font-semibold text-gray-700 block">Add Photos (Optional)</label>
                                    <div className="flex gap-3 items-start flex-wrap">
                                        <label className="group w-24 h-24 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-[#F92500] hover:bg-red-50 transition-all duration-200">
                                            <span className="text-3xl text-gray-400 group-hover:text-[#F92500] transition-colors">+</span>
                                            <span className="text-xs text-gray-500 mt-1">Upload</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </label>

                                        {images.map((image, index) => (
                                            <div key={index} className="relative group w-24 h-24">
                                                <Zoom>
                                                    <img
                                                        src={image.preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 cursor-pointer hover:border-[#F92500] transition-colors"
                                                    />
                                                </Zoom>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setImages(images.filter((_, i) => i !== index));
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                    title="Remove image"
                                                >
                                                    <RxCross2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">Add up to 5 photos to help others see your experience</p>
                                </div>

                                {/* Name Input */}
                                <div className="space-y-2">
                                    <label className="font-semibold text-gray-700 block">Your Name</label>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full outline-none border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[#F92500] focus:ring-2 focus:ring-red-100 transition-all"
                                    />
                                </div>

                                {/* Review Text */}
                                <div className="space-y-2">
                                    <label className="font-semibold text-gray-700 block">Your Review</label>
                                    <textarea
                                        rows={6}
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        className="w-full outline-none border-2 border-gray-300 rounded-lg p-4 focus:border-[#F92500] focus:ring-2 focus:ring-red-100 transition-all resize-none"
                                        placeholder="Share your experience with this product..."
                                    />
                                    <p className="text-xs text-gray-500">Minimum 10 characters</p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    disabled={reviewPending || loading}
                                    onClick={handleReview}
                                    className="w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2 rounded-lg bg-[#F92500] hover:bg-red-600 font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Star className="w-5 h-5" />
                                            <span>Submit Review</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Customer Reviews List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-gray-800">Customer Reviews</h3>
                                <span className="text-sm text-gray-500">{reviewsData?.length || 0} reviews</span>
                            </div>

                            {reviewsData?.length > 0 ? (
                                <div className="space-y-4">
                                    {reviewsData.map((review) => (
                                        <div key={review?._id} className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                                            {/* Review Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                                <div className="flex items-start gap-3">
                                                    {/* Avatar */}
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                        {review?.reviewer_name?.charAt(0).toUpperCase()}
                                                    </div>

                                                    {/* Name and Date */}
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{review?.reviewer_name}</h4>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                            </svg>
                                                            {new Date(review?.review_time).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                                                    <Rating size={16} value={review?.rating} readOnly={true} />
                                                    <span className="text-sm font-semibold text-gray-700">{review?.rating}.0</span>
                                                </div>
                                            </div>

                                            {/* Review Images */}
                                            {review?.images?.length > 0 && (
                                                <div className="flex gap-2 mb-4 flex-wrap">
                                                    {review.images.map((image, idx) => (
                                                        <Zoom key={idx}>
                                                            <img
                                                                src={image}
                                                                className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 cursor-pointer hover:border-[#F92500] transition-colors"
                                                                alt={`Review ${idx + 1}`}
                                                            />
                                                        </Zoom>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Review Text */}
                                            <p className="text-gray-700 leading-relaxed">{review?.reviewText}</p>

                                            {/* Verified Badge */}
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Verified Purchase
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">No reviews yet</p>
                                    <p className="text-gray-400 text-sm mt-2">Be the first to share your experience!</p>
                                </div>
                            )}
                        </div>

                    </TabsContent>
                    <TabsContent value="description" className={'p-4'}>
                        <div>
                            {product?.description && <p className="text-justify text-gray-500">{product?.description}</p>}
                            {!product?.description && <p className="text-justify text-gray-500">No description available for this product.</p>}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>


            {/* related products */}
            <div className="mt-4">
                <p className="text-2xl font-lexend my-5">You may also like</p>
                <div className="grid grid-cols-2 md:grid-cols-4 md:gap-6 gap-2">
                    {
                        relatedProducts.map((product) => (
                            <div key={product?._id} className="flex-shrink-0 w-auto relative">
                                <div
                                    onClick={() => handleNavigate(product?._id)}
                                    className="bg-white rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 
            flex flex-col outline-gray-500 mb-4 h-[270px] md:h-[322px]"
                                    onMouseEnter={() => setHovered(product?._id)}
                                    onMouseLeave={() => setHovered(false)}
                                >
                                    <p className='absolute top-2 right-2 bg-white px-4 z-10 rounded-xl font-[Caluxe] shadow-2xl'>{product?.subCategory}</p>
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={hovered === product?._id ? product.images[0] : product.images[1]}
                                            alt={product?.name}
                                            className="w-full h-full object-cover transition-transform duration-[900ms] hover:scale-105"
                                        />
                                    </div>
                                    <div className='pt-4 flex-grow'>
                                        <h3 className="font-medium text-gray-500 text-sm">{product?.name.split(' ').slice(0, 3).join(' ')}</h3>
                                    </div>
                                    <div className='flex flex-col md:flex-row md:gap-5 md:items-center'>
                                        <p className="text-gray-500 text-sm mt-1 line-through">Tk {product?.price} BDT</p>
                                        <p className="font-medium text-gray-600 mt-1 font-lexend text-sm">Tk {Math.ceil(product?.discountedPrice)} BDT</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

        </div >
    );
};

export default ProductDetails;
