export const formatPhone = (phone?: string) =>
  phone?.startsWith("+91") ? `+91 ${phone.slice(3)}` : (phone ?? "");

export const capitalize = (name?: string) =>
  (name ?? "").replace(/\b\w/g, (c) => c.toUpperCase());
