import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    ComposedChart,
    Legend,
} from "recharts";
import useAxiosSecure from "../../../Hooks/Axios/useAxiosSecure";
import {
    Users,
    Package,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    Calendar,
    Award,
    Clock
} from "lucide-react";

export default function Analytic() {
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString("en-US", { month: "long" }));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // get year
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axiosSecure.get(
                `/dashboard_summary?month=${selectedMonth}&year=${selectedYear}`
            );
            setDashboardData(response.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMonth, selectedYear]);

    if (loading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="relative inline-block">
                        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
                        <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-blue-300 opacity-20"></div>
                    </div>
                    <p className="text-gray-700 font-semibold text-lg">Loading Analytics...</p>
                    <p className="text-gray-500 text-sm mt-2">Fetching your dashboard data</p>
                </div>
            </div>
        );
    }

    if (!dashboardData || !dashboardData.weeklySales || !dashboardData.topProducts) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-red-800 font-medium">Failed to load dashboard data</p>
                            <p className="text-red-600 text-sm mt-1">Please refresh the page or contact support</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Prepare weekly sales data with day names
    const weeklyChartData = dashboardData.weeklySales.map(item => {
        const date = new Date(item.date);
        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            sell: item.sell,
            quantity: item.quantity
        };
    });

    // Calculate max quantity for top products (for percentage display)
    const maxQuantity = Math.max(...dashboardData.topProducts.map(p => p.totalQuantity), 1);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    Analytics Dashboard
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">Track your business performance and insights</p>
            </div>

            {/* Header Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Total Users Card */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:scale-105 group">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm sm:text-base text-gray-500 font-medium mb-2 flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-500" />
                                Total Users
                            </p>
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {dashboardData.totalUsers?.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                            <Users className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs sm:text-sm text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="font-semibold">Active customers</span>
                    </div>
                </div>

                {/* Total Products Card */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:scale-105 group">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm sm:text-base text-gray-500 font-medium mb-2 flex items-center gap-2">
                                <Package className="w-4 h-4 text-green-500" />
                                Total Products
                            </p>
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                {dashboardData.totalProducts?.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors">
                            <Package className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs sm:text-sm text-gray-600">
                        <span className="font-semibold">In inventory</span>
                    </div>
                </div>

                {/* Total Orders Card */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:scale-105 group">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm sm:text-base text-gray-500 font-medium mb-2 flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4 text-purple-500" />
                                Total Orders
                            </p>
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {dashboardData.totalOrders?.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors">
                            <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs sm:text-sm text-gray-600">
                        <span className="font-semibold">{dashboardData.totalItemsSold?.toLocaleString()} items sold</span>
                    </div>
                </div>

                {/* Total Revenue Card */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:scale-105 group">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm sm:text-base text-gray-500 font-medium mb-2 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-orange-500" />
                                Total Revenue
                            </p>
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                ৳{dashboardData.totalRevenue?.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-orange-200 transition-colors">
                            <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs sm:text-sm text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="font-semibold">Lifetime earnings</span>
                    </div>
                </div>
            </div>

            {/* Monthly Sale & Weekly Sale */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Monthly Sales Chart */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 xl:col-span-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-purple-600" />
                                Monthly Sales Analysis
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Revenue and quantity trends</p>
                        </div>
                        <div className="flex gap-2 sm:gap-3 flex-wrap">
                            <select
                                className="border-2 border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white hover:border-purple-400 transition-colors"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                {years.map((year, idx) => (
                                    <option key={idx} value={year}>{year}</option>
                                ))}
                            </select>
                            <select
                                className="border-2 border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white hover:border-purple-400 transition-colors"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                {months.map((month, idx) => (
                                    <option key={idx} value={month}>{month}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Monthly sales chart */}
                    <div className="w-full overflow-x-auto">
                        <ResponsiveContainer width="100%" height={280} minWidth={300}>
                            <ComposedChart data={dashboardData.monthlySales}>
                                <defs>
                                    <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.2} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="day"
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    label={{ value: 'Day of Month', position: 'insideBottom', offset: -5, style: { fontSize: 12, fill: '#6B7280' } }}
                                />
                                <YAxis
                                    yAxisId="left"
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    label={{ value: 'Revenue (৳)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6B7280' } }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    label={{ value: 'Quantity', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: '#6B7280' } }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: '12px',
                                        border: '1px solid #E5E7EB',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: '14px' }} />
                                <Bar
                                    yAxisId="right"
                                    dataKey="quantity"
                                    name="Quantity Sold"
                                    barSize={20}
                                    fill="#60A5FA"
                                    minPointSize={5}
                                    radius={[8, 8, 0, 0]}
                                />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="sell"
                                    name="Revenue (৳)"
                                    stroke="#7C3AED"
                                    strokeWidth={3}
                                    dot={{ fill: '#7C3AED', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 7 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Weekly Sales Chart */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    <div className="mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-600" />
                            Weekly Sales
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Last 7 days performance</p>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <ResponsiveContainer width="100%" height={280} minWidth={250}>
                            <BarChart data={weeklyChartData}>
                                <defs>
                                    <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.9} />
                                        <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.6} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="day"
                                    tick={{ fill: '#6B7280', fontSize: 11 }}
                                />
                                <YAxis
                                    tick={{ fill: '#6B7280', fontSize: 11 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: '12px',
                                        border: '1px solid #E5E7EB',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="sell"
                                    fill="url(#colorWeekly)"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Orders & Top Items */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                {/* Latest Orders Table */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 xl:col-span-2">
                    <div className="mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-blue-600" />
                            Latest Orders
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Recent customer transactions</p>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block lg:hidden space-y-3">
                        {dashboardData.latestOrders.map((order) => (
                            <div key={order._id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-bold text-gray-900">#{order.order_id}</p>
                                        <p className="text-sm text-gray-600 mt-1">{order.name}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === "completed"
                                                ? "bg-green-100 text-green-700"
                                                : order.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : order.status === "new"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                        {new Date(order.ordered_date).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: '2-digit'
                                        })}
                                    </span>
                                    <span className="font-bold text-gray-900">৳{order.products_total?.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-600 text-xs sm:text-sm border-b-2 border-gray-200">
                                    <th className="py-3 px-2 font-semibold">Order ID</th>
                                    <th className="px-2 font-semibold">Customer</th>
                                    <th className="px-2 font-semibold">Date</th>
                                    <th className="px-2 font-semibold">Price</th>
                                    <th className="px-2 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.latestOrders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                                        <td className="py-3 px-2 font-semibold text-gray-900 text-sm">#{order.order_id}</td>
                                        <td className="px-2 text-gray-700 text-sm">{order.name}</td>
                                        <td className="px-2 text-gray-600 text-sm">
                                            {new Date(order.ordered_date).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-2 font-bold text-gray-900 text-sm">৳{order.products_total?.toLocaleString()}</td>
                                        <td className="px-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${order.status === "completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : order.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : order.status === "new"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Sold Products */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    <div className="mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Award className="w-5 h-5 text-purple-600" />
                            Top Products
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Best sellers by quantity</p>
                    </div>

                    <div className="space-y-4 sm:space-y-5">
                        {dashboardData.topProducts.map((item, index) => {
                            const percentage = (item.totalQuantity / maxQuantity) * 100;
                            return (
                                <div key={item.product_id} className="group">
                                    <div className="flex items-center justify-between text-sm font-medium mb-2 text-gray-700">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                                                {index + 1}
                                            </span>
                                            <span className="truncate group-hover:text-purple-600 transition-colors">{item.name}</span>
                                        </div>
                                        <span className="text-purple-600 whitespace-nowrap ml-2 font-bold text-xs sm:text-sm">
                                            {item.totalQuantity} pcs
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-700 ease-out group-hover:from-purple-600 group-hover:to-indigo-700 relative"
                                            style={{ width: `${percentage}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500">
                                        Revenue: ৳{item.totalRevenue?.toLocaleString()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
