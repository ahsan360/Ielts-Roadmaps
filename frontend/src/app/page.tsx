"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Tag } from "antd";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  HeartOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  FundOutlined,
  AlertOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import ScrollReveal from "@/components/shared/ScrollReveal";
import FeatureShowcase from "@/components/shared/FeatureShowcase";
import SOSButton from "@/components/crisis/SOSButton";
import CrisisMap from "@/components/crisis/CrisisMap";
import { fundApi } from "@/lib/api/fund";
import { crisisApi } from "@/lib/api/crisis";
import { volunteerApi } from "@/lib/api/volunteer";
import type { Crisis, Volunteer } from "@/lib/types";

const severityColor: Record<string, string> = { low: "green", medium: "blue", high: "orange", critical: "red" };
const statusColor: Record<string, string> = { approved: "#3b82f6", ongoing: "#f59e0b", resolved: "#22c55e", pending: "#6b7280" };

export default function HomePage() {
  const router = useRouter();

  const { data: donationTotal } = useQuery({
    queryKey: ["donationTotal"],
    queryFn: () => fundApi.getDonationTotal(),
  });

  const { data: chartData } = useQuery({
    queryKey: ["chartData"],
    queryFn: () => fundApi.getChartData(),
  });

  const { data: crisisData } = useQuery({
    queryKey: ["crises", "recent"],
    queryFn: () => crisisApi.list({ limit: 6 }),
  });

  const { data: volunteerData } = useQuery({
    queryKey: ["volunteers", "recent"],
    queryFn: () => volunteerApi.list({ limit: 4 }),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden min-h-[100vh] flex items-center">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&q=80"
        >
          <source src="https://videos.pexels.com/video-files/855564/855564-hd_1920_1080_24fps.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay — strong for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-gray-900/80 to-blue-950/85" />

        {/* Subtle color accent */}
        <div className="absolute inset-0 hero-gradient opacity-20 mix-blend-overlay" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-emerald-300 text-sm font-semibold mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live Monitoring Active
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
                Disaster Response
                <br />
                <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent">
                  Made Effective
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-200 max-w-xl mb-10 leading-relaxed drop-shadow-md">
                Coordinate crisis response, mobilize volunteers, and track donations
                in real-time. Every second counts when lives are at stake.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/donation")}
                  className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl shadow-xl shadow-black/20 hover:shadow-2xl transition-shadow cursor-pointer border-0 text-base"
                >
                  <HeartOutlined className="mr-2" />
                  Donate Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/crisis")}
                  className="px-8 py-4 bg-white/15 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/40 hover:bg-white/25 transition-all cursor-pointer text-base shadow-lg"
                >
                  Report Crisis <ArrowRightOutlined className="ml-2" />
                </motion.button>
              </div>
            </motion.div>

            {/* Right: Stats cards */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {[
                {
                  icon: <FundOutlined className="text-2xl" />,
                  label: "Total Funds Raised",
                  value: donationTotal?.total ?? 0,
                  prefix: "$",
                  color: "from-emerald-500 to-teal-600",
                  iconBg: "bg-emerald-500/20",
                },
                {
                  icon: <AlertOutlined className="text-2xl" />,
                  label: "Active Crises",
                  value: crisisData?.meta?.total ?? 0,
                  prefix: "",
                  color: "from-orange-500 to-red-600",
                  iconBg: "bg-orange-500/20",
                },
                {
                  icon: <TeamOutlined className="text-2xl" />,
                  label: "Volunteers Ready",
                  value: volunteerData?.meta?.total ?? 0,
                  prefix: "",
                  color: "from-blue-500 to-indigo-600",
                  iconBg: "bg-blue-500/20",
                },
                {
                  icon: <SafetyCertificateOutlined className="text-2xl" />,
                  label: "Lives Impacted",
                  value: 12500,
                  prefix: "",
                  color: "from-purple-500 to-pink-600",
                  iconBg: "bg-purple-500/20",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className={`rounded-2xl p-6 cursor-default bg-gradient-to-br ${stat.color} shadow-xl`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    <AnimatedCounter end={stat.value} prefix={stat.prefix} duration={2.5} />
                  </div>
                  <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
              <div className="w-1.5 h-3 rounded-full bg-white/60" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">How it Works</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
                Rapid Response in Four Steps
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <AlertOutlined />, title: "Report Crisis", desc: "Anyone can report a disaster. Anonymous submissions are welcome with location and severity details.", color: "bg-red-500", num: "01" },
              { icon: <SafetyCertificateOutlined />, title: "Admin Verifies", desc: "Our team verifies, approves, and assigns severity levels to incoming crisis reports.", color: "bg-blue-500", num: "02" },
              { icon: <TeamOutlined />, title: "Deploy Volunteers", desc: "Verified volunteers are assigned to crises based on skills, location, and availability.", color: "bg-purple-500", num: "03" },
              { icon: <HeartOutlined />, title: "Fund & Supply", desc: "Donations fund relief operations. Inventory is tracked and supplies are distributed.", color: "bg-emerald-500", num: "04" },
            ].map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.15}>
                <div className="relative group">
                  <div className="absolute -top-3 -right-3 text-7xl font-black text-gray-100 group-hover:text-blue-50 transition-colors select-none">
                    {step.num}
                  </div>
                  <div className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                    <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg`}>
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURE SHOWCASE SLIDER ============ */}
      <FeatureShowcase />

      {/* ============ LIVE FUND TRACKER ============ */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3), transparent 50%), radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.3), transparent 50%)",
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Live Tracker</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
                Transparent Fund Management
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Every donation is tracked. Every expense is accounted for. Real-time transparency you can trust.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Big counter */}
            <ScrollReveal className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-10 text-center shadow-2xl shadow-blue-500/20">
                <FundOutlined className="text-5xl text-white/80 mb-4" />
                <div className="text-5xl sm:text-6xl font-black text-white mb-2">
                  <AnimatedCounter end={donationTotal?.total ?? 0} prefix="$" duration={3} />
                </div>
                <p className="text-blue-200 text-lg mb-8">Total Funds Raised</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/donation")}
                  className="w-full py-4 bg-white text-blue-700 font-semibold rounded-xl border-0 cursor-pointer text-base shadow-lg hover:shadow-xl transition-shadow"
                >
                  <HeartOutlined className="mr-2" /> Contribute Now
                </motion.button>
              </div>
            </ScrollReveal>

            {/* Chart */}
            <ScrollReveal delay={0.2} className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 h-full">
                <h3 className="text-white font-semibold text-lg mb-6">Daily Donations vs Expenses</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="period" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "white" }}
                      labelStyle={{ color: "#94a3b8" }}
                    />
                    <Legend />
                    <Bar dataKey="total_donations" name="Donations" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="total_expenses" name="Expenses" fill="#f97316" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============ ACTIVE CRISES ============ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">Active Crises</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
                  Current Emergencies
                </h2>
              </div>
              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => router.push("/crisis")}
                className="flex items-center gap-2 text-blue-600 font-semibold bg-transparent border-0 cursor-pointer text-base hover:text-blue-700"
              >
                View All Crises <ArrowRightOutlined />
              </motion.button>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {crisisData?.data?.map((crisis: Crisis, i: number) => {
              const crisisImages = [
                "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&h=300&fit=crop",
                "https://images.unsplash.com/photo-1573481078935-b9605167e06b?w=600&h=300&fit=crop",
                "https://images.unsplash.com/photo-1602524206684-fdf1ff697355?w=600&h=300&fit=crop",
                "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=300&fit=crop",
                "https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=600&h=300&fit=crop",
                "https://images.unsplash.com/photo-1504807417934-b18aaf089961?w=600&h=300&fit=crop",
              ];
              return (
              <ScrollReveal key={crisis.id} delay={i * 0.1}>
                <div className={`bg-white rounded-2xl overflow-hidden card-hover border border-gray-100 ${
                  crisis.severity === "critical" ? "severity-pulse-critical" : crisis.severity === "high" ? "severity-pulse-high" : ""
                }`}>
                  {/* Crisis image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={crisis.image_url || crisisImages[i % crisisImages.length]}
                      alt={crisis.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-white ${
                      crisis.severity === "critical" ? "bg-red-500" :
                      crisis.severity === "high" ? "bg-orange-500" :
                      crisis.severity === "medium" ? "bg-blue-500" : "bg-green-500"
                    }`}>
                      {crisis.severity.toUpperCase()}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Tag color={severityColor[crisis.severity]} className="m-0 font-semibold uppercase text-xs">
                        {crisis.severity}
                      </Tag>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor[crisis.status] }} />
                        <span className="text-xs text-gray-500 capitalize">{crisis.status}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {crisis.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                      <EnvironmentOutlined className="text-blue-400" />
                      {crisis.location}
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                      {crisis.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <ClockCircleOutlined />
                        {new Date(crisis.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                      <button
                        onClick={() => router.push(`/crisis/${crisis.id}`)}
                        className="text-blue-600 text-sm font-medium bg-transparent border-0 cursor-pointer hover:text-blue-700"
                      >
                        Details <ArrowRightOutlined className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CRISIS MAP ============ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Live Map</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">Crisis Locations</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Real-time view of all active crises. Click any marker for details.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <CrisisMap
                crises={crisisData?.data || []}
                onCrisisClick={(crisis) => router.push(`/crisis/${crisis.id}`)}
                height="500px"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ IMPACT GALLERY ============ */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Making a Difference</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">Impact on the Ground</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Real moments from our disaster response operations across the country.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop", label: "Food Distribution" },
              { src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=600&fit=crop", label: "Volunteer Team" },
              { src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop", label: "Donation Drive" },
              { src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=600&fit=crop", label: "Medical Aid" },
              { src: "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=600&h=600&fit=crop", label: "Rescue Operations" },
              { src: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?w=600&h=400&fit=crop", label: "Shelter Setup" },
              { src: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=600&h=400&fit=crop", label: "Community Support" },
              { src: "https://images.unsplash.com/photo-1580820267682-426da823b514?w=600&h=600&fit=crop", label: "Water Supply" },
            ].map((img, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group ${
                    i === 1 || i === 3 || i === 4 || i === 7 ? "row-span-2" : ""
                  }`}
                  style={{ height: (i === 1 || i === 3 || i === 4 || i === 7) ? 420 : 200 }}
                >
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white font-semibold text-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {img.label}
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ VOLUNTEERS ============ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">Our Heroes</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
                  Volunteer Network
                </h2>
              </div>
              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => router.push("/volunteer")}
                className="flex items-center gap-2 text-blue-600 font-semibold bg-transparent border-0 cursor-pointer text-base hover:text-blue-700"
              >
                View All Volunteers <ArrowRightOutlined />
              </motion.button>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {volunteerData?.data?.map((vol: Volunteer, i: number) => (
              <ScrollReveal key={vol.id} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 card-hover text-center">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                    <span className="text-white text-2xl font-bold">
                      {vol.name?.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">{vol.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 flex items-center justify-center gap-1">
                    <EnvironmentOutlined /> {vol.location}
                  </p>

                  {/* Status badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                    vol.status === "available" ? "bg-green-50 text-green-700" :
                    vol.status === "assigned" ? "bg-blue-50 text-blue-700" :
                    "bg-gray-50 text-gray-500"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      vol.status === "available" ? "bg-green-500" :
                      vol.status === "assigned" ? "bg-blue-500" : "bg-gray-400"
                    }`} />
                    {vol.status === "assigned" ? `Deployed` : vol.status}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {vol.skills?.slice(0, 3).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs">
                        {skill.replace("_", " ")}
                      </span>
                    ))}
                  </div>

                  {vol.assigned_task && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-blue-600 font-medium line-clamp-1">
                        <ThunderboltOutlined className="mr-1" />
                        {vol.assigned_task}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-300% animate-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
              Every Hand Makes a Difference
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Whether you donate, volunteer, or simply report a crisis &mdash; you become part of the solution. Join thousands making an impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/register")}
                className="px-10 py-4 bg-white text-blue-700 font-bold rounded-xl border-0 cursor-pointer text-lg shadow-2xl shadow-black/20 hover:shadow-3xl transition-all"
              >
                <TeamOutlined className="mr-2" /> Become a Volunteer
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/donation")}
                className="px-10 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white/40 cursor-pointer text-lg backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <HeartOutlined className="mr-2" /> Donate Funds
              </motion.button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SOSButton />
      <AppFooter />
    </div>
  );
}
