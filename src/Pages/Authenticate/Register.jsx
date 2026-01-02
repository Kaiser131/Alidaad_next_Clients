import React, { useState, useEffect } from 'react';
import useAuth from '../../Hooks/Auth/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion as Motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Chrome, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';

const Register = () => {
    const router = useRouter();
    const { createUser, user, signInWithGoogle, setLoading, loading } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    // Password strength indicators
    const [passwordStrength, setPasswordStrength] = useState({
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
    });

    // Validate password strength
    useEffect(() => {
        setPasswordStrength({
            hasMinLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    }, [password]);

    // Validate form
    useEffect(() => {
        const isPasswordValid = password.length >= 6;
        const doPasswordsMatch = password === confirmPassword && password.length > 0;
        const isEmailValid = email.length > 0 && email.includes('@');

        setIsFormValid(isEmailValid && isPasswordValid && doPasswordsMatch);
    }, [email, password, confirmPassword]);

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            toast.error('Please fill in all fields correctly');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        try {
            await createUser(email, password);
            toast.success('Registration successful! Welcome aboard!');
            router.push('/');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                toast.error('This email is already registered. Please login instead.');
            } else if (error.code === 'auth/invalid-email') {
                toast.error('Invalid email format.');
            } else if (error.code === 'auth/weak-password') {
                toast.error('Password is too weak. Please use a stronger password.');
            } else {
                toast.error(error.message || 'An error occurred during registration.');
            }
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            toast.success('Welcome aboard!');
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
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
            {/* Animated background elements */}
            <Motion.div
                className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
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
                className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
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
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50">
                            <UserPlus className="w-10 h-10 text-white" />
                        </div>
                    </Motion.div>
                    <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-slate-400">Join Alidaad today</p>
                </Motion.div>

                {/* Form card */}
                <Motion.div
                    variants={itemVariants}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50"
                >
                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Email input */}
                        <Motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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

                            {/* Password strength indicators */}
                            {password.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        <CheckCircle2 className={`h-3.5 w-3.5 ${passwordStrength.hasMinLength ? 'text-green-400' : 'text-slate-600'}`} />
                                        <span className={passwordStrength.hasMinLength ? 'text-green-400' : 'text-slate-500'}>
                                            At least 8 characters
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <CheckCircle2 className={`h-3.5 w-3.5 ${passwordStrength.hasUpperCase && passwordStrength.hasLowerCase ? 'text-green-400' : 'text-slate-600'}`} />
                                        <span className={passwordStrength.hasUpperCase && passwordStrength.hasLowerCase ? 'text-green-400' : 'text-slate-500'}>
                                            Upper & lowercase letters
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <CheckCircle2 className={`h-3.5 w-3.5 ${passwordStrength.hasNumber ? 'text-green-400' : 'text-slate-600'}`} />
                                        <span className={passwordStrength.hasNumber ? 'text-green-400' : 'text-slate-500'}>
                                            Contains a number
                                        </span>
                                    </div>
                                </div>
                            )}
                        </Motion.div>

                        {/* Confirm Password input */}
                        <Motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {confirmPassword.length > 0 && password !== confirmPassword && (
                                <p className="mt-2 text-xs text-red-400">Passwords do not match</p>
                            )}
                            {confirmPassword.length > 0 && password === confirmPassword && (
                                <p className="mt-2 text-xs text-green-400 flex items-center gap-1">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Passwords match
                                </p>
                            )}
                        </Motion.div>

                        {/* Register button */}
                        <Motion.button
                            variants={itemVariants}
                            type="submit"
                            disabled={loading || !isFormValid}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-5 w-5" />
                                    <span>Create Account</span>
                                </>
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
                            <span>Sign up with Google</span>
                        </Motion.button>

                        {/* Login link */}
                        <Motion.div
                            variants={itemVariants}
                            className="text-center"
                        >
                            <p className="text-sm text-slate-400">
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                                >
                                    Sign in
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

export default Register;