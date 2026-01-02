"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import useAxiosCommon from "../../../Hooks/Axios/useAxiosCommon";
import AdminChatWindow from "./AdminChatWindow";
import { MessageCircle, Users, ArrowLeft, Bell } from "lucide-react";
import toast from "react-hot-toast";

const SOCKET_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function AdminChatList() {
    const axiosCommon = useAxiosCommon();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [showChatOnMobile, setShowChatOnMobile] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState({});
    const socketRef = useRef(null);
    const audioRef = useRef(null);

    // Create audio element for notification sound
    useEffect(() => {
        audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYHGmi77eefTRALUKfj8LdjHAU7k9fyz3orBSl7x+/gjT8JFF247OunVRMJRqDf8r5sIQQpgc7y2Yk3Bxhpu+3mnk0PDlCn4/C3YxwEO5PX8dB6KwUpe8bw34w/CBVvuOzsp1UUCEaf3/K+bCAEKYDO8tmJOAcZabvt5p5NDw1Qp+Pwt2McBDuT1/HPeisFKHvG8N+MPwgVb7js7KdVFAhGn9/yvmwgBCmAzvLZiTgHGWm77eaeTQ8NUKfj8LdjHAQ7k9fxz3orBSh7xvDejD8IFW+47OynVRQIRp/f8r5sIAQpgM7y2Yk4Bxlpu+3mnk0PDVCn4/C3YxwEO5PX8c96KwUoe8bw3ow/CBVvuOzsp1UUCEaf3/K+bCAEKYDO8tmJOAcZabvt5p5NDw1Qp+Pwt2McBDuT1/HPeisFKHvG8N6MPwgVb7js7KdVFAhGn9/yvmwgBCmAzvLZiTgHGWm77eaeTQ8NUKfj8LdjHAQ7k9fxz3orBSh7xvDejD8IFW+47OynVRQIRp/f8r5sIAQpgM7y2Yk4Bxlpu+3mnk0PDVCn4/C3YxwEO5PX8c96KwUoe8bw3ow/CBVvuOzsp1UUCEaf3/K+bCAEKYDO8tmJOAcZabvt5p5NDw1Qp+Pwt2McBDuT1/HPeisFKHvG8N6MPwgVb7js7KdVFAhGn9/yvmwgBCl/zvLZiTgHGGm77eaeTRANU6fi8LdjHAQ7k9fxz3orBSh7xvDejD8IFW+47OynVRQIRp/f8r5sIAQpf87y2Yk4Bxhpu+3mnk0QDVOn4vC3YxwEO5PX8c96KwUoe8bw3ow/CBVvuOzsp1UUCEaf3/K+bCAEKX/O8tmJOAcYabvt5p5NEA1Tp+Lwt2McBDuT1/HPeisFKHvG8N6MPwgVb7js7KdVFAhGn9/yvmwgBCl/zvLZiTgHGGm77eaeTRANU6fi8LdjHAQ7k9fxz3orBSh7xvDejD8IFW+47OynVRQIRp/f8r5sIAQpf87y2Yk4Bxhpu+3mnk0QDVOn4vC3YxwEO5PX8c96KwUoe8bw3ow/CBVvuOzsp1UUCEaf3/K+bCAEKX/O8tmJOAcYabvt5p5NEA1Tp+Lwt2McBDuT1/HPeisFKHvG8N6MPwgVb7js7KdVFAhGn9/yvmwgBCl/zvLZiTgHGGm77eadTRANU6fi8LdjHAQ7k9fxz3orBSh7xvDejD8IFW+47OynVRQIRp/f8r5sIAQpf87y2Yk4Bxhpu+3mnU0QDVOn4vC3YxwEO5PX8c96KwUoe8bw3ow/CBVvuezsp1UUCEY=');
    }, []);

    // Global socket connection for notifications
    useEffect(() => {
        socketRef.current = io(SOCKET_URL, {
            transports: ["websocket"],
            withCredentials: true
        });

        socketRef.current.on("connect", () => {
            console.log("Admin list socket connected:", socketRef.current.id);

            // Join all chat rooms for notifications
            chats.forEach(chat => {
                const { email, cartToken } = chat._id;
                socketRef.current.emit("joinRoom", { email, cartToken });
                console.log(`Admin list joined room: ${email || cartToken}`);
            });
        });

        // Listen for all messages globally
        socketRef.current.on("receiveMessage", (msg) => {
            console.log("Admin list received message:", msg);

            // Check if message is from a user (not admin)
            if (msg.direction === "user") {
                const msgIdentifier = msg.email || msg.cartToken;
                const selectedIdentifier = selectedChat?.email || selectedChat?.cartToken;

                // If message is NOT from the currently selected chat, show notification
                if (msgIdentifier !== selectedIdentifier) {
                    // Play notification sound
                    if (audioRef.current) {
                        audioRef.current.play().catch(err => console.log("Audio play failed:", err));
                    }

                    // Show toast notification
                    const senderName = msg.email || `Guest (${msg.cartToken?.slice(0, 8)}...)`;
                    toast((t) => (
                        <div
                            onClick={() => {
                                // Find and select the chat
                                const chat = chats.find(c =>
                                    c._id.email === msg.email || c._id.cartToken === msg.cartToken
                                );
                                if (chat) {
                                    setSelectedChat(chat._id);
                                    setShowChatOnMobile(true);
                                }
                                toast.dismiss(t.id);
                            }}
                            className="cursor-pointer"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{senderName}</p>
                                    <p className="text-sm text-gray-600 line-clamp-2">{msg.text}</p>
                                </div>
                            </div>
                        </div>
                    ), {
                        duration: 5000,
                        position: 'top-right',
                        icon: '💬',
                        style: {
                            background: '#fff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }
                    });

                    // Increment unread count
                    setUnreadCounts(prev => ({
                        ...prev,
                        [msgIdentifier]: (prev[msgIdentifier] || 0) + 1
                    }));
                }

                // Refresh chat list to update last message
                axiosCommon.get("/chats")
                    .then((res) => setChats(res.data))
                    .catch((err) => console.error("Error refreshing chats:", err));
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [selectedChat, chats, axiosCommon]);

    // Join rooms when chats list updates
    useEffect(() => {
        if (socketRef.current?.connected && chats.length > 0) {
            chats.forEach(chat => {
                const { email, cartToken } = chat._id;
                socketRef.current.emit("joinRoom", { email, cartToken });
            });
        }
    }, [chats]);

    useEffect(() => {
        axiosCommon.get("/chats")
            .then((res) => setChats(res.data))
            .catch((err) => console.error("Error loading chats:", err));
    }, [axiosCommon]);

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
        setShowChatOnMobile(true);

        // Clear unread count for this chat
        const identifier = chat.email || chat.cartToken;
        setUnreadCounts(prev => {
            const newCounts = { ...prev };
            delete newCounts[identifier];
            return newCounts;
        });
    };

    const handleBackToList = () => {
        setShowChatOnMobile(false);
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] md:h-[calc(100vh-6rem)] bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg overflow-hidden border border-gray-200/50">
            {/* Sidebar - Hidden on mobile when chat is selected */}
            <div className={`${showChatOnMobile ? 'hidden' : 'flex'} md:flex w-full md:w-1/3 border-r border-gray-200 bg-gradient-to-b from-blue-50/30 to-white overflow-hidden flex-col`}>
                <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                        <div>
                            <h2 className="text-base sm:text-lg font-bold">Live Chats</h2>
                            <p className="text-xs sm:text-sm text-blue-100">{chats.length} active conversations</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
                            <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 mb-3 opacity-50" />
                            <p className="text-xs sm:text-sm">No active chats</p>
                        </div>
                    ) : (
                        chats.map((chat, i) => {
                            const { email, cartToken } = chat._id;
                            const isSelected = selectedChat &&
                                selectedChat.email === email &&
                                selectedChat.cartToken === cartToken;

                            const identifier = email || cartToken;
                            const unreadCount = unreadCounts[identifier] || 0;

                            return (
                                <div
                                    key={i}
                                    onClick={() => handleChatSelect(chat._id)}
                                    className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-blue-50/50 ${isSelected ? "bg-blue-100/70 border-l-4 border-l-blue-600" : ""
                                        } ${unreadCount > 0 ? "bg-blue-50/30" : ""}`}
                                >
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="relative">
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm sm:text-base">
                                                {email ? email[0].toUpperCase() : "G"}
                                            </div>
                                            {unreadCount > 0 && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`font-semibold text-gray-800 truncate text-sm sm:text-base ${unreadCount > 0 ? 'font-bold' : ''}`}>
                                                    {email || `Guest (${cartToken?.slice(0, 8)}...)`}
                                                </p>
                                                {unreadCount > 0 && (
                                                    <Bell className="w-4 h-4 text-red-500 animate-pulse flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className={`text-xs text-gray-500 truncate mt-0.5 sm:mt-1 ${unreadCount > 0 ? 'font-semibold text-gray-700' : ''}`}>
                                                {chat.lastMessage}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Window - Full width on mobile when selected */}
            <div className={`${showChatOnMobile ? 'flex w-full' : 'hidden'} md:flex md:flex-1 bg-white`}>
                {selectedChat ? (
                    <AdminChatWindow
                        session={selectedChat}
                        onBack={handleBackToList}
                        showBackButton={true}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
                        <MessageCircle className="w-16 h-16 sm:w-20 sm:h-20 mb-4 opacity-30" />
                        <p className="text-base sm:text-lg font-medium">Select a chat to view</p>
                        <p className="text-xs sm:text-sm mt-1 text-center">Choose a conversation from the sidebar</p>
                    </div>
                )}
            </div>
        </div>
    );
}
