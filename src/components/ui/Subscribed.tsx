import SafeView from "@/components/SafeView";
import { router } from "expo-router";
import {
    BookOpen,
    CalendarDays,
    Check,
    ChevronLeft,
    Crown,
    FileQuestion,
    MessageCircleQuestion,
    ScrollText,
    Video,
} from "lucide-react-native";
import moment from "moment";
import { Pressable, ScrollView, Text, View } from "react-native";

const BENEFITS = [
  { icon: Video, title: "Video Lectures" },
  { icon: BookOpen, title: "Study Notes" },
  { icon: ScrollText, title: "Bare Acts & Case Laws" },
  { icon: FileQuestion, title: "Mock Tests & PYQs" },
  { icon: MessageCircleQuestion, title: "Doubt Support" },
];

type Props = {
  expiredAt: string; // user.expiredAt
  startedAt?: string; // subscription start (falls back to 30 days before expiry)
  onRenew?: () => void;
};

export default function ActivePremium({
  expiredAt,
  startedAt,
  onRenew,
}: Props) {
  const end = moment(expiredAt);
  const start = startedAt
    ? moment(startedAt)
    : moment(end).subtract(30, "days");

  const totalDays = Math.max(end.diff(start, "days"), 1);
  const daysLeft = Math.max(Math.ceil(end.diff(moment(), "hours") / 24), 0);
  const progress = Math.min(Math.max(daysLeft / totalDays, 0), 1);
  const endingSoon = daysLeft <= 7;

  const accent = endingSoon ? "#FACC15" : "#4ADE80";

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
            <ChevronLeft size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Hero */}
        <View className="items-center mt-2">
          <View className="w-20 h-20 rounded-3xl bg-yellow-500/10 items-center justify-center">
            <Crown size={40} color="#FACC15" />
          </View>

          <View className="mt-5 px-3 py-1.5 rounded-full bg-green-500/10">
            <Text className="text-green-400 text-[10px] font-bold">
              PREMIUM ACTIVE
            </Text>
          </View>

          <Text className="text-white text-3xl font-bold mt-3">
            You&apos;re Premium
          </Text>
          <Text className="text-zinc-500 text-sm mt-2 text-center px-6">
            Enjoy complete access to all law courses
          </Text>
        </View>

        {/* Validity Card */}
        <View className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
          <View className="flex-row items-end justify-between">
            <View>
              <Text className="text-zinc-500 text-xs uppercase font-medium">
                Days left
              </Text>
              <Text
                className="text-4xl font-bold mt-1"
                style={{ color: accent }}
              >
                {daysLeft}
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-zinc-500 text-xs">Valid until</Text>
              <View className="flex-row items-center mt-1">
                <CalendarDays size={14} color="#A1A1AA" />
                <Text className="text-white font-semibold ml-1.5">
                  {end.format("DD MMM YYYY")}
                </Text>
              </View>
            </View>
          </View>

          {/* Progress bar */}
          <View className="h-2 rounded-full bg-zinc-800 mt-5 overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{ width: `${progress * 100}%`, backgroundColor: accent }}
            />
          </View>

          <Text className="text-zinc-500 text-xs mt-3">
            {endingSoon
              ? "Your plan is ending soon. Renew to keep learning without a break."
              : `Started on ${start.format("DD MMM YYYY")}`}
          </Text>
        </View>

        {/* Benefits */}
        <View className="mt-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
          <Text className="text-zinc-500 text-xs uppercase font-medium mb-4">
            Your benefits
          </Text>

          {BENEFITS.map(({ icon: Icon, title }, i) => (
            <View
              key={title}
              className={`flex-row items-center ${i > 0 ? "mt-4" : ""}`}
            >
              <View className="w-10 h-10 rounded-xl bg-zinc-800 items-center justify-center">
                <Icon size={20} color="#A1A1AA" />
              </View>
              <Text className="flex-1 ml-3 text-white text-sm font-semibold">
                {title}
              </Text>
              <Check size={18} color="#4ADE80" />
            </View>
          ))}
        </View>

        {/* CTA */}
        {endingSoon ? (
          <Pressable
            onPress={onRenew}
            className="mt-6 h-14 rounded-2xl bg-white items-center justify-center"
          >
            <Text className="text-black font-bold text-base">
              Renew Subscription
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => router.back()}
            className="mt-6 h-14 rounded-2xl bg-white items-center justify-center"
          >
            <Text className="text-black font-bold text-base">
              Continue Learning
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeView>
  );
}
