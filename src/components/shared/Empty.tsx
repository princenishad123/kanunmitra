import { router } from "expo-router";
import { ArrowLeft, VideoOff } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import SafeArea from "../SafeView";

interface EmptyInterface {
  name?: string;
}

export default function Empty({
  name = "We are adding more videos",
}: EmptyInterface) {
  return (
    <SafeArea>
      <View className="flex-1 px-4">
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="mt-4 h-10 w-10 items-center justify-center rounded-full bg-neutral-800"
        >
          <ArrowLeft size={20} color="white" />
        </Pressable>

        {/* Empty State */}
        <View className="flex-1 items-center justify-center">
          <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-neutral-800">
            <VideoOff size={26} color="#737373" />
          </View>

          <Text className="text-lg font-bold text-white">{name}</Text>

          <Text className="mt-2 text-center text-sm text-neutral-500">
            No related videos found.
          </Text>
        </View>
      </View>
    </SafeArea>
  );
}
