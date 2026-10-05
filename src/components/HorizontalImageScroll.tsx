import { Props } from "@/types/video.types";
import { Image } from "expo-image";
import { ChevronRight, Lock } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HorizontalImageScroll({
  data = [],
  width = 140,
  height = 220,
  name,
  slug,
  button = false,
  onViewMore,
  loading = false,
}: Props) {
  const skeletonItems = Array.from({ length: 10 });

  return (
    <View className="mb-4">
      {/* Header */}
      {name && (
        <View className="flex-row items-center justify-between px-4 py-4">
          {loading ? (
            <View className="h-6 w-32 rounded-md bg-zinc-950" />
          ) : (
            <View className="flex-row items-center gap-2">
              <Text className="text-[18px] font-semibold text-white">
                {name}
              </Text>
            </View>
          )}

          {button && (
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={loading}
              onPress={() => {}}
              className="flex-row items-center rounded-full bg-zinc-800 px-3 py-1.5"
            >
              {loading ? (
                <View className="h-4 w-14 rounded bg-zinc-700" />
              ) : (
                <>
                  <Text className="text-sm font-medium text-white">
                    View all
                  </Text>

                  <ChevronRight size={16} color="white" />
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Horizontal videos */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 16,
          paddingRight: 8,
        }}
      >
        {loading
          ? skeletonItems.map((_, index) => (
              <View
                key={`skeleton-${index}`}
                style={{
                  width,
                  height,
                  marginRight: 8,
                  borderRadius: 14,
                }}
                className="overflow-hidden bg-zinc-800"
              >
                {/* Skeleton highlight */}
                <View className="absolute inset-0 bg-zinc-700/40" />
              </View>
            ))
          : (Array.isArray(data) ? data : []).map((item) => (
              <TouchableOpacity
                key={item._id}
                activeOpacity={0.85}
                onPress={() => {}}
                style={{
                  width,
                  height,
                  marginRight: 8,
                  borderRadius: 14,
                  overflow: "hidden",
                }}
                className="border border-white/30 relative"
              >
                <Image
                  source={item.thumbnail}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={200}
                  placeholder={{
                    blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
                  }}
                />

                {item.isLocked && (
                  <View className="absolute top-0 right-0 p-2 bg-gray-100 rounded-bl-lg">
                    <Text>
                      <Lock color={"black"} size={14} />
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
      </ScrollView>
    </View>
  );
}
