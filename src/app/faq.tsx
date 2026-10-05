import SafeView from "@/components/SafeView";

import { router } from "expo-router";
import { ChevronDown, ChevronLeft, ChevronUp } from "lucide-react-native";
import { useState } from "react";

import { LayoutAnimation, Text, TouchableOpacity, View } from "react-native";

const faqs = [
  {
    question: "What is this app?",
    answer:
      "This app gives you access to premium content, videos, and other useful resources in one place.",
  },
  {
    question: "How do I create an account?",
    answer:
      "Simply go to the Sign In screen, enter your details, and complete the verification process.",
  },
  {
    question: "How do I subscribe to a plan?",
    answer:
      "Open the subscription section, select the plan you want, and complete the payment.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes. You can manage or cancel your subscription from your account settings.",
  },
  {
    question: "What happens if my payment fails?",
    answer:
      "If your payment fails, your subscription will not be activated. You can try the payment again.",
  },
  {
    question: "Can I use my account on multiple devices?",
    answer:
      "Device access depends on the limits of your current subscription plan.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can contact our support team from the Help & Support section of the app.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SafeView>
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center mb-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center mr-3"
          >
            <ChevronLeft size={22} color="white" />
          </TouchableOpacity>

          <Text className="text-white text-2xl font-bold">FAQ</Text>
        </View>
        <View className="pt-5 pb-6">
          <Text className="text-primary-500 text-3xl font-bold">
            Frequently Asked
          </Text>

          <Text className="text-zinc-400 text-base mt-2">
            Find answers to the most common questions.
          </Text>
        </View>

        {/* FAQ List */}
        <View className="gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => toggleFAQ(index)}
                className="bg-zinc-900 rounded-2xl px-4 py-4"
              >
                {/* Question */}
                <View className="flex-row items-center justify-between">
                  <Text
                    className="text-white text-base font-semibold flex-1 pr-4"
                    numberOfLines={2}
                  >
                    {faq.question}
                  </Text>

                  {isOpen ? (
                    <ChevronUp size={20} color="white" />
                  ) : (
                    <ChevronDown size={20} color="white" />
                  )}
                </View>

                {/* Answer */}
                {isOpen && (
                  <View className="mt-3 pt-3 border-t border-zinc-800">
                    <Text className="text-zinc-400 text-sm leading-6">
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeView>
  );
}
