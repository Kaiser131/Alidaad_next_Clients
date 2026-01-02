import { ArrowRight, Calendar, DollarSign, LogOut, Mail, PackageCheck, ShoppingBag, TrendingUp, User as UserIcon } from 'lucide-react';
import React from 'react';
import useAuth from '../../../Hooks/Auth/useAuth';
import { useHead } from '@unhead/react';
import useAxiosSecure from '../../../Hooks/Axios/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import Loading from '../../../components/Shared/Loading/Loading';

const Account = () => {
    const { logOut, user } = useAuth();
    const axiosSecure = useAxiosSecure();


    // states__________________________________________________________________________________________________________________________
    // req and fetches_________________________________________________________________________________________________________________
    const { data: orders = [], isLoading: ordersLoading } = useQuery({
        queryKey: ['orders', user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/account/${user?.email}`);
            return data;
        },
        enabled: !!user?.email
    });
    // functions and variables_________________________________________________________________________________________________________
    const totalSpent = orders.reduce((sum, order) => sum + parseInt(order?.total_price || 0), 0);
    const averageOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;

    // consoles________________________________________________________________________________________________________________________
    // console.log(orders);
    // console.log(totalSpent);



    useHead({
        title: `Account - Alidaad`,
        meta: [
            { name: 'Alidaad', content: `Account` }
        ]
    });

    if (ordersLoading) return <Loading />;

    return (
        <div className='min-h-[60dvh] mt-20 md:mt-24 mb-12'>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Header with User Profile */}
                <Card className="border-none shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardHeader>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                            <div className='flex items-center gap-4'>
                                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-white shadow-lg">
                                    <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                                    <AvatarFallback className="bg-blue-500 text-white text-xl">
                                        {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
                                        {user?.displayName || 'Welcome'}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-1 text-base">
                                        <Mail className="w-4 h-4" />
                                        {user?.email}
                                    </CardDescription>
                                </div>
                            </div>
                            <Button
                                onClick={logOut}
                                variant="outline"
                                className='flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors'
                            >
                                <LogOut className="w-4 h-4" />
                                Log out
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Statistics Cards */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                    {/* Total Orders Card */}
                    <Card className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-blue-500">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2 text-gray-600">
                                <ShoppingBag className="w-4 h-4" />
                                Total Orders
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl sm:text-4xl font-bold text-blue-600">
                                {orders?.length}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {orders?.length === 1 ? 'order placed' : 'orders placed'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Spent Card */}
                    <Card className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-green-500">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2 text-gray-600">
                                <DollarSign className="w-4 h-4" />
                                Total Spent
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl sm:text-4xl font-bold text-green-600">
                                ৳{totalSpent.toFixed(2)}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Lifetime spending
                            </p>
                        </CardContent>
                    </Card>

                    {/* Average Order Value Card */}
                    <Card className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-purple-500 sm:col-span-2 lg:col-span-1">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2 text-gray-600">
                                <TrendingUp className="w-4 h-4" />
                                Average Order Value
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl sm:text-4xl font-bold text-purple-600">
                                ৳{averageOrderValue.toFixed(2)}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Per order average
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Order History Section */}
                <Card className="shadow-xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold text-gray-800">Order History</CardTitle>
                                <CardDescription className="mt-1">
                                    View all your completed orders and deliveries
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="hidden sm:flex items-center gap-1 px-3 py-1">
                                <Calendar className="w-3 h-3" />
                                {orders.length} Total
                            </Badge>
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6">
                        {orders.length === 0 ? (
                            <div className='min-h-[300px] flex flex-col items-center justify-center text-gray-400'>
                                <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
                                <h2 className='text-xl font-medium mb-2'>No orders yet</h2>
                                <p className='text-sm'>You haven't placed any orders yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders?.map((order, index) => (
                                    <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                                        <CardContent className="p-0">
                                            <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 p-4'>
                                                {/* Product Info */}
                                                <div className='lg:col-span-6 flex items-center gap-4'>
                                                    <img
                                                        className='w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-gray-100 flex-shrink-0'
                                                        src={order?.image}
                                                        alt={order?.name}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                                                            {order?.name}
                                                        </p>
                                                        <div className='flex flex-wrap items-center gap-2 mt-1'>
                                                            <Badge variant="outline" className="text-xs">
                                                                ৳{order?.discountedPrice}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs">
                                                                Qty: {order?.quantity}
                                                            </Badge>
                                                            {order?.color && (
                                                                <span
                                                                    className={`w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm`}
                                                                    style={{ background: order?.color }}
                                                                    title={order?.color}
                                                                />
                                                            )}
                                                            {order?.size && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    Size: {order?.size}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Dates Info */}
                                                <div className='lg:col-span-5 space-y-2 text-sm'>
                                                    <div className='flex items-center gap-2 text-green-700'>
                                                        <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                                                        <span className="font-medium">Ordered:</span>
                                                        <span className='text-gray-600'>
                                                            {new Date(order?.ordered_date).toLocaleDateString("en-US", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className='flex items-center gap-2 text-blue-700'>
                                                        <PackageCheck className="w-4 h-4 flex-shrink-0" />
                                                        <span className="font-medium">Delivered:</span>
                                                        <span className='text-gray-600'>
                                                            {new Date(order?.completed_date).toLocaleDateString("en-US", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <div className='lg:col-span-1 flex items-center justify-end'>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    >
                                                        <ArrowRight className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default Account;