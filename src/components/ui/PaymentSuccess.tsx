import { StatusBar } from "expo-status-bar";
import { Check } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  amount: string; // e.g. "₹1,249.00"
  merchant: string; // e.g. "Blue Tokai Coffee"
  transactionId: string;
  paidWith?: string; // e.g. "Visa ending 4242"
  date?: string;
  onDone: () => void;
  onViewReceipt?: () => void;
};

function Ring({ delay }: { delay: number }) {
  const [t] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: 2200,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [delay, t]);

  return (
    <Animated.View
      pointerEvents="none"
      className="absolute h-28 w-28 rounded-full bg-[#34D399]"
      style={{
        opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] }),
        transform: [
          {
            scale: t.interpolate({ inputRange: [0, 1], outputRange: [1, 2.4] }),
          },
        ],
      }}
    />
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-4 py-2.5">
      <Text className="text-sm text-[#8A9A91]">{label}</Text>
      <Text
        className="shrink text-sm font-semibold text-[#F1F6F3]"
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

export default function PaymentSuccessScreen({
  amount,
  merchant,
  transactionId,
  paidWith,
  date,
  onDone,
  onViewReceipt,
}: Props) {
  const insets = useSafeAreaInsets();
  const [badge] = useState(() => new Animated.Value(0));
  const [check] = useState(() => new Animated.Value(0));
  const [content] = useState(() => new Animated.Value(0));

  // One orchestrated moment: badge pops, check lands, receipt rises.
  useEffect(() => {
    Animated.sequence([
      Animated.spring(badge, {
        toValue: 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.spring(check, {
        toValue: 1,
        friction: 5,
        tension: 160,
        useNativeDriver: true,
      }),
      Animated.timing(content, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [badge, check, content]);

  const rise = (distance: number) => ({
    opacity: content,
    transform: [
      {
        translateY: content.interpolate({
          inputRange: [0, 1],
          outputRange: [distance, 0],
        }),
      },
    ],
  });

  return (
    <View
      className="flex-1 bg-[#0A0E0C] px-6"
      style={{
        paddingTop: insets.top,
        paddingBottom: Math.max(insets.bottom, 12),
      }}
    >
      <StatusBar style="light" />

      <View className="flex-1 items-center justify-center">
        <View className="mb-9 h-28 w-28 items-center justify-center">
          <Ring delay={0} />
          <Ring delay={1100} />
          <Animated.View
            className="h-28 w-28 items-center justify-center rounded-full bg-[#34D399]"
            style={{ transform: [{ scale: badge }] }}
          >
            <Animated.View style={{ transform: [{ scale: check }] }}>
              <Check size={56} color="#04140C" strokeWidth={3} />
            </Animated.View>
          </Animated.View>
        </View>

        <Animated.View className="items-center" style={rise(16)}>
          <Text className="mb-2.5 text-base font-semibold text-[#34D399]">
            Payment received
          </Text>
          <Text className="text-[46px] font-extrabold tracking-[-1.5px] text-[#F1F6F3]">
            {amount}
          </Text>
          <Text className="mt-1.5 text-[15px] text-[#8A9A91]">
            sent to {merchant}
          </Text>
        </Animated.View>
      </View>

      {/* Ticket-style receipt */}
      <Animated.View
        className="mb-5 rounded-[20px] bg-[#141B17]"
        style={rise(28)}
      >
        <View className="px-5 py-2">
          {date ? <Row label="Date" value={date} /> : null}
          {paidWith ? <Row label="Paid with" value={paidWith} /> : null}
        </View>

        <View className="h-6 justify-center">
          <View className="absolute -left-3 h-6 w-6 rounded-full bg-[#0A0E0C]" />
          <View className="mx-[18px] border-t-2 border-dashed border-[#2A352F]" />
          <View className="absolute -right-3 h-6 w-6 rounded-full bg-[#0A0E0C]" />
        </View>

        <View className="px-5 py-2">
          <Row label="Transaction ID" value={transactionId} />
        </View>
      </Animated.View>

      <View className="gap-1">
        <Pressable
          onPress={onDone}
          accessibilityRole="button"
          className="items-center rounded-2xl bg-[#F1F6F3] py-[17px] active:opacity-80"
        >
          <Text className="text-base font-bold text-[#0A0E0C]">Done</Text>
        </Pressable>
        {onViewReceipt ? (
          <Pressable
            onPress={onViewReceipt}
            accessibilityRole="button"
            className="items-center py-3.5"
          >
            <Text className="text-[15px] font-semibold text-[#8A9A91]">
              View receipt
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
