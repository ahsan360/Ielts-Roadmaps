"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Crisis } from "@/lib/types";

const severityColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#3b82f6",
  low: "#22c55e",
};

interface CrisisMapProps {
  crises: Crisis[];
  onCrisisClick?: (crisis: Crisis) => void;
  height?: string;
}

export default function CrisisMap({ crises, onCrisisClick, height = "500px" }: CrisisMapProps) {
  const [selected, setSelected] = useState<Crisis | null>(null);
  const geoItems = crises.filter((c) => c.latitude && c.longitude);

  // Center map on average of all crisis locations
  const centerLat = geoItems.length > 0
    ? geoItems.reduce((s, c) => s + c.latitude!, 0) / geoItems.length
    : 23.8;
  const centerLng = geoItems.length > 0
    ? geoItems.reduce((s, c) => s + c.longitude!, 0) / geoItems.length
    : 90.4;

  // Use OpenStreetMap embed as base layer
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 3},${centerLat - 2},${centerLng + 3},${centerLat + 2}&layer=mapnik`;

  return (
    <div style={{ height, position: "relative" }} className="rounded-2xl overflow-hidden">
      {/* Base map */}
      <iframe
        src={mapUrl}
        style={{ width: "100%", height: "100%", border: 0 }}
        loading="lazy"
        title="Crisis Map"
      />

      {/* Crisis markers overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {geoItems.map((crisis) => {
          // Convert lat/lng to approximate pixel position (rough projection)
          const x = ((crisis.longitude! - (centerLng - 3)) / 6) * 100;
          const y = ((centerLat + 2 - crisis.latitude!) / 4) * 100;

          if (x < 0 || x > 100 || y < 0 || y > 100) return null;

          return (
            <motion.div
              key={crisis.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
              whileHover={{ scale: 1.3 }}
              onClick={() => {
                setSelected(crisis);
                onCrisisClick?.(crisis);
              }}
            >
              {/* Pulse ring for critical/high */}
              {(crisis.severity === "critical" || crisis.severity === "high") && (
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    backgroundColor: severityColors[crisis.severity],
                    opacity: 0.3,
                    width: crisis.severity === "critical" ? 32 : 24,
                    height: crisis.severity === "critical" ? 32 : 24,
                    margin: "auto",
                    top: 0, left: 0, right: 0, bottom: 0,
                  }}
                />
              )}
              {/* Marker dot */}
              <div
                className="rounded-full border-2 border-white shadow-lg relative z-10"
                style={{
                  width: crisis.severity === "critical" ? 20 : crisis.severity === "high" ? 16 : 12,
                  height: crisis.severity === "critical" ? 20 : crisis.severity === "high" ? 16 : 12,
                  backgroundColor: severityColors[crisis.severity] || "#3b82f6",
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Selected crisis info card */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 sm:left-4 sm:right-auto sm:w-80 bg-white rounded-xl shadow-2xl p-4 z-20 pointer-events-auto"
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-bold text-gray-900 text-sm m-0 leading-tight">{selected.title}</h4>
            <button
              onClick={(e) => { e.stopPropagation(); setSelected(null); }}
              className="text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer text-lg leading-none ml-2"
            >
              &times;
            </button>
          </div>
          <p className="text-xs text-gray-500 m-0 mb-2">{selected.location}</p>
          <div className="flex gap-2 mb-2">
            <span
              className="px-2 py-0.5 rounded text-xs font-bold text-white"
              style={{ backgroundColor: severityColors[selected.severity] }}
            >
              {selected.severity.toUpperCase()}
            </span>
            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
              {selected.status}
            </span>
          </div>
          {selected.required_help && (
            <p className="text-xs text-gray-600 m-0 line-clamp-2">{selected.required_help}</p>
          )}
          <button
            onClick={() => onCrisisClick?.(selected)}
            className="mt-2 w-full py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg border-0 cursor-pointer hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg text-xs">
        <div className="font-semibold text-gray-700 mb-1">Severity</div>
        {Object.entries(severityColors).map(([level, color]) => (
          <div key={level} className="flex items-center gap-1.5 py-0.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-gray-600 capitalize">{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
