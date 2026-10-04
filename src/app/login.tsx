import {
  ArrowLeft,
  ArrowRight,
  Pencil,
  ShieldCheck,
  Smartphone,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInRight,
  FadeOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { sendOtp, verifyAndLogin } from "@/apis/auth";
import { OtpInput } from "@/components/ui/OtpInput";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Colors, Spacing } from "@/constants/theme"; // adjust path to your theme file
import { useAuth } from "@/hooks/use-auth";
import { catchError } from "@/utils/catchError";
import { router } from "expo-router";

const OTP_LENGTH = 4;
const RESEND_SECONDS = 59;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/* Primary button with press-scale + loading spinner */
function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  const c = Colors[useColorScheme() === "dark" ? "dark" : "light"];
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const off = disabled || loading;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={off}
      onPress={onPress}
      onPressIn={() => {
        "worklet";
        // Reanimated shared values are intentionally mutable inside worklets.
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        "worklet";
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(1, { damping: 12, stiffness: 260 });
      }}
      style={[
        {
          height: 58,
          borderRadius: 18,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: Spacing.two,
          backgroundColor: disabled ? c.backgroundSelected : c.text,
          shadowColor: c.text,
          shadowOpacity: disabled ? 0 : 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: disabled ? 0 : 6,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={c.background} />
      ) : (
        <>
          <Text
            style={{
              color: disabled ? c.textSecondary : c.background,
              fontSize: 17,
              fontWeight: "700",
            }}
          >
            {label}
          </Text>
          <ArrowRight
            size={19}
            color={disabled ? c.textSecondary : c.background}
            strokeWidth={2.5}
          />
        </>
      )}
    </AnimatedPressable>
  );
}

export default function LoginScreen() {
  const c = Colors[useColorScheme() === "dark" ? "dark" : "light"];
  const { login } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(0);

  const progress = useSharedValue(1);
  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  /* ------------------------------ countdown ------------------------------ */
  const startTimer = useCallback(() => {
    setSeconds(RESEND_SECONDS);
    // Reanimated shared values are intentionally mutable outside React render.
    // eslint-disable-next-line react-hooks/immutability
    progress.value = 1;
    progress.value = withTiming(0, {
      duration: RESEND_SECONDS * 1000,
      easing: Easing.linear,
    });
  }, [progress]);

  useEffect(() => {
    if (step !== "otp" || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, seconds]);

  const handleSend = async () => {
    if (phone.length !== 10) return setError("Enter a valid 10 digit number");
    setError("");
    setLoading(true);
    try {
      await sendOtp(phone);
      setOtp("");
      setStep("otp");
      startTimer();
    } catch {
      setError("Could not send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (seconds > 0 || loading) return;
    setError("");
    setOtp("");
    setLoading(true);
    try {
      await handleSend();
      startTimer();
    } catch {
      setError("Could not resend OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (code = otp) => {
    if (code.length !== OTP_LENGTH || loading) return;
    setError("");
    setLoading(true);
    try {
      const { data } = await verifyAndLogin(phone, code);
      if (data) {
        await login(data.token, data.refreshToken);

        router.replace("/");
      } else {
        setError("Incorrect code. Please try again.");
        setOtp("");
      }
    } catch (error) {
      const err = catchError(error);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setStep("phone");
    setOtp("");
    setError("");
  };

  const mm = String(Math.floor(seconds / 60)).padStart(1, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const formattedPhone = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;

  /* --------------------------------- UI --------------------------------- */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      {/* soft background glow */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View
          style={{
            position: "absolute",
            top: -120,
            right: -90,
            width: 320,
            height: 320,
            borderRadius: 160,
            backgroundColor: c.backgroundElement,
            opacity: 0.9,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: -140,
            left: -110,
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: c.backgroundElement,
            opacity: 0.6,
          }}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, padding: Spacing.four }}
        >
          {/* top bar */}
          <View style={{ height: 44, justifyContent: "center" }}>
            {step === "otp" && (
              <Animated.View entering={FadeInRight.duration(250)}>
                <Pressable
                  onPress={goBack}
                  hitSlop={10}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: c.backgroundElement,
                  }}
                >
                  <ArrowLeft size={20} color={c.text} />
                </Pressable>
              </Animated.View>
            )}
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              paddingBottom: Spacing.five,
            }}
          >
            {/* icon badge */}
            <Animated.View
              key={`icon-${step}`}
              entering={FadeInDown.duration(500).springify().damping(16)}
              style={{
                width: 68,
                height: 68,
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: c.text,
                marginBottom: Spacing.four,
                shadowColor: c.text,
                shadowOpacity: 0.3,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 10 },
                elevation: 8,
              }}
            >
              {step === "phone" ? (
                <Smartphone size={30} color={c.background} />
              ) : (
                <ShieldCheck size={30} color={c.background} />
              )}
            </Animated.View>

            {/* ---------------------------- STEP 1: PHONE ---------------------------- */}
            {step === "phone" && (
              <Animated.View
                key="phone"
                entering={FadeInRight.duration(350)}
                exiting={FadeOutLeft.duration(200)}
              >
                <Text
                  style={{
                    color: c.text,
                    fontSize: 32,
                    fontWeight: "800",
                    letterSpacing: -0.8,
                  }}
                >
                  Welcome back
                </Text>
                <Text
                  style={{
                    color: c.textSecondary,
                    fontSize: 16,
                    lineHeight: 23,
                    marginTop: Spacing.two,
                  }}
                >
                  Enter your mobile number and we&apos;ll send you a one-time
                  password to log in.
                </Text>

                <View style={{ marginTop: Spacing.five }}>
                  <PhoneInput
                    value={phone}
                    editable={!loading}
                    onChange={(d) => {
                      setPhone(d);
                      if (error) setError("");
                    }}
                    error={!!error}
                    onSubmit={handleSend}
                  />
                  {!!error && (
                    <Animated.Text
                      entering={FadeInDown.duration(200)}
                      style={{
                        color: "#FF3B30",
                        marginTop: Spacing.two,
                        fontSize: 13,
                      }}
                    >
                      {error}
                    </Animated.Text>
                  )}
                </View>

                <View style={{ marginTop: Spacing.four }}>
                  <PrimaryButton
                    label="Send OTP"
                    onPress={handleSend}
                    loading={loading}
                    disabled={phone.length !== 10}
                  />
                </View>
              </Animated.View>
            )}

            {/* ----------------------------- STEP 2: OTP ----------------------------- */}
            {step === "otp" && (
              <Animated.View
                key="otp"
                entering={FadeInRight.duration(350)}
                exiting={FadeOutLeft.duration(200)}
              >
                <Text
                  style={{
                    color: c.text,
                    fontSize: 32,
                    fontWeight: "800",
                    letterSpacing: -0.8,
                  }}
                >
                  Verify your number
                </Text>
                <View
                  className="flex-row flex-wrap items-center"
                  style={{ marginTop: Spacing.two, gap: 6 }}
                >
                  <Text style={{ color: c.textSecondary, fontSize: 16 }}>
                    Code sent to
                  </Text>
                  <Pressable
                    onPress={goBack}
                    className="flex-row items-center"
                    style={{ gap: 6 }}
                  >
                    <Text
                      style={{ color: c.text, fontSize: 16, fontWeight: "700" }}
                    >
                      {formattedPhone}
                    </Text>
                    <Pencil size={14} color={c.textSecondary} />
                  </Pressable>
                </View>

                <View style={{ marginTop: Spacing.five }}>
                  <OtpInput
                    value={otp}
                    onChange={(v) => {
                      setOtp(v);
                      if (error) setError("");
                    }}
                    length={OTP_LENGTH}
                    error={!!error}
                    editable={!loading}
                    onComplete={handleVerify}
                  />
                  {!!error && (
                    <Animated.Text
                      entering={FadeInDown.duration(200)}
                      style={{
                        color: "#FF3B30",
                        marginTop: Spacing.three,
                        fontSize: 13,
                      }}
                    >
                      {error}
                    </Animated.Text>
                  )}
                </View>

                <View style={{ marginTop: Spacing.four }}>
                  <PrimaryButton
                    label="Verify & continue"
                    onPress={() => handleVerify()}
                    loading={loading}
                    disabled={otp.length !== OTP_LENGTH}
                  />
                </View>

                {/* resend + countdown */}
                <View style={{ marginTop: Spacing.four, alignItems: "center" }}>
                  {seconds > 0 ? (
                    <View style={{ width: "100%", alignItems: "center" }}>
                      <Text style={{ color: c.textSecondary, fontSize: 14 }}>
                        Resend code in{" "}
                        <Text
                          style={{
                            color: c.text,
                            fontWeight: "700",
                            fontVariant: ["tabular-nums"],
                          }}
                        >
                          {mm}:{ss}
                        </Text>
                      </Text>
                      <View
                        style={{
                          width: 140,
                          height: 4,
                          borderRadius: 2,
                          marginTop: Spacing.two + 2,
                          overflow: "hidden",
                          backgroundColor: c.backgroundSelected,
                        }}
                      >
                        <Animated.View
                          style={[
                            {
                              height: "100%",
                              borderRadius: 2,
                              backgroundColor: c.text,
                            },
                            barStyle,
                          ]}
                        />
                      </View>
                    </View>
                  ) : (
                    <Animated.View entering={FadeInDown.duration(300)}>
                      <Pressable
                        onPress={handleResend}
                        disabled={loading}
                        hitSlop={10}
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                          borderRadius: 14,
                          backgroundColor: c.backgroundElement,
                          opacity: loading ? 0.6 : 1,
                        }}
                      >
                        <Text
                          style={{
                            color: c.text,
                            fontSize: 15,
                            fontWeight: "700",
                          }}
                        >
                          Resend OTP
                        </Text>
                      </Pressable>
                    </Animated.View>
                  )}
                </View>
              </Animated.View>
            )}
          </View>

          <Text
            style={{
              color: c.textSecondary,
              fontSize: 12,
              textAlign: "center",
              lineHeight: 18,
            }}
          >
            By continuing you agree to our Terms of Service and Privacy Policy
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
