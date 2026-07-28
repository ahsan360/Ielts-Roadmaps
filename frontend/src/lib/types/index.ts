// ===== Common =====
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details: { field?: string; message: string }[];
    request_id?: string;
  };
}

// ===== Auth =====
export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  role: "admin" | "volunteer";
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
  role: "admin" | "volunteer";
}

// ===== Crisis =====
export type Severity = "low" | "medium" | "high" | "critical";
export type CrisisStatus = "pending" | "approved" | "ongoing" | "resolved";

export interface MediaItem {
  url: string;
  type: "image" | "video";
  filename: string;
  size?: number;
}

export interface Crisis {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  severity: Severity;
  status: CrisisStatus;
  required_help?: string;
  reported_by_name: string;
  reported_by_email: string;
  admin_notes?: string;
  media_urls?: MediaItem[];
  goal_amount?: number;
  created_at: string;
  updated_at?: string;
  approved_at?: string;
}

export interface CrisisCreate {
  title: string;
  description: string;
  location: string;
  image_url?: string;
  severity: Severity;
  required_help?: string;
  reported_by_name: string;
  reported_by_email: string;
  media_urls?: MediaItem[];
}

// ===== Fund =====
export interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  message?: string;
  crisis_id?: string;
  created_at: string;
}

export interface DonationCreate {
  donor_name: string;
  donor_email: string;
  amount: number;
  message?: string;
  crisis_id?: string;
}

export interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  category: string;
  approved_by: string;
  crisis_id?: string;
  created_at: string;
}

export interface ChartData {
  period: string;
  total_donations: number;
  total_expenses: number;
  donation_count: number;
  expense_count: number;
}

// ===== Volunteer =====
export interface Volunteer {
  id: string;
  name: string;
  age?: number;
  phone: string;
  location: string;
  skills: string[];
  status: "available" | "assigned" | "inactive";
  assigned_task?: string;
  user_id?: string;
  assigned_crisis_id?: string;
  created_at?: string;
  updated_at?: string;
  task_status?: string;
  task_notes?: string;

}

// ===== Inventory =====
export type ItemType = "relief" | "expense";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  type: ItemType;
  added_by: string;
  crisis_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface InventorySummary {
  total_items: number;
  total_quantity: number;
  by_category: { category: string; count: number; total_quantity: number }[];
  by_type: { type: string; count: number; total_quantity: number }[];
}

// ===== Stats =====
export interface CrisisStats {
  total: number;
  by_status: Record<string, number>;
  by_severity: Record<string, number>;
}
