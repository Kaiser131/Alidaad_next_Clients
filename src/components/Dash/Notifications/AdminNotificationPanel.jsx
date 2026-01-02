import { AlertTriangle, Bell, MessageCircle, Package, X } from "lucide-react";
import { useAdminNotifications } from "../../../Providers/AdminNotificationProvider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../ui/tabs";

const AdminNotificationPanel = () => {
    const {
        unreadCount,
        notifications,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        stockNotifications,
        stockUnreadCount,
        markStockAsRead,
        markAllStockAsRead,
        clearStockNotifications,
        deleteStockNotification,
    } = useAdminNotifications();

    const router = useRouter();

    const totalUnread = unreadCount + stockUnreadCount;

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        // Navigate to admin chat with this session
        router.push("/dashboard/admin_chat");
    };

    const handleStockNotificationClick = (notification) => {
        markStockAsRead(notification.id);
        // Navigate to product details or inventory page
        router.push(`/dashboard/update_product/${notification.productId}`);
    };

    const handleDeleteStockNotification = (e, notificationId) => {
        e.stopPropagation(); // Prevent navigation when clicking delete
        if (window.confirm('Are you sure you want to delete this notification?')) {
            deleteStockNotification(notificationId);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-gray-100/80 transition-colors">
                    <Bell className="w-6 h-6 text-gray-700" />
                    {totalUnread > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 animate-pulse">
                            {totalUnread > 99 ? "99+" : totalUnread}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-96 max-h-[600px] overflow-hidden p-0 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl"
            >
                <Tabs defaultValue="messages" className="w-full">
                    {/* Header with Tabs */}
                    <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h3 className="font-semibold text-gray-800 mb-3">Notifications</h3>
                        <TabsList className="w-full grid grid-cols-2 bg-white/50">
                            <TabsTrigger value="messages" className="relative">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Messages
                                {unreadCount > 0 && (
                                    <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">
                                        {unreadCount}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="stock" className="relative">
                                <Package className="w-4 h-4 mr-2" />
                                Stock
                                {stockUnreadCount > 0 && (
                                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                                        {stockUnreadCount}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Messages Tab */}
                    <TabsContent value="messages" className="m-0">
                        <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
                            <span className="text-xs text-gray-600 font-medium">User Messages</span>
                            {notifications.length > 0 && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Mark all read
                                    </button>
                                    <button
                                        onClick={clearNotifications}
                                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="overflow-y-auto max-h-[450px]">
                            <AnimatePresence>
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm">No new messages</p>
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-all hover:bg-blue-50/50 ${!notification.read ? "bg-blue-50/30" : "bg-white"
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.read ? "bg-blue-500" : "bg-gray-300"
                                                        }`}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm text-gray-800 mb-1">
                                                        {notification.sender}
                                                    </p>
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(notification.time).toLocaleString()}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <span className="flex-shrink-0 text-xs font-semibold text-blue-600">
                                                        NEW
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </TabsContent>

                    {/* Stock Tab */}
                    <TabsContent value="stock" className="m-0">
                        <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
                            <span className="text-xs text-gray-600 font-medium">Stock Alerts</span>
                            {stockNotifications.length > 0 && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={markAllStockAsRead}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Mark all read
                                    </button>
                                    <button
                                        onClick={clearStockNotifications}
                                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="overflow-y-auto max-h-[450px]">
                            <AnimatePresence>
                                {stockNotifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm">All stock levels are good!</p>
                                        <p className="text-xs text-gray-400 mt-1">You'll be notified of any issues</p>
                                    </div>
                                ) : (
                                    stockNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleStockNotificationClick(notification)}
                                            className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-all hover:bg-orange-50/50 ${!notification.read ?
                                                (notification.type === 'out_of_stock' ? "bg-red-50/30" : "bg-orange-50/30")
                                                : "bg-white"
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Product Image */}
                                                {notification.productImage && (
                                                    <img
                                                        src={notification.productImage}
                                                        alt={notification.productName}
                                                        className="w-12 h-12 object-cover rounded border border-gray-200"
                                                    />
                                                )}

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {notification.type === 'out_of_stock' ? (
                                                            <AlertTriangle className="w-4 h-4 text-red-500" />
                                                        ) : (
                                                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                                                        )}
                                                        <span className={`text-xs font-semibold ${notification.type === 'out_of_stock' ? 'text-red-600' : 'text-orange-600'
                                                            }`}>
                                                            {notification.type === 'out_of_stock' ? 'OUT OF STOCK' : 'LOW STOCK'}
                                                        </span>
                                                    </div>
                                                    <p className="font-medium text-sm text-gray-800 mb-1">
                                                        {notification.productName}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(notification.time).toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    {!notification.read && (
                                                        <span className={`flex-shrink-0 text-xs font-semibold ${notification.type === 'out_of_stock' ? 'text-red-600' : 'text-orange-600'
                                                            }`}>
                                                            NEW
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={(e) => handleDeleteStockNotification(e, notification.id)}
                                                        className="p-1 rounded-full hover:bg-red-100 transition-colors group"
                                                        title="Delete notification"
                                                    >
                                                        <X className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </TabsContent>
                </Tabs>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AdminNotificationPanel;
