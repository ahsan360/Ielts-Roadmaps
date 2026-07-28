"use client";

import {
  EnvironmentOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  UserOutlined,
  MailOutlined,
} from "@ant-design/icons";
import type { MediaItem } from "@/lib/types";

interface ReportPreviewProps {
  formData: {
    title?: string;
    description?: string;
    location?: string;
    severity?: string;
    required_help?: string;
    reported_by_name?: string;
    reported_by_email?: string;
  };
  media: MediaItem[];
}

const severityConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  low: { label: "Low", bg: "bg-green-100", text: "text-green-700" },
  medium: { label: "Medium", bg: "bg-blue-100", text: "text-blue-700" },
  high: { label: "High", bg: "bg-orange-100", text: "text-orange-700" },
  critical: { label: "Critical", bg: "bg-red-100", text: "text-red-700" },
};

export default function ReportPreview({
  formData,
  media,
}: ReportPreviewProps) {
  const { title, description, location, severity, required_help, reported_by_name, reported_by_email } = formData;
  const images = media.filter((m) => m.type === "image");
  const videos = media.filter((m) => m.type === "video");

  const hasAnyData =
    title || description || location || severity || media.length > 0;

  if (!hasAnyData) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-300 p-8 flex items-center justify-center min-h-[280px]">
        <p className="text-gray-400 text-sm text-center">
          Your report preview will appear here
        </p>
      </div>
    );
  }

  const sevConfig = severity ? severityConfig[severity] : null;

  return (
    <div className="rounded-2xl border border-gray-200 shadow-md bg-white overflow-hidden">
      {/* Hero image */}
      {images.length > 0 && (
        <div className="h-[200px] w-full overflow-hidden bg-gray-100">
          <img
            src={images[0].url}
            alt="Crisis preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Severity badge + title */}
        <div className="flex items-start gap-2">
          {sevConfig && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${sevConfig.bg} ${sevConfig.text} shrink-0`}
            >
              {sevConfig.label}
            </span>
          )}
          <h3 className="text-base font-bold text-gray-900 leading-snug">
            {title || (
              <span className="text-gray-300 font-normal">Untitled</span>
            )}
          </h3>
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <EnvironmentOutlined className="text-red-400" />
            <span>{location}</span>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {description}
          </p>
        )}

        {/* Required help */}
        {required_help && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
            <p className="text-xs font-semibold text-amber-700 mb-0.5">
              Help Needed
            </p>
            <p className="text-xs text-amber-600 line-clamp-2">
              {required_help}
            </p>
          </div>
        )}

        {/* Media count */}
        {(images.length > 0 || videos.length > 0) && (
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {images.length > 0 && (
              <span className="flex items-center gap-1">
                <PictureOutlined />
                {images.length} {images.length === 1 ? "image" : "images"}
              </span>
            )}
            {videos.length > 0 && (
              <span className="flex items-center gap-1">
                <VideoCameraOutlined />
                {videos.length} video
              </span>
            )}
          </div>
        )}

        {/* Reporter info */}
        {(reported_by_name || reported_by_email) && (
          <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
            {reported_by_name && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <UserOutlined className="text-gray-400" />
                <span>{reported_by_name}</span>
              </div>
            )}
            {reported_by_email && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MailOutlined className="text-gray-400" />
                <span>{reported_by_email}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
