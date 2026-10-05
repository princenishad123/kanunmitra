import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
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

export default function VideosLayout() {
  const [page, setPage] = useState(1);

  const [allVideos, setAllVideos] = useState<Video[]>([]);

  const [hasNextPage, setHasNextPage] = useState(true);

  const { data, error, isLoading } = useSWR(
    `/video?page=${page}&limit=16`,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  // New page data
  useEffect(() => {
    if (!data?.data) return;

    const newVideos: Video[] = data.data.videos ?? [];

    const pagination: Pagination = data.data.pagination;

    setAllVideos((prev) => {
      const existingIds = new Set(prev.map((video) => video._id));

      const uniqueVideos = newVideos.filter(
        (video) => !existingIds.has(video._id),
      );

      return [...prev, ...uniqueVideos];
    });

    setHasNextPage(pagination.hasNextPage);
  }, [data]);

  // Load next page
  const handleLoadMore = useCallback(() => {
    if (isLoading) return;

    if (!hasNextPage) return;

    setPage((prev) => prev + 1);
  }, [isLoading, hasNextPage]);

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
            {isLoading && allVideos.length > 0 && (
              <View className="items-center py-5">
                <ActivityIndicator size="small" color="#10b981" />

                <Text className="mt-2 text-xs text-zinc-500">
                  Loading more videos...
                </Text>
              </View>
            )}

            {!isLoading && !hasNextPage && allVideos.length > 0 && (
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
