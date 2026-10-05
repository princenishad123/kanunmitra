import { useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { fetcher } from "@/lib/fetcher";
import { useInfiniteQuery } from "@tanstack/react-query";
import VideoCard from "./shared/VideoCard";

interface Video {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  views?: number;
  duration?: number;
  slug?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface VideoPageResponse {
  data?: {
    videos?: Video[];
    pagination?: Pagination;
  };
}

export default function VideosLayout() {
  const {
    data,
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["related"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetcher(`/video?page=${pageParam}&limit=16`) as Promise<VideoPageResponse>,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data?.pagination;
      return pagination?.hasNextPage
        ? (pagination.page ?? 1) + 1
        : undefined;
    },
  });

  const allVideos = useMemo(() => {
    const seenIds = new Set<string>();
    return (data?.pages ?? [])
      .flatMap((page) => page.data?.videos ?? [])
      .filter((video) => {
        if (seenIds.has(video._id)) return false;
        seenIds.add(video._id);
        return true;
      });
  }, [data?.pages]);

  // Load next page
  const handleLoadMore = useCallback(() => {
    if (isFetching || !hasNextPage) return;
    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetching]);

  // Initial loader
  if (isLoading && allVideos.length === 0) {
    return (
      <View className="items-center justify-center py-10">
        <ActivityIndicator size="small" color="#10b981" />
      </View>
    );
  }

  // Error
  if (error && allVideos.length === 0) {
    return (
      <View className="items-center justify-center py-10">
        <Text className="text-sm text-red-400">Failed to load videos</Text>
      </View>
    );
  }

  return (
    <View className="mt-6 px-4">
      {/* Header */}
      <View className="mb-4">
        <Text className="text-xl font-bold text-white">All Videos</Text>

        <Text className="mt-1 text-sm text-zinc-400">
          Explore all legal videos
        </Text>
      </View>

      <FlatList
        data={allVideos}
        keyExtractor={(item) => item._id}

        // ⭐ 2 columns
        numColumns={2}

        // Parent ScrollView ke andar hai
        scrollEnabled={false}

        showsVerticalScrollIndicator={false}

        // Space between columns
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 18,
        }}

        renderItem={({ item }) => (
          <View className="w-[48%]">
            <VideoCard video={item} />
          </View>
        )}

        // Infinite pagination
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}

        ListFooterComponent={
          <>
            {isFetchingNextPage && allVideos.length > 0 && (
              <View className="items-center py-5">
                <ActivityIndicator size="small" color="#10b981" />

                <Text className="mt-2 text-xs text-zinc-500">
                  Loading more videos...
                </Text>
              </View>
            )}

            {!isFetching && !hasNextPage && allVideos.length > 0 && (
              <View className="items-center py-5">
                <Text className="text-xs text-zinc-500">No more videos</Text>
              </View>
            )}
          </>
        }
      />
    </View>
  );
}
