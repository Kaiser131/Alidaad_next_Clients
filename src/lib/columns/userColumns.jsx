import { Copy, DollarSign, MoreHorizontal, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

export const createUserColumns = (handleRoleChange, handleViewSpendings) => [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-3 min-w-[150px]">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{user?.name || "N/A"}</span>
                        <span className="text-xs text-gray-500">{user?.email}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            const email = row.getValue("email");
            return (
                <div className="text-sm min-w-[200px]">
                    {email || "N/A"}
                </div>
            );
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const user = row.original;
            const role = user?.role || "user";

            return (
                <div className="min-w-[120px]">
                    <Select
                        value={role}
                        onValueChange={(value) => handleRoleChange(user._id, value)}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue>
                                <div className="flex items-center gap-2">
                                    {role === "admin" ? (
                                        <Shield className="w-4 h-4 text-red-600" />
                                    ) : (
                                        <User className="w-4 h-4 text-blue-600" />
                                    )}
                                    <span className="capitalize">{role}</span>
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-600" />
                                    <span>User</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-red-600" />
                                    <span>Admin</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Joined Date",
        cell: ({ row }) => {
            const date = row.getValue("createdAt");
            if (!date) return <span className="text-sm text-gray-500">N/A</span>;

            return (
                <div className="text-sm whitespace-nowrap">
                    {new Date(date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const user = row.original;
            const isActive = user?.status !== "blocked";

            return (
                <Badge
                    variant={isActive ? "default" : "destructive"}
                    className={`${isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                >
                    {isActive ? "Active" : "Blocked"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original;

            const handleCopyEmail = () => {
                navigator.clipboard.writeText(user.email);
                toast.success("Email copied to clipboard!");
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleCopyEmail}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewSpendings(user)}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            View Total Spendings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            View Profile
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
