import SafeView from "@/components/SafeView";
import { router } from "expo-router";
import {
    BookOpen,
    Check,
    ChevronLeft,
    Crown,
    FileQuestion,
    MessageCircleQuestion,
    ScrollText,
    Video,
} from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

const ORIGINAL_PRICE = 199;
const PRICE = 99;
const DISCOUNT = Math.round(((ORIGINAL_PRICE - PRICE) / ORIGINAL_PRICE) * 100); // 50

const FEATURES = [
  {
    icon: Video,
    title: "Video Lectures",
    sub: "Learn law concepts in simple language",
  },
  {
    icon: BookOpen,
    title: "Study Notes",
    sub: "Short, exam-ready notes for every topic",
  },
  {
    icon: ScrollText,
    title: "Bare Acts & Case Laws",
    sub: "Quick access to important sections",
  },
  {
    icon: FileQuestion,
    title: "Mock Tests & PYQs",
    sub: "Practice with previous year questions",
  },
  {
    icon: MessageCircleQuestion,
    title: "Doubt Support",
    sub: "Get your doubts solved fast",
  },
];

type Props = {
  period?: string; // e.g. "month", "year"
  loading?: boolean;
  onSubscribe?: () => void;
};

export default function PremiumPlan({
  period = "month",
  loading = false,
  onSubscribe,
}: Props) {
  return (
    <SafeView tabBarInset={false} backgroundColor="#09090B">
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="pt-6 pb-4">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-zinc-900"
          >
            <Text>
              <ChevronLeft size={22} color="#FFFFFF" />
            </Text>
          </Pressable>
        </View>

        {/* Hero */}
        <View className="items-center mt-2">
          <View className="w-20 h-20 rounded-3xl bg-yellow-500/10 items-center justify-center">
            <Crown size={40} color="#FACC15" />
          </View>
          <Text className="text-white text-3xl font-bold mt-5">Go Premium</Text>
          <Text className="text-zinc-500 text-sm mt-2 text-center px-6">
            Unlock complete law learning with Kanoon Jano
          </Text>
        </View>

        {/* Price Card */}
        <View className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-zinc-400 text-xs uppercase font-medium">
              Premium Plan
            </Text>
            <View className="px-3 py-1.5 rounded-full bg-green-500/10">
              <Text className="text-green-400 text-[10px] font-bold">
                {DISCOUNT}% OFF
              </Text>
            </View>
          </View>

          <View className="flex-row items-end mt-4">
            <Text className="text-white text-5xl font-bold">₹{PRICE}</Text>
            <Text className="text-zinc-500 text-base mb-2 ml-1">
              / {period}
            </Text>
          </View>

          <View className="flex-row items-center mt-2">
            <Text className="text-zinc-600 text-base line-through">
              ₹{ORIGINAL_PRICE}
            </Text>
            <Text className="text-green-400 text-sm font-semibold ml-3">
              You save ₹{ORIGINAL_PRICE - PRICE}
            </Text>
          </View>

          <View className="h-[1px] bg-zinc-800 my-5" />

          {/* Features */}
          {FEATURES.map(({ icon: Icon, title, sub }, i) => (
            <View
              key={title}
              className={`flex-row items-center ${i > 0 ? "mt-4" : ""}`}
            >
              <View className="w-10 h-10 rounded-xl bg-zinc-800 items-center justify-center">
                <Icon size={20} color="#A1A1AA" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-white text-sm font-semibold">
                  {title}
                </Text>
                <Text className="text-zinc-500 text-xs mt-0.5">{sub}</Text>
              </View>
              <Check size={18} color="#4ADE80" />
            </View>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          onPress={onSubscribe}
          disabled={loading}
          className="mt-6 h-14 rounded-2xl bg-white items-center justify-center"
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          <Text className="text-black font-bold text-base">
            {loading ? "Please wait..." : `Subscribe Now · ₹${PRICE}`}
          </Text>
        </Pressable>

        <Text className="text-zinc-600 text-xs text-center mt-4">
          Secure payment · Cancel anytime
        </Text>
      </ScrollView>
    </SafeView>
  );
}
