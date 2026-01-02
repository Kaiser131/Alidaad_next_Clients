import { Bell, Check, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../../../Providers/NotificationProvider";
import { AnimatePresence } from "framer-motion";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NotificationsPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } =
        useNotifications();

    return (
        <div className="relative">
            {/* Bell Icon with Badge */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative flex items-center hover:scale-105 outline-none transition-transform"
                    >
                        <Bell size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] flex items-center justify-center font-semibold animate-pulse">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Notification</p>
                </TooltipContent>
            </Tooltip>


            {/* Notifications Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Panel */}
                        <div
                            className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-auto sm:mt-3 w-[calc(100vw-1rem)] max-w-[340px] sm:w-80 md:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[500px] flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-lg">
                                <div className="flex items-center gap-2">
                                    <Bell size={20} className="text-gray-700" />
                                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Actions */}
                            {notifications.length > 0 && (
                                <div className="px-4 py-2 border-b border-gray-200 flex gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                        >
                                            <Check size={14} />
                                            Mark all read
                                        </button>
                                    )}
                                    <button
                                        onClick={clearNotifications}
                                        className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 ml-auto"
                                    >
                                        <Trash2 size={14} />
                                        Clear all
                                    </button>
                                </div>
                            )}

                            {/* Notifications List */}
                            <div className="flex-1 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                                        <p className="text-sm">No notifications yet</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                onClick={() => {
                                                    if (!notification.read) {
                                                        markAsRead(notification.id);
                                                    }
                                                }}
                                                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? "bg-blue-50" : ""
                                                    }`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 animate-pulse" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-gray-800 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(notification.time).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    {!notification.read && (
                                                        <div className="flex-shrink-0">
                                                            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
