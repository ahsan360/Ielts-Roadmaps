import client from "./client";
import type { ApiResponse, Crisis, CrisisCreate, CrisisStats, MediaItem, PaginatedResponse } from "../types";
import {
  SAMPLE_CRISES,
  SAMPLE_CRISIS_STATS,
  isEmptyList,
  paginate,
  withFallback,
} from "./sample-data";

function filterSampleCrises(params?: {
  status?: string;
  severity?: string;
  search?: string;
}) {
  let items = [...SAMPLE_CRISES];
  if (params?.status) items = items.filter((c) => c.status === params.status);
  if (params?.severity) items = items.filter((c) => c.severity === params.severity);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }
  return items;
}

export const crisisApi = {
  list: (params?: { page?: number; limit?: number; status?: string; severity?: string; search?: string }) => {
    const fallback = paginate(filterSampleCrises(params), params?.page ?? 1, params?.limit ?? 12);
    return withFallback(
      client.get<PaginatedResponse<Crisis>>("/crises/", { params }).then((r) => r.data),
      fallback,
      isEmptyList,
    );
  },

  listAdmin: (params?: { page?: number; limit?: number; status?: string; severity?: string; search?: string }) => {
    const fallback = paginate(filterSampleCrises(params), params?.page ?? 1, params?.limit ?? 12);
    return withFallback(
      client.get<PaginatedResponse<Crisis>>("/crises/admin", { params }).then((r) => r.data),
      fallback,
      isEmptyList,
    );
  },

  getById: (id: string) => {
    const fallback = SAMPLE_CRISES.find((c) => c.id === id) ?? SAMPLE_CRISES[0];
    return withFallback(
      client.get<ApiResponse<Crisis>>(`/crises/${id}`).then((r) => r.data.data),
      fallback,
    );
  },

  create: (data: CrisisCreate) =>
    client.post<ApiResponse<Crisis>>("/crises/", data).then((r) => r.data.data),

  update: (id: string, data: Partial<Crisis>) =>
    client.put<ApiResponse<Crisis>>(`/crises/${id}`, data).then((r) => r.data.data),

  approve: (id: string, adminNotes?: string) =>
    client.patch<ApiResponse<Crisis>>(`/crises/${id}/approve`, { admin_notes: adminNotes }).then((r) => r.data.data),

  changeStatus: (id: string, status: string) =>
    client.patch<ApiResponse<Crisis>>(`/crises/${id}/status`, { status }).then((r) => r.data.data),

  delete: (id: string) =>
    client.delete(`/crises/${id}`),

  getStats: () =>
    withFallback(
      client.get<ApiResponse<CrisisStats>>("/crises/stats").then((r) => r.data.data),
      SAMPLE_CRISIS_STATS,
    ),

  uploadMedia: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return client
      .post<ApiResponse<{ urls: MediaItem[] }>>("/crises/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      })
      .then((r) => r.data.data.urls);
  },

  getTimeline: (crisisId: string, params?: { page?: number; limit?: number }) => {
    const fallback = paginate<any>([], params?.page ?? 1, params?.limit ?? 10);
    return withFallback(
      client.get<PaginatedResponse<any>>(`/crises/${crisisId}/timeline`, { params }).then((r) => r.data),
      fallback,
    );
  },

  sendSOS: (data: { latitude: number; longitude: number; phone?: string; message?: string }) =>
    client.post<ApiResponse<Crisis>>("/sos/", data).then((r) => r.data.data),
};
