import { useEffect, useMemo } from "react";
import { Animated, Easing, View } from "react-native";
import SafeView from "../SafeView";

function Bone({ className = "" }: { className?: string }) {
  const opacity = useMemo(() => new Animated.Value(0.4), []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View style={{ opacity }} className={`bg-zinc-800 ${className}`} />
  );
}

export default function ProfileSkeleton() {
  return (
    <SafeView>
      <View>
        {/* Profile row */}
        <View className="flex-row items-center">
          <Bone className="w-[72px] h-[72px] rounded-full" />
          <View className="ml-4 flex-1">
            <Bone className="h-5 w-40 rounded-md" />
            <Bone className="h-4 w-28 rounded-md mt-3" />
            <Bone className="h-3 w-32 rounded-md mt-3" />
          </View>
        </View>

        {/* Premium card */}
        <View className="mt-7 bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Bone className="w-11 h-11 rounded-2xl" />
              <View className="ml-3">
                <Bone className="h-3 w-20 rounded-md" />
                <Bone className="h-5 w-24 rounded-md mt-2" />
              </View>
            </View>
            <Bone className="h-6 w-16 rounded-full" />
          </View>

          <View className="h-[1px] bg-zinc-800 my-5" />

          <View className="flex-row">
            <View className="flex-1">
              <Bone className="h-3 w-16 rounded-md" />
              <Bone className="h-4 w-28 rounded-md mt-2" />
            </View>
            <View className="flex-1">
              <Bone className="h-3 w-16 rounded-md" />
              <Bone className="h-4 w-20 rounded-md mt-2" />
            </View>
          </View>

          <Bone className="h-12 rounded-xl mt-5" />
        </View>

        {/* Menu sections */}
        {[2, 1, 3].map((rows, i) => (
          <View key={i} className="mt-4">
            <Bone className="h-3 w-16 rounded-md mb-3" />
            <View className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              {Array.from({ length: rows }).map((_, r) => (
                <View
                  key={r}
                  className="min-h-[66px] px-4 py-3 flex-row items-center"
                >
                  <Bone className="w-10 h-10 rounded-xl" />
                  <View className="flex-1 ml-3">
                    <Bone className="h-4 w-32 rounded-md" />
                    <Bone className="h-3 w-44 rounded-md mt-2" />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </SafeView>
  );
}
