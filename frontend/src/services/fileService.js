import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// ================= CREATE FILE =================
export const createFile = async (formData) => {
    try {
        const response = await axiosInstance.post(
            API_PATHS.FILES.CREATE_FILE,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Create File Error:", error);
        throw error;
    }
};

// ================= GET ALL FILES =================
export const getAllFiles = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.FILES.GET_ALL_FILES);

        return response.data;
    } catch (error) {
        console.error("Get Files Error:", error);
        throw error;
    }
};

// ================= GET SINGLE FILE =================
export const getSingleFile = async (id) => {
    try {
        const response = await axiosInstance.get(
            API_PATHS.FILES.GET_SINGLE_FILE(id)
        );

        return response.data;
    } catch (error) {
        console.error("Get File Error:", error);
        throw error;
    }
};

// ================= DELETE FILE =================
export const deleteFile = async (id) => {
    try {
        const response = await axiosInstance.delete(
            API_PATHS.FILES.DELETE_FILE(id)
        );

        return response.data;
    } catch (error) {
        console.error("Delete File Error:", error);
        throw error;
    }
};
const fileService = {
    createFile,
    getAllFiles,
    getSingleFile,
    deleteFile,
};

export default fileService;