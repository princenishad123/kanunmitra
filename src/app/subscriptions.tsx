import SafeView from "@/components/SafeView";
import SubscriptionCard from "@/components/ui/SubscriptionCard";
import { fetcher } from "@/lib/fetcher";
import { SubscriptionResponse } from "@/types/subscription.types";
import { formatDate } from "@/utils/fomatDate";
import { useInfiniteQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const PAGE_SIZE = 10;

const Separator = () => <View className="h-4" />;

const Header = () => (
  <View className="flex-row items-center pb-6 pt-4">
    <TouchableOpacity
      onPress={() => router.back()}
      activeOpacity={0.7}
      className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-zinc-900"
    >
      <ChevronLeft size={22} color="white" />
    </TouchableOpacity>

    <Text className="text-2xl text-white font-bold text-primary-500">
      Subscriptions history
    </Text>
  </View>
);

export default function Subscriptions() {
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: ["subscriptions"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetcher(
        `/subscription?page=${pageParam}&limit=${PAGE_SIZE}`,
      ) as Promise<SubscriptionResponse>,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.data?.pagination;
      return pagination?.hasNextPage ? pagination.page + 1 : undefined;
    },
  });

  // Flatten every loaded page into one list (and drop any accidental duplicates).
  const subscriptions = useMemo(() => {
    const all = data?.pages.flatMap((p) => p?.data?.subscriptions ?? []) ?? [];
    return Array.from(new Map(all.map((s) => [s._id, s])).values());
  }, [data]);

  /* Infinite scroll */
  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || isFetchNextPageError) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  /* Pull to refresh */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  /* Initial loading */
  if (isPending) {
    return (
      <SafeView>
        <View className="flex-1 px-4">
          <Header />
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#10B981" />
            <Text className="mt-3 text-sm text-neutral-500">
              Loading subscriptions...
            </Text>
          </View>
        </View>
      </SafeView>
    );
  }

  /* Initial error (nothing to show yet) */
  if (isError && subscriptions.length === 0) {
    return (
      <SafeView>
        <View className="flex-1 px-4">
          <Header />
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center text-base font-semibold text-white">
              Something went wrong
            </Text>
            <Text className="mt-2 text-center text-sm text-neutral-500">
              We couldn&apos;t load your subscription history.
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              activeOpacity={0.8}
              className="mt-5 rounded-xl bg-primary-500 px-6 py-3"
            >
              <Text className="font-semibold text-black">Try again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeView>
    );
  }

  return (
    <SafeView>
      <View className="flex-1 px-4">
        <Header />

        <FlatList
          data={subscriptions}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 18,
            paddingBottom: 30,
            flexGrow: subscriptions.length === 0 ? 1 : 0,
          }}
          ItemSeparatorComponent={Separator}
          renderItem={({ item }) => (
            <SubscriptionCard
              plan={item.plan}
              amount={String(item.amount)}
              startDate={formatDate(item.start_date)}
              endDate={formatDate(item.end_date)}
              status={item.status}
              paidOn={formatDate(item.createdAt)}
              transactionId={item.paymentId}
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#10B981"
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-6">
              <Text className="text-center text-lg font-semibold text-white">
                No subscriptions yet
              </Text>
              <Text className="mt-2 text-center text-sm text-neutral-500">
                Your subscription history will appear here.
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="items-center py-6">
                <ActivityIndicator size="small" color="#10B981" />
                <Text className="mt-2 text-xs text-neutral-500">
                  Loading more...
                </Text>
              </View>
            ) : isFetchNextPageError ? (
              <TouchableOpacity
                onPress={() => fetchNextPage()}
                activeOpacity={0.7}
                className="items-center py-6"
              >
                <Text className="text-sm text-neutral-400">
                  Couldn&apos;t load more. Tap to retry
                </Text>
              </TouchableOpacity>
            ) : null
          }
        />
      </View>
    </SafeView>
  );
}
