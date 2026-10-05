import SafeView from "@/components/SafeView";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
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
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useRef, useState } from "react";

const PRICE = 199;

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
};

export type PaymentMethod = "google_pay" | "phonepe" | "paytm";

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  mark: string;
  markColor: string;
  markBackground: string;
}[] = [
  {
    id: "google_pay",
    label: "Google Pay",
    mark: "G",
    markColor: "#4285F4",
    markBackground: "#FFFFFF",
  },
  {
    id: "phonepe",
    label: "PhonePe",
    mark: "P",
    markColor: "#FFFFFF",
    markBackground: "#5F259F",
  },
  {
    id: "paytm",
    label: "Paytm",
    mark: "P",
    markColor: "#FFFFFF",
    markBackground: "#00B9F1",
  },
];

function isPaymentCancellation(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const description = "description" in error ? error.description : undefined;
  return typeof description === "string" && /cancel/i.test(description);
}

export default function PremiumPlan({
  period = "month",
}: Props) {
  const queryClient = useQueryClient();
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod | null>(null);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);
  const paymentInProgress = useRef(false);

  const handleSubscribe = async () => {
    if (!selectedMethod || paymentInProgress.current) return;

    paymentInProgress.current = true;
    setIsCreatingSubscription(true);
    let checkoutCompleted = false;
    try {
      // Load the native module first so Expo Go fails before creating a
      // pending subscription on the backend.
      const { default: RazorpayCheckout } = await import(
        "react-native-razorpay"
      );
      const response = await api.post("/subscription");
      const subscription = response.data?.data as
        | { key?: unknown; id?: unknown }
        | undefined;
      if (
        typeof subscription?.key !== "string" ||
        !subscription.key ||
        typeof subscription.id !== "string" ||
        !subscription.id
      ) {
        throw new Error("Subscription details are missing.");
      }

      const paymentResult = await RazorpayCheckout.open({
        key: subscription.key,
        subscription_id: subscription.id,
        name: "KanunMitra",
        description: "PRO Subscription",
        currency: "INR",
        // Razorpay's RN SDK supports generic UPI preselection, not a guaranteed
        // app-specific launch for Google Pay, PhonePe, or Paytm.
        method: "upi",
        theme: { color: "#10B981" },
      });
      if (
        !paymentResult.razorpay_payment_id ||
        !paymentResult.razorpay_subscription_id ||
        !paymentResult.razorpay_signature
      ) {
        throw new Error("Payment confirmation is incomplete.");
      }
      checkoutCompleted = true;
    } catch (error) {
      if (isPaymentCancellation(error)) {
        Alert.alert("Payment cancelled", "You can try again whenever you're ready.");
      } else {
        Alert.alert("Payment failed", "Please try again.");
      }
    } finally {
      let statusRefreshed = false;
      try {
        const profileResponse = await api.get("/user");
        queryClient.setQueryData(["profile"], profileResponse.data);
        statusRefreshed = true;
      } catch {
        await queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
      paymentInProgress.current = false;
      setIsCreatingSubscription(false);

      if (checkoutCompleted) {
        Alert.alert(
          "Payment completed",
          statusRefreshed
            ? "Your subscription status has been refreshed from the server."
            : "Your payment was received. Subscription status is awaiting server confirmation.",
        );
      }
    }
  };

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
                MONTHLY
              </Text>
            </View>
          </View>

          <View className="flex-row items-end mt-4">
            <Text className="text-white text-5xl font-bold">{"₹"}{PRICE}</Text>
            <Text className="text-zinc-500 text-base mb-2 ml-1">
              / {period}
            </Text>
          </View>

          <Text className="text-zinc-500 text-sm mt-2">Billed {period}ly. Cancel anytime.</Text>

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

        <Text className="text-white text-base font-semibold mt-7 mb-3">
          Choose payment method
        </Text>
        {PAYMENT_METHODS.map((method) => {
          const selected = selectedMethod === method.id;
          return (
            <Pressable
              key={method.id}
              accessibilityRole="radio"
              accessibilityLabel={method.label}
              accessibilityState={{
                checked: selected,
                disabled: isCreatingSubscription,
              }}
              disabled={isCreatingSubscription}
              onPress={() => setSelectedMethod(method.id)}
              className={`mb-3 min-h-16 flex-row items-center rounded-2xl border px-4 ${
                selected
                  ? "border-emerald-400 bg-emerald-400/10"
                  : "border-zinc-800 bg-zinc-900"
              }`}
            >
              <View
                className="h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: method.markBackground }}
              >
                <Text className="font-bold" style={{ color: method.markColor }}>
                  {method.mark}
                </Text>
              </View>
              <Text className="ml-3 flex-1 font-semibold text-white">
                {method.label}
              </Text>
              <View
                className={`h-5 w-5 items-center justify-center rounded-full border ${
                  selected ? "border-emerald-400" : "border-zinc-600"
                }`}
              >
                {selected && (
                  <View className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                )}
              </View>
            </Pressable>
          );
        })}
        <Text className="text-zinc-500 text-xs leading-5">
          The app you selected is a preference only. Razorpay cannot guarantee
          that it will launch Google Pay, PhonePe, or Paytm specifically.
        </Text>

        {/* CTA */}
        <Pressable
          onPress={handleSubscribe}
          disabled={!selectedMethod || isCreatingSubscription}
          className="mt-6 h-14 rounded-2xl bg-emerald-500 items-center justify-center"
          style={{ opacity: !selectedMethod || isCreatingSubscription ? 0.6 : 1 }}
        >
          <Text className="text-black font-bold text-base">
            {isCreatingSubscription
              ? "Processing payment..."
              : `Continue Payment · ₹${PRICE}`}
          </Text>
        </Pressable>

        <Text className="text-zinc-600 text-xs text-center mt-4">
          Secure payment. Cancel anytime.
        </Text>
      </ScrollView>
    </SafeView>
  );
}
