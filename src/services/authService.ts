const API_URL = "https://api.outfit4rent.online/api";

// 🟢 Hàm đăng nhập
export const loginUser = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
  
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Incorrect email or password.");
      }
  
      return response.json();
    } catch (error) {
      throw new Error("Incorrect email or password.");
    }
  };
  

// 🟢 Hàm đăng ký
export const registerUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed.");
    }

    return response.json();
  } catch (error) {
    throw new Error("Registration failed. Please try again.");
  }
};

// 🟢 Hàm đăng xuất
export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const authProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
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

  logout: async () => {
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

    // Token exists, consider user authenticated
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

    try {
      // You can implement getUserProfile here if needed
      return null;
    } catch (error) {
      return null;
    }
  },

  onError: async (error: any) => {
    console.error(error);
    return { error };
  },
};