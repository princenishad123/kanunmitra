import { Clock3, Lock } from "lucide-react-native";
import { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

import { useRefresh } from "@/hooks/useRefresh";
import { fetcher } from "@/lib/fetcher";
import { useInfiniteQuery } from "@tanstack/react-query";
import Empty from "./shared/Empty";

type Video = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  src: string;
  category: string;
  language: string;
  views: number;
  duration: number;
  type: string;
  isFree: boolean;
  isPublished: boolean;
  slug: string;
  isLocked?: boolean;
};

type VideoResponse = {
  statusCode: number;
  data: {
    videos: Video[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  message: string;
};

interface RelatedVideoProps {
  slug: string;
  currentVideoId?: string;
  onVideoPress?: (id: string, isLocked?: boolean) => void;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

function RelatedVideoSkeleton() {
  return (
    <View className="mb-4 flex-row">
      {/* Thumbnail skeleton */}
      <View className="h-[95px] w-[145px] rounded-xl bg-neutral-800" />

      {/* Content skeleton */}
      <View className="ml-3 flex-1">
        <View className="h-4 w-[90%] rounded bg-neutral-800" />

        <View className="mt-2 h-3 w-[75%] rounded bg-neutral-800" />

        <View className="mt-2 h-3 w-[55%] rounded bg-neutral-800" />

        <View className="mt-3 h-5 w-16 rounded-md bg-neutral-800" />
      </View>
    </View>
  );
}

function RelatedVideoSkeletonList() {
  return (
    <View className="mt-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <RelatedVideoSkeleton key={index} />
      ))}
    </View>
  );
}

export default function RelatedVideo({
  slug,
  onVideoPress,
  currentVideoId,
}: RelatedVideoProps) {
  const {
    data,
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["relatedvideo", slug],
    initialPageParam: 1,
    enabled: Boolean(slug),
    queryFn: ({ pageParam }) =>
      fetcher(
        `/video?search=${encodeURIComponent(slug)}&page=${pageParam}&limit=10`,
      ) as Promise<VideoResponse>,
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.hasNextPage
        ? lastPage.data.pagination.page + 1
        : undefined,
  });

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const { refresh, refreshing } = useRefresh(handleRefresh);

  const videos = useMemo(() => {
    const seenIds = new Set<string>();
    return (data?.pages ?? [])
      .flatMap((page) => page.data.videos)
      .filter((video) => {
        if (seenIds.has(video._id)) return false;
        seenIds.add(video._id);
        return true;
      });
  }, [data?.pages]);

  const handleLoadMore = useCallback(() => {
    if (isFetching || !hasNextPage) return;
    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetching]);

  if (!slug) {
    return null;
  }

  /*
   * Initial loading — only when we truly have nothing to show.
   * With `keepPreviousData` SWR returns cached data instantly on revisit,
   * so `isLoading` can be true while `data` is already present. Don't
   * flash skeletons / empty state in that case.
   */
  if (
    refreshing ||
    (isLoading && videos.length === 0)
  ) {
    return (
      <View className="mt-6">
        <Text className="text-lg font-bold text-white">Related Videos</Text>

        <RelatedVideoSkeletonList />
      </View>
    );
  }

  /*
   * Error
   */
  if (error) {
    return (
      <View className="mt-6">
        <Text className="text-lg font-bold text-white">Related Videos</Text>

        <Text className="mt-4 text-sm text-neutral-500">
          Unable to load related videos.
        </Text>
      </View>
    );
  }

  /*
   * Empty — only after loading finished, no error, and SWR actually
   * returned (empty) data. Otherwise a revisit would briefly show
   * "No related videos found" while SWR revalidates the cached key.
   */
  if (!videos.length && !isLoading && !error && data?.pages.length) {
    return <Empty />;
  }

  return (
    <View className="flex-1 px-4">
      {/* Header */}
      <View className="mb-4">
        <Text className="text-xl font-bold text-white">Related videos</Text>

        <Text className="mt-1 text-xs text-neutral-500">
          More videos you may like
        </Text>
      </View>

      {/* Videos */}
      <FlatList
        data={videos}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#000"
          />
        }
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onVideoPress?.(item._id, item.isLocked)}
            className="mb-4 flex-row"
          >
            {/* Thumbnail */}
            <View className="relative h-[82px] w-[90px] overflow-hidden rounded-xl bg-neutral-900">
              <Image
                source={{ uri: item.thumbnail }}
                className="h-full w-full"
                resizeMode="cover"
              />

              {item.isLocked && (
                <View className="absolute top-0 right-0 p-2 bg-white rounded-bl-2xl">
                  <Text>
                    <Lock color={"black"} size={12} />
                  </Text>
                </View>
              )}

              {/* Currently playing */}
              {currentVideoId === item._id && (
                <>
                  {/* Dark overlay */}
                  <View className="absolute inset-0 bg-black/55" />

                  {/* Playing badge */}
                  <View className="absolute inset-0 items-center justify-center">
                    <View className="flex-row items-center rounded-full bg-emerald-500 px-2.5 py-1">
                      <View className="mr-1.5 h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-white" />

                      <Text className="text-[9px] font-bold text-white">
                        PLAYING
                      </Text>
                    </View>
                  </View>
                </>
              )}

              {/* Normal overlay */}
              {currentVideoId !== item._id && (
                <View className="absolute bottom-0 left-0 right-0 h-7 bg-black/30" />
              )}

              {/* Duration */}
              {currentVideoId !== item._id && (
                <View className="absolute bottom-1 right-1 flex-row items-center rounded bg-black/85 px-1.5 py-0.5">
                  <Clock3 size={9} color="white" />

                  <Text className="ml-1 text-[9px] font-semibold text-white">
                    {formatDuration(item.duration)}
                  </Text>
                </View>
              )}
            </View>

            {/* Content */}
            <View className="ml-3 flex-1">
              <Text
                numberOfLines={2}
                className="text-[14px] font-bold leading-[18px] text-white"
              >
                {item.title}
              </Text>

              <Text
                numberOfLines={2}
                className="mt-1 text-[11px] leading-[15px] text-neutral-400"
              >
                {item.description}
              </Text>
            </View>
          </Pressable>
        )}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="items-center py-5">
              <ActivityIndicator size="small" color="#10b981" />

              <Text className="mt-2 text-xs text-neutral-500">
                Loading more videos...
              </Text>
            </View>
          ) : !hasNextPage ? (
            <View className="items-center py-5">
              <Text className="text-xs text-neutral-600">No more videos</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
