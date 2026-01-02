import { ArrowRight, RefreshCcw, Trash2, Package, AlertTriangle, CheckCircle } from "lucide-react";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

export const createProductColumns = (handleDeleteProduct) => [
    {
        accessorKey: "SKU",
        header: "SKU",
        cell: ({ row }) => (
            <div className="text-sm min-w-[100px] font-medium font-mono bg-gray-50 px-2 py-1 rounded">
                {row.getValue("SKU")}
            </div>
        ),
    },
    {
        accessorKey: "name",
        header: "Product Details",
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div className="flex items-center gap-3 min-w-[280px]">
                    <img
                        src={product?.images?.[0]}
                        alt={product?.name}
                        className="size-14 sm:size-16 rounded object-cover flex-shrink-0 border border-gray-200"
                    />
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium line-clamp-2">{product?.name}</span>
                        <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                {product?.category}
                            </Badge>
                            {product?.subCategory && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    {product?.subCategory}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const description = row.getValue("description");
            return (
                <div className="text-xs text-gray-600 min-w-[200px] max-w-[250px]">
                    <p className="line-clamp-3" title={description}>
                        {description || "No description available"}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div className="text-sm min-w-[120px]">
                    {product?.discount > 0 && (
                        <>
                            <p className="text-gray-400 line-through text-xs">
                                {product?.price}{" "}
                                <span className="text-sm font-mina">৳</span>
                            </p>
                            <p className="text-red-500 text-xs font-medium bg-red-50 px-2 py-0.5 rounded inline-block">
                                {product?.discount}% OFF
                            </p>
                        </>
                    )}
                    <p className="font-semibold text-gray-700 mt-1">
                        {product?.discountedPrice || product?.price}{" "}
                        <span className="text-base font-mina">৳</span>
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => {
            const quantity = parseInt(row.getValue("quantity")) || 0;
            return (
                <div className="min-w-[100px]">
                    <div className="flex items-center gap-2">
                        <Package className={`w-4 h-4 ${quantity === 0 ? 'text-red-500' : quantity <= 5 ? 'text-orange-500' : 'text-green-500'}`} />
                        <span
                            className={`text-sm font-bold ${quantity === 0 ? "text-red-600" : quantity <= 5 ? "text-orange-600" : "text-green-600"
                                }`}
                        >
                            {quantity}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "stock",
        header: "Stock Status",
        cell: ({ row }) => {
            const stock = row.getValue("stock");
            const quantity = parseInt(row.original.quantity) || 0;
            const isOutOfStock = quantity === 0 || stock === "out of stock";
            const isLowStock = quantity > 0 && quantity <= 5;

            return (
                <div className="min-w-[120px]">
                    {isOutOfStock ? (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" />
                            Out of Stock
                        </Badge>
                    ) : isLowStock ? (
                        <Badge variant="outline" className="flex items-center gap-1 w-fit bg-orange-50 text-orange-700 border-orange-200">
                            <AlertTriangle className="w-3 h-3" />
                            Low Stock
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="flex items-center gap-1 w-fit bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3" />
                            In Stock
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "sizes",
        header: "Sizes",
        cell: ({ row }) => {
            const sizes = row.getValue("sizes") || [];
            return (
                <div className="min-w-[150px] max-w-[200px]">
                    {sizes.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {sizes.slice(0, 3).map((size, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    {size}
                                </Badge>
                            ))}
                            {sizes.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                    +{sizes.length - 3}
                                </Badge>
                            )}
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400">No sizes</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "variant",
        header: "Variants",
        cell: ({ row }) => {
            const variants = row.getValue("variant") || [];
            return (
                <div className="min-w-[150px] max-w-[200px]">
                    {variants.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {variants.slice(0, 3).map((variant, index) => (
                                <Badge key={index} variant="outline" className="text-xs capitalize">
                                    {variant}
                                </Badge>
                            ))}
                            {variants.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{variants.length - 3}
                                </Badge>
                            )}
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400">No variants</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "specification",
        header: "Specifications",
        cell: ({ row }) => {
            const specification = row.getValue("specification");
            return (
                <div className="text-xs text-gray-600 min-w-[180px] max-w-[220px]">
                    <p className="line-clamp-2" title={specification}>
                        {specification || "No specifications"}
                    </p>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div className="flex items-center gap-2 sm:gap-3 min-w-[120px]">
                    <Link
                        href={`/dashboard/update_product/${product?._id}`}
                        className="outline-none text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded"
                        title="Edit Product"
                    >
                        <RefreshCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                    <button
                        onClick={() => handleDeleteProduct(product?._id)}
                        className="outline-none text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                        title="Delete Product"
                    >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <Link
                        href={`/product_details/${product?._id}`}
                        className="outline-none text-green-600 hover:text-green-800 transition-colors p-1 hover:bg-green-50 rounded"
                        title="View Details"
                    >
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                </div>
            );
        },
    },
];
