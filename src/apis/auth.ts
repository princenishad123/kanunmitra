import { api } from "@/lib/api";

export const sendOtp = async (phone: string) => {
  const { data } = await api.post("/auth/sign-in", { phone });
  return data;
};

export async function verifyAndLogin(phone: string, otp: string) {
  const { data } = await api.post("/auth/verify-otp", {
    phone,
    otp,
  });

  return data;
}
