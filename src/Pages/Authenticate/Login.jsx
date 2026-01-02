"use client";

import React, { useState, useEffect } from 'react';
import useAuth from '../../Hooks/Auth/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion as Motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Chrome, Loader2 } from 'lucide-react';

const Login = () => {
    const router = useRouter();
    const { login, user, signInWithGoogle, setLoading, loading } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    // Validate form
    useEffect(() => {
        setIsFormValid(email.length > 0 && password.length >= 6);
    }, [email, password]);

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            toast.error('Please fill in all fields correctly');
            return;
        }

        try {
            await login(email, password);
            toast.success('Welcome back!');
            router.push('/');
        } catch (error) {
            if (error.code === 'auth/invalid-credential') {
                toast.error('Password or Email not matched');
            } else if (error.code === 'auth/wrong-password') {
                toast.error('Incorrect password. Please check and try again.');
            } else if (error.code === 'auth/invalid-email') {
                toast.error('Invalid email format.');
            } else if (error.code === 'auth/user-disabled') {
                toast.error('This account has been disabled.');
            } else if (error.code === 'auth/user-not-found') {
                toast.error('User not found. Please check your email.');
            } else if (error.code === 'auth/too-many-requests') {
                toast.error('Too many unsuccessful login attempts. Try again later.');
            } else {
                toast.error(error.message || 'An unknown error occurred.');
            }
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            toast.success('Welcome back!');
            router.push('/');
        } catch (err) {
            toast.error(err.message || 'Failed to sign in with Google');
            setLoading(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' }
        }
    };

    const floatingAnimation = {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Animated background elements */}
            <Motion.div
                className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />
            <Motion.div
                className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />

            {/* Main container */}
            <Motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-md mx-4"
            >
                {/* Logo section */}
                <Motion.div
                    variants={itemVariants}
                    className="text-center mb-8"
                >
                    <Motion.div
                        animate={floatingAnimation}
                        className="inline-block mb-4"
                    >
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
                            <span className="text-3xl font-bold text-white">AL</span>
                        </div>
                    </Motion.div>
                    <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to continue to Alidaad</p>
                </Motion.div>

                {/* Form card */}
                <Motion.div
                    variants={itemVariants}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50"
                >
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email input */}
                        <Motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                />
                            </div>
                        </Motion.div>

                        {/* Password input */}
                        <Motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </Motion.div>

                        {/* Sign in button */}
                        <Motion.button
                            variants={itemVariants}
                            type="submit"
                            disabled={loading || !isFormValid}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </Motion.button>

                        {/* Divider */}
                        <Motion.div variants={itemVariants} className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-slate-800/50 text-slate-400">Or continue with</span>
                            </div>
                        </Motion.div>

                        {/* Google sign in button */}
                        <Motion.button
                            variants={itemVariants}
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3.5 bg-slate-900/50 border border-slate-700 text-white font-semibold rounded-xl hover:bg-slate-900 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            <Chrome className="h-5 w-5" />
                            <span>Sign in with Google</span>
                        </Motion.button>

                        {/* Register link */}
                        <Motion.div
                            variants={itemVariants}
                            className="text-center"
                        >
                            <p className="text-sm text-slate-400">
                                Don't have an account?{' '}
                                <Link
                                    href="/register"
                                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                >
                                    Create account
                                </Link>
                            </p>
                        </Motion.div>
                    </form>
                </Motion.div>

                {/* Footer text */}
                <Motion.p
                    variants={itemVariants}
                    className="text-center text-slate-500 text-sm mt-8"
                >
                    © 2025 Alidaad. All rights reserved.
                </Motion.p>
            </Motion.div>
        </div>
    );
};

export default Login;