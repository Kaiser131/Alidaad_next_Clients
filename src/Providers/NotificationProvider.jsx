'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const NotificationContext = createContext();
const SOCKET_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export const NotificationProvider = ({ children, user }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const socketRef = useRef(null);

    const cartToken = typeof window !== "undefined" ? localStorage.getItem("cartToken") : null;
    const email = user?.email || null;

    // Generate beep sound programmatically
    const playNotificationSound = useCallback(() => {
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
            console.error("Error playing sound:", err);
        }
    }, []);

    // Socket connection for notifications
    useEffect(() => {
        socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

        socketRef.current.on("connect", () => {
            console.log("Notification socket connected");
            socketRef.current.emit("joinRoom", { cartToken, email });
        });

        socketRef.current.on("receiveMessage", (msg) => {
            // Only react to admin messages (not user's own messages)
            if (msg.direction === "admin") {
                const isForThisUser =
                    (msg.email && msg.email === email) ||
                    (!msg.email && msg.cartToken && msg.cartToken === cartToken);

                if (isForThisUser) {
                    // Play sound
                    playNotificationSound();

                    // Show toast
                    toast.success("New message from support!", {
                        duration: 4000,
                        icon: "💬",
                    });

                    // Add to notifications
                    const newNotification = {
                        id: msg._id || Date.now(),
                        message: msg.text,
                        time: msg.time || new Date().toISOString(),
                        read: false,
                    };

                    setNotifications((prev) => [newNotification, ...prev]);
                    setUnreadCount((prev) => prev + 1);

                    // Save to localStorage
                    const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
                    localStorage.setItem(
                        "notifications",
                        JSON.stringify([newNotification, ...stored].slice(0, 50)) // Keep last 50
                    );
                }
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [cartToken, email, playNotificationSound]);

    // Load notifications from localStorage on mount
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
        setNotifications(stored);
        setUnreadCount(stored.filter((n) => !n.read).length);
    }, []);

    // Clear notifications when user changes (login/logout/register)
    useEffect(() => {
        // Clear notifications on user change
        const clearUserNotifications = () => {
            setNotifications([]);
            setUnreadCount(0);
            localStorage.removeItem("notifications");
        };

        // Clear when user email changes (login or logout)
        clearUserNotifications();
    }, [email]); // Triggers when email changes

    const markAsRead = useCallback((notificationId) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === notificationId ? { ...n, read: true } : n
            )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        // Update localStorage
        const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
        const updated = stored.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
        );
        localStorage.setItem("notifications", JSON.stringify(updated));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);

        // Update localStorage
        const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
        const updated = stored.map((n) => ({ ...n, read: true }));
        localStorage.setItem("notifications", JSON.stringify(updated));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
        localStorage.removeItem("notifications");
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                unreadCount,
                notifications,
                markAsRead,
                markAllAsRead,
                clearNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within NotificationProvider");
    }
    return context;
};
