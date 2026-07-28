import type {
  ChartData,
  Crisis,
  CrisisStats,
  Donation,
  Expense,
  InventoryItem,
  InventorySummary,
  PaginatedResponse,
  Volunteer,
} from "../types";

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

export const SAMPLE_CRISES: Crisis[] = [
  {
    id: "sample-crisis-1",
    title: "Severe Flooding in Riverside District",
    description:
      "Heavy monsoon rains have caused major flooding across the Riverside district, displacing over 2,000 families. Urgent need for evacuation, shelter, and clean water.",
    location: "Riverside, Karachi",
    latitude: 24.8607,
    longitude: 67.0011,
    image_url:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&h=300&fit=crop",
    severity: "critical",
    status: "ongoing",
    required_help: "Evacuation boats, dry food, bottled water, medical supplies",
    reported_by_name: "Ahmed Khan",
    reported_by_email: "ahmed@example.com",
    goal_amount: 500000,
    created_at: daysAgo(2),
    approved_at: daysAgo(2),
  },
  {
    id: "sample-crisis-2",
    title: "7.2 Magnitude Earthquake Damages",
    description:
      "Earthquake aftershocks have damaged hundreds of homes. Search and rescue operations ongoing. Medical teams on site.",
    location: "Quetta, Balochistan",
    latitude: 30.1798,
    longitude: 66.9749,
    image_url:
      "https://images.unsplash.com/photo-1573481078935-b9605167e06b?w=600&h=300&fit=crop",
    severity: "critical",
    status: "ongoing",
    required_help: "Rescue teams, medical aid, temporary shelters",
    reported_by_name: "Sara Malik",
    reported_by_email: "sara@example.com",
    goal_amount: 750000,
    created_at: daysAgo(4),
    approved_at: daysAgo(4),
  },
  {
    id: "sample-crisis-3",
    title: "Wildfire Spreading Near Hill Station",
    description:
      "A fast-moving wildfire threatens surrounding villages. Firefighters requesting additional support and equipment.",
    location: "Murree Hills",
    latitude: 33.9062,
    longitude: 73.3903,
    image_url:
      "https://images.unsplash.com/photo-1602524206684-fdf1ff697355?w=600&h=300&fit=crop",
    severity: "high",
    status: "approved",
    required_help: "Firefighting equipment, water tankers, evacuation support",
    reported_by_name: "Bilal Ahmed",
    reported_by_email: "bilal@example.com",
    goal_amount: 300000,
    created_at: daysAgo(6),
    approved_at: daysAgo(5),
  },
  {
    id: "sample-crisis-4",
    title: "Drought Affecting Farming Communities",
    description:
      "Extended drought has decimated crops. Food and water distribution urgently needed for 500+ households.",
    location: "Tharparkar, Sindh",
    latitude: 24.7449,
    longitude: 70.3697,
    image_url:
      "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=300&fit=crop",
    severity: "high",
    status: "approved",
    required_help: "Food packages, water, livestock feed",
    reported_by_name: "Fatima Rashid",
    reported_by_email: "fatima@example.com",
    goal_amount: 400000,
    created_at: daysAgo(8),
    approved_at: daysAgo(7),
  },
  {
    id: "sample-crisis-5",
    title: "Landslide Blocks Main Highway",
    description:
      "Landslide has blocked supply route to mountain villages. Clearing operations in progress. Residents cut off from aid.",
    location: "Hunza Valley",
    latitude: 36.3167,
    longitude: 74.65,
    image_url:
      "https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=600&h=300&fit=crop",
    severity: "medium",
    status: "ongoing",
    required_help: "Heavy machinery, essential supplies by air",
    reported_by_name: "Imran Shah",
    reported_by_email: "imran@example.com",
    goal_amount: 200000,
    created_at: daysAgo(10),
    approved_at: daysAgo(10),
  },
  {
    id: "sample-crisis-6",
    title: "Urban Flooding — Storm Damage",
    description:
      "Heavy storm caused flooding in low-lying neighborhoods. Power outage affecting 15,000 residents.",
    location: "Lahore",
    latitude: 31.5204,
    longitude: 74.3587,
    image_url:
      "https://images.unsplash.com/photo-1504807417934-b18aaf089961?w=600&h=300&fit=crop",
    severity: "medium",
    status: "resolved",
    required_help: "Completed — power restored, water receded",
    reported_by_name: "Nadia Hussain",
    reported_by_email: "nadia@example.com",
    goal_amount: 150000,
    created_at: daysAgo(20),
    approved_at: daysAgo(19),
  },
  {
    id: "sample-crisis-7",
    title: "Heatwave Health Crisis",
    description:
      "Record temperatures causing heatstroke cases. Cooling centers being set up.",
    location: "Jacobabad, Sindh",
    latitude: 28.2812,
    longitude: 68.4375,
    image_url:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&h=300&fit=crop",
    severity: "low",
    status: "approved",
    required_help: "ORS packets, cold drinking water, fans",
    reported_by_name: "Omar Farooq",
    reported_by_email: "omar@example.com",
    goal_amount: 80000,
    created_at: daysAgo(12),
    approved_at: daysAgo(11),
  },
  {
    id: "sample-crisis-8",
    title: "Cyclone Preparedness — Coastal Region",
    description:
      "Cyclone warning issued. Evacuation of coastal villages underway. Relief supplies being pre-positioned.",
    location: "Gwadar, Balochistan",
    latitude: 25.1216,
    longitude: 62.3254,
    image_url:
      "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=600&h=300&fit=crop",
    severity: "high",
    status: "approved",
    required_help: "Emergency shelters, life jackets, communications",
    reported_by_name: "Zainab Ali",
    reported_by_email: "zainab@example.com",
    goal_amount: 600000,
    created_at: daysAgo(1),
    approved_at: daysAgo(1),
  },
];

export const SAMPLE_VOLUNTEERS: Volunteer[] = [
  {
    id: "sample-vol-1",
    name: "Hassan Raza",
    age: 28,
    phone: "+92-300-1234567",
    location: "Karachi",
    skills: ["first_aid", "rescue", "swimming"],
    status: "assigned",
    assigned_task: "Flood evacuation — Riverside District",
    assigned_crisis_id: "sample-crisis-1",
    created_at: daysAgo(30),
  },
  {
    id: "sample-vol-2",
    name: "Ayesha Tariq",
    age: 32,
    phone: "+92-301-2345678",
    location: "Lahore",
    skills: ["medical", "first_aid", "coordination"],
    status: "assigned",
    assigned_task: "Medical triage — Earthquake zone",
    assigned_crisis_id: "sample-crisis-2",
    created_at: daysAgo(45),
  },
  {
    id: "sample-vol-3",
    name: "Usman Javed",
    age: 25,
    phone: "+92-302-3456789",
    location: "Islamabad",
    skills: ["logistics", "driving", "coordination"],
    status: "available",
    created_at: daysAgo(60),
  },
  {
    id: "sample-vol-4",
    name: "Mariam Sheikh",
    age: 29,
    phone: "+92-303-4567890",
    location: "Peshawar",
    skills: ["psychological_support", "first_aid"],
    status: "available",
    created_at: daysAgo(20),
  },
  {
    id: "sample-vol-5",
    name: "Tariq Mahmood",
    age: 35,
    phone: "+92-304-5678901",
    location: "Quetta",
    skills: ["rescue", "engineering", "climbing"],
    status: "assigned",
    assigned_task: "Search & rescue — Earthquake response",
    assigned_crisis_id: "sample-crisis-2",
    created_at: daysAgo(90),
  },
  {
    id: "sample-vol-6",
    name: "Hina Akhtar",
    age: 26,
    phone: "+92-305-6789012",
    location: "Multan",
    skills: ["medical", "pharmacy"],
    status: "available",
    created_at: daysAgo(15),
  },
  {
    id: "sample-vol-7",
    name: "Saad Iqbal",
    age: 31,
    phone: "+92-306-7890123",
    location: "Faisalabad",
    skills: ["firefighting", "rescue"],
    status: "assigned",
    assigned_task: "Wildfire suppression — Murree",
    assigned_crisis_id: "sample-crisis-3",
    created_at: daysAgo(50),
  },
  {
    id: "sample-vol-8",
    name: "Rabia Noor",
    age: 27,
    phone: "+92-307-8901234",
    location: "Hyderabad",
    skills: ["coordination", "communications"],
    status: "available",
    created_at: daysAgo(10),
  },
];

export const SAMPLE_DONATIONS: Donation[] = [
  { id: "sample-don-1",  donor_name: "Anonymous Donor",    donor_email: "anon1@example.com",  amount: 50000, message: "Praying for everyone affected",  created_at: daysAgo(1) },
  { id: "sample-don-2",  donor_name: "Khan Foundation",    donor_email: "khan@foundation.org", amount: 100000, message: "Standing with our fellow citizens", created_at: daysAgo(1) },
  { id: "sample-don-3",  donor_name: "Ali Corp",           donor_email: "csr@alicorp.pk",    amount: 75000, message: "CSR contribution",               created_at: daysAgo(2) },
  { id: "sample-don-4",  donor_name: "Sarah Ahmed",        donor_email: "sarah@gmail.com",   amount: 5000,                                        created_at: daysAgo(2) },
  { id: "sample-don-5",  donor_name: "Bilal Hussain",      donor_email: "bilal@gmail.com",   amount: 2500, message: "Every little helps",           created_at: daysAgo(3) },
  { id: "sample-don-6",  donor_name: "Zahra Textile Mills", donor_email: "ceo@zahra.com.pk", amount: 150000, message: "Company pledge",              created_at: daysAgo(3) },
  { id: "sample-don-7",  donor_name: "Omar Sheikh",        donor_email: "omar@gmail.com",    amount: 10000,                                       created_at: daysAgo(4) },
  { id: "sample-don-8",  donor_name: "Nadia Malik",        donor_email: "nadia@yahoo.com",   amount: 3000, message: "In memory of my grandfather", created_at: daysAgo(4) },
  { id: "sample-don-9",  donor_name: "Hamza Tech Solutions", donor_email: "hr@hamzatech.pk", amount: 25000,                                       created_at: daysAgo(5) },
  { id: "sample-don-10", donor_name: "Fatima Javed",       donor_email: "fatima@hotmail.com", amount: 7500, message: "Stay strong!",                created_at: daysAgo(6) },
  { id: "sample-don-11", donor_name: "Anonymous Donor",    donor_email: "anon2@example.com",  amount: 20000,                                       created_at: daysAgo(7) },
  { id: "sample-don-12", donor_name: "Rashid & Family",    donor_email: "rashid@gmail.com",  amount: 12000, message: "From our family to yours",    created_at: daysAgo(8) },
];

export const SAMPLE_EXPENSES: Expense[] = [
  { id: "sample-exp-1", title: "Emergency food packages",    amount: 85000, category: "food",      approved_by: "admin", description: "500 food bags distributed", created_at: daysAgo(1) },
  { id: "sample-exp-2", title: "Medical supplies batch",     amount: 62000, category: "medical",   approved_by: "admin", description: "Bandages, ORS, basic meds", created_at: daysAgo(2) },
  { id: "sample-exp-3", title: "Temporary shelter tents",    amount: 120000, category: "shelter",  approved_by: "admin", description: "40 family tents",           created_at: daysAgo(3) },
  { id: "sample-exp-4", title: "Transportation — relief run", amount: 25000, category: "transport", approved_by: "admin", description: "Fuel and truck rental",     created_at: daysAgo(4) },
  { id: "sample-exp-5", title: "Water purification tablets", amount: 18000, category: "medical",   approved_by: "admin",                                           created_at: daysAgo(5) },
  { id: "sample-exp-6", title: "Rescue equipment",           amount: 95000, category: "equipment", approved_by: "admin", description: "Boats, ropes, life jackets", created_at: daysAgo(6) },
  { id: "sample-exp-7", title: "Volunteer meals & lodging",  amount: 32000, category: "food",      approved_by: "admin",                                           created_at: daysAgo(7) },
  { id: "sample-exp-8", title: "Communication radios",       amount: 45000, category: "equipment", approved_by: "admin",                                           created_at: daysAgo(8) },
];

export const SAMPLE_CHART_DATA: ChartData[] = [
  { period: daysAgo(14).slice(0, 10), total_donations: 45000, total_expenses: 20000, donation_count: 8,  expense_count: 3 },
  { period: daysAgo(13).slice(0, 10), total_donations: 32000, total_expenses: 28000, donation_count: 6,  expense_count: 4 },
  { period: daysAgo(12).slice(0, 10), total_donations: 58000, total_expenses: 35000, donation_count: 11, expense_count: 5 },
  { period: daysAgo(11).slice(0, 10), total_donations: 41000, total_expenses: 22000, donation_count: 9,  expense_count: 3 },
  { period: daysAgo(10).slice(0, 10), total_donations: 72000, total_expenses: 40000, donation_count: 14, expense_count: 6 },
  { period: daysAgo(9).slice(0, 10),  total_donations: 55000, total_expenses: 31000, donation_count: 10, expense_count: 4 },
  { period: daysAgo(8).slice(0, 10),  total_donations: 68000, total_expenses: 45000, donation_count: 13, expense_count: 7 },
  { period: daysAgo(7).slice(0, 10),  total_donations: 82000, total_expenses: 52000, donation_count: 16, expense_count: 8 },
  { period: daysAgo(6).slice(0, 10),  total_donations: 60000, total_expenses: 38000, donation_count: 12, expense_count: 5 },
  { period: daysAgo(5).slice(0, 10),  total_donations: 95000, total_expenses: 55000, donation_count: 18, expense_count: 9 },
  { period: daysAgo(4).slice(0, 10),  total_donations: 78000, total_expenses: 48000, donation_count: 15, expense_count: 7 },
  { period: daysAgo(3).slice(0, 10),  total_donations: 110000, total_expenses: 65000, donation_count: 20, expense_count: 10 },
  { period: daysAgo(2).slice(0, 10),  total_donations: 92000, total_expenses: 58000, donation_count: 17, expense_count: 9 },
  { period: daysAgo(1).slice(0, 10),  total_donations: 125000, total_expenses: 70000, donation_count: 22, expense_count: 11 },
];

export const SAMPLE_DONATION_TOTAL = { total: 1013500 };

export const SAMPLE_INVENTORY: InventoryItem[] = [
  { id: "sample-inv-1",  name: "Bottled Water",        category: "water",     quantity: 5000, unit: "bottles",  type: "relief",  added_by: "admin", created_at: daysAgo(5) },
  { id: "sample-inv-2",  name: "Rice Bags (25kg)",     category: "food",      quantity: 400,  unit: "bags",     type: "relief",  added_by: "admin", created_at: daysAgo(6) },
  { id: "sample-inv-3",  name: "First Aid Kits",       category: "medical",   quantity: 250,  unit: "kits",     type: "relief",  added_by: "admin", created_at: daysAgo(7) },
  { id: "sample-inv-4",  name: "Family Tents",         category: "shelter",   quantity: 120,  unit: "tents",    type: "relief",  added_by: "admin", created_at: daysAgo(4) },
  { id: "sample-inv-5",  name: "Blankets",             category: "shelter",   quantity: 800,  unit: "pieces",   type: "relief",  added_by: "admin", created_at: daysAgo(3) },
  { id: "sample-inv-6",  name: "ORS Packets",          category: "medical",   quantity: 3000, unit: "packets",  type: "relief",  added_by: "admin", created_at: daysAgo(2) },
  { id: "sample-inv-7",  name: "Flashlights",          category: "tools",     quantity: 150,  unit: "pieces",   type: "relief",  added_by: "admin", created_at: daysAgo(10) },
  { id: "sample-inv-8",  name: "Rescue Ropes (50m)",   category: "tools",     quantity: 40,   unit: "rolls",    type: "relief",  added_by: "admin", created_at: daysAgo(12) },
  { id: "sample-inv-9",  name: "Baby Formula",         category: "food",      quantity: 180,  unit: "tins",     type: "relief",  added_by: "admin", created_at: daysAgo(1) },
  { id: "sample-inv-10", name: "Face Masks",           category: "medical",   quantity: 5000, unit: "pieces",   type: "relief",  added_by: "admin", created_at: daysAgo(8) },
  { id: "sample-inv-11", name: "Life Jackets",         category: "tools",     quantity: 90,   unit: "pieces",   type: "relief",  added_by: "admin", created_at: daysAgo(9) },
  { id: "sample-inv-12", name: "Cooking Oil (5L)",     category: "food",      quantity: 200,  unit: "bottles",  type: "relief",  added_by: "admin", created_at: daysAgo(11) },
];

export const SAMPLE_INVENTORY_SUMMARY: InventorySummary = {
  total_items: SAMPLE_INVENTORY.length,
  total_quantity: SAMPLE_INVENTORY.reduce((s, i) => s + i.quantity, 0),
  by_category: [
    { category: "water",   count: 1, total_quantity: 5000 },
    { category: "food",    count: 3, total_quantity: 780 },
    { category: "medical", count: 3, total_quantity: 8250 },
    { category: "shelter", count: 2, total_quantity: 920 },
    { category: "tools",   count: 3, total_quantity: 280 },
  ],
  by_type: [
    { type: "relief",  count: SAMPLE_INVENTORY.length, total_quantity: SAMPLE_INVENTORY.reduce((s, i) => s + i.quantity, 0) },
    { type: "expense", count: 0, total_quantity: 0 },
  ],
};

export const SAMPLE_CRISIS_STATS: CrisisStats = {
  total: SAMPLE_CRISES.length,
  by_status: { pending: 0, approved: 4, ongoing: 3, resolved: 1 },
  by_severity: { low: 1, medium: 2, high: 3, critical: 2 },
};

export const SAMPLE_VOLUNTEER_STATS = {
  total: SAMPLE_VOLUNTEERS.length,
  by_status: {
    available: SAMPLE_VOLUNTEERS.filter((v) => v.status === "available").length,
    assigned: SAMPLE_VOLUNTEERS.filter((v) => v.status === "assigned").length,
    inactive: 0,
  },
};

export const SAMPLE_FUND_SUMMARY = {
  total_donations: SAMPLE_DONATION_TOTAL.total,
  total_expenses: SAMPLE_EXPENSES.reduce((s, e) => s + e.amount, 0),
  balance:
    SAMPLE_DONATION_TOTAL.total -
    SAMPLE_EXPENSES.reduce((s, e) => s + e.amount, 0),
  donation_count: SAMPLE_DONATIONS.length,
  expense_count: SAMPLE_EXPENSES.length,
};

export function paginate<T>(
  items: T[],
  page = 1,
  limit = 12,
): PaginatedResponse<T> {
  const start = (page - 1) * limit;
  const slice = items.slice(start, start + limit);
  return {
    success: true,
    data: slice,
    meta: {
      page,
      limit,
      total: items.length,
      total_pages: Math.max(1, Math.ceil(items.length / limit)),
    },
  };
}

export function isEmptyList<T>(r: PaginatedResponse<T> | undefined | null) {
  return !r || !Array.isArray(r.data) || r.data.length === 0;
}

export async function withFallback<T>(
  promise: Promise<T>,
  fallback: T,
  shouldUseFallback?: (value: T) => boolean,
): Promise<T> {
  try {
    const value = await promise;
    if (shouldUseFallback && shouldUseFallback(value)) return fallback;
    return value;
  } catch {
    return fallback;
  }
}
