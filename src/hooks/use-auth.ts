import { authStorage } from "@/lib/auth.storage";
import { useCallback, useEffect, useState } from "react";

export function useAuth() {
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

  return {
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
}
