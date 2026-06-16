import axios from "axios";

const authApi = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api") + "/auth",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default authApi;
