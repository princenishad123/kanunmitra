import SafeView from "@/components/SafeView";
import { ThemedText } from "@/components/themed-text";
import { DEMO_DATA, ScaleCarousel } from "@/components/ui/Carousel";
import { Navbar } from "@/components/ui/Navbar";
import { router } from "expo-router";
import { ChevronRight, ClipboardList } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <SafeView tabBarInset={false} bottomSafeArea={false}>
      <Navbar
        appName="Nova"
        userName="Rahul Sharma"
        avatar="https://i.pravatar.cc/150?img=12"
        unreadCount={3}
        onProfilePress={() => router.push("/profile")}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      >
        <ScaleCarousel data={DEMO_DATA} autoPlayMs={3500} />

        <View className="px-4 pt-2">
          <ThemedText type="default" className="text-lg font-bold text-white">
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

        <Pressable
          onPress={() => router.push("/login")}
          className="py-4 px-12 bg-blue-700"
        >
          <ThemedText>Login</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => router.push("/storage")}
          className="py-4 px-12 bg-red-700"
        >
          <ThemedText>Login</ThemedText>
        </Pressable>

        <ThemedText>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem
          tempora repudiandae eligendi provident facilis eius reiciendis atque,
          iusto mollitia quibusdam nemo ratione, recusandae omnis possimus.
          Autem doloribus, optio aperiam explicabo obcaecati deserunt quos
          officiis delectus? Nobis tempore doloribus sint adipisci vel enim
          nulla corrupti maiores? Explicabo praesentium quas quidem expedita
          cupiditate deleniti reiciendis! Qui et, optio unde perferendis
          excepturi impedit temporibus sequi voluptas quasi quis sunt
          repudiandae magnam iure doloribus quibusdam cumque debitis nobis iste
          quia ea hic! Ea, ducimus sapiente enim at magnam, omnis quasi, quo hic
          numquam dolore voluptatibus nobis. Animi id rem tempora ducimus odio
          commodi eum.
        </ThemedText>
      </ScrollView>
    </SafeView>
  );
}
