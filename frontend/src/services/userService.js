import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// Get all users
export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get(
            API_PATHS.USERS.GET_ALL_USERS
        );

        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "An Unknown error occurred" };
    }
};

// Get single user
export const getSingleUser = async (id) => {
    try {
        const response = await axiosInstance.get(
            API_PATHS.USERS.GET_SINGLE_USER(id)
        );

        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "An Unknown error occurred" };
    }
};

// Delete user
export const deleteUser = async (id) => {
    try {
        const response = await axiosInstance.delete(
            API_PATHS.USERS.DELETE_USER(id)
        );

        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "An Unknown error occurred" };
    }
};

// Export service object
const userService = {
    getAllUsers,
    getSingleUser,
    deleteUser,
};

export default userService;