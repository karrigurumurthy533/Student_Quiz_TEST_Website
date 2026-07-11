export const API_PATHS = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    LOGOUT: "/logout",
  },

  USERS: {
    GET_ALL_USERS: "/admin/users",
    GET_SINGLE_USER: (id) => `/admin/user/${id}`,
    DELETE_USER: (id) => `/admin/user/${id}`,
  },

  TESTS: {
    CREATE_TEST: "/admin/test/create",
    GET_ALL_TESTS: "/tests",
    GET_SINGLE_TEST: (id) => `/test/${id}`,
    DELETE_TEST: (id) => `/admin/test/${id}`,
    SUBMIT_TEST: (id) => `/test/${id}/submit`,
  },
   FILES: {
    UPLOAD_FILE: "/admin/file/upload",
    GET_ALL_FILES: "/files",
    GET_SINGLE_FILE: (id) => `/file/${id}`,
    DELETE_FILE: (id) => `/admin/file/${id}`,
    //DOWNLOAD_FILE: (id) => `/file/${id}/download`,
  },
};