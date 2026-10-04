import ProfileSkeleton from "@/components/loaders/ProfileLoader";
import SafeView from "@/components/SafeView";
import { useAuth } from "@/hooks/use-auth";
import { authStorage } from "@/lib/auth.storage";
import { fetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  BadgeQuestionMark,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Crown,
  FileText,
  Heart,
  LogOut,
  RotateCcw,
  Share as ShareIcon,
  ShieldCheck,
  User2,
} from "lucide-react-native";
import moment from "moment";
import React from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const { logout } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetcher("/user"),
  });

  const user = data?.data ?? data;

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const handleLogout = async () => {
    await authStorage.clearTokens();
    await logout();
  };

  return (
    <SafeView tabBarInset={false} backgroundColor="#09090B">
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="flex-row items-center pt-6 pb-6">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-zinc-900"
          >
            <ChevronLeft size={22} color="#FFFFFF" />
          </Pressable>
          <View>
            <Text className="text-white text-3xl font-bold">Profile</Text>
            <Text className="text-zinc-500 text-sm mt-1">
              Your account & subscription
            </Text>
          </View>
        </View>

        {/* Profile */}
        {/* Profile */}
        <View className="flex-row items-center">
          {/* Avatar: image if it exists, otherwise the icon */}
          <View className="w-[72px] h-[72px] items-center justify-center rounded-full border-2 border-zinc-700 p-1 overflow-hidden">
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <User2 size={40} color="white" />
            )}
          </View>

          <View className="ml-4 flex-1">
            {/* Name: only if it exists */}
            {!!user?.name && (
              <Text className="text-white text-xl font-bold capitalize">
                {user.name}
              </Text>
            )}

            {/* Phone: if there is no name, it takes the title style */}
            {!!user?.phone && (
              <Text
                className={
                  user?.name
                    ? "text-zinc-400 text-sm mt-1 font-semibold"
                    : "text-white text-xl font-bold"
                }
              >
                {user.phone}
              </Text>
            )}

            {/* Join date: only if it exists */}
            {!!user?.createdAt && (
              <Text className="text-zinc-600 text-xs mt-1">
                Joined on {moment(user.createdAt).format("DD MMM YYYY")}
              </Text>
            )}
          </View>
        </View>

        {/* Premium Card */}
        <View className=" mt-7">
          <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-11 h-11 rounded-2xl bg-yellow-500/10 items-center justify-center">
                  <Crown size={22} color="#FACC15" />
                </View>

                <View className="ml-3">
                  <Text className="text-zinc-500 text-xs uppercase font-medium">
                    Current Plan
                  </Text>

                  <Text className="text-white text-lg font-bold mt-1">
                    Premium
                  </Text>
                </View>
              </View>

              <View className="px-3 py-1.5 rounded-full bg-green-500/10">
                <Text className="text-green-400 text-[10px] font-bold">
                  ACTIVE
                </Text>
              </View>
            </View>

            <View className="h-[1px] bg-zinc-800 my-5" />

            <View className="flex-row">
              <View className="flex-1">
                <Text className="text-zinc-500 text-xs">Valid until</Text>

                <Text className="text-white font-semibold mt-1">
                  05 Oct 2026
                </Text>
              </View>

              <View className="flex-1">
                <Text className="text-zinc-500 text-xs">Auto Pay</Text>

                <Text className="text-green-400 font-semibold mt-1">
                  Enabled
                </Text>
              </View>
            </View>

            <Pressable className="mt-5 h-12 rounded-xl bg-white items-center justify-center">
              <Text className="text-black font-bold">Manage Subscription</Text>
            </Pressable>
          </View>
        </View>

        {/* Account */}
        <Section title="Others">
          <MenuItem
            icon={<ShareIcon size={20} color="#A1A1AA" />}
            title="Share App"
            subtitle="Share app with your family"
            id="share"
          />

          <Divider />

          <MenuItem
            icon={<BadgeQuestionMark size={20} color="#A1A1AA" />}
            title="Faq"
            subtitle="Frequent asked questions"
            id="faq"
          />
        </Section>

        {/* Support */}
        <Section title="SUPPORT">
          <MenuItem
            icon={<CircleHelp size={20} color="#A1A1AA" />}
            title="Help & Support"
            subtitle="Get help or contact us"
            id="help"
          />
        </Section>

        {/* Legal */}
        <Section title="LEGAL">
          <MenuItem
            icon={<FileText size={20} color="#A1A1AA" />}
            title="Terms & Conditions"
            id="terms-and-conditions"
          />

          <Divider />

          <MenuItem
            icon={<ShieldCheck size={20} color="#A1A1AA" />}
            title="Privacy Policy"
            id="privacy-policy"
          />

          <Divider />

          <MenuItem
            icon={<RotateCcw size={20} color="#A1A1AA" />}
            title="Refund Policy"
            id="refund-policy"
          />
        </Section>

        {/* Logout */}
        <View className="px-5 mt-8">
          <Pressable
            onPress={handleLogout}
            className="h-12 rounded-2xl border border-red-500/20 bg-red-500/5 flex-row items-center justify-center"
          >
            <LogOut size={19} color="#EF4444" />

            <Text className="text-red-400 font-semibold ml-2">Logout</Text>
          </Pressable>
        </View>

        {/* Version */}
        <View className="items-center mt-8">
          <View className="flex-row items-center">
            <Text className="text-xs text-zinc-600">Kanoon Jano made with</Text>
            <Heart size={13} color="#EF4444" fill="#EF4444" />
            <Text className="text-xs text-zinc-600">India</Text>
          </View>

          <Text className="text-zinc-700 text-xl mt-2">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className=" mt-4">
      <Text className="text-zinc-600 text-xs font-bold mb-3 tracking-wider">
        {title}
      </Text>

      <View className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {children}
      </View>
    </View>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
  rightText,
  id,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  rightText?: string;
  id?: string;
}) {
  const handleButton = async () => {
    if (id === "share") {
      await Share.share({
        message: "Check this out!",
      });

      return;
    }

    if (id === "faq") {
      return;
    }

    if (id === "help") {
      await Linking.openURL("https://wa.link/n1l30x");
      return;
    }

    if (id === "terms-and-conditions") {
      return;
    }
    if (id === "privacy-policy") {
      return;
    }
    if (id === "refund-policy") {
      return;
    }
  };

  return (
    <TouchableOpacity
      onPress={handleButton}
      className="min-h-[66px] px-4 py-3 flex-row items-center"
    >
      <View className="w-10 h-10 rounded-xl bg-zinc-800 items-center justify-center">
        {icon}
      </View>

      <View className="flex-1 ml-3">
        <Text className="text-white text-sm font-semibold">{title}</Text>

        {subtitle && (
          <Text className="text-zinc-500 text-xs mt-1">{subtitle}</Text>
        )}
      </View>

      {rightText ? (
        <Text className="text-green-400 text-xs font-bold mr-2">
          {rightText}
        </Text>
      ) : (
        <ChevronRight size={18} color="#52525B" />
      )}
    </TouchableOpacity>
  );
}

function Divider() {
  return <View className="h-[1px] bg-zinc-800 ml-[68px]" />;
}
