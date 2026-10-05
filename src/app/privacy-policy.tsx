import SafeView from "@/components/SafeView";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PrivacyPolicy() {
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
            Privacy Policy
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
            title="1. Introduction"
            text="Your privacy is important to us. This Privacy Policy explains what information we collect, how we use it, and how we protect your information when you use our application."
          />

          <Section
            title="2. Information We Collect"
            text="We may collect information that you provide when creating or using your account, such as your name, email address, phone number, and other information required to provide our services."
          />

          <Section
            title="3. Account Information"
            text="We use your account information to authenticate you, maintain your account, provide access to features, and communicate with you about important service-related updates."
          />

          <Section
            title="4. How We Use Your Information"
            text="We may use collected information to provide and improve our services, process transactions, manage subscriptions, provide customer support, prevent fraud, maintain security, and comply with applicable laws."
          />

          <Section
            title="5. Payment Information"
            text="Payments may be processed by third-party payment providers. We do not directly store sensitive payment information such as complete card numbers. Payment providers handle payment information according to their own privacy policies."
          />

          <Section
            title="6. Device and Technical Information"
            text="We may collect certain technical information such as device type, operating system, application version, and information necessary to maintain the security and functionality of the application."
          />

          <Section
            title="7. Cookies and Similar Technologies"
            text="Our services may use cookies or similar technologies where applicable to maintain sessions, remember preferences, improve functionality, and understand how our services are used."
          />

          <Section
            title="8. Information Sharing"
            text="We do not sell your personal information. We may share information with trusted service providers when necessary to operate our services, process payments, provide infrastructure, or comply with legal obligations."
          />

          <Section
            title="9. Data Security"
            text="We take reasonable technical and organizational measures to protect your information against unauthorized access, loss, misuse, or disclosure. However, no method of electronic transmission or storage is completely secure."
          />

          <Section
            title="10. Data Retention"
            text="We retain your information only for as long as reasonably necessary to provide our services, maintain records, resolve disputes, enforce agreements, and comply with applicable legal requirements."
          />

          <Section
            title="11. Your Rights"
            text="Depending on applicable law, you may have rights to access, correct, update, or delete certain personal information. You may contact us to request assistance with your information."
          />

          <Section
            title="12. Children's Privacy"
            text="Our services are not intended for children who are not legally permitted to use the service. We do not knowingly collect personal information from children without appropriate authorization."
          />

          <Section
            title="13. Third-Party Services"
            text="Our application may use third-party services for payments, analytics, authentication, hosting, notifications, or other functionality. These services may process information according to their own privacy policies."
          />

          <Section
            title="14. Changes to This Privacy Policy"
            text="We may update this Privacy Policy from time to time. When changes are made, the updated policy will be made available through the application or other appropriate communication channels."
          />

          <Section
            title="15. Contact Us"
            text="If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact our support team through the available support channels."
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
