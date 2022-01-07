import { API_URL } from "./App";
import { AuthProvider } from "@pankod/refine";
import axios from "axios";

export const TOKEN_KEY = "mw-auth";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    // Make a request to backend /auth/login endpoint using the API_URL and the credentials to get token
    // and store it in localStorage

    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });

    // if response has access_token property, store it in localStorage
    if (response.data.access_token) {
      localStorage.setItem(TOKEN_KEY, response.data.access_token);
      return Promise.resolve();
    }

    return Promise.reject("Invalid credentials");

    // fulfill the promise
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return Promise.resolve();
    }

    return Promise.reject({
      redirectPath: "",
    });
  },
  getPermissions: () => Promise.resolve(),
  getUserIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return Promise.reject();
    }
    // get user identity from backend /auth/me endpoint
    const user = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Promise.resolve(user.data);
  },
};
