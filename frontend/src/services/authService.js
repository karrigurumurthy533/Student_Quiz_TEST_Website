import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// Login user
export const login = async (email, password) => {
    try {
        const response = await axiosInstance.post(
            API_PATHS.AUTH.LOGIN,
            {
                email,
                password,
            }
        );

        const res = response.data;

        // Save token if returned
        const token = res?.token;
        if (token) {
            localStorage.setItem("token", token);
        }

        return res;
    } catch (error) {
        throw error?.response?.data || { message: "An Unknown error occurred" };
    }
};

// Register user
export const register = async (name, email, password) => {
    try {
        const response = await axiosInstance.post(
            API_PATHS.AUTH.REGISTER,
            {
                name,
                email,
                password,
            }
        );

        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "An Unknown error occurred" };
    }
};

// Export as service object
const authService = {
    login,
    register,
};

export default authService;