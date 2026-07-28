import client from "./client";
import type { ApiResponse, InventoryItem, InventorySummary, PaginatedResponse } from "../types";
import {
  SAMPLE_INVENTORY,
  SAMPLE_INVENTORY_SUMMARY,
  isEmptyList,
  paginate,
  withFallback,
} from "./sample-data";

function filterSampleInventory(params?: {
  category?: string;
  type?: string;
  crisis_id?: string;
}) {
  let items = [...SAMPLE_INVENTORY];
  if (params?.category) items = items.filter((i) => i.category === params.category);
  if (params?.type) items = items.filter((i) => i.type === params.type);
  if (params?.crisis_id) items = items.filter((i) => i.crisis_id === params.crisis_id);
  return items;
}

export const inventoryApi = {
  list: (params?: { page?: number; limit?: number; category?: string; type?: string; crisis_id?: string }) => {
    const fallback = paginate(filterSampleInventory(params), params?.page ?? 1, params?.limit ?? 12);
    return withFallback(
      client.get<PaginatedResponse<InventoryItem>>("/inventory/items", { params }).then((r) => r.data),
      fallback,
      isEmptyList,
    );
  },

  getById: (id: string) => {
    const fallback = SAMPLE_INVENTORY.find((i) => i.id === id) ?? SAMPLE_INVENTORY[0];
    return withFallback(
      client.get<ApiResponse<InventoryItem>>(`/inventory/items/${id}`).then((r) => r.data.data),
      fallback,
    );
  },

  create: (data: { name: string; category: string; quantity: number; unit: string; type: string; crisis_id?: string }) =>
    client.post<ApiResponse<InventoryItem>>("/inventory/items", data).then((r) => r.data.data),

  update: (id: string, data: Partial<InventoryItem>) =>
    client.put<ApiResponse<InventoryItem>>(`/inventory/items/${id}`, data).then((r) => r.data.data),

  adjustQuantity: (id: string, adjustment: number) =>
    client.patch<ApiResponse<InventoryItem>>(`/inventory/items/${id}/quantity`, { adjustment }).then((r) => r.data.data),

  delete: (id: string) =>
    client.delete(`/inventory/items/${id}`),

  getSummary: (crisisId?: string) =>
    withFallback(
      client.get<ApiResponse<InventorySummary>>("/inventory/summary", { params: { crisis_id: crisisId } }).then((r) => r.data.data),
      SAMPLE_INVENTORY_SUMMARY,
    ),

  exportReport: (params: { format: "csv" | "xlsx"; crisis_id?: string }) =>
    client.get("/inventory/reports/export", { params, responseType: "blob" }).then((r) => r.data),
};
