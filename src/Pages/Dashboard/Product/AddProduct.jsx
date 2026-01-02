"use client";

import React, { useState } from 'react';
import { useMutation } from "@tanstack/react-query";
import Breadcrumbs from '../../../components/Shared/Breadcrumbs/Breadcrumbs';
import { Eraser, Package2, RotateCcw, RotateCcwSquare, Undo2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Zoom from "react-medium-image-zoom";
import 'react-medium-image-zoom/dist/styles.css';
import { RxCross2 } from "react-icons/rx";
import { imageUpload } from '../../../Utils/ImageUpload';
import ProductReviewModal from '../../../components/Shared/Modal/ProductReviewModal';
import useAxiosSecure from '../../../Hooks/Axios/useAxiosSecure';
import { AiOutlineLoading } from 'react-icons/ai';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Category data - defined outside component to prevent recreation on each render
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

const AddProducts = () => {
    const axiosSecure = useAxiosSecure();

    // states_______________________________________________________________________________________________________________________________
    const [images, setImages] = useState([]);
    const [activeImage, setActiveImage] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [specification, setSpecification] = useState('');
    const [sizesHolder, setSizesHolder] = useState(["XS", "S", "M", "L", "XL", "XXL", "XXXL"]);
    const [sizes, setSizes] = useState([]);
    const [variantsHolder, setVariantsHolder] = useState(["red", "green", "blue", "yellow", "orange", "white", "black"]);
    const [variants, setVariants] = useState([]);
    const [basePrice, setBasePrice] = useState('');
    const [SKU, setSKU] = useState('');
    const [stock, setStock] = useState('');
    const [quantity, setQuantity] = useState('');
    const [discount, setDiscount] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [reviewProduct, setReviewProduct] = useState({});
    const [isOpen, setIsOpen] = useState(false);


    // request and responses________________________________________________________________________________________________________________
    const { mutateAsync: addProduct } = useMutation({
        mutationFn: async (product) => {
            const { data } = await axiosSecure.post('/add_product', product);
            return data;
        },
        onSuccess: () => {
            toast.success('Product Added Successfully');
            setName('');
            setImages([]);
            setDescription('');
            setSpecification('');
            setSubCategory('');
            setSizes([]);
            setVariants([]);
            setBasePrice('');
            setStock('');
            setDiscount('');
            setCategory('');
            setSKU('');
            setReviewProduct({});
            setActiveImage(null);
            setIsOpen(false);
        }
    });


    // functions____________________________________________________________________________________________________________________________
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

    const addVariant = (e) => {
        e.preventDefault();
        const form = e.target;
        const variantInput = form.variant;
        const newVariant = variantInput.value.trim().toLowerCase();

        if (newVariant && !variants.includes(newVariant)) {
            setVariants([...variants, newVariant]);
            if (!variantsHolder.includes(newVariant)) {
                setVariantsHolder([...variantsHolder, newVariant]);
            }
            variantInput.value = '';
        }
    };

    const addSize = (e) => {
        e.preventDefault();
        const form = e.target;
        const sizeInput = form.size;
        const newSize = sizeInput.value.trim().toUpperCase();

        if (newSize && !sizes.includes(newSize)) {
            setSizes([...sizes, newSize]);
            if (!sizesHolder.includes(newSize)) {
                setSizesHolder([...sizesHolder, newSize]);
            }
            sizeInput.value = '';
        }
    };

    // console.log(variants);

    const handleAddProduct = () => {
        if (!name) {
            return toast.error('Proveide Product Name !');
        } else if (!description) {
            return toast.error('Proveide Product Description !');
        } else if (!basePrice) {
            return toast.error('Proveide Product Base Price !');
        } else if (!stock) {
            return toast.error('Proveide Product Stock !');
        } else if (!category) {
            return toast.error('Proveide Product Category !');
        } else if (images.length === 0) {
            return toast.error('Proveide Product Images !');
        } else if (!SKU) {
            return toast.error('Proveide Product SKU !');
        } else if (!sizes.length && !variants.length) {
            return toast.error('Add atleast one variants or sizes !');
        } else if (!subCategory) {
            return toast.error('Provide Product Sub-Category !');
        }

        const discountedPrice = Math.ceil(parseInt(basePrice) - (parseInt(basePrice) * parseInt(discount || 0)) / 100);

        const productData = {
            name,
            price: basePrice,
            discount,
            discountedPrice,
            category,
            subCategory,
            variant: variants,
            quantity,
            description,
            specification,
            uuId: (() => {
                if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
                    return window.crypto.randomUUID();
                }
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            })(),
            sizes,
            SKU,
            stock,
        };

        // console.table(productData);
        setReviewProduct(productData);
        setIsOpen(true);


    };


    const handleSubmit = async () => {
        try {
            setLoading(true); // Start loading

            const imageUploadPromises = [...images].map(image => imageUpload(image.file));
            const imageUrls = await Promise.all(imageUploadPromises);
            const completeProduct = { ...reviewProduct, images: imageUrls };
            await addProduct(completeProduct);
            setIsOpen(false);
        } catch (error) {
            toast.error("Error adding product:", error);
        } finally {
            setLoading(false);// Stop loading no matter what
        }
    };

    // consoles_____________________________________________________________________________________________________________________________
    // console.log(variants.split(','));



    return (
        <div className='min-h-[100dvh] bg-[#F4F8FB] p-4 sm:p-6 md:p-10'>
            <div className="space-y-3">

                {/* modal */}
                <div>
                    <ProductReviewModal loading={loading} handleSubmit={handleSubmit} data={reviewProduct} isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>


                {/* starts here */}
                <div className="">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                        <p className='text-xl sm:text-2xl font-bold flex items-center gap-2'><Package2 className="w-5 h-5 sm:w-6 sm:h-6" />Add Product</p>
                        {/* breadcrumbs */}
                        <div className="hidden md:block">
                            <Breadcrumbs />
                        </div>
                        <div className="hidden md:flex gap-3 w-full sm:w-auto">
                            <button disabled={loading} onClick={handleAddProduct} className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-green-500 text-white text-sm sm:text-base">
                                {loading ? <AiOutlineLoading className="animate-spin text-xl sm:text-2xl mx-auto" /> : "Add Product"}
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
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter product name"
                                        className="w-full border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm mb-1">Specification Product</label>
                                    <textarea
                                        rows="6"
                                        required
                                        value={specification}
                                        onChange={(e) => setSpecification(e.target.value)}
                                        placeholder="Enter product specification"
                                        className="w-full border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                    ></textarea>
                                </div>

                                {/* Sizes */}
                                <div className='flex flex-col sm:flex-row justify-between gap-3 sm:gap-5'>
                                    {/* Sizes */}
                                    <div className="flex-1">
                                        <div className='flex items-center'>
                                            <label className="block text-sm">Size</label>
                                            <button onClick={() => setSizes([])} className="p-2 outline-none">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <RotateCcwSquare className="size-4" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Reset</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </button>
                                        </div>
                                        <div>
                                            <div className='flex gap-2 flex-wrap'>
                                                {sizesHolder.map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => !sizes.includes(size) && setSizes([...sizes, size])}
                                                        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded-lg hover:bg-green-100 
                                                        ${sizes.includes(size) && 'text-white bg-green-400 hover:text-black'}`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                            <form onSubmit={addSize}>
                                                <div className="mt-2 flex">
                                                    <input
                                                        type="text"
                                                        name="size"
                                                        placeholder="Add custom size"
                                                        className="flex-1 border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                                    />
                                                    <button type="submit" className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm sm:text-base">
                                                        Add
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    {/* Variants */}
                                    <div className="flex-1">
                                        <div className='flex items-center'>
                                            <label className="block text-sm">Variants</label>
                                            <button onClick={() => setVariants([])} className="p-2 outline-none">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Eraser className="size-4" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Reset</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </button>
                                        </div>
                                        <div>
                                            <div className="flex gap-2 flex-wrap">
                                                {variantsHolder.map((variant) => (
                                                    <button
                                                        key={variant}
                                                        onClick={() => !variants.includes(variant) && setVariants([...variants, variant])}
                                                        className={`px-2 sm:px-3 capitalize py-1 text-xs sm:text-sm border rounded-lg hover:bg-green-100
                                                        ${variants.includes(variant) && 'text-white bg-green-400 hover:text-black'}`}
                                                    >
                                                        {variant}
                                                    </button>
                                                ))}
                                            </div>
                                            <form onSubmit={addVariant}>
                                                <div className="mt-2 flex">
                                                    <input
                                                        type="text"
                                                        name="variant"
                                                        placeholder="Add custom variant"
                                                        className="flex-1 border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                                    />
                                                    <button type="submit" className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm sm:text-base">
                                                        Add
                                                    </button>
                                                </div>
                                            </form>
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
                                            value={basePrice}
                                            onKeyDown={(e) => {
                                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                                            }}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                if (value < 0) {
                                                    toast.error('Input can not be negative');
                                                    return;
                                                }
                                                setBasePrice(e.target.value);
                                            }}
                                            className="w-full border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                            placeholder="$0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Stock</label>
                                        <input
                                            type="text"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            className="w-full border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                            placeholder="In stock"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Discount</label>
                                        <input
                                            type="number"
                                            value={discount}
                                            min={0}
                                            onKeyDown={(e) => {
                                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                                            }}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                if (value < 0) {
                                                    toast.error('Input can not be negative');
                                                    return;
                                                }
                                                setDiscount(value);
                                            }}
                                            className="w-full border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                            placeholder="10%"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Sku</label>
                                        <input
                                            type="text"
                                            onChange={(e) => setSKU(e.target.value)}
                                            placeholder="Product SKU"
                                            value={SKU}
                                            className="w-full border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                        />
                                    </div>
                                    <div className='col-span-2'>
                                        <label className="block text-sm mb-1">Description</label>
                                        <textarea
                                            rows="4"
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Product Specification"
                                            value={description}
                                            className="w-full border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                        />
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/* Right side Upload Image */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
                            <h3 className="font-semibold text-base sm:text-lg mb-4">Upload Image</h3>

                            {/* Main image */}
                            <div className="w-full h-48 sm:h-64 border rounded-xl flex items-center justify-center bg-gray-50">
                                {activeImage ? (
                                    <Zoom>
                                        <img
                                            src={activeImage}
                                            alt="Main Preview"
                                            className="object-contain h-48 sm:h-64 w-full"
                                        />
                                    </Zoom>
                                ) : (
                                    <span className="text-gray-400 text-sm">No Image</span>
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="flex w-full gap-2 mt-4 overflow-x-auto pb-2">
                                {/* image section */}
                                <div className='flex gap-2'>
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

                            {/* Quantity */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl shadow mt-4">
                                <h3 className="font-semibold text-base sm:text-lg mb-4">Quantity</h3>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        min="0"
                                        value={quantity}
                                        onKeyDown={(e) => {
                                            if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                                        }}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            if (value < 0) {
                                                toast.error('Input can not be negative');
                                                return;
                                            }
                                            setQuantity(e.target.value);
                                        }}
                                        className="w-full border rounded-lg p-2 bg-[#EEEEEE] text-sm sm:text-base"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl shadow mt-4">
                                <h3 className="font-semibold text-base sm:text-lg mb-4">Category</h3>

                                {/* Category Select */}
                                <div className="mb-4">
                                    <label className="block text-sm mb-2">Category</label>
                                    <Select
                                        value={category}
                                        onValueChange={(value) => {
                                            setCategory(value);
                                            setSubCategory('');
                                        }}
                                    >
                                        <SelectTrigger className="w-full bg-[#EEEEEE] text-sm sm:text-base">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Luxury">Luxury</SelectItem>
                                            <SelectItem value="Religious">Religious</SelectItem>
                                            <SelectItem value="Casual">Casual</SelectItem>
                                            <SelectItem value="Household">Household</SelectItem>
                                            <SelectItem value="Men">Men</SelectItem>
                                            <SelectItem value="Women">Women</SelectItem>
                                            <SelectItem value="Groceries">Groceries</SelectItem>
                                            <SelectItem value="Organic">Organic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Sub Category Select */}
                                <div>
                                    <label className="block text-sm mb-2">Sub category</label>
                                    <Select
                                        value={subCategory}
                                        onValueChange={setSubCategory}
                                        disabled={!category}
                                    >
                                        <SelectTrigger className="w-full bg-[#EEEEEE] text-sm sm:text-base disabled:cursor-not-allowed disabled:opacity-50">
                                            <SelectValue placeholder="Select sub-category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {category && CATEGORY_DATA[category]?.map((subcat) => (
                                                <SelectItem key={subcat} value={subcat}>
                                                    {subcat.replace(/-/g, ' ')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className='w-full mt-6'>
                                <button onClick={handleAddProduct} disabled={loading} className='w-full bg-green-500 py-2 rounded-md text-white flex justify-center text-sm sm:text-base'>
                                    {loading ? <AiOutlineLoading className="animate-spin text-xl sm:text-2xl" /> : "Add Product"}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default AddProducts;