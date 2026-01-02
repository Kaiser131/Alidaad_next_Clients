import axios from "axios";
import React from 'react';
const axiosSecure = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    withCredentials: true
});

const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;