import { isAxiosError } from "axios";

export const catchError = (error: unknown) => {
  if (isAxiosError(error)) {
    const messages = error.response?.data;

    return messages;
  }

  return "something error";
};
