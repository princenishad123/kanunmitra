import { Image, type ImageSource } from "expo-image";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { View, useWindowDimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

import { Colors } from "@/constants/theme"; // adjust path to your theme file
import { fetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import CarouselSkeleton from "../loaders/CarouselSekeleton";

export type CarouselItem = {
  _id: string;
  duration?: string;
  thumbnail: ImageSource | number | string;
  slug?: string;
  isLocked?: boolean;
};

type Props = {
  data: CarouselItem[];
  /** Card width as a fraction of screen width */
  itemWidthRatio?: number;
  /** Card height */
  itemHeight?: number;
  /** Gap between cards */
  gap?: number;
  /** Scale of the non-focused cards */
  sideScale?: number;
  /** Auto-play interval in ms. 0 = off */
  autoPlayMs?: number;
  onIndexChange?: (index: number) => void;
};

type LoopItem = CarouselItem & { key: string };

const AnimatedFlatList = Animated.FlatList<LoopItem>;

/* ------------------------------------------------------------------ */
/* Single card                                                         */
/* ------------------------------------------------------------------ */
type CardProps = {
  item: LoopItem;
  index: number;
  scrollX: SharedValue<number>;
  step: number;
  width: number;
  height: number;
  sideScale: number;
};

function Card({
  item,
  index,
  scrollX,
  step,
  width,
  height,
  sideScale,
}: CardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const input = [(index - 1) * step, index * step, (index + 1) * step];

    const scale = interpolate(
      scrollX.value,
      input,
      [sideScale, 1, sideScale],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      input,
      [0.55, 1, 0.55],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollX.value,
      input,
      [14, 0, 14],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: 28,
          backgroundColor: "#212225",
          overflow: "hidden",
          // shadow
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 10,
        },
        animatedStyle,
      ]}
    >
      <Image
        source={
          typeof item.thumbnail === "string"
            ? { uri: item.thumbnail }
            : item.thumbnail
        }
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="cover"
        transition={250}
        cachePolicy="memory-disk"
      />
    </Animated.View>
  );
}

/* ------------------------------------------------------------------ */
/* Pagination dot                                                      */
/* ------------------------------------------------------------------ */
function Dot({
  index,
  count,
  scrollX,
  step,
}: {
  index: number;
  count: number;
  scrollX: SharedValue<number>;
  step: number;
}) {
  const style = useAnimatedStyle(() => {
    // circular distance between current position and this dot
    const pos = scrollX.value / step;
    let d = Math.abs((((pos - index) % count) + count) % count);
    d = Math.min(d, count - d);
    return {
      width: interpolate(d, [0, 1], [22, 8], Extrapolation.CLAMP),
      opacity: interpolate(d, [0, 1], [1, 0.35], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 8,
          borderRadius: 4,
          backgroundColor: Colors.dark.textSecondary,
        },
        style,
      ]}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Carousel                                                            */
/* ------------------------------------------------------------------ */
const COPIES = 5; // data is repeated 5x, we always keep the user in the middle copy

export function ScaleCarousel({
  itemWidthRatio = 0.7,
  itemHeight = 320,
  gap = 5,
  sideScale = 0.85,
  autoPlayMs = 0,
  onIndexChange,
}: Props) {
  const { width: screenWidth } = useWindowDimensions();

  const { data: carousel, isLoading } = useQuery({
    queryKey: ["carousel"],
    queryFn: () => fetcher("/video/carousel"),
  });

  // The query result is undefined until it resolves. The API may return the
  // list directly or wrap it in a `data` field, so normalize both shapes.
  const data: CarouselItem[] = useMemo(
    () =>
      Array.isArray(carousel)
        ? carousel
        : Array.isArray(carousel?.data)
          ? carousel.data
          : [],
    [carousel],
  );

  const n = data.length;
  const itemWidth = screenWidth * itemWidthRatio;
  const step = itemWidth + gap;
  const sidePadding = (screenWidth - itemWidth) / 2;

  // repeated data -> endless feeling
  const loopData = useMemo(
    () =>
      Array.from({ length: COPIES }, (_, c) =>
        data.map((d: any, i: any) => ({ ...d, key: `${d.id}-${c}-${i}` })),
      ).flat(),
    [data],
  );

  // start exactly on the MIDDLE item of the MIDDLE copy
  const midCopy = Math.floor(COPIES / 2);
  const startIndex = n * midCopy + Math.floor(n / 2);

  const scrollX = useSharedValue(startIndex * step);
  const listRef = useRef<Animated.FlatList<LoopItem>>(null);
  const currentIndex = useRef(startIndex);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  // If we drift out of the middle copy, silently jump to the identical card in the middle copy
  const recenter = useCallback(
    (idx: number) => {
      const lo = n * midCopy;
      const hi = n * (midCopy + 1);
      if (idx >= lo && idx < hi) return idx;
      const fixed = lo + (((idx % n) + n) % n);
      listRef.current?.scrollToOffset({
        offset: fixed * step,
        animated: false,
      });
      return fixed;
    },
    [n, midCopy, step],
  );

  const handleMomentumEnd = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / step);
      currentIndex.current = recenter(idx);
      onIndexChange?.(currentIndex.current % n);
    },
    [step, n, recenter, onIndexChange],
  );

  // Optional autoplay (also loops forever)
  useEffect(() => {
    if (!autoPlayMs || n < 2) return;
    const timer = setInterval(() => {
      const base = recenter(currentIndex.current);
      const next = base + 1;
      currentIndex.current = next;
      listRef.current?.scrollToOffset({ offset: next * step, animated: true });
      onIndexChange?.(next % n);
    }, autoPlayMs);
    return () => clearInterval(timer);
  }, [autoPlayMs, n, step, recenter, onIndexChange]);

  if (isLoading) {
    return <CarouselSkeleton />;
  }

  return (
    <View className="items-center">
      {data.length > 0 && (
        <AnimatedFlatList
          ref={listRef}
          data={loopData}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          // start in the middle
          initialScrollIndex={startIndex}
          // smooth snapping
          snapToInterval={step}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum
          contentContainerStyle={{
            paddingHorizontal: sidePadding,
            paddingVertical: 24,
            alignItems: "center",
          }}
          ItemSeparatorComponent={() => <View style={{ width: gap }} />}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumEnd}
          getItemLayout={(_, index) => ({
            length: step,
            offset: step * index,
            index,
          })}
          initialNumToRender={7}
          windowSize={7}
          renderItem={({ item, index }) => (
            <Card
              item={item}
              index={index}
              scrollX={scrollX}
              step={step}
              width={itemWidth}
              height={itemHeight}
              sideScale={sideScale}
            />
          )}
        />
      )}

      {/* pagination */}
      <View className="mt-2 flex-row items-center" style={{ gap: 6 }}>
        {data.map((item, i) => (
          <Dot
            key={item._id}
            index={i}
            count={n}
            scrollX={scrollX}
            step={step}
          />
        ))}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Usage example                                                       */
/* ------------------------------------------------------------------ */
export const DEMO_DATA: CarouselItem[] = [
  {
    _id: "1",
    duration: "15",
    slug: "bsns",
    thumbnail: "https://picsum.photos/id/1018/600/800",
  },
];
