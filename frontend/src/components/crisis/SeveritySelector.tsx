"use client";

import { motion } from "framer-motion";
import {
  SafetyCertificateOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  FireOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";

interface SeveritySelectorProps {
  value: string | undefined;
  onChange: (severity: string) => void;
}

interface SeverityOption {
  key: string;
  label: string;
  description: string;
  icon: ReactNode;
  color: string; // tailwind color name root, e.g. "green"
  border: string;
  bg: string;
  text: string;
  ring: string;
}

const options: SeverityOption[] = [
  {
    key: "low",
    label: "Low",
    description: "Minor impact, under control",
    icon: <SafetyCertificateOutlined />,
    color: "green",
    border: "border-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
    ring: "ring-green-500/30",
  },
  {
    key: "medium",
    label: "Medium",
    description: "Moderate impact, needs attention",
    icon: <InfoCircleOutlined />,
    color: "blue",
    border: "border-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-500/30",
  },
  {
    key: "high",
    label: "High",
    description: "Significant impact, urgent help",
    icon: <WarningOutlined />,
    color: "orange",
    border: "border-orange-500",
    bg: "bg-orange-50",
    text: "text-orange-700",
    ring: "ring-orange-500/30",
  },
  {
    key: "critical",
    label: "Critical",
    description: "Catastrophic, immediate action",
    icon: <FireOutlined />,
    color: "red",
    border: "border-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-500/30",
  },
];

export default function SeveritySelector({
  value,
  onChange,
}: SeveritySelectorProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {options.map((opt) => {
        const selected = value === opt.key;

        return (
          <motion.button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors outline-none ${
              selected
                ? `${opt.border} ${opt.bg} ring-2 ${opt.ring}`
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            {/* Icon */}
            <span
              className={`text-2xl ${
                selected ? opt.text : "text-gray-400"
              }`}
            >
              {opt.icon}
            </span>

            {/* Label */}
            <span
              className={`text-sm font-semibold ${
                selected ? opt.text : "text-gray-700"
              }`}
            >
              {opt.label}
            </span>

            {/* Description */}
            <span
              className={`text-xs text-center leading-snug ${
                selected ? opt.text : "text-gray-400"
              }`}
            >
              {opt.description}
            </span>

            {/* Selected indicator dot */}
            {selected && (
              <motion.div
                layoutId="severity-dot"
                className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                  opt.border.replace("border-", "bg-")
                }`}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
