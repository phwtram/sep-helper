export const API_URL = "https://api.outfit4rent.online/api/auth/login"; // Cập nhật URL API của bạn

export const fetchAPI = async (endpoint: string, method = "GET", body?: any, token?: string) => {
  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};
