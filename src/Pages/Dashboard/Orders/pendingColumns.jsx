import { ArrowRight, Ban, CheckCheck } from "lucide-react";
import Link from 'next/link';

export const createPendingColumns = (handleCompleteOrder, handleCancelOrder) => [
    {
        accessorKey: "order_id",
        header: "Order ID",
        cell: ({ row }) => (
            <div className="text-sm min-w-[100px]">{row.getValue("order_id")}</div>
        ),
    },
    {
        accessorKey: "products",
        header: "Product Name",
        cell: ({ row }) => {
            const products = row.getValue("products");
            const firstProduct = products?.[0];
            return (
                <div className="flex items-center gap-2 min-w-[200px]">
                    <img
                        src={firstProduct?.image}
                        alt={firstProduct?.name}
                        className="size-14 rounded object-cover flex-shrink-0"
                    />
                    <span className="text-sm font-medium line-clamp-2">{firstProduct?.name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "shipping",
        header: "Shipping Details",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <div className="text-sm text-gray-600 min-w-[180px]">
                    <p className="truncate max-w-[200px]">{order?.name}</p>
                    <p className="truncate max-w-[200px]">{order?.address}</p>
                    <p>{order?.mobile}</p>
                    <p
                        className={`font-medium ${order?.delivery === "Outside Dhaka"
                            ? "text-red-600"
                            : "text-blue-600"
                            }`}
                    >
                        {order?.delivery}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "ordered_date",
        header: "Date",
        cell: ({ row }) => {
            const date = row.getValue("ordered_date");
            return (
                <div className="text-sm whitespace-nowrap">
                    {new Date(date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: "products_total",
        header: "Price",
        cell: ({ row }) => (
            <div className="text-sm whitespace-nowrap">
                {row.getValue("products_total")}{" "}
                <span className="text-base font-mina">৳</span>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Order",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <div className="min-w-[100px]">
                    {order?.status === "listed" && (
                        <p className="font-medium text-green-600">
                            <span className="font-bold">{order?.products?.length}</span>{" "}
                            {order?.status}
                        </p>
                    )}
                    {order?.status === "pending" && (
                        <p className="font-medium text-orange-600">
                            <span className="font-bold">{order?.products?.length}</span>{" "}
                            {order?.status}
                        </p>
                    )}
                    {order?.status === "completed" && (
                        <p className="font-medium text-blue-600">
                            <span className="font-bold">{order?.products?.length}</span>{" "}
                            {order?.status}
                        </p>
                    )}
                    {order?.status === "cancelled" && (
                        <p className="font-medium text-red-600">
                            <span className="font-bold">{order?.products?.length}</span>{" "}
                            {order?.status}
                        </p>
                    )}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <div className="flex items-center gap-3 min-w-[120px]">
                    <button
                        disabled={order?.status === "completed"}
                        onClick={() => handleCompleteOrder(order)}
                        className="disabled:cursor-not-allowed outline-none text-green-700 hover:text-green-900"
                        title="Complete Order"
                    >
                        <CheckCheck />
                    </button>
                    <button
                        disabled={order?.status === "cancelled"}
                        onClick={() => handleCancelOrder(order?._id)}
                        className="disabled:cursor-not-allowed outline-none text-red-600 hover:text-red-800"
                        title="Cancel Order"
                    >
                        <Ban />
                    </button>
                    <Link
                        href={`/dashboard/order_details/${order?._id}`}
                        className="outline-none text-blue-700 hover:text-blue-900"
                        title="View Details"
                    >
                        <ArrowRight />
                    </Link>
                </div>
            );
        },
    },
];
