import { router } from "expo-router";
import { Clock3, Lock } from "lucide-react-native";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface Video {
  _id: string;
  title: string;
  thumbnail?: string;
  views?: number;
  duration?: number;
  slug?: string;
  isLocked?: boolean;
}

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Pressable
      className="overflow-hidden rounded-xl bg-zinc-900"
      onPress={() =>
        router.push({
          pathname: video.isLocked ? "/subscription" : "/watch/[id]",
          params: {
            id: video._id,
            slug: video.slug,
          },
        })
      }
    >
      {/* Thumbnail */}
      <View className="relative">
        <Image
          source={{
            uri: video.thumbnail,
          }}
          className="h-64 w-full"
          resizeMode="cover"
        />

        {video.isLocked && (
          <View className="absolute top-0 right-0 p-3 bg-white rounded-bl-2xl">
            <Text>
              <Lock color={"black"} size={14} />
            </Text>
          </View>
        )}
        {/* Duration */}
        {video.duration !== undefined && (
          <View className="absolute bottom-1.5 right-1.5 flex-row items-center rounded bg-black/80 px-1.5 py-1">
            <Clock3 size={10} color="white" />

            <Text className="ml-1 text-[10px] text-white">
              {formatDuration(video.duration)}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
