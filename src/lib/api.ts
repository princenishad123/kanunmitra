import { create, type AxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

const baseURL = process.env.EXPO_PUBLIC_API_URL?.trim();

export const api = create({
  ...(baseURL ? { baseURL } : {}),
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});

// Attach access token to every request
api.interceptors.request.use(
  async (config) => {
    const accessToken = await SecureStore.getItemAsync("access_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Returns response data directly,
 * which can be used as a TanStack Query function.
 */
export async function getApiData<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await api.get<T>(url, config);

  return response.data;
}
