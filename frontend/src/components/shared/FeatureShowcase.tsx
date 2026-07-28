"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleFilled,
  LeftOutlined,
  RightOutlined,
  DashboardOutlined,
  TeamOutlined,
  AlertOutlined,
  DollarOutlined,
  InboxOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
  RiseOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  CameraOutlined,
  AimOutlined,
} from "@ant-design/icons";

type Slide = {
  tag: string;
  title: string;
  description: string;
  bullets: string[];
  accent: string;
  icon: React.ReactNode;
  mockup: React.ReactNode;
};

// ========== Mockup components (in-app screenshots rendered in HTML/CSS) ==========

function BrowserChrome({
  children,
  url,
}: {
  children: React.ReactNode;
  url: string;
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-gray-200">
      {/* Top bar */}
      <div className="h-9 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <div className="ml-3 flex-1 bg-white rounded-md h-5 px-2 text-[10px] text-gray-400 flex items-center truncate">
          {url}
        </div>
      </div>
      <div className="bg-gray-50">{children}</div>
    </div>
  );
}

function AdminDashboardMockup() {
  const statCards = [
    { label: "Total Crises", value: "8", icon: <WarningOutlined />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending", value: "1", icon: <ClockCircleOutlined />, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Donations", value: "$1.01M", icon: <DollarOutlined />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Volunteers", value: "12", icon: <TeamOutlined />, color: "text-purple-600", bg: "bg-purple-50" },
  ];
  const bars = [40, 55, 35, 70, 60, 85, 50, 90, 65, 80];
  const recent = [
    { title: "Severe Flooding — Riverside", severity: "critical", status: "ongoing" },
    { title: "7.2 Earthquake — Quetta", severity: "critical", status: "ongoing" },
    { title: "Wildfire — Murree Hills", severity: "high", status: "approved" },
    { title: "Cyclone — Gwadar Coast", severity: "high", status: "approved" },
  ];
  const sevColor: Record<string, string> = {
    critical: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-blue-100 text-blue-700",
    low: "bg-green-100 text-green-700",
  };
  const statusColor: Record<string, string> = {
    ongoing: "bg-amber-100 text-amber-700",
    approved: "bg-blue-100 text-blue-700",
    pending: "bg-gray-100 text-gray-600",
  };

  return (
    <BrowserChrome url="app.disaster-mgmt.com/admin">
      <div className="p-4 space-y-3">
        {/* Title */}
        <div>
          <div className="text-[13px] font-bold text-gray-800">Admin Dashboard</div>
          <div className="text-[10px] text-gray-400">Overview of crisis management, donations, and volunteer activity</div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-2">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-5 h-5 rounded ${s.bg} ${s.color} flex items-center justify-center text-[10px]`}>
                  {s.icon}
                </div>
                <div className="text-[9px] text-gray-500 font-medium">{s.label}</div>
              </div>
              <div className={`text-base font-bold ${s.color} leading-tight`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Chart + pie */}
        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-3 bg-white rounded-lg p-2 shadow-sm border border-gray-100">
            <div className="text-[10px] font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <RiseOutlined className="text-blue-500" /> Donations vs Expenses
            </div>
            <div className="flex items-end gap-[3px] h-16">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 flex gap-px items-end">
                  <div className="flex-1 bg-emerald-400 rounded-t" style={{ height: `${h}%` }} />
                  <div className="flex-1 bg-red-300 rounded-t" style={{ height: `${h * 0.6}%` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2 bg-white rounded-lg p-2 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="text-[10px] font-semibold text-gray-700 mb-1.5 self-start">Crisis by Severity</div>
            {/* Pie placeholder */}
            <div className="relative w-14 h-14 rounded-full"
              style={{
                background: "conic-gradient(#f5222d 0 25%, #fa8c16 25% 62.5%, #1677ff 62.5% 87.5%, #52c41a 87.5% 100%)",
              }}>
              <div className="absolute inset-2 rounded-full bg-white" />
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[8px]">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Critical 2</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" />High 3</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Medium 2</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />Low 1</span>
            </div>
          </div>
        </div>

        {/* Recent crises */}
        <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[10px] font-semibold text-gray-700 flex items-center gap-1">
              <ClockCircleOutlined className="text-blue-500" /> Recent Crises
            </div>
            <span className="text-[9px] text-blue-600 font-medium">View All →</span>
          </div>
          <div className="space-y-1">
            {recent.map((r) => (
              <div key={r.title} className="flex items-center justify-between text-[10px] py-1 border-b border-gray-50 last:border-0">
                <span className="text-gray-800 truncate flex-1">{r.title}</span>
                <div className="flex gap-1 shrink-0">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase ${sevColor[r.severity]}`}>
                    {r.severity}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium capitalize ${statusColor[r.status]}`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: <CheckCircleOutlined />, label: "Approve", color: "text-blue-600 bg-blue-50" },
            { icon: <TeamOutlined />, label: "Volunteers", color: "text-purple-600 bg-purple-50" },
            { icon: <SafetyCertificateOutlined />, label: "Users", color: "text-emerald-600 bg-emerald-50" },
            { icon: <FileTextOutlined />, label: "Reports", color: "text-orange-600 bg-orange-50" },
          ].map((a) => (
            <div key={a.label} className={`rounded-lg p-1.5 text-center border border-gray-100 bg-white`}>
              <div className={`w-6 h-6 rounded ${a.color} flex items-center justify-center mx-auto mb-0.5 text-xs`}>
                {a.icon}
              </div>
              <div className="text-[9px] font-semibold text-gray-700">{a.label}</div>
            </div>
          ))}
        </div>
      </div>
    </BrowserChrome>
  );
}

function VolunteerDashboardMockup() {
  return (
    <BrowserChrome url="app.disaster-mgmt.com/dashboard">
      <div className="p-4 space-y-3">
        <div>
          <div className="text-[13px] font-bold text-gray-800">Welcome, Hassan Raza</div>
          <div className="text-[10px] text-gray-400">Track tasks, update progress, and stay connected.</div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Status", val: "Assigned", color: "text-blue-700 bg-blue-50", dot: "bg-blue-500" },
            { label: "Task", val: "In Progress", color: "text-orange-700 bg-orange-50", dot: "bg-orange-500" },
            { label: "Location", val: "Karachi", color: "text-green-700 bg-green-50", dot: "bg-green-500" },
            { label: "Skills", val: "3", color: "text-purple-700 bg-purple-50", dot: "bg-purple-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
              <div className="text-[8px] text-gray-400 font-semibold uppercase">{s.label}</div>
              <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded mt-1 text-[10px] font-semibold ${s.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {s.val}
              </div>
            </div>
          ))}
        </div>

        {/* Current assignment */}
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="text-[11px] font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <ThunderboltOutlined className="text-orange-500" /> Current Assignment
          </div>

          <div className="bg-gray-50 rounded p-2 mb-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-gray-900 text-[11px]">Severe Flooding — Riverside</div>
                <div className="text-[9px] text-gray-500 flex items-center gap-1">
                  <EnvironmentOutlined /> Riverside, Karachi
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold text-white bg-red-500">CRITICAL</span>
            </div>
          </div>

          <div className="mb-2">
            <div className="text-[9px] text-gray-400 font-medium">Your Task</div>
            <div className="text-[11px] font-semibold text-gray-800">Flood evacuation — Sector 3 residents</div>
          </div>

          <div className="mb-2">
            <div className="text-[9px] text-gray-400 font-medium">Status</div>
            <span className="inline-block px-2 py-0.5 rounded text-[9px] font-semibold bg-orange-100 text-orange-700 mt-0.5">
              ⟳ In Progress
            </span>
          </div>

          <div className="flex gap-1.5 pt-2 border-t border-gray-100">
            <button className="flex-1 bg-green-600 text-white text-[9px] font-semibold py-1 rounded flex items-center justify-center gap-1">
              <CheckCircleOutlined /> Mark Completed
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 text-[9px] font-semibold py-1 rounded flex items-center justify-center gap-1">
              View Crisis →
            </button>
          </div>
        </div>

        {/* Task flow */}
        <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
          <div className="text-[10px] font-semibold text-gray-700 mb-1.5">Task Flow</div>
          <div className="flex items-center justify-between gap-1">
            {[
              { label: "Assigned", done: true, color: "bg-blue-500" },
              { label: "Started", done: true, color: "bg-orange-500" },
              { label: "Completed", done: false, color: "bg-green-500" },
              { label: "New Task", done: false, color: "bg-purple-500" },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex-1 flex items-center">
                <div className="flex flex-col items-center gap-0.5">
                  <div className={`w-4 h-4 rounded-full ${step.done ? step.color : "bg-gray-200"} flex items-center justify-center text-white text-[7px]`}>
                    {step.done ? "✓" : i + 1}
                  </div>
                  <div className="text-[8px] text-gray-500">{step.label}</div>
                </div>
                {i < arr.length - 1 && (
                  <div className={`h-[2px] flex-1 ${arr[i + 1].done ? "bg-green-300" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}

function CrisisReportMockup() {
  return (
    <BrowserChrome url="app.disaster-mgmt.com/crisis/report">
      <div className="p-4 space-y-3">
        <div>
          <div className="text-[13px] font-bold text-gray-800">Report a Crisis</div>
          <div className="text-[10px] text-gray-400">Help us respond faster — no login required</div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 space-y-2">
          <div>
            <div className="text-[9px] text-gray-500 font-medium mb-0.5">Title</div>
            <div className="border border-gray-200 rounded px-2 py-1 text-[11px] text-gray-800">
              Severe flooding in Riverside District
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[9px] text-gray-500 font-medium mb-0.5">Severity</div>
              <div className="border border-gray-200 rounded px-2 py-1 text-[11px] flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold text-white bg-red-500">CRITICAL</span>
                <span className="text-gray-400">▾</span>
              </div>
            </div>
            <div>
              <div className="text-[9px] text-gray-500 font-medium mb-0.5">Location</div>
              <div className="border border-gray-200 rounded px-2 py-1 text-[11px] text-gray-800 flex items-center gap-1">
                <AimOutlined className="text-blue-500" /> Karachi, Riverside
              </div>
            </div>
          </div>

          <div>
            <div className="text-[9px] text-gray-500 font-medium mb-0.5">Description</div>
            <div className="border border-gray-200 rounded px-2 py-1.5 text-[10px] text-gray-700 leading-snug">
              Heavy monsoon rains caused flooding across 12 neighborhoods. Over 2,000 families displaced. Urgent need for evacuation boats and dry food...
            </div>
          </div>

          <div>
            <div className="text-[9px] text-gray-500 font-medium mb-0.5">Photos / Media</div>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded border border-gray-200 flex items-center justify-center">
                  <CameraOutlined className="text-blue-500 text-sm" />
                </div>
              ))}
              <div className="aspect-square border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
                <span className="text-lg">+</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button className="flex-1 bg-blue-600 text-white text-[10px] font-semibold py-1.5 rounded">
              Submit Report
            </button>
            <button className="flex-1 bg-red-600 text-white text-[10px] font-semibold py-1.5 rounded flex items-center justify-center gap-1">
              <AlertOutlined /> Emergency SOS
            </button>
          </div>
        </div>

        {/* Success banner preview */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 flex items-start gap-2">
          <CheckCircleFilled className="text-blue-500 mt-0.5 text-sm" />
          <div>
            <div className="text-[10px] font-semibold text-blue-800">Report submitted</div>
            <div className="text-[9px] text-blue-600">Pending admin review — usually approved within minutes</div>
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}

function DonationMockup() {
  const donations = [
    { name: "Khan Foundation", amt: "100,000", msg: "Standing with our fellow citizens" },
    { name: "Zahra Textile Mills", amt: "150,000", msg: "Company pledge" },
    { name: "Anonymous Donor", amt: "50,000", msg: "Praying for everyone" },
    { name: "Ali Corp", amt: "75,000", msg: "CSR contribution" },
  ];
  const bars = [30, 45, 60, 50, 75, 65, 85, 70, 90, 78, 95, 88];
  return (
    <BrowserChrome url="app.disaster-mgmt.com/donation">
      <div className="p-4 space-y-3">
        {/* Big total */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-4 text-center text-white shadow-lg">
          <DollarOutlined className="text-xl opacity-80 mb-1" />
          <div className="text-2xl font-black">$1,013,500</div>
          <div className="text-[10px] opacity-80">Total Funds Raised</div>
          <button className="mt-2 bg-white text-blue-700 text-[10px] font-bold px-4 py-1 rounded-full inline-flex items-center gap-1">
            <HeartOutlined /> Donate Now
          </button>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-semibold text-gray-700">Daily Donations vs Expenses</div>
            <div className="flex gap-2 text-[8px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-500" />Donations</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-orange-400" />Expenses</span>
            </div>
          </div>
          <div className="flex items-end gap-1 h-20">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex gap-0.5 items-end">
                <div className="flex-1 bg-blue-500 rounded-t" style={{ height: `${h}%` }} />
                <div className="flex-1 bg-orange-400 rounded-t" style={{ height: `${h * 0.55}%` }} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent donations */}
        <div className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-100">
          <div className="text-[10px] font-semibold text-gray-700 mb-1.5">Recent Donations</div>
          <div className="space-y-1.5">
            {donations.map((d) => (
              <div key={d.name} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                    {d.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-semibold text-gray-800 truncate">{d.name}</div>
                    <div className="text-[9px] text-gray-400 truncate">{d.msg}</div>
                  </div>
                </div>
                <div className="text-[11px] font-bold text-emerald-600 shrink-0">${d.amt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}

function InventoryMockup() {
  const items = [
    { name: "Bottled Water", cat: "water",   qty: 5000, unit: "bottles", color: "bg-cyan-100 text-cyan-700" },
    { name: "Rice Bags (25kg)", cat: "food", qty: 400,  unit: "bags",    color: "bg-amber-100 text-amber-700" },
    { name: "First Aid Kits",   cat: "medical", qty: 250,  unit: "kits",  color: "bg-red-100 text-red-700" },
    { name: "Family Tents",     cat: "shelter", qty: 120,  unit: "tents", color: "bg-indigo-100 text-indigo-700" },
    { name: "Blankets",         cat: "shelter", qty: 800,  unit: "pieces", color: "bg-indigo-100 text-indigo-700" },
    { name: "ORS Packets",      cat: "medical", qty: 3000, unit: "packets", color: "bg-red-100 text-red-700" },
  ];
  return (
    <BrowserChrome url="app.disaster-mgmt.com/inventory">
      <div className="p-4 space-y-3">
        <div>
          <div className="text-[13px] font-bold text-gray-800">Inventory</div>
          <div className="text-[10px] text-gray-400">Relief supplies across all active crises</div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
            <div className="text-[9px] text-gray-500">Total Items</div>
            <div className="text-lg font-bold text-blue-600">12</div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
            <div className="text-[9px] text-gray-500">Total Quantity</div>
            <div className="text-lg font-bold text-emerald-600">15,230</div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
            <div className="text-[9px] text-gray-500">Categories</div>
            <div className="text-lg font-bold text-purple-600">5</div>
          </div>
        </div>

        {/* Item table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-2 py-1.5 bg-gray-50 border-b border-gray-100 text-[9px] font-semibold text-gray-500 uppercase">
            <div>Item</div>
            <div>Category</div>
            <div className="text-right">Qty</div>
            <div>Unit</div>
          </div>
          {items.map((it) => (
            <div key={it.name} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-2 py-1.5 border-b border-gray-50 last:border-0 items-center text-[10px]">
              <div className="font-medium text-gray-800 truncate">{it.name}</div>
              <div><span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${it.color}`}>{it.cat}</span></div>
              <div className="text-right font-bold text-gray-900">{it.qty.toLocaleString()}</div>
              <div className="text-gray-500 text-[9px]">{it.unit}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 text-white text-[10px] font-semibold py-1.5 rounded">+ Add Item</button>
          <button className="flex-1 bg-gray-100 text-gray-700 text-[10px] font-semibold py-1.5 rounded">Export CSV</button>
        </div>
      </div>
    </BrowserChrome>
  );
}

// ========== Slides ==========

const slides: Slide[] = [
  {
    tag: "Admin Dashboard",
    title: "Command Center for Crisis Response",
    description:
      "Administrators get a real-time overview of every active crisis, pending report, volunteer assignment, and financial movement — all in one place.",
    bullets: [
      "Approve or reject incoming crisis reports",
      "Assign verified volunteers to active crises",
      "Monitor donations and expenses in real time",
      "Export CSV / Excel reports with one click",
    ],
    accent: "from-blue-600 to-indigo-700",
    icon: <DashboardOutlined />,
    mockup: <AdminDashboardMockup />,
  },
  {
    tag: "Volunteer Portal",
    title: "Deploy Faster, Coordinate Better",
    description:
      "Verified volunteers see their assignments, update task status from the field, and stay connected to the command center throughout a crisis.",
    bullets: [
      "View assigned crisis details and required help",
      "Start → In-progress → Completed task flow",
      "Add field notes when completing a task",
      "Request a new assignment when ready",
    ],
    accent: "from-purple-600 to-pink-600",
    icon: <TeamOutlined />,
    mockup: <VolunteerDashboardMockup />,
  },
  {
    tag: "Public Reporting",
    title: "Report a Crisis in 30 Seconds",
    description:
      "Anyone — no login required — can report a disaster with location, photos, and severity. Reports are triaged and approved by admins within minutes.",
    bullets: [
      "Anonymous submissions supported",
      "Attach geo-location and photos",
      "Auto-routed to the nearest admin",
      "One-tap SOS button for emergencies",
    ],
    accent: "from-red-600 to-orange-600",
    icon: <AlertOutlined />,
    mockup: <CrisisReportMockup />,
  },
  {
    tag: "Transparent Donations",
    title: "Every Rupee. Every Expense. Public.",
    description:
      "A live fund tracker shows how much has been raised and exactly how it's been spent. Donors and the public see the impact of every contribution.",
    bullets: [
      "Real-time donation counter",
      "Daily donations vs expenses chart",
      "Per-crisis allocation breakdown",
      "Downloadable financial reports",
    ],
    accent: "from-emerald-600 to-teal-600",
    icon: <DollarOutlined />,
    mockup: <DonationMockup />,
  },
  {
    tag: "Inventory Tracking",
    title: "Know Exactly What's in Stock",
    description:
      "Track relief supplies — food, medicine, shelter, tools — across every crisis. Adjust quantities on the fly and export stock reports anytime.",
    bullets: [
      "Categorized inventory with live quantities",
      "Adjust stock from the field",
      "Per-crisis supply allocation",
      "CSV / Excel export",
    ],
    accent: "from-amber-600 to-orange-600",
    icon: <InboxOutlined />,
    mockup: <InventoryMockup />,
  },
];

const AUTO_PLAY_MS = 7000;

export default function FeatureShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_PLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  const goto = (i: number) => setIndex((i + slides.length) % slides.length);
  const next = () => goto(index + 1);
  const prev = () => goto(index - 1);

  const slide = slides[index];

  return (
    <section
      className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            What You Can Do
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
            One Platform, Every Role Covered
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            A live preview of each dashboard and its functionality — admin, volunteer,
            public reporter, and donor all in one system.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {slides.map((s, i) => (
            <button
              key={s.tag}
              onClick={() => goto(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border cursor-pointer ${
                i === index
                  ? `text-white border-transparent bg-gradient-to-r ${s.accent} shadow-md`
                  : "text-gray-600 bg-white border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              <span className="mr-1.5">{s.icon}</span>
              {s.tag}
            </button>
          ))}
        </div>

        {/* Slide */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-blue-500/5 border border-gray-100"
            >
              {/* Mockup */}
              <div className="order-2 lg:order-1">{slide.mockup}</div>

              {/* Text */}
              <div className="order-1 lg:order-2">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 text-white bg-gradient-to-r ${slide.accent}`}
                >
                  {slide.icon}
                  <span>{slide.tag}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {slide.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  {slide.description}
                </p>
                <ul className="space-y-3">
                  {slide.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <CheckCircleFilled className="text-emerald-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute top-1/2 -translate-y-1/2 -left-2 sm:-left-5 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-blue-600 hover:shadow-xl transition-all cursor-pointer z-20"
          >
            <LeftOutlined />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute top-1/2 -translate-y-1/2 -right-2 sm:-right-5 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-blue-600 hover:shadow-xl transition-all cursor-pointer z-20"
          >
            <RightOutlined />
          </button>
        </div>

        {/* Dots */}
        <div className="flex flex-col items-center mt-8 gap-3">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goto(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === index
                    ? "w-10 bg-gradient-to-r from-blue-500 to-purple-500"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">
            {paused ? "Paused — hover to resume" : "Auto-advancing"}
          </span>
        </div>
      </div>
    </section>
  );
}
