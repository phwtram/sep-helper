import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
  } from "axios";
  import { jwtDecode } from "jwt-decode";
  import toast from "react-hot-toast";
  import { Dispatch } from "redux";
  import store from "@/lib/redux/store";
  import { clearCurrentUser, setCurrentUser } from "@/lib/redux/userSlice";
  
  export const BASE_URL = "https://api.outfit4rent.online";
  
  export const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  let isRefreshing = false;
  let failedQueue: any[] = [];
  
  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
  
    failedQueue = [];
  };
  
  const renewToken = async (refreshToken: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/refresh-token`, {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error("Error renewing token:", error);
      return null;
    }
  };
  
  axiosClient.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {
      const token = localStorage.getItem("token");
  
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
  
  axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axiosClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
  
        originalRequest._retry = true;
        isRefreshing = true;
  
        const refreshToken = localStorage.getItem("refreshToken");
  
        if (!refreshToken) {
          store.dispatch(clearCurrentUser());
          toast.error("Session expired. Please log in again.");
          window.location.href = "/login";
          return Promise.reject(error);
        }
  
        try {
          const newTokens = await renewToken(refreshToken);
          if (newTokens) {
            localStorage.setItem("token", newTokens.token);
            localStorage.setItem("refreshToken", newTokens.refreshToken);
            store.dispatch(setCurrentUser(jwtDecode(newTokens.token)));
            processQueue(null, newTokens.token);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newTokens.token}`;
            }
            return axiosClient(originalRequest);
          } else {
            processQueue(error, null);
            store.dispatch(clearCurrentUser());
            toast.error("Session expired. Please log in again.");
            window.location.href = "/login";
            return Promise.reject(error);
          }
        } catch (err) {
          processQueue(err, null);
          store.dispatch(clearCurrentUser());
          toast.error("Session expired. Please log in again.");
          window.location.href = "/login";
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
  
      return Promise.reject(error);
    }
  );
  