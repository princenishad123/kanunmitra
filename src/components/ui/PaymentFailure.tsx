import { StatusBar } from "expo-status-bar";
import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  amount: string; // e.g. "₹1,249.00"
  reason?: string; // what went wrong
  hint?: string; // how to fix it
  errorCode?: string;
  onRetry: () => void;
  onChangeMethod?: () => void;
  onCancel: () => void;
};

export default function PaymentFailureScreen({
  amount,
  reason = "Your bank declined the payment.",
  hint = "No money was taken. Check your card details or try another payment method.",
  errorCode,
  onRetry,
  onChangeMethod,
  onCancel,
}: Props) {
  const insets = useSafeAreaInsets();
  const [pop] = useState(() => new Animated.Value(0));
  const [shake] = useState(() => new Animated.Value(0));
  const [content] = useState(() => new Animated.Value(0));

  // One moment: badge drops in, gives a short shake, then the details rise.
  useEffect(() => {
    const step = (to: number) =>
      Animated.timing(shake, {
        toValue: to,
        duration: 70,
        easing: Easing.linear,
        useNativeDriver: true,
      });

    Animated.sequence([
      Animated.spring(pop, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.sequence([step(1), step(-1), step(0.7), step(-0.7), step(0)]),
      Animated.timing(content, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [pop, shake, content]);

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
      className="flex-1 bg-[#0F0B0A] px-6"
      style={{
        paddingTop: insets.top,
        paddingBottom: Math.max(insets.bottom, 12),
      }}
    >
      <StatusBar style="light" />

      <View className="flex-1 items-center justify-center">
        {/* Squarer than the success badge so the two states feel distinct */}
        <Animated.View
          className="mb-9 h-28 w-28 items-center justify-center rounded-[36px] bg-[#FF5C4A]"
          style={{
            transform: [
              { scale: pop },
              {
                translateX: shake.interpolate({
                  inputRange: [-1, 1],
                  outputRange: [-10, 10],
                }),
              },
            ],
          }}
        >
          <X size={56} color="#fff" strokeWidth={3} />
        </Animated.View>

        <Animated.View className="items-center" style={rise(16)}>
          <Text className="mb-2.5 text-base font-semibold text-[#FF5C4A]">
            Payment failed
          </Text>
          <Text
            className="text-[46px] font-extrabold tracking-[-1.5px] text-[#F8EFED] line-through"
            style={{ textDecorationColor: "#FF5C4A" }}
          >
            {amount}
          </Text>
          <Text className="mt-1.5 text-[15px] text-[#A39390]">Not charged</Text>
        </Animated.View>
      </View>

      <Animated.View
        className="mb-5 flex-row gap-3.5 rounded-[20px] bg-[#1A1413] p-[18px]"
        style={rise(28)}
      >
        <View className="w-1 rounded-sm bg-[#FF5C4A]" />
        <View className="flex-1">
          <Text className="mb-1 text-[15px] font-bold text-[#F8EFED]">
            {reason}
          </Text>
          <Text className="text-sm leading-5 text-[#A39390]">{hint}</Text>
          {errorCode ? (
            <Text className="mt-2.5 text-xs text-[#6E5F5C]">
              Error code {errorCode}
            </Text>
          ) : null}
        </View>
      </Animated.View>

      <View className="gap-2.5">
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          className="items-center rounded-2xl bg-[#F8EFED] py-[17px] active:opacity-80"
        >
          <Text className="text-base font-bold text-[#0F0B0A]">Try again</Text>
        </Pressable>

        {onChangeMethod ? (
          <Pressable
            onPress={onChangeMethod}
            accessibilityRole="button"
            className="items-center rounded-2xl border-[1.5px] border-[#3A2C29] py-4 active:opacity-70"
          >
            <Text className="text-[15px] font-semibold text-[#F8EFED]">
              Use another method
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={onCancel}
          accessibilityRole="button"
          className="items-center py-2"
        >
          <Text className="text-[15px] font-semibold text-[#A39390]">
            Cancel
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
