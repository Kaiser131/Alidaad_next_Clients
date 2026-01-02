import axios from "axios";
import React from 'react';
const axiosCommon = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL
});

const useAxiosCommon = () => {
    return axiosCommon;
};

export default useAxiosCommon;