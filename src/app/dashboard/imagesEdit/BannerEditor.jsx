"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAxiosSecure from '@/Hooks/Axios/useAxiosSecure';
import Swal from 'sweetalert2';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Edit2, X, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import Loading from '@/components/Shared/Loading/Loading';
import Breadcrumbs from '@/components/Shared/Breadcrumbs/Breadcrumbs';
import { imageUpload } from '@/Utils/ImageUpload';

const BannerEditor = ({ initialBanners }) => {
    const axiosSecure = useAxiosSecure();
    const router = useRouter();

    const [banners, setBanners] = useState(initialBanners);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        image: '',
        heading: '',
        text: '',
        order: 0
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const resetForm = () => {
        setFormData({
            image: '',
            heading: '',
            text: '',
            order: 0
        });
        setImageFile(null);
        setImagePreview('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = formData.image;

        // If user selected a file, upload it first
        if (imageFile) {
            setIsUploadingImage(true);
            try {
                imageUrl = await imageUpload(imageFile);
                setFormData({ ...formData, image: imageUrl });
            } catch (error) {
                setIsUploadingImage(false);
                Swal.fire({
                    title: "Upload Error",
                    text: "Failed to upload image. Please try again.",
                    icon: "error"
                });
                return;
            }
            setIsUploadingImage(false);
        }

        if (!imageUrl.trim() || !formData.heading.trim()) {
            Swal.fire({
                title: "Validation Error",
                text: "Image and Heading are required!",
                icon: "warning"
            });
            return;
        }

        const bannerData = {
            ...formData,
            image: imageUrl
        };

        setIsProcessing(true);

        try {
            if (editingBanner) {
                // Update banner
                await axiosSecure.put(`/banners/${editingBanner._id}`, bannerData);
                Swal.fire({
                    title: "Updated!",
                    text: "Banner updated successfully.",
                    icon: "success",
                    timer: 2000
                });
                setEditingBanner(null);
            } else {
                // Add banner
                await axiosSecure.post('/banners', bannerData);
                Swal.fire({
                    title: "Success!",
                    text: "Banner added successfully.",
                    icon: "success",
                    timer: 2000
                });
                setShowAddForm(false);
            }

            resetForm();
            router.refresh(); // Refresh server-side data
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: editingBanner ? "Failed to update banner." : "Failed to add banner.",
                icon: "error"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setFormData({
            image: banner.image || '',
            heading: banner.heading || '',
            text: banner.text || '',
            order: banner.order || 0
        });
        setImagePreview(banner.image || '');
        setImageFile(null);
        setShowAddForm(false);
    };

    const handleCancelEdit = () => {
        setEditingBanner(null);
        setShowAddForm(false);
        resetForm();
    };

    const handleDelete = async (id, heading) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete "${heading}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            setIsProcessing(true);
            try {
                await axiosSecure.delete(`/banners/${id}`);
                Swal.fire({
                    title: "Deleted!",
                    text: "Banner has been deleted.",
                    icon: "success",
                    timer: 2000
                });
                router.refresh(); // Refresh server-side data
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete banner.",
                    icon: "error"
                });
            } finally {
                setIsProcessing(false);
            }
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Breadcrumbs />

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Edit Banner</h1>
                <Button
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        setEditingBanner(null);
                        resetForm();
                    }}
                    className="flex items-center gap-2"
                    disabled={isProcessing}
                >
                    {showAddForm ? (
                        <>
                            <X className="h-4 w-4" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4" />
                            Add New Banner
                        </>
                    )}
                </Button>
            </div>

            {/* Current Banner Images Preview Section */}
            {initialBanners.length > 0 && (
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Current Banner Images ({initialBanners.length})
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {initialBanners.map((banner, index) => (
                                <div
                                    key={banner._id}
                                    className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
                                    onClick={() => handleEdit(banner)}
                                >
                                    <div className="aspect-video relative">
                                        <img
                                            src={banner.image}
                                            alt={banner.heading}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                                            <p className="text-white text-xs font-semibold text-center truncate w-full">
                                                {banner.heading}
                                            </p>
                                            <span className="text-white text-[10px] mt-1">
                                                Order: {banner.order || 0}
                                            </span>
                                            <Edit2 className="h-4 w-4 text-white mt-2" />
                                        </div>
                                    </div>
                                    <div className="absolute top-1 left-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Add/Edit Form */}
            {(showAddForm || editingBanner) && (
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Upload Image *
                                </label>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            disabled={isProcessing || isUploadingImage}
                                            className="flex-1"
                                        />
                                        {isUploadingImage && (
                                            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                        )}
                                    </div>

                                    {/* Image Preview */}
                                    {(imagePreview || formData.image) && (
                                        <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                                            <img
                                                src={imagePreview || formData.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/800x400?text=Image+Preview';
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setImagePreview('');
                                                    setFormData({ ...formData, image: '' });
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Upload an image file or use URL below
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Or Enter Image URL
                                </label>
                                <Input
                                    type="url"
                                    placeholder="https://example.com/banner.jpg or /images/banner.jpg"
                                    value={formData.image}
                                    onChange={(e) => {
                                        setFormData({ ...formData, image: e.target.value });
                                        if (e.target.value) {
                                            setImagePreview(e.target.value);
                                        }
                                    }}
                                    disabled={isProcessing || isUploadingImage}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Heading *
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Welcome!"
                                    value={formData.heading}
                                    onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                                    required
                                    disabled={isProcessing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Description Text
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Shop the latest trends..."
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                    disabled={isProcessing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Display Order
                                </label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    disabled={isProcessing}
                                />
                                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={isProcessing || isUploadingImage}
                                >
                                    {isUploadingImage ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : isProcessing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            {editingBanner ? 'Update Banner' : 'Add Banner'}
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                    disabled={isProcessing || isUploadingImage}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
                <div className="flex justify-center py-8">
                    <Loading />
                </div>
            )}

            {/* Empty State */}
            {initialBanners.length === 0 && !showAddForm && !editingBanner && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No banners yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Get started by adding your first banner
                        </p>
                        <Button onClick={() => setShowAddForm(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Banner
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Banners Grid */}
            {initialBanners.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {initialBanners.map((banner) => (
                        <Card
                            key={banner._id}
                            className={`overflow-hidden hover:shadow-lg transition-shadow ${editingBanner?._id === banner._id ? 'ring-2 ring-blue-500' : ''
                                }`}
                        >
                            <div className="relative aspect-video bg-gray-100">
                                {banner.image ? (
                                    <img
                                        src={banner.image}
                                        alt={banner.heading || 'Banner'}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                                        }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <ImageIcon className="h-16 w-16 text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
                                    <h3 className="text-white text-xl font-semibold mb-2">
                                        {banner.heading}
                                    </h3>
                                    {banner.text && (
                                        <p className="text-white text-sm">
                                            {banner.text}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <CardContent className="p-4">
                                <div className="space-y-2 mb-4">
                                    <p className="text-xs text-gray-500">
                                        Order: {banner.order || 0}
                                    </p>
                                    {banner.createdAt && (
                                        <p className="text-xs text-gray-500">
                                            Created: {new Date(banner.createdAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleEdit(banner)}
                                        variant="outline"
                                        className="flex-1 flex items-center justify-center gap-2"
                                        disabled={isProcessing}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(banner._id, banner.heading)}
                                        variant="destructive"
                                        className="flex-1 flex items-center justify-center gap-2"
                                        disabled={isProcessing}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BannerEditor;
