"use client";

import SafeView from "@/components/SafeView";
import { ThemedText } from "@/components/themed-text";
import { router } from "expo-router";
import { Pressable, View } from "react-native";

const Storage = () => {
  return (
    <SafeView>
      <View className="space-y-6">
        <Pressable
          onPress={() => router.push("/payment-success")}
          className="py-4 px-4 rounded-xl bg-green-600"
        >
          <ThemedText>Payment Success</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => router.push("/payment-failed")}
          className="py-4 px-4 rounded-xl bg-red-600"
        >
          <ThemedText>Payment Failed</ThemedText>
        </Pressable>

        <Pressable
          onPress={() => router.push("/plan")}
          className="py-4 px-12 bg-blue-700"
        >
          <ThemedText>plan</ThemedText>
        </Pressable>
      </View>
    </SafeView>
  );
};

export default Storage;
