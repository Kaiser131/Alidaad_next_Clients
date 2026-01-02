"use client";

// src/components/ChatWidget.jsx
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useMutation } from "@tanstack/react-query";
import useAxiosCommon from "../../../Hooks/Axios/useAxiosCommon";

// configure socket URL
const SOCKET_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function ChatWidget({ user }) {
    // user: object from your firebase auth (may be null)
    // we will derive email from user?.email
    const axiosCommon = useAxiosCommon();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isAdminTyping, setIsAdminTyping] = useState(false);
    const socketRef = useRef(null);
    const scrollRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // cartToken from localStorage (your existing token for anon users)
    const cartToken = typeof window !== "undefined" ? localStorage.getItem("cartToken") : null;
    const email = user?.email || null;

    // create socket and join room
    useEffect(() => {
        socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

        socketRef.current.on("connect", () => {
            console.log("Socket connected", socketRef.current.id);
            socketRef.current.emit("joinRoom", { cartToken, email });
        });

        socketRef.current.on("receiveMessage", (msg) => {
            // ensure we only accept messages for this user (server already emits to room but double-check)
            if (
                (msg.email && msg.email === email) ||
                (!msg.email && msg.cartToken && msg.cartToken === cartToken)
            ) {
                setMessages((prev) => {
                    // Prevent duplicates by checking if message already exists
                    const exists = prev.some(m => m._id && msg._id && m._id.toString() === msg._id.toString());
                    if (exists) return prev;
                    return [...prev, msg];
                });

                // Clear typing indicator when message received
                setIsAdminTyping(false);

                // If message is from admin and chat is closed, increment unread count
                if (msg.direction === "admin" && !open) {
                    setUnreadCount((prev) => prev + 1);
                }
            }
        });

        socketRef.current.on("userTyping", ({ email: typingEmail, cartToken: typingCartToken, isTyping, isAdmin }) => {
            // Only show typing indicator if it's from admin and matches current user
            const isCurrentUser =
                (email && typingEmail === email) ||
                (cartToken && typingCartToken === cartToken);

            if (isCurrentUser && isAdmin) {
                setIsAdminTyping(isTyping);
            }
        });

        return () => {
            socketRef.current.disconnect();
            socketRef.current = null;
        };
    }, [cartToken, email, open]);

    // scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // fetch history when opening chat
    useEffect(() => {
        if (!open) return;

        // Reset unread count when opening chat
        setUnreadCount(0);

        const abortCtrl = new AbortController();
        const load = async () => {
            try {
                setLoadingHistory(true);
                const params = email ? `?email=${encodeURIComponent(email)}` : `?cartToken=${encodeURIComponent(cartToken)}`;
                const res = await axiosCommon.get(`/messages${params}`, { signal: abortCtrl.signal });
                setMessages(res.data || []);
            } catch (err) {
                if (!abortCtrl.signal.aborted) {
                    console.error("Failed to load messages:", err);
                }
            } finally {
                setLoadingHistory(false);
            }
        };

        load();
        return () => abortCtrl.abort();
    }, [open, axiosCommon, cartToken, email]);

    // mutation to send message using your axios + react-query pattern
    const { mutateAsync } = useMutation({
        mutationFn: async (message) => {
            const { data } = await axiosCommon.post("/live_chat", message);
            return data;
        }
    });

    const handleTyping = (value) => {
        setText(value);

        // Emit typing event
        if (socketRef.current?.connected) {
            socketRef.current.emit("typing", {
                email,
                cartToken,
                isTyping: value.length > 0,
                isAdmin: false
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
                        isAdmin: false
                    });
                }, 2000);
            }
        }
    };

    const handleSend = async () => {
        if (!text.trim()) return;

        const payload = {
            cartToken,
            email,
            text: text.trim(),
            time: new Date().toISOString()
        };

        setText("");

        // Stop typing indicator
        if (socketRef.current?.connected) {
            socketRef.current.emit("typing", {
                email,
                cartToken,
                isTyping: false,
                isAdmin: false
            });
        }

        try {
            // send via REST endpoint (server stores and emits to room)
            // Don't add optimistically - let socket.io handle it to avoid duplicates
            await mutateAsync(payload);
        } catch (err) {
            console.error("Failed to send message:", err);
            // optionally show error or re-add message with error flag
        }
    };

    return (
        <>
            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.05);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes bounce {
                    0%, 60%, 100% {
                        transform: translateY(0);
                    }
                    30% {
                        transform: translateY(-8px);
                    }
                }

                .chat-widget-container {
                    position: fixed;
                    right: 16px;
                    bottom: 16px;
                    z-index: 9999;
                }

                @media (max-width: 640px) {
                    .chat-widget-container {
                        right: 12px;
                        bottom: 12px;
                    }
                }

                .chat-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
                    color: white;
                    padding: 14px 20px;
                    border-radius: 50px;
                    box-shadow: 0 4px 20px rgba(14, 165, 233, 0.4);
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 15px;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .chat-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 25px rgba(14, 165, 233, 0.5);
                }

                .chat-button:active {
                    transform: translateY(0);
                }

                @media (max-width: 640px) {
                    .chat-button {
                        padding: 12px 18px;
                        font-size: 14px;
                    }
                }

                .unread-badge {
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    background: #ef4444;
                    color: white;
                    font-size: 11px;
                    border-radius: 50%;
                    padding: 4px 7px;
                    font-weight: 700;
                    min-width: 22px;
                    height: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: pulse 2s infinite;
                    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
                }

                .chat-window {
                    position: fixed;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    animation: slideUp 0.3s ease;
                }

                @media (min-width: 641px) {
                    .chat-window {
                        width: 380px;
                        height: 580px;
                        bottom: 90px;
                        right: 16px;
                    }
                }

                @media (max-width: 640px) {
                    .chat-window {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        width: 100%;
                        height: 100%;
                        border-radius: 0;
                        z-index: 10000;
                    }
                }

                .chat-header {
                    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
                    color: white;
                    padding: 18px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .chat-header-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .chat-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }

                .chat-header-text h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .chat-header-text p {
                    margin: 0;
                    font-size: 12px;
                    opacity: 0.9;
                }

                .close-button {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                    font-size: 20px;
                    line-height: 1;
                }

                .close-button:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%);
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .chat-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .chat-messages::-webkit-scrollbar-track {
                    background: transparent;
                }

                .chat-messages::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }

                .chat-messages::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }

                .message-wrapper {
                    display: flex;
                    animation: fadeIn 0.3s ease;
                }

                .message-wrapper.user {
                    justify-content: flex-end;
                }

                .message-wrapper.admin {
                    justify-content: flex-start;
                }

                .message-bubble {
                    max-width: 75%;
                    padding: 12px 16px;
                    border-radius: 18px;
                    word-wrap: break-word;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                }

                @media (max-width: 640px) {
                    .message-bubble {
                        max-width: 85%;
                    }
                }

                .message-bubble.user {
                    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
                    color: white;
                    border-bottom-right-radius: 4px;
                }

                .message-bubble.admin {
                    background: white;
                    color: #1e293b;
                    border-bottom-left-radius: 4px;
                }

                .message-text {
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0;
                }

                .message-time {
                    font-size: 11px;
                    margin-top: 6px;
                    opacity: 0.7;
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #64748b;
                    text-align: center;
                    padding: 20px;
                }

                .empty-state-icon {
                    font-size: 48px;
                    margin-bottom: 12px;
                }

                .empty-state-text {
                    font-size: 14px;
                    margin: 0;
                }

                .loading-state {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #64748b;
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #e2e8f0;
                    border-top-color: #0ea5e9;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .chat-input-container {
                    padding: 16px 20px;
                    background: white;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .chat-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 2px solid #e2e8f0;
                    border-radius: 24px;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.2s;
                    font-family: inherit;
                }

                .chat-input:focus {
                    border-color: #0ea5e9;
                }

                .chat-input::placeholder {
                    color: #94a3b8;
                }

                .send-button {
                    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
                    color: white;
                    border: none;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
                    flex-shrink: 0;
                }

                .send-button:hover:not(:disabled) {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
                }

                .send-button:active:not(:disabled) {
                    transform: scale(0.95);
                }

                .send-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .send-icon {
                    font-size: 18px;
                }
            `}</style>

            <div className="chat-widget-container">
                <div style={{ position: "relative" }}>
                    <button
                        onClick={() => setOpen((o) => !o)}
                        className="chat-button"
                        aria-label={open ? "Close chat" : "Open chat"}
                    >
                        {open ? (
                            <>
                                <span>✕</span>
                                <span>Close</span>
                            </>
                        ) : (
                            <>
                                <span>Chat</span>
                            </>
                        )}
                    </button>
                    {unreadCount > 0 && !open && (
                        <span className="unread-badge">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </div>

                {open && (
                    <div className="chat-window">
                        <div className="chat-header">
                            <div className="chat-header-content">
                                <div className="chat-avatar">
                                    🛍️
                                </div>
                                <div className="chat-header-text">
                                    <h3>Alidaad Support</h3>
                                    <p>We typically reply instantly</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="close-button"
                                aria-label="Close chat"
                            >
                                ✕
                            </button>
                        </div>

                        <div ref={scrollRef} className="chat-messages">
                            {loadingHistory ? (
                                <div className="loading-state">
                                    <div className="loading-spinner"></div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">👋</div>
                                    <p className="empty-state-text">
                                        <strong>Welcome to Alidaad!</strong>
                                        <br />
                                        Start a conversation with us.
                                        <br />
                                        We're here to help!
                                    </p>
                                </div>
                            ) : (
                                messages.map((m, idx) => {
                                    const isUser = m.direction === "user" || (!m.direction && (m.email === email || m.cartToken === cartToken));
                                    return (
                                        <div
                                            key={m._id ? String(m._id) : `${idx}-${m.time}`}
                                            className={`message-wrapper ${isUser ? "user" : "admin"}`}
                                        >
                                            <div className={`message-bubble ${isUser ? "user" : "admin"}`}>
                                                <p className="message-text">{m.text}</p>
                                                <div className="message-time">
                                                    {new Date(m.time).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                            {/* Typing Indicator */}
                            {isAdminTyping && (
                                <div className="message-wrapper admin" style={{ animation: 'fadeIn 0.3s ease' }}>
                                    <div className="message-bubble admin" style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '10px 14px' }}>
                                        <span style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '0ms' }}></span>
                                        <span style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '0.2s' }}></span>
                                        <span style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '0.4s' }}></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="chat-input-container">
                            <input
                                value={text}
                                onChange={(e) => handleTyping(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Type your message..."
                                className="chat-input"
                                disabled={loadingHistory}
                            />
                            <button
                                onClick={handleSend}
                                className="send-button"
                                disabled={!text.trim() || loadingHistory}
                                aria-label="Send message"
                            >
                                <span className="send-icon">➤</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
