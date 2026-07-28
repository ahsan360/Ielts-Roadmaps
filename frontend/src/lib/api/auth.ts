import client from "./client";
import type { ApiResponse, LoginRequest, PaginatedResponse, RegisterRequest, TokenResponse, User } from "../types";

export const authApi = {
  register: (data: RegisterRequest) =>
    client.post<ApiResponse<TokenResponse>>("/auth/register", data).then((r) => r.data.data),

  login: (data: LoginRequest) =>
    client.post<ApiResponse<TokenResponse>>("/auth/login", data).then((r) => r.data.data),

  getMe: () =>
    client.get<ApiResponse<User>>("/auth/me").then((r) => r.data.data),

  updateMe: (data: Partial<User>) =>
    client.put<ApiResponse<User>>("/auth/me", data).then((r) => r.data.data),

  listUsers: (params?: { page?: number; limit?: number; role?: string; search?: string }) =>
    client.get<PaginatedResponse<User>>("/auth/users", { params }).then((r) => r.data),

  verifyUser: (userId: string) =>
    client.patch<ApiResponse<User>>(`/auth/users/${userId}/verify`).then((r) => r.data.data),

  changeRole: (userId: string, role: "admin" | "volunteer") =>
    client.patch<ApiResponse<User>>(`/auth/users/${userId}/role`, { role }).then((r) => r.data.data),
};
