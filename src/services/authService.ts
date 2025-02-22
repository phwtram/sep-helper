const API_URL = "https://api.outfit4rent.online/api";

interface LoginResponse {
  token(arg0: string, token: any): unknown;
  status: number;
  message: string;
  data: {
    token: { accessToken: string; role: string; };
    accessToken: string;
    role: string;
  };
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.status !== 200) {
      throw new Error(data.message || "Login failed");
    }

    if (!data.data?.accessToken) {
      throw new Error("Invalid token received");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Login failed. Please try again.");
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};