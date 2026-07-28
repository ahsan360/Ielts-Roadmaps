"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Tag, Spin, Button, Descriptions, Timeline } from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MailOutlined,
  HeartOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import ScrollReveal from "@/components/shared/ScrollReveal";
import CrisisTimeline from "@/components/crisis/CrisisTimeline";
import WeatherWidget from "@/components/crisis/WeatherWidget";
import { crisisApi } from "@/lib/api/crisis";
import type { Crisis, Severity } from "@/lib/types";

const severityConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  low: { color: "text-green-700", bg: "bg-green-50", border: "border-green-200", label: "Low Severity" },
  medium: { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", label: "Medium Severity" },
  high: { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", label: "High Severity" },
  critical: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200", label: "Critical Severity" },
};

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  pending: { color: "text-gray-600", bg: "bg-gray-100", icon: <ClockCircleOutlined />, label: "Pending Review" },
  approved: { color: "text-blue-600", bg: "bg-blue-100", icon: <CheckCircleOutlined />, label: "Approved" },
  ongoing: { color: "text-amber-600", bg: "bg-amber-100", icon: <ExclamationCircleOutlined />, label: "Response Ongoing" },
  resolved: { color: "text-green-600", bg: "bg-green-100", icon: <CheckCircleOutlined />, label: "Resolved" },
};

// Fallback images based on crisis keywords
const crisisImages: Record<string, string[]> = {
  flood: [
    "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1614091066028-e0fdf5d9e600?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=800&h=500&fit=crop",
  ],
  earthquake: [
    "https://images.unsplash.com/photo-1573481078935-b9605167e06b?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1504807417934-b18aaf089961?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1590071089561-a6cbcdd28f80?w=800&h=500&fit=crop",
  ],
  fire: [
    "https://images.unsplash.com/photo-1602524206684-fdf1ff697355?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1486551937199-baf066858de7?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1576428140189-86f0cf89bd09?w=800&h=500&fit=crop",
  ],
  cyclone: [
    "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=800&h=500&fit=crop",
  ],
  default: [
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=500&fit=crop",
  ],
};

function getVideosForCrisis(crisis: Crisis): string[] {
  if (crisis.media_urls?.length) {
    return crisis.media_urls.filter(m => m.type === "video").map(m => m.url);
  }
  return [];
}

function getImagesForCrisis(crisis: Crisis): string[] {
  if (crisis.media_urls?.length) {
    const images = crisis.media_urls.filter(m => m.type === "image").map(m => m.url);
    if (images.length > 0) return images;
  }
  if (crisis.image_url) return [crisis.image_url];
  const title = crisis.title.toLowerCase();
  if (title.includes("flood")) return crisisImages.flood;
  if (title.includes("earthquake")) return crisisImages.earthquake;
  if (title.includes("fire")) return crisisImages.fire;
  if (title.includes("cyclone") || title.includes("storm")) return crisisImages.cyclone;
  return crisisImages.default;
}

export default function CrisisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: crisis, isLoading, error } = useQuery({
    queryKey: ["crisis", id],
    queryFn: () => crisisApi.getById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error || !crisis) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="pt-20 flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <WarningOutlined className="text-5xl text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-500">Crisis not found</h2>
          <Button onClick={() => router.push("/crisis")}>Back to Crises</Button>
        </div>
      </div>
    );
  }

  const images = getImagesForCrisis(crisis);
  const sev = severityConfig[crisis.severity] || severityConfig.medium;
  const stat = statusConfig[crisis.status] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
          src={images[0]}
          alt={crisis.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-24 left-6 z-10"
        >
          <button
            onClick={() => router.push("/crisis")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all cursor-pointer"
          >
            <ArrowLeftOutlined /> Back to Crises
          </button>
        </motion.div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 mb-4"
            >
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                crisis.severity === "critical" ? "bg-red-500 text-white" :
                crisis.severity === "high" ? "bg-orange-500 text-white" :
                crisis.severity === "medium" ? "bg-blue-500 text-white" :
                "bg-green-500 text-white"
              }`}>
                {crisis.severity}
              </span>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${stat.bg} ${stat.color}`}>
                {stat.icon} {stat.label}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 drop-shadow-lg"
            >
              {crisis.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 text-white/80 text-sm"
            >
              <span className="flex items-center gap-1.5">
                <EnvironmentOutlined /> {crisis.location}
              </span>
              <span className="flex items-center gap-1.5">
                <ClockCircleOutlined /> Reported {new Date(crisis.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5">
                <UserOutlined /> {crisis.reported_by_name}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <ScrollReveal>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-base">
                  {crisis.description}
                </p>
              </div>
            </ScrollReveal>

            {/* Required Help */}
            {crisis.required_help && (
              <ScrollReveal delay={0.1}>
                <div className={`rounded-2xl p-8 border ${sev.border} ${sev.bg}`}>
                  <h2 className={`text-xl font-bold ${sev.color} mb-4 flex items-center gap-2`}>
                    <ExclamationCircleOutlined /> Help Needed
                  </h2>
                  <p className={`${sev.color} leading-relaxed text-base`}>
                    {crisis.required_help}
                  </p>
                </div>
              </ScrollReveal>
            )}

            {/* Image Gallery */}
            {images.length > 1 && (
              <ScrollReveal delay={0.2}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Related Images</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {images.slice(1).map((img, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        className="relative rounded-xl overflow-hidden cursor-pointer group aspect-video"
                      >
                        <img
                          src={img}
                          alt={`${crisis.title} - Image ${i + 2}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Video */}
            {getVideosForCrisis(crisis).length > 0 && (
              <ScrollReveal delay={0.25}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Video</h2>
                  {getVideosForCrisis(crisis).map((videoUrl, i) => (
                    <video
                      key={i}
                      src={videoUrl}
                      controls
                      className="w-full rounded-xl"
                      style={{ maxHeight: 400 }}
                    />
                  ))}
                </div>
              </ScrollReveal>
            )}

            {/* Admin Notes */}
            {crisis.admin_notes && (
              <ScrollReveal delay={0.3}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Notes</h2>
                  <p className="text-gray-600 leading-relaxed">{crisis.admin_notes}</p>
                </div>
              </ScrollReveal>
            )}

            {/* Activity Timeline */}
            <ScrollReveal delay={0.35}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Timeline</h2>
                <CrisisTimeline crisisId={id} />
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <ScrollReveal direction="right">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Crisis Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <EnvironmentOutlined className="text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium uppercase">Location</div>
                      <div className="text-sm font-semibold text-gray-800">{crisis.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                      <WarningOutlined className="text-red-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium uppercase">Severity</div>
                      <div className={`text-sm font-semibold ${sev.color}`}>{sev.label}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                      <ClockCircleOutlined className="text-amber-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium uppercase">Status</div>
                      <div className={`text-sm font-semibold ${stat.color}`}>{stat.label}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                      <UserOutlined className="text-purple-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium uppercase">Reported By</div>
                      <div className="text-sm font-semibold text-gray-800">{crisis.reported_by_name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MailOutlined /> {crisis.reported_by_email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="border-t border-gray-100 mt-5 pt-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Reported</span>
                    <span className="text-gray-700 font-medium">
                      {new Date(crisis.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  {crisis.approved_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Approved</span>
                      <span className="text-gray-700 font-medium">
                        {new Date(crisis.approved_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  )}
                  {crisis.updated_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Last Updated</span>
                      <span className="text-gray-700 font-medium">
                        {new Date(crisis.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Weather */}
            <ScrollReveal direction="right" delay={0.05}>
              <WeatherWidget
                location={crisis.location}
                latitude={crisis.latitude ?? undefined}
                longitude={crisis.longitude ?? undefined}
              />
            </ScrollReveal>

            {/* CTA Cards */}
            <ScrollReveal direction="right" delay={0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                onClick={() => router.push("/donation")}
                className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 cursor-pointer shadow-lg shadow-blue-500/20"
              >
                <HeartOutlined className="text-3xl text-white/80 mb-3" />
                <h3 className="text-white font-bold text-lg mb-1">Donate to Help</h3>
                <p className="text-blue-100 text-sm">Your contribution directly supports disaster relief efforts</p>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <motion.div
                whileHover={{ y: -4 }}
                onClick={() => router.push("/register")}
                className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <TeamOutlined className="text-3xl text-white/80 mb-3" />
                <h3 className="text-white font-bold text-lg mb-1">Volunteer Now</h3>
                <p className="text-emerald-100 text-sm">Join the response team and make a difference on the ground</p>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
