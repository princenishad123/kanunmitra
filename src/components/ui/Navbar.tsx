import { Image } from "expo-image";
import { Search, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, TextInput, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, Spacing } from "@/constants/theme"; // adjust path to your theme file

type Props = {
  appName?: string;
  avatar?: string; // image url, falls back to initials
  userName?: string;
  placeholder?: string;
  unreadCount?: number;
  onLogoPress?: () => void;
  onSearchChange?: (text: string) => void;
  onSearchSubmit?: (text: string) => void;
  onBellPress?: () => void;
  onProfilePress?: () => void;
};

export function Navbar({
  appName = "App",
  avatar,
  userName = "User",
  placeholder = "Search",
  unreadCount = 0,
  onLogoPress,
  onSearchChange,
  onSearchSubmit,
  onBellPress,
  onProfilePress,
}: Props) {
  const c = Colors[useColorScheme() === "dark" ? "dark" : "light"];
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View
      className="flex-row items-center "
      style={{
        paddingTop: 6,
        paddingBottom: 0,
        paddingHorizontal: Spacing.two,
        gap: Spacing.two + Spacing.one,
        backgroundColor: c.background,
      }}
    >
      {/* Logo */}
      <Pressable
        onPress={onLogoPress}
        className="items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: c.text,
        }}
      >
        <Text style={{ color: c.background, fontSize: 20, fontWeight: "800" }}>
          {appName.charAt(0).toUpperCase()}
        </Text>
      </Pressable>

      {/* Search */}
      <View
        className="flex-1 flex-row items-center"
        style={{
          height: 42,
          borderRadius: 21,
          paddingHorizontal: Spacing.three,
          gap: Spacing.two,
          backgroundColor: c.backgroundElement,
          borderWidth: 1.5,
          borderColor: focused ? c.text : c.backgroundElement,
        }}
      >
        <Search size={18} color={c.textSecondary} />
        <TextInput
          value={text}
          onChangeText={(t) => {
            setText(t);
            onSearchChange?.(t);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={() => onSearchSubmit?.(text)}
          placeholder={placeholder}
          placeholderTextColor={c.textSecondary}
          returnKeyType="search"
          autoCorrect={false}
          style={{ flex: 1, color: c.text, fontSize: 15, paddingVertical: 0 }}
        />
        {text.length > 0 && (
          <Pressable
            hitSlop={8}
            onPress={() => {
              setText("");
              onSearchChange?.("");
            }}
          >
            <X size={18} color={c.textSecondary} />
          </Pressable>
        )}
      </View>

      {/* Profile */}
      <Pressable
        onPress={onProfilePress}
        className="items-center justify-center overflow-hidden border border-gray-500"
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: c.backgroundSelected,
        }}
      >
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : (
          <Text style={{ color: c.text, fontSize: 14, fontWeight: "700" }}>
            {initials}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
