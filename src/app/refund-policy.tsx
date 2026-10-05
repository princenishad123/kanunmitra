import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import SafeView from "../components/SafeView";

export default function RefundPolicy() {
  return (
    <SafeView>
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center pt-5 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center mr-3"
          >
            <ChevronLeft size={22} color="white" />
          </TouchableOpacity>

          <Text className="text-primary-500 text-2xl font-bold">
            Refund Policy
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
        >
          <Text className="text-zinc-500 text-sm mb-6">
            Last updated: September 6, 2026
          </Text>

          <Section
            title="1. Overview"
            text="We want you to have a clear understanding of our refund policy before making a purchase. This policy explains when a refund may be available for subscriptions and other purchases made through the application."
          />

          <Section
            title="2. Subscription Payments"
            text="Subscription payments are generally non-refundable once a billing period has started, except where a refund is required by applicable law or specifically approved by us."
          />

          <Section
            title="3. Trial Period"
            text="If a trial or introductory offer is available, the applicable price and duration will be shown before you start the offer. If the trial converts into a paid subscription, the applicable subscription charge will be processed according to the selected plan."
          />

          <Section
            title="4. Accidental Purchases"
            text="If you believe that a purchase was made accidentally, please contact our support team as soon as possible. Refund requests will be reviewed on a case-by-case basis."
          />

          <Section
            title="5. Duplicate Payments"
            text="If you are charged more than once for the same subscription or purchase due to a technical issue, please contact support. After verification, the duplicate charge may be eligible for a refund."
          />

          <Section
            title="6. Failed or Incomplete Payments"
            text="If a payment fails or is reversed but your account was still charged, please contact us with the relevant transaction details. We will investigate the transaction and take appropriate action."
          />

          <Section
            title="7. Cancellation"
            text="Cancelling your subscription prevents future renewals but does not necessarily result in a refund for the current billing period. You may continue to have access until the end of the applicable subscription period."
          />

          <Section
            title="8. Refund Processing"
            text="If your refund request is approved, the refund will normally be processed through the original payment method or payment provider. The time required for the refund to appear in your account may depend on the payment provider or bank."
          />

          <Section
            title="9. Third-Party Payments"
            text="Payments may be processed through third-party payment providers. In some cases, refund requests may need to be handled according to the payment provider's policies and procedures."
          />

          <Section
            title="10. How to Request a Refund"
            text="To request a refund, contact our support team and provide the email address associated with your account, transaction details, and a brief explanation of the reason for your request."
          />

          <Section
            title="11. Refund Review"
            text="All refund requests may be reviewed before approval. We may consider factors such as the transaction date, usage of the service, payment status, duplicate charges, technical issues, and applicable laws."
          />

          <Section
            title="12. Changes to This Policy"
            text="We may update this Refund Policy from time to time. Any updated version will be made available through the application or other appropriate communication channels."
          />

          <Section
            title="13. Contact Us"
            text="If you have any questions about refunds, payments, or cancellations, please contact our support team through the available support channels."
          />
        </ScrollView>
      </View>
    </SafeView>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <View className="mb-7">
      <Text className="text-white text-lg font-semibold mb-2">{title}</Text>

      <Text className="text-zinc-400 text-[15px] leading-6">{text}</Text>
    </View>
  );
}
