import SafeView from "@/components/SafeView";
import { router } from "expo-router";
import { ArrowLeft, BriefcaseBusiness, CalendarDays, ChevronRight, Clock3, FileText, Plus } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";

const orders = [
  {
    id: "KM-1048",
    title: "Legal consultation",
    detail: "Property documentation review",
    date: "12 Oct 2026 | 11:30 AM",
    status: "In progress",
    color: "#FACC15",
    icon: BriefcaseBusiness,
  },
  {
    id: "KM-1021",
    title: "Document drafting",
    detail: "Rental agreement",
    date: "08 Oct 2026 | 4:15 PM",
    status: "Completed",
    color: "#34D399",
    icon: FileText,
  },
];

const filters = ["All", "In progress", "Completed"] as const;

export default function OrdersScreen() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const visibleOrders = useMemo(
    () => (filter === "All" ? orders : orders.filter((order) => order.status === filter)),
    [filter],
  );

  return (
    <SafeView tabBarInset={false} backgroundColor="#09090B">
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 32 }}
      >
        <View className="mb-6 flex-row items-start">
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} className="mr-3 mt-1 h-10 w-10 items-center justify-center rounded-full bg-zinc-900">
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          <View>
            <Text className="text-3xl font-bold text-white">My orders</Text>
            <Text className="mt-1 text-sm text-zinc-500">Track your legal services</Text>
          </View>
        </View>

        <View className="mb-6 flex-row rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
          {filters.map((item) => {
            const selected = filter === item;
            return (
              <Pressable
                key={item}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setFilter(item)}
                className={`flex-1 items-center rounded-xl px-2 py-3 ${selected ? "bg-zinc-700" : ""}`}
              >
                <Text className={`text-xs font-semibold ${selected ? "text-white" : "text-zinc-500"}`}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-base font-bold text-white">Recent orders</Text>
          <Text className="text-xs text-zinc-500">{visibleOrders.length} orders</Text>
        </View>

        {visibleOrders.length ? (
          visibleOrders.map((order) => {
            const Icon = order.icon;
            return (
              <Pressable
                key={order.id}
                accessibilityRole="button"
                accessibilityLabel={`${order.title}, ${order.status}`}
                className="mb-3 rounded-3xl border border-zinc-800 bg-zinc-900 p-4 active:opacity-80"
              >
                <View className="mb-4 flex-row items-start">
                  <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-zinc-800">
                    <Icon size={20} color={order.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-white">{order.title}</Text>
                    <Text className="mt-1 text-xs text-zinc-500">{order.detail}</Text>
                  </View>
                  <ChevronRight size={18} color="#71717A" />
                </View>
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-xs text-zinc-600">Order {order.id}</Text>
                  <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: `${order.color}18` }}>
                    <Text className="text-[10px] font-bold" style={{ color: order.color }}>{order.status}</Text>
                  </View>
                </View>
                <View className="h-px bg-zinc-800" />
                <View className="mt-3 flex-row items-center">
                  {order.status === "Completed" ? <CalendarDays size={14} color="#71717A" /> : <Clock3 size={14} color="#71717A" />}
                  <Text className="ml-2 text-xs text-zinc-400">{order.date}</Text>
                </View>
              </Pressable>
            );
          })
        ) : (
          <View className="items-center rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-10">
            <FileText size={28} color="#71717A" />
            <Text className="mt-3 text-base font-semibold text-white">No {filter.toLowerCase()} orders</Text>
            <Text className="mt-1 text-center text-sm text-zinc-500">Your service requests will appear here.</Text>
          </View>
        )}

        <View className="mt-5 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <Text className="text-lg font-bold text-white">Need legal help?</Text>
          <Text className="mt-1 text-sm leading-5 text-zinc-400">Start a request and our team will help you find the right service.</Text>
          <Pressable accessibilityRole="button" onPress={() => Linking.openURL("https://wa.link/n1l30x")} className="mt-4 h-12 flex-row items-center justify-center rounded-2xl bg-yellow-400 active:opacity-80">
            <Plus size={18} color="#18181B" />
            <Text className="ml-2 font-bold text-zinc-950">New request</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeView>
  );
}
