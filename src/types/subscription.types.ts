export type SubscriptionStatus =
  "active" | "cancelled" | "refunded" | "failed" | "expired";

export type Subscription = {
  _id: string;
  userId: string;
  plan: string;
  amount: number;
  start_date: string;
  end_date: string;
  status: SubscriptionStatus;
  paymentId: string;
  createdAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type SubscriptionResponse = {
  statusCode: number;
  data: {
    subscriptions: Subscription[];
    pagination: Pagination;
  };
  message: string;
  success: boolean;
};
