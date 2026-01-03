import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import useAxiosCommon from "../../../Hooks/Axios/useAxiosCommon";
import { Send, User, ArrowLeft } from "lucide-react";

const SOCKET_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function AdminChatWindow({ session, onBack, showBackButton }) {
    const axiosCommon = useAxiosCommon();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [isUserTyping, setIsUserTyping] = useState(false);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const currentSessionRef = useRef({ email: null, cartToken: null });
    const typingTimeoutRef = useRef(null);

    const { email, cartToken } = session;

    // Update current session ref
    useEffect(() => {
        if (!email) return;
        currentSessionRef.current = { email, cartToken };

    }, [email, cartToken]);

    // Auto scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Socket connection - only create once
    useEffect(() => {
        // Create socket connection
        socketRef.current = io(SOCKET_URL, {
            transports: ["websocket"],
            withCredentials: true
        });

        socketRef.current.on("connect", () => {
            console.log("Admin socket connected:", socketRef.current.id);
            // Join room on connect if we have session data
            const { email: currentEmail, cartToken: currentCartToken } = currentSessionRef.current;
            if (currentEmail || currentCartToken) {
                socketRef.current.emit("joinRoom", { email: currentEmail, cartToken: currentCartToken });
                console.log(`Admin joined room on connect for ${currentEmail || currentCartToken}`);
            }
        });

        socketRef.current.on("receiveMessage", (msg) => {
            console.log("Admin received message:", msg);

            // Check if message belongs to current session
            const { email: currentEmail, cartToken: currentCartToken } = currentSessionRef.current;
            const belongsToCurrentSession =
                (currentEmail && msg.email === currentEmail) ||
                (currentCartToken && msg.cartToken === currentCartToken);

            if (belongsToCurrentSession) {
                setMessages((prev) => {
                    // Prevent duplicates by checking if message already exists
                    const exists = prev.some(m => m._id && msg._id && m._id.toString() === msg._id.toString());
                    if (exists) return prev;
                    return [...prev, msg];
                });
                // Clear typing indicator when message received
                setIsUserTyping(false);
            }
        });

        socketRef.current.on("userTyping", ({ email: typingEmail, cartToken: typingCartToken, isTyping, isAdmin }) => {
            // Only show typing indicator if it's from user (not admin) and matches current session
            const { email: currentEmail, cartToken: currentCartToken } = currentSessionRef.current;
            const isCurrentSession =
                (currentEmail && typingEmail === currentEmail) ||
                (currentCartToken && typingCartToken === currentCartToken);

            if (isCurrentSession && !isAdmin) {
                setIsUserTyping(isTyping);
            }
        });

        socketRef.current.on("disconnect", () => {
            console.log("Admin socket disconnected");
        });

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []); // Empty dependency - only run once

    // Join room when session changes
    useEffect(() => {
        if (socketRef.current?.connected && (email || cartToken)) {
            console.log(`Admin joining room for ${email || cartToken}`);
            socketRef.current.emit("joinRoom", { email, cartToken });
        }
    }, [email, cartToken]);

    // load history when session changes
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const res = await axiosCommon.get("/messages", { params: { email, cartToken } });
                setMessages(res.data || []);
            } catch (err) {
                console.error("Error loading messages:", err);
            }
        };

        loadMessages();
        // Reset typing indicator when switching chats
        setIsUserTyping(false);
    }, [axiosCommon, email, cartToken]);

    const handleTyping = (value) => {
        setText(value);

        // Emit typing event
        if (socketRef.current?.connected) {
            socketRef.current.emit("typing", {
                email,
                cartToken,
                isTyping: value.length > 0,
                isAdmin: true
            });

            // Clear previous timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Stop typing after 2 seconds of inactivity
            if (value.length > 0) {
                typingTimeoutRef.current = setTimeout(() => {
                    socketRef.current?.emit("typing", {
                        email,
                        cartToken,
                        isTyping: false,
                        isAdmin: true
                    });
                }, 2000);
            }
        }
    };

    const sendMessage = async () => {
        if (!text.trim()) return;

        const newMsg = {
            email,
            cartToken,
            text: text.trim(),
            time: new Date().toISOString(),
            isAdmin: true,
        };

        setText("");

        // Stop typing indicator
        if (socketRef.current?.connected) {
            socketRef.current.emit("typing", {
                email,
                cartToken,
                isTyping: false,
                isAdmin: true
            });
        }

        try {
            await axiosCommon.post("/live_chat", newMsg);
            // Message will be added via socket.io "receiveMessage" event
        } catch (err) {
            console.error("Admin send error:", err);
            // Re-add text on error
            setText(newMsg.text);
        }
    };


    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-b border-blue-700 shadow-md">
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Back button - only visible on mobile */}
                    {showBackButton && (
                        <button
                            onClick={onBack}
                            className="md:hidden p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            aria-label="Back to chat list"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm sm:text-base truncate">
                            {email || `Guest (${cartToken?.slice(0, 8)}...)`}
                        </p>
                        <p className="text-xs text-blue-100">Active now</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gradient-to-b from-gray-50 to-white">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 px-4">
                        <p className="text-xs sm:text-sm text-center">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((m, i) => (
                            <div
                                key={m._id || i}
                                className={`mb-2.5 sm:mb-3 flex ${m.direction === "admin" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl max-w-[85%] sm:max-w-[75%] md:max-w-[70%] shadow-sm ${m.direction === "admin"
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                                        : "bg-white text-gray-800 border border-gray-200"
                                        }`}
                                >
                                    <p className="text-xs sm:text-sm leading-relaxed break-words">{m.text}</p>
                                    <p className={`text-xs mt-1 ${m.direction === "admin" ? "text-blue-100" : "text-gray-400"}`}>
                                        {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}

                {/* Typing Indicator */}
                {isUserTyping && (
                    <div className="flex justify-start mb-2">
                        <div className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 shadow-sm">
                            <div className="flex gap-1.5 items-center">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                                <span className="text-xs text-gray-500 ml-1">typing...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 bg-white border-t border-gray-200 shadow-lg">
                <div className="flex gap-2">
                    <input
                        className="flex-1 border border-gray-300 rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={text}
                        onChange={(e) => handleTyping(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message..."
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 sm:gap-2 font-medium text-xs sm:text-sm"
                    >
                        <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
