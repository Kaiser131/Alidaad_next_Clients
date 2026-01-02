'use client';

import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";


import axios from "axios";
import auth from "../firebase/firebase.config";

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchbarOpen, setSearchbarOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [color, setColor] = useState("");
    const [sizes, setSizes] = useState("");
    const [quantity, setQuantity] = useState(1);

    // Load from localStorage after mount to avoid hydration mismatch
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedColor = localStorage.getItem("color");
            const savedSizes = localStorage.getItem("sizes");
            const savedQuantity = localStorage.getItem("quantity");

            if (savedColor) setColor(savedColor);
            if (savedSizes) setSizes(savedSizes);
            if (savedQuantity) setQuantity(parseInt(savedQuantity, 10));
        }
    }, []);

    // Save product selections to localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (color) localStorage.setItem("color", color);
            if (sizes) localStorage.setItem("sizes", sizes);
            if (quantity) localStorage.setItem("quantity", quantity.toString());
        }
    }, [color, sizes, quantity]);

    // set unique token for the cart
    const [cartToken, setCartTokenState] = useState(null);

    const generateUUID = () => {
        // Fallback for browsers that don't support crypto.randomUUID
        if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
            return window.crypto.randomUUID();
        }
        // Fallback UUID generator
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const setCartToken = (token) => {
        if (typeof window !== "undefined") {
            localStorage.setItem('cartToken', token);
            setCartTokenState(token);
        }
    };

    const getCartToken = () => {
        return typeof window !== "undefined" ? localStorage.getItem('cartToken') : null;
    };

    // Initialize cartToken from localStorage on client-side
    useEffect(() => {
        const token = getCartToken();
        if (!token) {
            const newToken = generateUUID();
            setCartToken(newToken);
        } else {
            setCartTokenState(token);
        }
    }, []);




    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };


    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    // save users data
    const saveUser = async (user) => {
        const currentUser = {
            image: user?.photoURL,
            email: user?.email,
            status: "verified",
            role: 'user',
            name: user?.displayName,
            createdAt: new Date().toISOString()
        };
        const { data } = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`, currentUser);
        // console.log(data);
        return data;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            // console.log('stateUser', currentUser);
            if (currentUser) {
                saveUser(currentUser);
            }
            setLoading(false);
        });

        return () => {
            return unsubscribe();
        };

    }, []);


    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };



    const authInfo = {
        user, loading, setLoading, createUser, login, signInWithGoogle, logOut, cartToken, color, setColor, quantity, setQuantity, searchbarOpen, setSearchbarOpen, cartOpen, setCartOpen, sizes, setSizes
        // saveUser
    };



    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
