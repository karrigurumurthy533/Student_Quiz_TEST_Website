import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// Create test
export const createTest = async (data) => {
    try {
        const response = await axiosInstance.post(
            API_PATHS.TESTS.CREATE_TEST,
            data
        );

        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "An Unknown error occurred" };
    }
};

// Get all tests
export const getAllTests = async () => {
    try {
        const response = await axiosInstance.get(
            API_PATHS.TESTS.GET_ALL_TESTS
        );

        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "An Unknown error occurred" };
    }
};

// Get single test
export const getTestById = async (id) => {
    try {
        const response = await axiosInstance.get(
            API_PATHS.TESTS.GET_SINGLE_TEST(id)
        );

        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "An Unknown error occurred" };
    }
};

// Delete test
export const deleteTest = async (id) => {
    try {
        const response = await axiosInstance.delete(
            API_PATHS.TESTS.DELETE_TEST(id)
        );

        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "An Unknown error occurred" };
    }
};

export const submitTest = async (id, data) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.TESTS.SUBMIT_TEST(id),
      data   // ✅ direct ga pampu
    );

    return response.data;
  } catch (error) {
    throw error?.response?.data || { message: "An Unknown error occurred" };
  }
};

// Export service object
const testService = {
    createTest,
    getAllTests,
    getTestById,
    deleteTest,
    submitTest,
};

export default testService;