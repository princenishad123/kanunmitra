import SafeView from "@/components/SafeView";
import ActivePremium from "@/components/ui/Subscribed";
import PremiumPlan from "@/components/ui/PremiumPlan";
import { fetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { ActivityIndicator, View } from "react-native";

type UserSubscription = {
  expiredAt?: string;
  startedAt?: string;
};

export default function PremiumScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetcher("/user"),
  });

  const user = (data?.data ?? data) as UserSubscription | undefined;
  const expiry = user?.expiredAt;
  const isPremiumActive = Boolean(
    expiry && moment(expiry).isValid() && moment(expiry).isAfter(moment()),
  );

  if (isLoading) {
    return (
      <SafeView tabBarInset={false} backgroundColor="#09090B">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#FACC15" />
        </View>
      </SafeView>
    );
  }

  if (isPremiumActive && expiry) {
    const startedAt = user?.startedAt;
    return (
      <ActivePremium
        expiredAt={expiry}
        startedAt={startedAt && moment(startedAt).isValid() ? startedAt : undefined}
      />
    );
  }

  return <PremiumPlan period="month" />;
}
