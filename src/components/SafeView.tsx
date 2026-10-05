import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth } from "@/constants/theme";
import { ChildrenInterface } from "@/types/children.interface";
import { FC } from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = ChildrenInterface & {
  /** Add extra bottom space for a floating/custom tab bar. Default: false */
  tabBarInset?: boolean;
  /** Respect the device's bottom safe area (home indicator). Default: true */
  bottomSafeArea?: boolean;
  /** Override the screen background (hex string). */
  backgroundColor?: string;
};

const SafeView: FC<Props> = ({
  children,
  tabBarInset = false,
  bottomSafeArea = true,
  backgroundColor,
}) => {
  const insets = useSafeAreaInsets();

  // Bottom space = real device inset (only once) + tab bar height (only if asked).
  const paddingBottom =
    (bottomSafeArea ? insets.bottom : 0) + (tabBarInset ? BottomTabInset : 0);

  return (
    <View
      className="flex-1 flex-row justify-center bg-[#0A0A0A]"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <View
        className="flex-1 gap-2 px-0.5"
        style={{
          maxWidth: MaxContentWidth,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom,
        }}
      >
        {children}
        {Platform.OS === "web" && <WebBadge />}
      </View>
    </View>
  );
};

export default SafeView;
