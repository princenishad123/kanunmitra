import { CalendarDays, Copy, CreditCard } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type SubscriptionCardProps = {
  plan: string;
  startDate: string;
  endDate: string;
  paidOn: string;
  amount: string;
  status: any;
  transactionId: string;
};

export default function SubscriptionCard({
  plan,
  startDate,
  endDate,
  paidOn,
  amount,
  status,
  transactionId,
}: SubscriptionCardProps) {
  return (
    <View className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
      {/* Top */}
      <View className="flex-row items-center justify-between mb-5">
        <View>
          <Text className="text-zinc-400 text-xs mb-1">Subscription Plan</Text>

          <Text className="text-white text-xl font-bold">{plan}</Text>
        </View>

        <View className="bg-zinc-800 rounded-full px-3 py-1.5">
          <Text className="text-white text-xs font-semibold">{status}</Text>
        </View>
      </View>

      {/* Dates */}
      <View className="flex-row mb-5">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <CalendarDays size={14} color="#a1a1aa" />
            <Text className="text-zinc-500 text-xs ml-1.5">Start Date</Text>
          </View>

          <Text className="text-white text-sm">{startDate}</Text>
        </View>

        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <CalendarDays size={14} color="#a1a1aa" />
            <Text className="text-zinc-500 text-xs ml-1.5">End Date</Text>
          </View>

          <Text className="text-white text-sm">{endDate}</Text>
        </View>
      </View>

      {/* Payment */}
      <View className="flex-row items-center justify-between border-t border-zinc-800 pt-4 mb-4">
        <View>
          <Text className="text-zinc-500 text-xs mb-1">Paid On</Text>

          <Text className="text-white text-sm">{paidOn}</Text>
        </View>

        <View className="items-end">
          <Text className="text-zinc-500 text-xs mb-1">Amount</Text>

          <Text className="text-white text-lg font-bold">₹{amount}</Text>
        </View>
      </View>

      {/* Transaction ID */}
      <View className="bg-black/40 rounded-xl px-3 py-3">
        <View className="flex-row items-center mb-1">
          <CreditCard size={14} color="#a1a1aa" />

          <Text className="text-zinc-500 text-xs ml-1.5">Transaction ID</Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-zinc-300 text-xs flex-1 mr-3" numberOfLines={1}>
            {transactionId}
          </Text>

          <TouchableOpacity activeOpacity={0.7}>
            <Copy size={15} color="#a1a1aa" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
