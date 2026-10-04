import { Colors } from "@/constants/theme";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

export default function AppTabs() {
  const scheme = useColorScheme();

  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{
        selected: {
          color: colors.text,
        },
      }}
    >
      {/* HOME */}
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/home.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      {/* EXPLORE */}
      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/fire.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      {/* SAVED */}
      <NativeTabs.Trigger name="save">
        <NativeTabs.Trigger.Label>Save</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/bookmark.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      {/* PREMIUM */}
      <NativeTabs.Trigger name="premium">
        <NativeTabs.Trigger.Label>Premium</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/premium.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
