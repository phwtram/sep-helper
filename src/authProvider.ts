import type { AuthProvider } from "@refinedev/core";
import { message } from "antd";
import { loginUser, logoutUser } from "@/services/authService";
import * as yup from "yup";


const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export const authProvider: AuthProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
    try {
     
      await loginSchema.validate({ email, password }, { abortEarly: false });


      const response = await loginUser(email, password);
      const { accessToken, role } = response.data;

      if (!accessToken) throw new Error("No access token received from server.");

   
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", role || "");
      localStorage.setItem("loginSuccess", "true");

      message.success("Login successful!");
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: any) {
      let errorMessage = "Invalid credentials";

 
      if (error.name === "ValidationError") {
        errorMessage = error.errors.join(", ");
      } else if (error.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
      return {
        success: false,
        error: {
          name: "Login Error",
          message: errorMessage,
        },
      };
    }
  },

  logout: async () => {
    logoutUser();
    message.success("Logged out successfully!");
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("Please log in first.");
      return {
        authenticated: false,
        error: {
          name: "Not Authenticated",
          message: "You must be logged in",
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
    return localStorage.getItem("role") || null;
  },

  getIdentity: async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    return token && role ? { token, role } : null;
  },

  onError: async (error: any) => {
    console.error(error);
    message.error(error?.message || "Something went wrong");
    return { error };
  },
};
