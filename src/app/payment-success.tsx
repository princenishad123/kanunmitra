import PaymentSuccessScreen from "@/components/ui/PaymentSuccess";
import { router } from "expo-router";

export default function paymentSuccess() {
  return (
    <PaymentSuccessScreen
      amount="₹1,249.00"
      merchant="Blue Tokai Coffee"
      transactionId="TXN84920173"
      paidWith="Visa ending 4242"
      date="5 Oct 2026, 4:12 PM"
      onDone={() => router.replace("/")}
    />
  );
}
