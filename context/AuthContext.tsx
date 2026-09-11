"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

interface RegisterData {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: any;
  role: string | null;
  loading: boolean;
  initializing: boolean;
  error: string;

  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // VERIFY SESSION ON LOAD/REFRESH
  // =========================
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        const res = await api.get("/me");

        setUser(res.data.user);
        setRole(res.data.role);

        // localStorage ko fresh, verified data se sync kar dein
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("role", res.data.role);
      } catch (err) {
        // Token invalid/expired/tampered - sab clear kar dein
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        setUser(null);
        setRole(null);
      } finally {
        setInitializing(false);
      }
    };

    verifySession();
  }, []);

  // =========================
  // REGISTER
  // =========================
  const register = async (data: RegisterData) => {
    setError("");
    setLoading(true);

    try {
      await api.post("/register", data);

      router.push("/check-email");   // 👈 pehle /login tha, ab yahan redirect
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Registration failed.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGIN
  // =========================
  const login = async (data: LoginData) => {
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/login", data);

      const {
        token,
        role: userRole,
        user: userData,
      } = res.data;

      // Save authentication data
      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);
      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      // Update React state
      setUser(userData);
      setRole(userRole);

      // Redirect according to role
      if (userRole === "admin") {
        router.push("/admin/dashboard");
      } else if (userRole === "doctor") {
        router.push("/doctor/dashboard");
      } else if (userRole === "patient") {
        router.push("/patient/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Login failed.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
    
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Remove authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      // Clear user state
      setUser(null);
      setRole(null);

      // Go to login
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        initializing,
        error,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}