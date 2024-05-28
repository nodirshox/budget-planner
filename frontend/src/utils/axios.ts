import axios from "axios";

export interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/auth/refresh`,
    {
      refreshToken: refresh,
    }
  );

  const { token } = response.data;
  localStorage.setItem("token", token.access);
  localStorage.setItem("refresh", token.refresh);

  return token;
};

const AxiosClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API,
});

AxiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      try {
        const newToken = await refreshToken();
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        return AxiosClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default AxiosClient;
