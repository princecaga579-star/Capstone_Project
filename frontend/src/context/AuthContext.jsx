
import { createContext, useContext, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );

  async function login(email, password) {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    const newToken =
      response.data.token ?? response.data.access_token;
    const newUser = response.data.user;

    if (!newToken) {
      throw new Error("The API response did not include a token.");
    }

    localStorage.setItem("token", newToken);
    setToken(newToken);

    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
    }

    return response.data;
  }

  async function register(name, email, password, password_confirmation) {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      password_confirmation,
    });

    if (response.data.token || response.data.access_token) {
      const newToken =
        response.data.token ?? response.data.access_token;
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }

    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
    }

    return response.data;
  }

  async function logout() {
    try {
      if (token) {
        await axios.post(
          `${API_URL}/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch {
      // Clear local session even if the API logout request fails.
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
