"use client";
import React, { createContext, useState, useEffect } from "react";
import { login, playerLogin, playerSignUp } from "../lib/api/auth";
import { User } from "../types/types";
import { Player } from "../types/types";

type AuthContextType = {
  user: User | null;
  player: Player | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  handleLogin: (email: string, password: string) => Promise<void>;
  handlePlayerLogin: (email: string, code: number) => Promise<void>;
  handlePlayerSignUp: (name: string, email: string) => Promise<void>;
  handleLogout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedPlayer = localStorage.getItem("player");

    try {
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (token && storedPlayer) {
        setPlayer(JSON.parse(storedPlayer));
      }
    } catch (error) {
      console.error("Failed to restore authentication:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("player");

      document.cookie = "token=; path=/; max-age=0";

      setUser(null);
      setPlayer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePlayerLogin = async (email: string, code: number) => {
    const data = await playerLogin(email, code);

    localStorage.setItem("token", data.token);
    localStorage.setItem("player", JSON.stringify(data.player));

    document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 3}; SameSite=Strict`;

    setPlayer(data.player);
  };

  const handlePlayerSignUp = async (
    name: string,
    email: string,
  ): Promise<void> => {
    try {
      const data = await playerSignUp(name, email);

      localStorage.setItem("token", data.token);
      localStorage.setItem("player", JSON.stringify(data.player));

      document.cookie = `token=${data.token}; path=/; max-age=${
        60 * 60 * 24 * 3
      }; SameSite=Strict`;

      setPlayer(data.player);
    } catch (error) {
      console.error("Player signup failed:", error);
      throw error;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const data = await login(email, password);

    console.log("Login response:", data);
    console.log("User from backend:", data.user);

    // Store in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Store token in cookie for server-side middleware
    document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;

    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Remove cookie
    document.cookie = "token=; path=/; max-age=0";

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        handleLogin,
        handleLogout,
        loading,
        player,
        handlePlayerLogin,
        handlePlayerSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
