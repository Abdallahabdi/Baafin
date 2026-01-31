import axios from "axios";

const API = axios.create({
  // ✅ Tani waxay si toos ah u akhrinaysaa link-ga Render ee aad Vercel gelisay
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// 👉 KU DAR INTERCEPTOR-KAN
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;