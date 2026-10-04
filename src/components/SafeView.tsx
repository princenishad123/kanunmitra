import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { ChildrenInterface } from "@/types/children.interface";
import { FC } from "react";
import { Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SafeView: FC<
  ChildrenInterface & { tabBarInset?: boolean; backgroundColor?: string }
> = ({ children, tabBarInset = true, backgroundColor }) => {
  return (
    <ThemedView
      className="border border-white"
      style={[
        styles.container,
        backgroundColor ? { backgroundColor } : undefined,
      ]}
    >
      <SafeAreaView
        className="border border-blue-700"
        style={[
          styles.safeArea,
          {
            paddingBottom: tabBarInset
              ? BottomTabInset + Spacing.three
              : Spacing.three,
          },
        ]}
      >
        {children}

        {Platform.OS === "web" && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.half,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});

export default SafeView;
