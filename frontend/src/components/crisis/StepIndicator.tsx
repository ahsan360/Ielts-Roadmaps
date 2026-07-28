"use client";

import { motion } from "framer-motion";
import { CheckOutlined } from "@ant-design/icons";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export default function StepIndicator({
  currentStep,
  steps,
}: StepIndicatorProps) {
  return (
    <div className="w-full px-2 py-4">
      <div className="flex items-start justify-between">
        {steps.map((label, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isFuture = index > currentStep;

          return (
            <div
              key={label}
              className="flex flex-1 flex-col items-center relative"
            >
              {/* Connecting line (not rendered before the first step) */}
              {index > 0 && (
                <div className="absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2">
                  <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-green-500 origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isCompleted || isActive ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              )}

              {/* Circle */}
              <motion.div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-colors ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                }`}
                initial={false}
                animate={
                  isActive
                    ? { scale: [1, 1.2, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {isCompleted ? (
                  <CheckOutlined className="text-xs" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>

              {/* Label */}
              <span
                className={`mt-2 text-xs sm:text-sm text-center leading-tight ${
                  isActive
                    ? "text-blue-600 font-bold"
                    : isCompleted
                      ? "text-green-600 font-medium"
                      : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
