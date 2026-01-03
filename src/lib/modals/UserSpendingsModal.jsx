import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DollarSign, ShoppingBag, TrendingUp, Loader2 } from 'lucide-react';

export const UserSpendingsModal = ({ user, isOpen, onClose, totalSpendings = 0, totalOrders = 0, isLoading = false }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        User Spending Details
                    </DialogTitle>
                    <DialogDescription>
                        Complete spending information for {user?.name || 'this user'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <>
                            {/* User Info */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-lg font-semibold text-blue-600">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{user?.name || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        <span className="text-xs text-gray-600">Total Spent</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-700">
                                        {totalSpendings.toFixed(2)} <span className="text-lg">৳</span>
                                    </p>
                                </div>

                                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ShoppingBag className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs text-gray-600">Total Orders</span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-700">{totalOrders}</p>
                                </div>
                            </div>

                            {/* Average Order Value */}
                            <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm text-gray-600">Average Order Value</span>
                                </div>
                                <p className="text-xl font-bold text-purple-700">
                                    {totalOrders > 0 ? (totalSpendings / totalOrders).toFixed(2) : '0.00'}{" "}
                                    <span className="text-base">৳</span>
                                </p>
                            </div>

                            {/* Additional Info */}
                            <div className="text-xs text-gray-500 pt-2 border-t">
                                <p>Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                                <p className="mt-1">Status: <span className="font-medium capitalize">{user?.role || 'user'}</span></p>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
