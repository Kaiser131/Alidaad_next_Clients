import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Axios/useAxiosSecure";
import useAuth from "../Auth/useAuth";

const useRole = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data, isLoading: roleLoading } = useQuery({
        queryKey: ['userRole', user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/users/${user?.email}`);
            return data;
        },
        enabled: !!user?.email,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
        retry: 1, // Only retry once on failure
    });

    return {
        role: data?.role,
        roleLoading,
        userData: data,
    };
};

export default useRole;