import client from "./client";
import type { ApiResponse, PaginatedResponse, Volunteer } from "../types";
import {
  SAMPLE_VOLUNTEERS,
  SAMPLE_VOLUNTEER_STATS,
  isEmptyList,
  paginate,
  withFallback,
} from "./sample-data";

function filterSampleVolunteers(params?: { status?: string; search?: string }) {
  let items = [...SAMPLE_VOLUNTEERS];
  if (params?.status) items = items.filter((v) => v.status === params.status);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.skills.some((s) => s.toLowerCase().includes(q)),
    );
  }
  return items;
}

export const volunteerApi = {
  list: (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    const fallback = paginate(filterSampleVolunteers(params), params?.page ?? 1, params?.limit ?? 12);
    return withFallback(
      client.get<PaginatedResponse<Volunteer>>("/volunteers", { params }).then((r) => r.data),
      fallback,
      isEmptyList,
    );
  },

  createProfile: (data: { name: string; age?: number; phone: string; location: string; skills: string[] }) =>
    client.post<ApiResponse<Volunteer>>("/volunteers/profile", data).then((r) => r.data.data),

  getMyProfile: () =>
    client.get<ApiResponse<Volunteer>>("/volunteers/profile/me").then((r) => r.data.data),

  updateProfile: (data: Partial<Volunteer>) =>
    client.put<ApiResponse<Volunteer>>("/volunteers/profile/me", data).then((r) => r.data.data),

  getById: (id: string) => {
    const fallback = SAMPLE_VOLUNTEERS.find((v) => v.id === id) ?? SAMPLE_VOLUNTEERS[0];
    return withFallback(
      client.get<ApiResponse<Volunteer>>(`/volunteers/${id}`).then((r) => r.data.data),
      fallback,
    );
  },

  assign: (id: string, data: { crisis_id: string; task: string }) =>
    client.patch<ApiResponse<Volunteer>>(`/volunteers/${id}/assign`, data).then((r) => r.data.data),

  unassign: (id: string) =>
    client.patch<ApiResponse<Volunteer>>(`/volunteers/${id}/unassign`).then((r) => r.data.data),

  getStats: () =>
    withFallback(
      client.get<ApiResponse<any>>("/volunteers/stats").then((r) => r.data.data),
      SAMPLE_VOLUNTEER_STATS,
    ),

  updateTask: (data: { task_status: string; task_notes?: string }) =>
    client.patch<ApiResponse<Volunteer>>("/volunteers/profile/me/task", data).then((r) => r.data.data),
};
