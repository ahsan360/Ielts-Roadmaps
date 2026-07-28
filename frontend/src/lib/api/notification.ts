import client from "./client";
import type { ApiResponse, PaginatedResponse } from "../types";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  reference_id?: string;
  is_read: boolean;
  created_at: string;
}

export const notificationApi = {
  list: (params?: { page?: number; limit?: number; unread_only?: boolean }) =>
    client.get<PaginatedResponse<Notification>>("/notifications", { params }).then((r) => r.data),

  getUnreadCount: () =>
    client.get<ApiResponse<{ unread: number }>>("/notifications/count").then((r) => r.data.data),

  markAsRead: (id: string) =>
    client.patch<ApiResponse<Notification>>(`/notifications/${id}/read`).then((r) => r.data.data),

  markAllRead: () =>
    client.post("/notifications/read-all").then((r) => r.data),
};
