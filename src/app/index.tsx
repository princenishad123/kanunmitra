import SafeView from "@/components/SafeView";
import { ThemedText } from "@/components/themed-text";
import { DEMO_DATA, ScaleCarousel } from "@/components/ui/Carousel";
import { Navbar } from "@/components/ui/Navbar";
import { router } from "expo-router";
import { Pressable, View } from "react-native";

export default function index() {
  return (
    <SafeView>
      <Navbar
        appName="Nova"
        userName="Rahul Sharma"
        avatar="https://i.pravatar.cc/150?img=12"
        unreadCount={3}
        onProfilePress={() => router.push("/profile")}
      />
      <View>
        <ScaleCarousel data={DEMO_DATA} autoPlayMs={3500} />
        <ThemedText className="text-white">
          Hello welcome to home screen
        </ThemedText>

        <Pressable onPress={() => router.push("/profile")}>
          <ThemedText>Profile</ThemedText>
        </Pressable>
      </View>
    </SafeView>
  );
}
