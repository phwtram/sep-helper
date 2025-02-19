import type { AuthProvider } from "@refinedev/core";
import { notification } from "antd";
import { loginUser, registerUser, logoutUser } from "@/services/authService";
export const authProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
    if (!email || !password) {
      return {
        success: false,
        error: {
          name: "Validation Error",
          message: "Email and password are required.",
        },
      };
    }

    try {
      const response = await loginUser(email, password);

      if (response.token) {
        localStorage.setItem("token", response.token);
        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: {
          name: "Login Error",
          message: "Invalid credentials",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "Login Error",
          message: error.message || "Invalid credentials",
        },
      };
    }
  },

  register: async ({ email, password }: { email: string; password: string }) => {
    if (!email || !password) {
      return {
        success: false,
        error: {
          name: "Validation Error",
          message: "Email and password are required.",
        },
      };
    }

    try {
      const response = await registerUser(email, password);

      if (response.token) {
        localStorage.setItem("token", response.token);
        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: {
          name: "Register Error",
          message: "Registration failed",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "Register Error",
          message: error.message || "Registration failed",
        },
      };
    }
  },

  logout: async (p0: {}) => {
    logoutUser();
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        authenticated: false,
        error: {
          name: "Token Not Found",
          message: "Token not found",
        },
        logout: true,
        redirectTo: "/login",
      };
    }

    return {
      authenticated: true,
    };
  },

  getPermissions: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    return null;
  },

  getIdentity: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    return null;
  },

  onError: async (error: any) => {
    console.error(error);
    return { error };
  },
};
