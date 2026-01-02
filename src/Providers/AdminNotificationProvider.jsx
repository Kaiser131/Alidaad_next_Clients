'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import axios from "axios";

const AdminNotificationContext = createContext();

export const useAdminNotifications = () => {
    const context = useContext(AdminNotificationContext);
    if (!context) {
        throw new Error("useAdminNotifications must be used within AdminNotificationProvider");
    }
    return context;
};

export const AdminNotificationProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [stockNotifications, setStockNotifications] = useState([]);
    const [stockUnreadCount, setStockUnreadCount] = useState(0);

    // Check if current user is admin (you can implement your own logic)
    useEffect(() => {
        // For now, assume dashboard users are admins
        // You might want to check user role from auth context
        const checkAdmin = () => {
            if (typeof window !== 'undefined') {
                const path = window.location.pathname;
                setIsAdmin(path.includes('/dashboard'));
            }
        };
        checkAdmin();
    }, []);

    // Clear notifications when admin status changes (login/logout)
    useEffect(() => {
        const clearAdminNotifications = () => {
            setNotifications([]);
            setUnreadCount(0);
            localStorage.removeItem("adminNotifications");
        };

        // Clear when switching between admin/non-admin
        if (!isAdmin) {
            clearAdminNotifications();
        }
    }, [isAdmin]);

    useEffect(() => {
        // Only load notifications if admin
        if (!isAdmin) return;

        // Load notifications from localStorage
        const stored = localStorage.getItem("adminNotifications");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setNotifications(parsed);
                const unread = parsed.filter((n) => !n.read).length;
                setUnreadCount(unread);
            } catch (err) {
                console.error("Error parsing admin notifications:", err);
            }
        }

        // Load stock notifications from localStorage
        const storedStock = localStorage.getItem("stockNotifications");
        if (storedStock) {
            try {
                const parsed = JSON.parse(storedStock);
                setStockNotifications(parsed);
                const unread = parsed.filter((n) => !n.read).length;
                setStockUnreadCount(unread);
            } catch (err) {
                console.error("Error parsing stock notifications:", err);
            }
        }
    }, [isAdmin]);

    useEffect(() => {

        // Connect to socket.io
        const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000", {
            withCredentials: true,
        });

        setSocket(newSocket);

        // Listen for user messages
        newSocket.on("receiveMessage", (msg) => {
            // Only notify admin about user messages
            if (msg.direction === "user") {
                // Play notification sound
                playNotificationSound();

                // Show toast
                const senderName = msg.email || `Guest (${msg.cartToken?.slice(0, 6)}...)`;
                toast.success(`New message from ${senderName}: ${msg.text.slice(0, 50)}...`, {
                    duration: 5000,
                    icon: "💬",
                });

                // Add to notifications
                const newNotification = {
                    id: msg._id || Date.now(),
                    type: "message",
                    message: msg.text,
                    sender: senderName,
                    email: msg.email,
                    cartToken: msg.cartToken,
                    time: msg.time || new Date(),
                    read: false,
                };

                setNotifications((prev) => {
                    const updated = [newNotification, ...prev].slice(0, 50); // Keep last 50
                    localStorage.setItem("adminNotifications", JSON.stringify(updated));
                    return updated;
                });

                setUnreadCount((prev) => prev + 1);
            }
        });

        // Listen for stock notifications (real-time)
        newSocket.on("stockNotification", (stockData) => {
            console.log("Received stock notification:", stockData);

            // Only process if admin
            if (!isAdmin) return;

            // Play notification sound
            playNotificationSound();

            // Show toast based on type
            if (stockData.type === "out_of_stock") {
                toast.error(`🔴 ${stockData.productName} is now out of stock!`, {
                    duration: 7000,
                });
            } else if (stockData.type === "low_stock") {
                toast.warning(`🟠 ${stockData.productName} is running low (${stockData.quantity} left)`, {
                    duration: 6000,
                });
            }

            // Create notification object
            const newStockNotification = {
                id: `stock-${stockData.productId}-${Date.now()}`,
                type: stockData.type,
                productId: stockData.productId,
                productName: stockData.productName,
                productImage: stockData.productImage,
                message: stockData.message,
                quantity: stockData.quantity,
                time: new Date(stockData.time),
                read: false,
            };

            // Add to stock notifications
            setStockNotifications((prev) => {
                const updated = [newStockNotification, ...prev].slice(0, 100); // Keep last 100
                localStorage.setItem("stockNotifications", JSON.stringify(updated));
                return updated;
            });

            setStockUnreadCount((prev) => prev + 1);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [isAdmin]);

    // Fetch stock notifications periodically
    useEffect(() => {
        if (!isAdmin) return;

        const fetchStockNotifications = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/low_stock_products`
                );

                const { outOfStock, lowStock } = response.data;

                // Get existing notifications from localStorage
                const existingNotifications = JSON.parse(localStorage.getItem("stockNotifications") || "[]");

                // Create a map of existing notifications by productId for quick lookup
                const existingMap = new Map();
                existingNotifications.forEach(notif => {
                    existingMap.set(notif.productId, notif);
                });

                // Create/update notifications for current stock issues
                const updatedNotifications = [];
                let newNotificationCount = 0;

                // Process out of stock products
                outOfStock.forEach(product => {
                    const existing = existingMap.get(product._id);

                    if (!existing) {
                        // New out of stock notification
                        const notification = {
                            id: `stock-${product._id}-${Date.now()}`,
                            type: "out_of_stock",
                            productId: product._id,
                            productName: product.name,
                            productImage: product.images?.[0],
                            message: `Product "${product.name}" is out of stock`,
                            quantity: 0,
                            time: new Date(),
                            read: false,
                        };
                        updatedNotifications.push(notification);
                        newNotificationCount++;

                        // Show toast for new out of stock items
                        toast.error(`⚠️ ${product.name} is out of stock!`, {
                            duration: 6000,
                        });
                    } else {
                        // Keep existing notification
                        updatedNotifications.push(existing);
                        existingMap.delete(product._id); // Mark as processed
                    }
                });

                // Process low stock products
                lowStock.forEach(product => {
                    const qty = parseInt(product.quantity);
                    const existing = existingMap.get(product._id);

                    if (!existing) {
                        // New low stock notification
                        const notification = {
                            id: `stock-${product._id}-${Date.now()}`,
                            type: "low_stock",
                            productId: product._id,
                            productName: product.name,
                            productImage: product.images?.[0],
                            message: `Product "${product.name}" is low on stock (${qty} left)`,
                            quantity: qty,
                            time: new Date(),
                            read: false,
                        };
                        updatedNotifications.push(notification);
                        newNotificationCount++;

                        // Show toast for new low stock items
                        toast.warning(`⚠️ ${product.name} is running low (${qty} left)`, {
                            duration: 5000,
                        });
                    } else {
                        // Update quantity if changed but keep notification
                        const notification = {
                            ...existing,
                            quantity: qty,
                            message: `Product "${product.name}" is low on stock (${qty} left)`,
                        };
                        updatedNotifications.push(notification);
                        existingMap.delete(product._id); // Mark as processed
                    }
                });

                // Keep manually created notifications that weren't processed (user can delete these manually)
                // But auto-remove notifications for products that are now back in stock
                // (Only if they were auto-generated, not manually kept)

                if (newNotificationCount > 0) {
                    playNotificationSound();
                }

                // Update state with all current stock issues
                setStockNotifications(updatedNotifications);
                localStorage.setItem("stockNotifications", JSON.stringify(updatedNotifications));

                // Count unread
                const unreadCount = updatedNotifications.filter(n => !n.read).length;
                setStockUnreadCount(unreadCount);

            } catch (error) {
                console.error("Error fetching stock notifications:", error);
            }
        };

        // Fetch immediately
        fetchStockNotifications();

        // Then fetch every 5 minutes
        const interval = setInterval(fetchStockNotifications, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [isAdmin]);

    const playNotificationSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = "sine";

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (err) {
            console.error("Error playing notification sound:", err);
        }
    };

    const markAsRead = (id) => {
        setNotifications((prev) => {
            const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
            localStorage.setItem("adminNotifications", JSON.stringify(updated));
            return updated;
        });
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications((prev) => {
            const updated = prev.map((n) => ({ ...n, read: true }));
            localStorage.setItem("adminNotifications", JSON.stringify(updated));
            return updated;
        });
        setUnreadCount(0);
    };

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
        localStorage.removeItem("adminNotifications");
    };

    const markStockAsRead = (id) => {
        setStockNotifications((prev) => {
            const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
            localStorage.setItem("stockNotifications", JSON.stringify(updated));
            return updated;
        });
        setStockUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const markAllStockAsRead = () => {
        setStockNotifications((prev) => {
            const updated = prev.map((n) => ({ ...n, read: true }));
            localStorage.setItem("stockNotifications", JSON.stringify(updated));
            return updated;
        });
        setStockUnreadCount(0);
    };

    const clearStockNotifications = () => {
        setStockNotifications([]);
        setStockUnreadCount(0);
        localStorage.removeItem("stockNotifications");
    };

    const deleteStockNotification = (id) => {
        setStockNotifications((prev) => {
            const notification = prev.find(n => n.id === id);
            const updated = prev.filter((n) => n.id !== id);
            localStorage.setItem("stockNotifications", JSON.stringify(updated));

            // Decrease unread count if the deleted notification was unread
            if (notification && !notification.read) {
                setStockUnreadCount((count) => Math.max(0, count - 1));
            }

            return updated;
        });
    };

    const refreshStockNotifications = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/low_stock_products`
            );

            const { outOfStock, lowStock } = response.data;

            // Recreate all notifications based on current stock status
            const allNotifications = [];

            outOfStock.forEach(product => {
                allNotifications.push({
                    id: `stock-${product._id}-${Date.now()}`,
                    type: "out_of_stock",
                    productId: product._id,
                    productName: product.name,
                    productImage: product.images?.[0],
                    message: `Product "${product.name}" is out of stock`,
                    quantity: 0,
                    time: new Date(),
                    read: false,
                });
            });

            lowStock.forEach(product => {
                const qty = parseInt(product.quantity);
                allNotifications.push({
                    id: `stock-${product._id}-${Date.now()}`,
                    type: "low_stock",
                    productId: product._id,
                    productName: product.name,
                    productImage: product.images?.[0],
                    message: `Product "${product.name}" is low on stock (${qty} left)`,
                    quantity: qty,
                    time: new Date(),
                    read: false,
                });
            });

            setStockNotifications(allNotifications);
            setStockUnreadCount(allNotifications.length);
            localStorage.setItem("stockNotifications", JSON.stringify(allNotifications));

        } catch (error) {
            console.error("Error refreshing stock notifications:", error);
        }
    };

    const value = {
        unreadCount,
        notifications,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        socket,
        stockNotifications,
        stockUnreadCount,
        markStockAsRead,
        markAllStockAsRead,
        clearStockNotifications,
        deleteStockNotification,
        refreshStockNotifications,
    };

    return (
        <AdminNotificationContext.Provider value={value}>
            {children}
        </AdminNotificationContext.Provider>
    );
};
