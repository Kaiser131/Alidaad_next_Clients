"use client";

import React, { useState } from 'react';
import Breadcrumbs from '../../../components/Shared/Breadcrumbs/Breadcrumbs';
import { useParams } from 'next/navigation';
import Zoom from "react-medium-image-zoom";
import { Eraser, Package2, RotateCcw, RotateCcwSquare, Undo2 } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/Axios/useAxiosSecure';
import Loading from '../../../components/Shared/Loading/Loading';
import toast from 'react-hot-toast';
import { AiOutlineLoading } from 'react-icons/ai';
import { RxCross2 } from 'react-icons/rx';
import { imageUpload } from '../../../Utils/ImageUpload';

const UpdateProducts = () => {

    const { id } = useParams();
    const axiosSecure = useAxiosSecure();

    // states______________________________________________________________________________________________________________________________________
    const [editedData, setEditedData] = useState({});
    const [images, setImages] = useState([]);
    const [activeImage, setActiveImage] = useState(null);
    const [sizes, setSizes] = useState([]);
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);

    // console.log(editedData);

    // variables___________________________________________________________________________________________________________________________________
    const CATEGORY_DATA = {
        Luxury: [
            'Watches',
            'Jewelry',
            'Handbags',
            'Perfumes',
            'Shoes',
        ],
        Religious: [
            'Prayer-Mats',
            'Tasbeeh',
            'Attar',
            'Islamic-Books',
            'Hijab-Abaya',
            'Quran-Stand',
            'Prayer-Caps',
            'Gift-Sets'
        ],
        Casual: [
            'T-Shirts',
            'Jeans',
            'Sneakers',
            'Hoodies',
            'PoloShirts',
            'Shorts',
            'Casual-Shirts',
            'Caps-&-Hats',
            'Jackets',
            'Sweatpants'
        ],
        Household: [
            'Furniture',
            'Kitchen',
            'Home-Decor',
            'Lighting',
            'Cleaning',
            'Storage',
            'Bedding',
            'Cookware',
            'Bathroom',
            'Gardening'
        ],
        Men: [
            'Jubbah',
            'Panjabi',
            'Khimar',
            'Shimagh',
            'T-Shirts',
            'Jeans',
            'Hoodies',
            'PoloShirts',
            'Shorts',
            'Casual-Shirts',
            'Caps-&-Hats',
            'Jackets',
        ],
        Women: [
            'Abaya',
            'Hijab',
            'Jilbab',
            'Burka',
        ],
        // Groceries: [],
        // Organic: [],

    };

    // request and responses_______________________________________________________________________________________________________________________

    // product data fetching
    const { data: productData = [], isLoading: productDataIsLoading, refetch } = useQuery({
        queryKey: ['productData', id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/product/${id}`);
            return data;
        }
    });
    console.log(productData);
    // send update data to the server
    const { mutateAsync: updateProduct } = useMutation({
        mutationFn: async (updatedData) => {
            const { data } = await axiosSecure.patch(`/update_product/${id}`, updatedData);
            return data;
        },
        onSuccess: () => {
            toast.success('Product updated successfully');
            setLoading(false);
            setEditedData({});
            refetch();
        }
    });


    // functions___________________________________________________________________________________________________________________________________
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                previews.push({ file, preview: reader.result });
                if (previews.length === files.length) {
                    setImages((prev) => [...prev, ...previews]);
                    if (!activeImage) setActiveImage(previews[0].preview);
                }
            };
            reader.readAsDataURL(file);
        });
    };


    const handleUpdateProduct = async () => {
        if (sizes.length !== 0) {
            editedData.sizes = sizes;
        }
        if (variants.length !== 0) {
            editedData.variant = variants;
        }
        if (editedData.price) {
            editedData.discountedPrice = Math.ceil(
                parseInt(editedData.price) -
                (parseInt(editedData.price) * parseInt(editedData.discount || 0)) / 100
            );
        }
        try {
            setLoading(true);
            let completeProduct = { ...editedData };
            // Only try uploading if there are actual images in the state
            if (images && images.length > 0) {
                const imageUploadPromises = images.map(image => imageUpload(image.file));
                const imageUrls = await Promise.all(imageUploadPromises);
                // Only add images field if uploads succeeded and URLs exist
                if (imageUrls.length > 0) {
                    completeProduct.images = imageUrls;
                }
            }
            await updateProduct(completeProduct);
        } catch (error) {
            toast.error("Error adding product:", error);
        } finally {
            setLoading(false);
        }
    };



    // consoles____________________________________________________________________________________________________________________________________
    // console.log(id);
    // console.table(productData);
    // console.log(sizes);
    // console.log(variants);
    // console.table({ name, description, sizes, variants, basePrice, SKU, stock, discount, category });
    // console.table(editedData);
    // console.log(images);



    if (productDataIsLoading) return <Loading />;


    return (
        <div className='min-h-[100dvh] bg-[#F4F8FB] p-4 sm:p-6 md:p-8'>
            <div className="space-y-3">


                {/* starts here */}
                <div className="">
                    {/* Header */}
                    <div className="flex flex-col space-y-2 mb-4">
                        <p className='text-xl sm:text-2xl font-bold flex items-center gap-2'><Package2 className="w-5 h-5 sm:w-6 sm:h-6" />Update Product</p>
                        {/* breadcrumbs */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="hidden md:block">
                                <Breadcrumbs />
                            </div>
                            <button disabled={loading} onClick={handleUpdateProduct} className="w-full sm:w-auto hidden md:block px-4 py-2 rounded-full bg-green-500 text-white text-sm sm:text-base">
                                {loading ? <AiOutlineLoading className="animate-spin text-xl sm:text-2xl mx-2 md:mx-10" /> : "Update Product"}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Left side form */}
                        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
                            {/* General Information */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
                                <h3 className="font-semibold text-base sm:text-lg mb-4">General Information</h3>
                                <div className="mb-3">
                                    <label className="block text-sm mb-1">Name Product</label>
                                    <input
                                        type="text"
                                        required
                                        value={editedData.name || ''}
                                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                                        placeholder={productData?.name}
                                        className="w-full border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm mb-1">Description Product</label>
                                    <textarea
                                        rows="9"
                                        required
                                        value={editedData.description || ''}
                                        onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                                        placeholder={productData?.description}
                                        className="w-full border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                    ></textarea>
                                </div>

                                {/* Sizes */}
                                <div className='flex flex-col sm:flex-row justify-between gap-3 sm:gap-5'>
                                    {/* Sizes */}
                                    <div className="flex-1">
                                        <div className='flex items-center'>
                                            <label className="block text-sm">Size</label>
                                            <button onClick={() => { setSizes([]); setEditedData({ ...editedData, sizes: [] }); }} className="p-2 outline-none">
                                                <RotateCcwSquare className="size-4" />
                                            </button>
                                        </div>
                                        <div className='flex gap-2 flex-wrap'>
                                            {["XS", "S", "M", "XL", "XXL", "XXXL"].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => !sizes.includes(s) && setSizes([...sizes, s])}
                                                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded-lg hover:bg-green-100 
                                                        ${sizes.includes(s) && 'text-white bg-green-400 hover:text-black'}
                                                        ${productData?.sizes.includes(s) && !sizes.includes(s) && 'bg-gray-200'}
                                                        `}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>


                                    {/* Variants */}
                                    <div className="flex-1">
                                        <div className='flex items-center'>
                                            <label className="block text-sm">Variants</label>
                                            <button onClick={() => { setVariants([]); setEditedData({ ...editedData, variants: [] }); }} className="p-2 outline-none">
                                                <Eraser className="size-4" />
                                            </button>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {["red", "green", "blue", "yellow", "orange", "white", "black"].map((variant) => (
                                                <button
                                                    key={variant}
                                                    onClick={() => !variants.includes(variant) && setVariants([...variants, variant])}
                                                    className={`px-2 sm:px-3 capitalize py-1 text-xs sm:text-sm border rounded-lg hover:bg-green-100
                                                        ${variants.includes(variant) && 'text-white bg-green-400 hover:text-black'}
                                                        ${productData?.variant.includes(variant) && !variants.includes(variant) && 'bg-gray-200'}
                                                        `}
                                                >
                                                    {variant}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing and Stock */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
                                <h3 className="font-semibold text-base sm:text-lg mb-4">Pricing And Stock</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm mb-1">Base Pricing</label>
                                        <input
                                            type="number"
                                            value={editedData.price || ''}
                                            onKeyDown={(e) => {
                                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                                            }}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                if (value < 0) {
                                                    toast.error('Price can not be negative');
                                                    return;
                                                }
                                                setEditedData({ ...editedData, price: e.target.value });
                                            }}
                                            className="w-full border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                            placeholder={productData?.price}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Stock</label>
                                        <input
                                            type="text"
                                            value={editedData.stock || ''}
                                            onChange={(e) => setEditedData({ ...editedData, stock: e.target.value })}
                                            className="w-full border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                            placeholder={productData?.stock}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Discount</label>
                                        <input
                                            type="number"
                                            value={editedData.discount || ''}
                                            min={0}
                                            onKeyDown={(e) => {
                                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                                            }}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                if (value < 0) {
                                                    toast.error('Discount can not be negative');
                                                    return;
                                                }
                                                if (value > 100) {
                                                    toast.error('Discount can not be greater than 100');
                                                    return;
                                                }
                                                setEditedData({ ...editedData, discount: value });
                                            }}
                                            className="w-full border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                            placeholder={`${productData?.discount} %`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Category</label>
                                        <select
                                            onChange={(e) => setEditedData({ ...editedData, category: e.target.value })}
                                            className="w-full border rounded-lg p-2 text-gray-600 bg-[#EEEEEE] text-sm sm:text-base">
                                            <option disabled selected>Select a category</option>
                                            <option value="Luxury">Luxury</option>
                                            <option value="Religious">Religious</option>
                                            <option value="Casual">Casual</option>
                                            <option value="Household">Household</option>
                                            <option value="Men">Men</option>
                                            <option value="Women">Women</option>
                                            <option value="Groceries">Groceries</option>
                                            <option value="Organic">Organic</option>
                                        </select>
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/* Right side Upload Image */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">

                            <div className=''>
                                <h1 className="font-semibold text-base sm:text-lg mb-2">Previous Images</h1>
                                <div className='flex w-full mb-4 overflow-x-auto pb-2'>
                                    <div className='flex gap-2 min-w-max mb-2'>
                                        {productData?.images && productData.images.map((img, index) => (
                                            <Zoom key={index}>
                                                <img
                                                    src={img}
                                                    alt={`Previous Image ${index + 1}`}
                                                    className="object-cover size-16 sm:size-20 rounded-lg border flex-shrink-0"
                                                />
                                            </Zoom>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <h3 className="font-semibold text-base sm:text-lg mb-4">Upload New Images</h3>

                            {/* Main image */}
                            <div className="w-full h-48 sm:h-56 border rounded-xl flex items-center justify-center bg-gray-50">
                                {activeImage ? (
                                    <Zoom>
                                        <img
                                            src={activeImage}
                                            alt="Main Preview"
                                            className="object-contain h-48 sm:h-56 w-full py-2"
                                        />
                                    </Zoom>
                                ) : (
                                    <span className="text-gray-400 text-sm">No Image</span>
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="flex w-full gap-2 mt-4 overflow-x-auto pb-2">
                                {/* image section */}
                                <div className='flex gap-2 mb-2'>
                                    {images.map((image, index) => (
                                        <div key={index} className="size-14 sm:size-16 relative z-0 flex-shrink-0">
                                            <img
                                                src={image.preview}
                                                alt=""
                                                onClick={() => setActiveImage(image.preview)}
                                                className={`size-14 sm:size-16 object-cover rounded-lg border cursor-pointer 
      ${activeImage === image.preview ? "border-green-500" : "border-gray-200"}`}
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setImages(images.filter((_, i) => i !== index));
                                                    if (activeImage === image.preview) {
                                                        setActiveImage(images[index + 1]?.preview || images[index - 1]?.preview || null);
                                                    }
                                                }}
                                                className="absolute bg-green-500 top-0 z-10 text-white font-bold right-0 p-1 text-xs rounded-full"
                                            >
                                                <RxCross2 />
                                            </button>
                                        </div>
                                    ))}

                                </div>
                                {/* Upload Button */}
                                <div className="flex-shrink-0">
                                    <label className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg border border-dashed border-gray-300 cursor-pointer hover:border-green-500">
                                        <span className="text-xl sm:text-2xl text-gray-400">+</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                            </div>


                            {/* SKU */}
                            <div className="bg-white p-4 rounded-xl shadow mt-4">
                                <h3 className="font-semibold text-base sm:text-lg mb-4">SKU</h3>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={editedData.SKU || ''}
                                        onChange={(e) => setEditedData({ ...editedData, SKU: e.target.value })}
                                        placeholder={productData?.SKU}
                                        className="w-full border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                    />
                                </div>
                            </div>

                            <div className='w-full mt-6 sm:mt-8'>
                                <button onClick={handleUpdateProduct} disabled={loading} className='w-full bg-green-500 py-2 rounded-md text-white flex justify-center text-sm sm:text-base'>
                                    {loading ? <AiOutlineLoading className="animate-spin text-xl sm:text-2xl" /> : "Update Product"}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>


            </div>
        </div >
    );
};

export default UpdateProducts;