import SafeView from "@/components/SafeView";

import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TermsAndConditions() {
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
            Terms & Conditions
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
            title="1. Acceptance of Terms"
            text="By accessing or using this application, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use the application."
          />

          <Section
            title="2. Account"
            text="You are responsible for maintaining the security of your account and for all activities performed through your account. You should provide accurate and up-to-date information when creating your account."
          />

          <Section
            title="3. Use of the Application"
            text="You agree to use the application only for lawful purposes. You must not misuse the application, attempt to gain unauthorized access, or interfere with the normal operation of the service."
          />

          <Section
            title="4. Subscriptions and Payments"
            text="Some features or content may require a paid subscription. Subscription prices, billing periods, and available features will be displayed before purchase. Payments are processed through the supported payment provider."
          />

          <Section
            title="5. Cancellation"
            text="You may cancel your subscription according to the available cancellation options. Cancellation does not automatically entitle you to a refund unless required by applicable law or specifically stated in our refund policy."
          />

          <Section
            title="6. Content"
            text="All content provided through the application is intended for personal use unless otherwise stated. You may not copy, redistribute, reproduce, or commercially exploit content without appropriate permission."
          />

          <Section
            title="7. Intellectual Property"
            text="The application, its design, branding, text, graphics, and other materials are protected by applicable intellectual property laws. All rights not expressly granted are reserved."
          />

          <Section
            title="8. Privacy"
            text="Your use of the application may involve the collection and processing of certain information. Please review our Privacy Policy to understand how your information is handled."
          />

          <Section
            title="9. Service Availability"
            text="We may occasionally modify, suspend, or temporarily restrict access to parts of the application for maintenance, updates, security, or other operational reasons."
          />

          <Section
            title="10. Limitation of Liability"
            text="To the maximum extent permitted by applicable law, we are not responsible for indirect, incidental, or consequential losses resulting from your use of the application."
          />

          <Section
            title="11. Changes to These Terms"
            text="We may update these Terms and Conditions from time to time. Updated terms will become effective when published within the application or through other appropriate communication."
          />

          <Section
            title="12. Contact Us"
            text="If you have any questions regarding these Terms and Conditions, please contact our support team through the available support channels."
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
