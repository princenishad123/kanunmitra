declare module "react-native-razorpay" {
  export type RazorpayCheckoutOptions = {
    key: string;
    subscription_id: string;
    name: string;
    description: string;
    currency: "INR";
    method: "upi";
    theme: { color: string };
  };

  export type RazorpaySuccess = {
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    razorpay_signature: string;
  };

  export type RazorpayFailure = {
    code?: number | string;
    description?: string;
  };

  const RazorpayCheckout: {
    open(options: RazorpayCheckoutOptions): Promise<RazorpaySuccess>;
  };

  export default RazorpayCheckout;
}
