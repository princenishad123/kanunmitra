import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { getApiData } from "@/lib/api";

type ApiQueryOptions<TData> = Omit<
  UseQueryOptions<TData, Error, TData>,
  "queryKey" | "queryFn"
>;

export function useApiQuery<TData>(
  queryKey: QueryKey,
  url: string,
  options?: ApiQueryOptions<TData>,
) {
  return useQuery({
    ...options,
    queryKey,
    queryFn: () => getApiData<TData>(url),
  });
}
