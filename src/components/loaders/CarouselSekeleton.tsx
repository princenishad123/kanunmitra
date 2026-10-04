import { useEffect, useState } from "react";
import { Animated, ScrollView, useWindowDimensions } from "react-native";

export default function CarouselSkeleton({ height = 160 }) {
  const { width } = useWindowDimensions();
  const [opacity] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <ScrollView
      horizontal
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      {[0, 1, 2].map((i) => (
        <Animated.View
          key={i}
          style={{ opacity, width: width * 0.8, height }}
          className="mr-3 rounded-2xl bg-zinc-800"
        />
      ))}
    </ScrollView>
  );
}
