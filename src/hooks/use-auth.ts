import { authStorage } from "@/lib/auth.storage";
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthContextValue = {
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const accessToken = await authStorage.getAccessToken();
      const refreshToken = await authStorage.getRefreshToken();

      setIsAuthenticated(Boolean(accessToken && refreshToken));
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await checkAuth();
    })();
  }, [checkAuth]);

  const login = useCallback(
    async (accessToken: string, refreshToken: string) => {
      await authStorage.setTokens(accessToken, refreshToken);
      setIsAuthenticated(true);
    },
    [],
  );

  const logout = useCallback(async () => {
    await authStorage.clearTokens();
    setIsAuthenticated(false);
  }, []);

  const value = {
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
