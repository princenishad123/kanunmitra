import SafeView from "@/components/SafeView";
import { ThemedText } from "@/components/themed-text";
import { DEMO_DATA, ScaleCarousel } from "@/components/ui/Carousel";
import { Navbar } from "@/components/ui/Navbar";
import { router } from "expo-router";
import { ChevronRight, ClipboardList } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <SafeView>
      <Navbar
        appName="Nova"
        userName="Rahul Sharma"
        avatar="https://i.pravatar.cc/150?img=12"
        unreadCount={3}
        onProfilePress={() => router.push("/profile")}
      />

      <ScrollView
        className=" border border-red-500  "

        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <ScaleCarousel data={DEMO_DATA} autoPlayMs={3500} />

        <View className="px-4 pt-4">
          <ThemedText type="subtitle" className="text-white">
            Hello, welcome
          </ThemedText>
          <ThemedText className="mt-1 text-zinc-400">
            Get support for your legal needs.
          </ThemedText>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/orders")}
          className="mx-4 mt-5 flex-row items-center rounded-2xl border border-zinc-800 bg-zinc-900 p-4 active:opacity-80"
        >
          <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl bg-zinc-800">
            <ClipboardList size={21} color="#FACC15" />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-white">My orders</Text>
            <Text className="mt-1 text-xs text-zinc-400">
              Track your legal service requests
            </Text>
          </View>
          <ChevronRight size={18} color="#A1A1AA" />
        </Pressable>

        <ThemedText>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
          reiciendis voluptate accusamus ullam dicta magnam placeat mollitia
          numquam. Hic odit repellendus debitis, similique id harum, sint sit
        </ThemedText>
      </ScrollView>
    </SafeView>
  );
}
