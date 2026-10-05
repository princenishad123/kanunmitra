import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CarouselItem = {
  id: string;
  views: string;
  title: string;
  image: string;
  thumbnail: string;
};

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.65;
const CARD_HEIGHT = 280;
const SPACING = 4;
const ITEM_SIZE = CARD_WIDTH + SPACING;

const ORIGINAL_DATA: CarouselItem[] = [
  {
    id: "1",
    views: "72K",
    title: "HANUMAN GATHA",
    image:
      "https://pub-e021d0e12dcd4aaf93eb35ec41c3613d.r2.dev/images/hard.jpg",
    thumbnail:
      "https://www.flipkart.com/a4-size-aesthetic-retro-poster-wall-decoration-paper-print/p/itma9f22f106d2ed",
  },
  {
    id: "2",
    views: "271K",
    title: "Stream",
    image:
      "https://streamora-bucket.s3.ap-southeast-1.amazonaws.com/images/stream.jpg",
    thumbnail:
      "https://www.flipkart.com/a4-size-aesthetic-retro-poster-wall-decoration-paper-print/p/itma9f22f106d2ed",
  },
  {
    id: "3",
    views: "100K",
    title: "AVENGERS",
    image:
      "https://pub-e021d0e12dcd4aaf93eb35ec41c3613d.r2.dev/images/excute.jpg",
    thumbnail:
      "https://www.flipkart.com/a4-size-aesthetic-retro-poster-wall-decoration-paper-print/p/itma9f22f106d2ed",
  },
  {
    id: "4",
    views: "100K",
    title: "AVENGERS",
    image:
      "https://pub-e021d0e12dcd4aaf93eb35ec41c3613d.r2.dev/images/rich.jpg",
    thumbnail:
      "https://www.flipkart.com/a4-size-aesthetic-retro-poster-wall-decoration-paper-print/p/itma9f22f106d2ed",
  },
];

const DATA: CarouselItem[] = [
  ...ORIGINAL_DATA,
  ...ORIGINAL_DATA,
  ...ORIGINAL_DATA,
];

type ImageCardProps = {
  item: CarouselItem;
  isActive: boolean;
  scale: Animated.AnimatedInterpolation<number>;
  opacity: Animated.AnimatedInterpolation<number>;
};

function CarouselImageCard({
  item,
  isActive,
  scale,
  opacity,
}: ImageCardProps) {
  return (
    <Animated.View
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginRight: SPACING,
        transform: [{ scale }],
        opacity,
      }}
      className="relative overflow-hidden rounded-2xl border border-gray-800 bg-black"
    >
      {/* Main Image */}
      <Image
        source={{ uri: item.image }}
        style={{ flex: 1 }}
        resizeMode="cover"
      />

      {/* Thumbnail Overlay (optional - shows on top) */}
      <View className="absolute inset-0 items-center justify-center">
        <Image
          source={{ uri: item.thumbnail }}
          style={{
            width: CARD_WIDTH * 0.4,
            height: CARD_HEIGHT * 0.4,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: "white",
          }}
          resizeMode="cover"
        />
      </View>

      {/* Views */}
      <View className="absolute right-2 top-2 flex-row items-center rounded-full border border-white/10 bg-black/50 px-2.5 py-1">
        <Ionicons
          name="eye"
          size={13}
          color="white"
        />

        <Text className="ml-1 text-[11px] font-bold text-white">
          {item.views}
        </Text>
      </View>

      {/* Title */}
      {item.title.length > 0 && (
        <View className="absolute bottom-3 left-0 right-0 items-center">
          <Text className="rounded-md border border-white/5 bg-black/50 px-3 py-1 text-center text-xs font-extrabold uppercase tracking-wide text-white">
            {item.title}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

export default function CarouselCard() {
  const scrollX = useRef(new Animated.Value(0)).current;

  const flatListRef =
    useRef<FlatList<CarouselItem>>(null);

  const [activeIndex, setActiveIndex] = useState(
    ORIGINAL_DATA.length
  );

  const handleScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            x: scrollX,
          },
        },
      },
    ],
    {
      useNativeDriver: true,

      listener: (
        event: NativeSyntheticEvent<NativeScrollEvent>
      ) => {
        const offsetX =
          event.nativeEvent.contentOffset.x;

        const rawIndex = Math.round(
          offsetX / ITEM_SIZE
        );

        setActiveIndex((previous) => {
          if (previous === rawIndex) {
            return previous;
          }

          return rawIndex;
        });

        if (rawIndex <= 0) {
          requestAnimationFrame(() => {
            flatListRef.current?.scrollToOffset({
              offset:
                ITEM_SIZE *
                ORIGINAL_DATA.length,
              animated: false,
            });
          });

          setActiveIndex(
            ORIGINAL_DATA.length
          );

          return;
        }

        if (
          rawIndex >=
          ORIGINAL_DATA.length * 2
        ) {
          requestAnimationFrame(() => {
            flatListRef.current?.scrollToOffset({
              offset:
                ITEM_SIZE *
                ORIGINAL_DATA.length,
              animated: false,
            });
          });

          setActiveIndex(
            ORIGINAL_DATA.length
          );
        }
      },
    }
  );

  return (
    <View className="flex-1 items-center justify-center bg-black py-6">
      <Animated.FlatList
        ref={flatListRef}
        data={DATA}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        initialScrollIndex={ORIGINAL_DATA.length}
        getItemLayout={(_, index) => ({
          length: ITEM_SIZE,
          offset: ITEM_SIZE * index,
          index,
        })}
        contentContainerStyle={{
          paddingHorizontal:
            (width - ITEM_SIZE) / 2,
        }}
        keyExtractor={(item, index) =>
          `${item.id}-${index}`
        }
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
          ];

          const scale =
            scrollX.interpolate({
              inputRange,
              outputRange: [
                0.85,
                1,
                0.85,
              ],
              extrapolate: "clamp",
            });

          const opacity =
            scrollX.interpolate({
              inputRange,
              outputRange: [
                0.6,
                1,
                0.6,
              ],
              extrapolate: "clamp",
            });

          const isActive =
            activeIndex === index;

          return (
            <CarouselImageCard
              item={item}
              isActive={isActive}
              scale={scale}
              opacity={opacity}
            />
          );
        }}
      />
    </View>
  );
}