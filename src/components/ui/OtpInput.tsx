import { useEffect, useRef, useState } from "react";
import { Pressable, TextInput, useColorScheme, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

import { Colors } from "@/constants/theme"; // adjust path to your theme file

type Props = {
  value: string;
  onChange: (code: string) => void;
  length?: number;
  error?: boolean;
  autoFocus?: boolean;
  editable?: boolean;
  onComplete?: (code: string) => void;
};

const ERROR = "#FF3B30";

/* ---------------------------- single box ---------------------------- */
function Box({
  char,
  active,
  error,
  filled,
}: {
  char?: string;
  active: boolean;
  error: boolean;
  filled: boolean;
}) {
  const c = Colors[useColorScheme() === "dark" ? "dark" : "light"];
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const caret = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 180 });
    scale.value = withSpring(active ? 1.06 : 1, {
      damping: 14,
      stiffness: 220,
    });
  }, [active, progress, scale]);

  // blinking caret
  useEffect(() => {
    if (active && !filled) {
      caret.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 450 }),
          withTiming(1, { duration: 450 }),
        ),
        -1,
      );
    } else {
      caret.value = 0;
    }
  }, [active, filled, caret]);

  const boxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: error
      ? ERROR
      : interpolateColor(
          progress.value,
          [0, 1],
          [filled ? c.text : c.backgroundSelected, c.text],
        ),
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [c.backgroundElement, c.background],
    ),
    shadowOpacity: progress.value * 0.14,
  }));

  const caretStyle = useAnimatedStyle(() => ({ opacity: caret.value }));

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          maxWidth: 54,
          aspectRatio: 0.88,
          borderRadius: 16,
          borderWidth: 1.5,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: c.text,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
        },
        boxStyle,
      ]}
    >
      {char ? (
        <Animated.Text
          key={char}
          entering={ZoomIn.duration(160)}
          style={{
            color: error ? ERROR : c.text,
            fontSize: 26,
            fontWeight: "700",
          }}
        >
          {char}
        </Animated.Text>
      ) : (
        <Animated.View
          style={[
            { width: 2, height: 26, borderRadius: 1, backgroundColor: c.text },
            caretStyle,
          ]}
        />
      )}
    </Animated.View>
  );
}

/* ------------------------------ OTP row ------------------------------ */
export function OtpInput({
  value,
  onChange,
  length = 6,
  error = false,
  autoFocus = true,
  editable = true,
  onComplete,
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const shake = useSharedValue(0);

  useEffect(() => {
    if (!error) return;
    shake.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 100 }), 4, true),
      withTiming(0, { duration: 50 }),
    );
  }, [error, shake]);

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const handleChange = (t: string) => {
    const code = t.replace(/\D/g, "").slice(0, length);
    onChange(code);
    if (code.length === length) onComplete?.(code);
  };

  const activeIndex = Math.min(value.length, length - 1);

  return (
    <View>
      <Animated.View style={rowStyle}>
        <Pressable
          onPress={() => inputRef.current?.focus()}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 12,
          }}
        >
          {Array.from({ length }).map((_, i) => (
            <Box
              key={i}
              char={value[i]}
              filled={!!value[i]}
              active={focused && i === activeIndex}
              error={error}
            />
          ))}
        </Pressable>
      </Animated.View>

      {/* one hidden input drives all the boxes (supports SMS autofill + paste) */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        editable={editable}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        caretHidden
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0,
        }}
      />
    </View>
  );
}
