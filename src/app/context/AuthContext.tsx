"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { User } from "../module/auth/domain/entities/user.entity";
import { api } from "../prisma/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  // Helper pour sauvegarder les tokens proprement
  const saveTokens = (
    accessToken: string,
    refreshToken?: string,
    userId?: string
  ) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", accessToken);
      if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
      if (userId) localStorage.setItem("user_id", userId);
    }
  };

  // ✅ CORRECTION : Adapter à la structure réelle de votre backend
  const login = async (email: string, password: string): Promise<User> => {
    try {
      const res = await api.post(`/auth/login`, { email, password });
     
      const { user, token } = res.data;
      const { access_token } = token;
      saveTokens(access_token, undefined, user.id);

      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erreur de connexion");
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
    }
    setUser(null);
    setIsAuthenticated(false);
  };
  const refreshUser = async () => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/auth/me`);
      if (isMounted.current) {
        setUser(res.data);
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      // ⚠️ Pour l'instant, pas de refresh automatique car pas de refresh_token
      if (error.response?.status === 401) {
        // console.error("Token expiré, veuillez vous reconnecter");
        if (isMounted.current) logout();
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };
  useEffect(() => {
    isMounted.current = true;
    refreshUser();
    return () => {
      isMounted.current = false;
    };
  }, []);
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, refreshUser }}
    >
      {!loading ? (
        children
      ) : (
        <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">
            Chargement de votre session...
          </p>
        </div>
      )}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};
