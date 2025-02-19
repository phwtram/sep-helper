import { fetchAPI } from "./api";

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return await fetchAPI("/auth/profile", "GET", undefined, token);
};
