import PaymentFailureScreen from "@/components/ui/PaymentFailure";
import { router } from "expo-router";

export default function paymentFailed() {
  return (
    <PaymentFailureScreen
      amount="₹1,249.00"
      errorCode="CARD_DECLINED"
      onRetry={() => router.back()}
      onChangeMethod={() => router.push("/(tabs)/premium")}
      onCancel={() => router.replace("/")}
    />
  );
}
