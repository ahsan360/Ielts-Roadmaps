import client from "./client";
import type { ApiResponse, ChartData, Donation, DonationCreate, Expense, PaginatedResponse } from "../types";
import {
  SAMPLE_CHART_DATA,
  SAMPLE_DONATIONS,
  SAMPLE_DONATION_TOTAL,
  SAMPLE_EXPENSES,
  SAMPLE_FUND_SUMMARY,
  isEmptyList,
  paginate,
  withFallback,
} from "./sample-data";

export const fundApi = {
  donate: (data: DonationCreate) =>
    client.post<ApiResponse<Donation>>("/funds/donations", data).then((r) => r.data.data),

  listDonations: (params?: { page?: number; limit?: number }) => {
    const fallback = paginate(SAMPLE_DONATIONS, params?.page ?? 1, params?.limit ?? 10);
    return withFallback(
      client.get<PaginatedResponse<Donation>>("/funds/donations", { params }).then((r) => r.data),
      fallback,
      isEmptyList,
    );
  },

  getDonationTotal: () =>
    withFallback(
      client.get<ApiResponse<{ total: number }>>("/funds/donations/total").then((r) => r.data.data),
      SAMPLE_DONATION_TOTAL,
      (v) => !v || !v.total,
    ),

  createExpense: (data: { title: string; description?: string; amount: number; category: string; crisis_id?: string }) =>
    client.post<ApiResponse<Expense>>("/funds/expenses", data).then((r) => r.data.data),

  listExpenses: (params?: { page?: number; limit?: number; category?: string }) => {
    const fallback = paginate(SAMPLE_EXPENSES, params?.page ?? 1, params?.limit ?? 10);
    return withFallback(
      client.get<PaginatedResponse<Expense>>("/funds/expenses", { params }).then((r) => r.data),
      fallback,
      isEmptyList,
    );
  },

  getChartData: (params?: { start_date?: string; end_date?: string }) =>
    withFallback(
      client.get<ApiResponse<ChartData[]>>("/funds/charts/daily", { params }).then((r) => r.data.data),
      SAMPLE_CHART_DATA,
      (v) => !Array.isArray(v) || v.length === 0,
    ),

  getSummary: (params?: { from_date?: string; to_date?: string }) =>
    withFallback(
      client.get<ApiResponse<any>>("/funds/summary", { params }).then((r) => r.data.data),
      SAMPLE_FUND_SUMMARY,
    ),

  exportReport: (params: { format: "csv" | "xlsx"; type: "donations" | "expenses" }) =>
    client.get("/funds/reports/export", { params, responseType: "blob" }).then((r) => r.data),
};
