import { useContext } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import React from 'react';

const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
};

export default useAuth;