import { Check } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TextInput, useColorScheme, View } from "react-native";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
    ZoomIn,
} from "react-native-reanimated";

import { Colors, Spacing } from "@/constants/theme"; // adjust path to your theme file

type Props = {
  /** raw digits only, max 10 */
  value: string;
  onChange: (digits: string) => void;
  countryCode?: string;
  flag?: string;
  error?: boolean;
  editable?: boolean;
  onSubmit?: () => void;
};

const ERROR = "#FF3B30";

// 9876543210 -> "98765 43210"
const format = (d: string) =>
  d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;

export function PhoneInput({
  value,
  onChange,
  countryCode = "+91",
  flag = "🇮🇳",
  error = false,
  editable = true,
  onSubmit,
}: Props) {
  const c = Colors[useColorScheme() === "dark" ? "dark" : "light"];
  const [focused, setFocused] = useState(false);

  const focus = useSharedValue(0);
  const shake = useSharedValue(0);

  useEffect(() => {
    focus.value = withTiming(focused ? 1 : 0, { duration: 200 });
  }, [focused, focus]);

  useEffect(() => {
    if (!error) return;
    shake.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 90 }),
      withTiming(-6, { duration: 90 }),
      withTiming(0, { duration: 50 }),
    );
  }, [error, shake]);

  const boxStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
    borderColor: error
      ? ERROR
      : interpolateColor(focus.value, [0, 1], [c.backgroundSelected, c.text]),
    backgroundColor: interpolateColor(
      focus.value,
      [0, 1],
      [c.backgroundElement, c.background],
    ),
    shadowOpacity: focus.value * 0.12,
  }));

  const valid = value.length === 10;

  return (
    <Animated.View
      style={[
        {
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 18,
          borderWidth: 1.5,
          paddingHorizontal: Spacing.three,
          shadowColor: c.text,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        },
        boxStyle,
      ]}
    >
      {/* country */}
      <View className="flex-row items-center" style={{ gap: Spacing.two }}>
        <View
          style={{
            minWidth: 28,
            height: 24,
            paddingHorizontal: 4,
            borderRadius: 7,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: c.backgroundSelected,
          }}
        >
          <Text style={{ color: c.textSecondary, fontSize: 11, fontWeight: "800" }}>
            {flag}
          </Text>
        </View>
        <Text style={{ color: c.text, fontSize: 17, fontWeight: "600" }}>
          {countryCode}
        </Text>
      </View>

      <View
        style={{
          width: 1.5,
          height: 26,
          marginHorizontal: Spacing.three - 2,
          backgroundColor: c.backgroundSelected,
        }}
      />

      <TextInput
        value={format(value)}
        onChangeText={(t) => onChange(t.replace(/\D/g, "").slice(0, 10))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={onSubmit}
        editable={editable}
        placeholder="98765 43210"
        placeholderTextColor={c.textSecondary}
        keyboardType="number-pad"
        textContentType="telephoneNumber"
        autoComplete="tel"
        maxLength={11}
        selectionColor={c.text}
        style={{
          flex: 1,
          color: c.text,
          fontSize: 19,
          fontWeight: "600",
          letterSpacing: 1,
          paddingVertical: 0,
        }}
      />

      {valid && (
        <Animated.View
          entering={ZoomIn.springify().damping(14)}
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#22C55E",
          }}
        >
          <Check size={15} color="#fff" strokeWidth={3} />
        </Animated.View>
      )}
    </Animated.View>
  );
}
